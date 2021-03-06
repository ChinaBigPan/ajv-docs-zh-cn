---
title: 自定义关键字
sidebarDepth: 3
---

# 定义自定义关键字

[英文原地址](https://github.com/ajv-validator/ajv/blob/master/CUSTOM.md)

## 内容

### 使用验证函数定义关键字

验证函数会在数据验证时调用，并传入：

- schema
- 数据
- 父级 schema
- 当前数据路径
- 父级数据对象
- 父级数据对象中的属性名
- 根数据

对父级数据对象和当前属性名称的访问允许创建修改验证数据的关键字(在本例中，**必须**在关键字定义中使用`modifying`配置项)。

该函数返回的验证结果应该是布尔值。它可以通过自身的`.errors`属性返回一个验证错误信息数组(否则将使用标准错误)。

这种定义关键字方法的作用是：

- 在将关键字转换为编译后的/内联的关键字之前，先使用关键字。
- 定义不依赖与 schema 值的关键字(比方说，值总为`true`时)。在这种情况下，您可以在关键字中添加配置项`schema: false`，这样 schema 就不会传递给验证函数，它将只接收与编译后的验证函数相同的 4 个参数(参见下一节)。
- 定义关键字，其中 schema 是某个表达式中的值。
- 定义支持[$data 引用](https://github.com/ajv-validator/ajv#data-reference)的关键字 —— 在这种情况下，验证函数是必需的，要么作为唯一的选项，要么作为编译、宏或内联函数的附加配置项(见下文)。

::: warning 注意
在验证流因为 schema 不同而不同且必须使用`if`的情况下，这种定义关键字的方法比根据 schema 返回不同验证函数的编译关键字的性能更差。
:::

示例。`constant`关键字(draft-06 `const`关键字的同义词，它相当于只有一个项的`enum`关键字)。

```js
ajv.addKeyword('constant', {
  validate: function (schema, data) {
    return typeof schema == 'object' && schema !== null
            ? deepEqual(schema, data)
            : schema === data;
  },
  errors: false
});

var schema = {
  "constant": 2
};
var validate = ajv.compile(schema);
console.log(validate(2)); // true
console.log(validate(3)); // false

var schema = {
  "constant": {
    "foo": "bar"
  }
};
var validate = ajv.compile(schema);
console.log(validate({foo: 'bar'})); // true
console.log(validate({foo: 'baz'})); // false
```

Ajv 中已经能够使用`const`关键字。

[Reporting errors in custom keywords]:https://github.com/ajv-validator/ajv/blob/master/CUSTOM.md#reporting-errors-in-custom-keywords

::: tip 请注意
如果关键字没有定义自定义错误(参见[自定义关键字中的错误报告][Reporting errors in custom keywords])，则在其定义中传入`error: false`可以使生成的代码更有效。
:::

添加异步关键字可以在定义中传入`async: true`。

### 使用"编译"函数验证关键字

[schema compilation context]:https://github.com/ajv-validator/ajv/blob/master/CUSTOM.md#schema-compilation-context

在 schema 编译期间调用编译函数。它将传入 schema、父级 schema 和[schema 编译上下文][schema compilation context]，并且它应该返回一个验证函数。该验证函数将在验证期间传入：

- 数据
- 当前数据路径
- 父级数据对象
- 父级数据对象的属性名
- 根数据
  
对父级数据对象和当前属性名的访问允许创建修改验证数据的关键字(**必须**使用`modifying`配置项)。  

该函数返回的验证结果应该是布尔值。它可以通过自身的`.errors`属性返回一个验证错误信息数组(否则将使用标准错误)。

在某些情况下，这是定义关键字的最佳方法，但是它会在产生额外的函数调用，损失一些性能。如果关键字逻辑可以通过其他一些 JSON schema 来表达，那么`macro`关键字定义就更有效了(见下文)。

所有自定义关键字类型的定义中都有一个可选属性`metaSchema`，在 schema 编译期间，关键字的值将根据该 schema 进行验证。

自定义关键字再起定义中还有一个可选属性`dependencies` —— 它是包含了(父级) schema 中必需的关键字列表。

示例：使用编译 schema 的`range`和`exclusiveRange`关键字。

```js
ajv.addKeyword('range', {
  type: 'number',
  compile: function (sch, parentSchema) {
    var min = sch[0];
    var max = sch[1];

    return parentSchema.exclusiveRange === true
            ? function (data) { return data > min && data < max; }
            : function (data) { return data >= min && data <= max; }
  },
  errors: false,
  metaSchema: {
    type: 'array',
    items: [
      { type: 'number' },
      { type: 'number' }
    ],
    additionalItems: false
  }
});

var schema = {
  "range": [2, 4],
  "exclusiveRange": true
};
var validate = ajv.compile(schema);
console.log(validate(2.01)); // true
console.log(validate(3.99)); // true
console.log(validate(2)); // false
console.log(validate(4)); // false
```

参见上一小节中的自定义错误和异步关键字。

### 使用“宏”函数定义关键字

"宏"函数会在 schema 编译期间调用。它将传入 schema、父级 schema 和[schema 编译上下文][schema compilation context]，并且它应该返回另一个 schema，除了原始 schema 外，它还将应用于数据。

(在关键字逻辑可以用另一个 JSON schema 表示的情况下)它是最有效的方法，因为它通常很容易实现，而且在验证期间没有调用额外的函数。

除了来自扩展的 schema 的错误外，宏关键字还会在验证失败时添加它自己的错误。

示例：使用宏来定义前面例子的`range`和`exclusiveRange`关键字。

```js
ajv.addKeyword('range', {
  type: 'number',
  macro: function (schema, parentSchema) {
    return {
      minimum: schema[0],
      maximum: schema[1],
      exclusiveMinimum: !!parentSchema.exclusiveRange,
      exclusiveMaximum: !!parentSchema.exclusiveRange
    };
  },
  metaSchema: {
    type: 'array',
    items: [
      { type: 'number' },
      { type: 'number' }
    ],
    additionalItems: false
  }
});
```

[v5 proposal]:https://github.com/json-schema/json-schema/wiki/contains-(v5-proposal)

示例：5+ 版本提议中的`contains`关键字要求数组至少有一个项能匹配 schema，参见[这里][v5 proposal]。

```js
var schema = {
  "contains": {
    "type": "number",
    "minimum": 4,
    "exclusiveMinimum": true
  }
};

var validate = ajv.addKeyword('contains', {
  type: 'array',
  macro: function (schema) {
    return {
      "not": {
        "items": {
          "not": schema
        }
      }
    };
  }
})
.compile(schema);

console.log(validate([1,2,3])); // false
console.log(validate([2,3,4])); // false
console.log(validate([3,4,5])); // true, 数字 5 匹配了 schema 内部的 "contains"
```

若 Ajv 设置了配置项`v5: true`，则`contains`关键字可以使用。

[test]:https://github.com/ajv-validator/ajv/blob/master/spec/custom.spec.js#L151

参见[测试][test]中的递归宏关键字`deepProperties`。

### 使用“内联”函数定义关键字

在 schema 编译期间使用内联编译函数。它接收4个参数：`it`(当前 schema 编译上下文)、`keyword`(3.0 版本中添加，允许使用一个函数定义多个关键字)、`schema`和`parentSchema`，并且它应该返回将要内联到已编译 schema 代码中的代码(以字符串形式)。该代码可以是计算验证结果的表达式，也可以是将验证结果分配给变量的一组语句。

虽然使用"内联"函数定义关键字更具挑战性，它也有许多优点：

- 性能最好
- 精确控制验证过程
- 访问父级数据和当前验证数据的路径
- 通过`it.util`访问 Ajv 工具
  
`even`关键字的示例：

```js
var schema = { "even": true };

var validate = ajv.addKeyword('even', {
  type: 'number',
  inline: function (it, keyword, schema) {
    var op = schema ? '===' : '!==';
    return 'data' + (it.dataLevel || '') + ' % 2 ' + op + ' 0';
  },
  metaSchema: { type: 'boolean' }
})
.compile(schema);

console.log(validate(2)); // true
console.log(validate(3)); // false
```

上面示例中的`'data' + (it.dataLevel || '')`是对当前验证数据的引用。还要注意`schema`关键字和`it.schema.event`是相同的。即便如此，schema 在这里也并非严格必需的 —— 传递它是为了方便。

[doT Template]:https://github.com/olado/doT

示例：使用[doT Template][doT Template]定义`range`关键字：

```js
// {% raw %}
var doT = require('dot');
var inlineRangeTemplate = doT.compile("\
{{ \
  var $data = 'data' + (it.dataLevel || '') \
    , $min = it.schema.range[0] \
    , $max = it.schema.range[1] \
    , $gt = it.schema.exclusiveRange ? '>' : '>=' \
    , $lt = it.schema.exclusiveRange ? '<' : '<='; \
}} \
var valid{{=it.level}} = {{=$data}} {{=$gt}} {{=$min}} && {{=$data}} {{=$lt}} {{=$max}}; \
");

ajv.addKeyword('range', {
  type: 'number',
  inline: inlineRangeTemplate,
  statements: true,
  metaSchema: {
    type: 'array',
    items: [
      { type: 'number' },
      { type: 'number' }
    ],
    additionalItems: false
  }
});
// {% endraw %}
```

上面示例中的`'valid' + it.level`应该讲验证结果设置为变量的预期名字。

如果验证代码设置了变量而非对验证结果求值的话，关键字定义中的`statements`属性应该设置为`true`。

定义内联关键字的主要挑战是：您必须编写在 schema 编译(编译时)和代码在数据验证过程(验证时 —— 这段代码可以使用字符串拼接或使用模板生成，见下面的示例)都执行的代码。

Ajv 使用了[doT Template][doT Template]来生成验证函数的代码，由于模板和代码中使用的语法不同，验证函数的代码更容易分离编译时代码和验证时代码。Ajv 还为编译时和验证时变量了使用不同的变量名，以便更容易区分 —— 编译时变量名以`$`开头。

此外还必须记住的是，编译时变量存在于为编译关键字而编写的函数的作用域内，因此它们是隔离的，但验证时变量与单个验证函数作用域内的所有变量共享作用域。因此，如果关键字存在子 schema，则必须在变量名中添加 schema 级别(`it.level`)。

请参阅下面一小节来获取更多信息。

## Schema 编译上下文

传给`inline`关键字编译函数的第一个参数(传递给`compile`和`macro`关键字函数的第三个参数)是`it`，即 schema 编译上下文。这里的所有属性和函数在关键字可以放心使用，它们不会被重命名，也不会在没有主要版本变化的情况下改变其含义。

`it`对象具有以下属性：

[Validation time variables]:https://github.com/ajv-validator/ajv/blob/master/CUSTOM.md#validation-time-variables
[switch]:https://github.com/ajv-validator/ajv-keywords/blob/master/keywords/dot/switch.jst
[Ajv utilities]:https://github.com/ajv-validator/ajv/blob/master/CUSTOM.md#ajv-utilities

| `it`的属性 | 描述 |
|:---:|---|
| `level` | 当前 schema 的级别，顶层为`0`，子级 schema 为`1`(例如`property`中的 schema 或`anyOf`关键字中的 schema)。该属性的值应该附加到您在生成的代码中使用的验证时变量。|
| `dataLevel` | 当前已验证数据的级别。它可以用于从上到下访问所有级别上的属性名和数据。参见[验证时间变量][Validation time variables]。 |
| `schema` | 当前级别的 schema。您的关键字的值是`it.schema[keyword]`，该值会作为第三个参数传递给内联编译函数，而当前级别 schema 则会作为第四个参数。 |
| `schemaPath` | 验证时间表达式，计算结果为当前 schema 的属性名。 |
| `baseId` | 应该用作解析引用($ref)中 URI 基础的 base URI。 |
| `async` | 如果当前 schema 是异步的则为真值。|
| `opts` | Ajv 实例的配置项。您不应该更改它们。|
| `formats ` | Ajv 实例中所有可用的格式，包括自定义格式。|
| `compositeRule` | 布尔值，表示当前 schema 是否位于符合关键字内，其中的部分规则失败并不意味着验证失败(`switch`中的`anyOf`、`oneOf`、`not`和`if`)。该值可以用来确定如果`allErrors`配置项的值不是`true`的时候是否可以在出现错误后立即返回验证结果。只有在关键字中有许多步骤并且可能定义多个错误时才需要这样做。 |
| `validate` | 用于编译关键字中的子级 schema 的函数(例如，请参阅`switch`关键字的[实现][switch])。 |
| `util` | 可以用在内联变异函数中的[Ajv 工具][Ajv utilities] |
| `self`| Ajv 实例 |


## 验证时变量

您可以在关键字生成的(验证时)代码中使用许多变量和表达式。

- `'data' + (it.dataLevel || '')`：当前级别数据的变量名。
- `'data' + ((it.dataLevel-1)||'')`：`it.dataLevel > 0`时的父级数据。
- `'rootData'`：根数据。
- `it.dataPathArr[it.dataLevel]`：`it.dataLevel > 0`时父级对象中指向当前数据的属性名称。
- `'validate.schema'` 验证时当前验证函数的顶级 schema。
- `'validate.schema' + it.schemaPath`：验证时可用的当前级别 schema (编译时的相同 schema 是`it.schema`) 。
- `'validate.schema' + it.schemaPath + '.' + keyword`：自定义关键字在验证时的值。关键字是传给内联编译函数的第二个参数，从而允许使用同一个函数编译多个关键字。
- `'valid' + it.level`：如果关键字返回语句而非表达式，则必须声明该变量并将验证结果分配给该变量（`statements: true`）。
- `'errors'`：错误的数量。参见[自定义关键字中的错误报告][Reporting errors in custom keywords]。
- `vErrors`：到目前为止收集到的错误数组。。参见[自定义关键字中的错误报告][Reporting errors in custom keywords]。


## Ajv 工具

您可以在你的内联关键字中使用一些有用的函数。这些函数可以作为`it.util`对象的属性。

#### `.copy(Object obj[, Object target]) -> Object`

克隆或扩展对象。如果传入一个对象，则克隆。如果传入两个对象，则使用第一个对象的属性扩展第二个。

#### `.toHash(Array arr) -> Object`

将字符串数组转换为对象，其中每个字符串都成为值为`true`的键。

```js
it.util.toHash(['a', 'b', 'c']) // { a: true, b: true, c: true }
```

#### `.equal(value1, value2) -> Boolean`

执行深度相等比较。该函数用于关键字`enum`、`constant`、`uniqueItems`中，并可用于自定义关键字。

#### `.getProperty(String key) -> String`

将访问属性/项的键/索引字符串转换为 JavaScript 语法可以访问的样式(`.`语法或`[…]`语法)。

```js
it.util.getProperty('a')   // ".a"
it.util.getProperty('1')   // "['1']"
it.util.getProperty("a'b") // "['a\\'b']"
it.util.getProperty(1)     // "[1]"
```

#### `.schemaHasRules(Object schema, Object rules) -> String`

确定传递的 schema 是否有需要验证的规则。这个函数应该在调用`it.validate`编译子集 schema 之前使用。

```js
it.util.schemaHasRules(schema, it.RULES.all) // true or false
```

#### `.escapeQuotes(String str) -> String`

对字符串中的单引号进行转义，这样就可以使用单引号将其插入到生成的代码的字符串常量中。

#### `.toQuotedString(String str) -> String`

将字符串转换为单引号中的 JavaScript 字符串常量(使用转义字符串)。

```js
it.util.toQuotedString("a'b") // "'a\\'b'"
```

#### `.getData(String jsonPointer, Number dataLevel, Array paths) -> String`

返回验证时间表达式，以基于传递的 json 指针安全地访问数据(参见示例)。

```js
it.util.getData('2/test/1', it.dataLevel, it.dataPathArr)
// 结果依赖于当前 level
// 如果 it.dataLevel 为 3，则结果为 "data1 && data1.test && data1.test[1]"
```

#### `.escapeJsonPointer(String str) -> String`

将属性名称转换为 JSON 指针片段。

#### `.unescapeJsonPointer (String str) -> String`

将 JSON 指针片段转换为属性名。

#### `.unescapeFragment(String str) -> String`

将属性名称转换为可在 URI 中使用的 JSON 指针片段。

#### `.escapeFragment(String str) -> String`

将 JSON 指针片段从 URI 转换为属性名。

## 报告自定义关键字中的错误

除宏(macro)关键字外的所有自定义关键字可以选择创建自定义错误消息。

同步验证和编译关键字应该通过将它们分配给验证函数的`.errors`属性来定义错误。异步关键字可以通过`new Ajv.ValidationError(erros)`返回 reject 的 promise，其中`errors`是自定义验证错误的数组(如果不想在异步关键字中定义自定义错误，则其验证函数可以返回值为`false`的 promise)。

[example range keyword]:https://github.com/ajv-validator/ajv/blob/master/spec/custom_rules/range_with_errors.jst

内联自定义关键字应该增加错误计数器`errors`，并将粗偶添加到`vErrors`数组(其值可以为 null)。对于异步和同步关键字这么做都是可以的。参见[example range keyword][example range keyword]。

当内联关键字执行验证验证时，Ajv 通过比较验证前后的错误计数来监查其是否创建了错误。要跳过这个检查，可以向关键字定义中添加`errors`配置项(它的值可以是`"full"`、`true`、`false`)：

```js
ajv.addKeyword('range', {
  type: 'number',
  inline: inlineRangeTemplate,
  statements: true,
  errors: true // 在验证失败时，关键字应当创建自定义错误
  // errors: 'full' // 创建的错误应该设置了 dataPath
  // errors: false // 关键字不会产生错误，Ajv 将添加一个默认错误
});
```

每个错误对象至少应该有`keyword`、`message`和`params`属性，其他属性随后添加。内联关键字可以在错误对象中定义`dataPath`和`schemaPath`属性，它们将由 Ajv 分配，除非关键字的`errors`配置项是`"full"`。

如果自定义关键字不创建错误，则在关键字验证失败时将创建默认错误(参见[Ajv 的验证错误](https://github.com/ajv-validator/ajv#validation-errors))。

## 短路验证

在某些情况下，内联关键字可以在遇到错误时立即终止验证并返回结果。只有当您定义的关键字有许多标准需要验证，并且您希望它能够快速失败时才会这样。只有在关键字本身定义了错误时才需要这样做，否则 Ajv 将在创建默认错误时返回(如果满足以下条件)。

在关键字返回结果之前，会检查两个条件：

- 不应使用`allErrors`配置项(`!it.opts.allErrors`应该为 true)。
- 当某些关键字失败并不意味着验证失败(`!it.compositeRule`应该为 true)，当前 schema 不应该在复合规则中(例如`no`或`anyOf`)。
  
如果满足这些条件，您的关键字可以立即返回结果。如果当前 schema 是异步的(`it.async`的值不是`true`)，当其遇到错误`err`时，您可以将其添加到关键字的生成代码：

```js
if (vErrors === null) vErrors = [err];
else vErrors.push(err);
validate.errors = vErrors;
return false;
```

如果当前 schema 是异步返回结果的(`it.async`的值为`true`)，您需要：

```js
if (vErrors === null) vErrors = [err];
else vErrors.push(err);
throw new ValidationError(vErrors); // ValidationError 在作用域内
```

如果使用了`allErrors`配置项，关键字应该在遇到错误后继续验证，从而找到尽可能多的错误。

如果不使用`allErrors`配置项，但`it.compositeRule`为真值(truthy)，关键字可能会短路验证，但不应该返回最终的验证结果。

