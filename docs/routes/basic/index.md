---
title: Ajv
sidebarDepth: 2
---

[英文原地址](https://github.com/ajv-validator/ajv)

## 安装

```bash
npm install ajv
```

## 开始

您可以在[这里](https://tonicdev.com/npm/ajv)调试看看。

做最快速的验证：

```js
// Node.js require:
var Ajv = require('ajv');
// 或是 ESM/TypeScript import
import Ajv from 'ajv';

var ajv = new Ajv(); // 可以传入配置项, 例如： {allErrors: true}
var validate = ajv.compile(schema);
var valid = validate(data);
if (!valid) console.log(validate.errors);
```

用最少的代码：

```js
// ...
var valid = ajv.validate(schema, data);
if (!valid) console.log(ajv.errors);
// ...
```

或者

```js
// ...
var valid = ajv.addSchema(schema, 'mySchema')
               .validate('mySchema', data);
if (!valid) console.log(ajv.errorsText());
// ...
```

[fast-json-stable-stringify]:https://github.com/epoberezkin/fast-json-stable-stringify

Ajv 将 schema 编译为函数并在所有情况下对其进行缓存(使用[fast-json-stable-stringify][fast-json-stable-stringify]对 schema 进行序列化，或是自定义函数为键)，这样下次使用相同的 schema 时(不一定是相同的对象实例)时，就不会再次编译。

使用`compile`或`getSchema`方法(不需要额外调用其他函数)返回的已编译函数可以获得最佳性能。

::: warning 请注意
每次调用验证函数或`ajv.validate`时都会覆盖`errors`属性。如果你想之后再使用它(比如说在回调函数中)，您需要将`errors`数组赋值给另一个变量。
:::

::: tip TypeScript 
`ajv`提供了开箱即用的 TypeScript 声明。因此您无需安装已经弃用的`@types/ajv`模块。
:::

## 在浏览器中使用  

如果需要在几个包中使用 Ajv，可以使用`npm run bundle`创建一个单独的UMD包。

您可以直接在浏览器中加载 Ajv.

```html
<script src="ajv.min.js"></script>
```

这个包可以用于不同的模块系统，如果没有找到则会创建全局变量`Ajv`。

浏览器包可以在[CDN](https://cdnjs.com/libraries/ajv)找到

::: warning 注意
一些框架，例如Dojo，可能会重新定义全局引入，这种方式与 CommonJS 模块格式是不兼容的。在这种情况下，必须先加载 Ajv 包，然后才能使用全局 Ajv。
:::

### Ajv 和 内容安全策略(CSP)

如果您正在使用 Ajv 在浏览器文档中编译一个 schema (这是典型用法)，但是它配置了内容安全策略(CSP, Content Security Policy)，该策略需要`script-src`指令且包含了`unsafe-eval`值。**注意：**⚠️，`unsafe-eval`值并不是一个安全的策略。因为它有可能打开文档的跨站脚本攻击。

为了在不影响 CSP 的情况下使用 Ajv，您可以[使用 CLI 对 schema 进行预编译](/ajv-docs-cn/routes/cli)。这将把 schema JSON 转换为 JavaScript 文件，该文件会导出一个`validate`函数到运行时编译的模式中。

需要注意的是预编译使用的是[ajv-pack](/ajv-docs-cn/routes/pack)进行的，它可以编译的模式特性有一些限制。成功的预编译应该和运行时编译的 schema 是相同的。

## 命令行接口

[ajv-cli](/ajv-docs-cn/routes/cli)可以作为单独的 npm 包。它支持如下功能：

- 编译 JSON Schema 以测试其有效性。
- BETA：生成独立模块，导出不需要 Ajv 使用的验证函数(使用[ajv-pack](/ajv-docs-cn/routes/pack))。
- 将 schema 迁移到 draft-07 (采用[json-schema-migrate](https://github.com/epoberezkin/json-schema-migrate))
- 根据 JSON Schema 验证文件。
- 根据 JSON Schema 测试数据的期望有效性。
- 引用的 schema。
- 自定义 meta-schema。
- JSON、JSON5、YAML和JavaScript格式的文件。
- 所有的 Ajv 配置项。
- 报告[JSON-patch](https://tools.ietf.org/html/rfc6902)格式验证后的数据更改。

## 验证关键字 (看左边目录的验证那里)

## 注释关键字

JSON Schema 规范定义了几个描述 schema 本身但不会触发验证的注释关键字。

- `title`和`description`：表示该 schema 数据代表的信息。
- `$comment`：（draft-07 新增）。给开发人员的信息。通过设置`$comment`项，Ajv 可以记录或将注释字符串传递给用户提供的函数。
- `default`：数据实例的默认值。
- `examples`：（draft-06 新增）数据实例的数组。 Ajv 不会根据 schema 检查这些实例的有效性。
- `readOnly`和`writeOnly`：(draft-07 新增) 根据数据源(数据库、api等)将数据实例标记为只读或只写。
- `contentEncoding`：[RFC 2045](https://tools.ietf.org/html/rfc2045#section-6.1)。如："base64"。
- `contentMediaType`：[RFC 2046](https://tools.ietf.org/html/rfc2046)。如："image/png"。

::: tip 请注意
Ajv 没有实现关键字`example`、`contentEncoding`和`contentMediaType`的验证，但保留了它们。如果您想创建一个插件来实现其中的一些关键字，应该从实例中删除这些它们。
:::

## 格式

Ajv 实现了由 JSON schema 规范定义的格式和一些其他格式。建议**不要**对不受信任的数据使用`format`关键字实现，因为它们使用了潜在的不安全的正则表达式。

::: tip 请注意
如果您需要使用`format`关键字来验证不受信任的数据，那么您必须评估它们对于您的验证场景的适用性和安全性。
:::

使用“format”关键字进行字符串验证，实现了下面这些格式：

- date: 根据[RFC3339](http://tools.ietf.org/html/rfc3339#section-5.6)实现的日期。
- time: 带时区的时间。
- data-time: 同来源的日期时间(时区是强制性的)。`date`、`time`和`date-time`在`full`模式下验证区间而在`fast`模式下仅用正则验证。
- uri: full URI。
- uri-reference: URI引用，包括完整的和相对的URI。
- uri-template: 根据[RFC6570](https://tools.ietf.org/html/rfc6570)的 URI 模板。
- email: 邮箱地址。
- hostname: 根据[RFC1034](http://tools.ietf.org/html/rfc1034#section-3.5)的 host 名。
- ipv4: IP 地址 v4。
- ipv6: IP 地址 v6。
- regex: 通过传入正则表达式构造器来验证字符串是否是一个可用的正则表达式。
- uuid: 全局惟一标识符。根据[RFC4122](http://tools.ietf.org/html/rfc4122)
- json-pointer: 根据[RFC6901](https://tools.ietf.org/html/rfc6901)的 JSON 指针。
- relative-json-pointer: 根据[该草案](http://tools.ietf.org/html/draft-luff-relative-json-pointer-00)的相对 JSON 指针。

::: tip 请注意
JSON Schema draft-07 同样为 URL、域名、邮箱定义了`iri`、`iri-reference`、`idn-hostname`和`idn-email`格式。不过 Ajv 并未实现他们。如果您创建了实现它们的 Ajv 插件，请提 PR。 
::: 

[Options]:https://github.com/ajv-validator/ajv#options

格式验证有两种模式：`fast`和`full`。模式会影响`date`、`time`、`date-time`、`uri`、`uri-reference`和`email`。请参见[配置项][Options]文档。

`unknownFormats`配置项允许在遇到未知格式时更改默认行为。在这种情况下，Ajv 要么模式编译失败(默认情况)，要么忽略它(在 5.0.0 版本之前是这样的)。你还可以指定哪些格式可以忽略。

您可以找到用于格式验证的正则表达式以及[formats.js](https://github.com/ajv-validator/ajv/blob/master/lib/compile/formats.js)中使用的源代码。

## 使用 $ref 组合 schema

您可以跨多个 schema 文件组合验证逻辑，并通过`$ref`关键字让 schema 相互引用。

示例：

```js
var schema = {
  "$id": "http://example.com/schemas/schema.json",
  "type": "object",
  "properties": {
    "foo": { "$ref": "defs.json#/definitions/int" },
    "bar": { "$ref": "defs.json#/definitions/str" }
  }
};

var defsSchema = {
  "$id": "http://example.com/schemas/defs.json",
  "definitions": {
    "int": { "type": "integer" },
    "str": { "type": "string" }
  }
};
```

现在您可以将所有的 schema 传给 Ajv 实例来编译您的 schema。

```js
var ajv = new Ajv({schemas: [schema, defsSchema]});
var validate = ajv.getSchema('http://example.com/schemas/schema.json');
```

也可以使用`addSchema`方法：

```js
var ajv = new Ajv;
var validate = ajv.addSchema(defsSchema)
                  .compile(schema);
```

参见[配置项][Options]和[addSchema](https://github.com/ajv-validator/ajv#api)方法.

**请注意：**

- 使用 schema `id`作为基本`URI`(参见示例)，将`$ref`作为 URI 引用。
- 引用可以是递归的(也可以相互递归)，以实现不同数据结构(如链表、树、图等)的 schema。
- 您不必将 schema 文件放到作为 schema `id`的 URI 当中。这些 URI 仅用于定义 schema，根据 JSON schema 模式规范，验证器不应该期望能够从这些 URI 中下载 schema。
- 没有使用 schema 文件在文件系统中的实际位置。
- 您可以将 schema 的标识符作为`addSchema`方法的第二个参数或是`schema`配置项中的属性名称进行传递。该标识符可以用来代替 schema `$id`(或作为 schema `$id`的补充)。
- 不能将相同的`$id`(或 schema 标识符)用于多个 schema -- 这将引发异常。
- 您可以使用`compileAsync`方法实现引用 schema 的动态解析。通过这种方式，您可以在任何系统(文件、web、数据库等)中存储 schema 并引用它们，而无需显式地添加到 Ajv 实例中。参见[异步 schema 编译](https://github.com/ajv-validator/ajv#asynchronous-schema-compilation)

## $data 引用

通过`$data`配置项，您可以使用来自验证数据的值作为 schema 关键字的值。可以看看[这里](https://github.com/json-schema-org/json-schema-spec/issues/51)来了解它的原理。

`$data`支持在下面的关键字当中都是支持的：const, enum, format, maximum/minimum, exclusiveMaximum / exclusiveMinimum, maxLength / minLength, maxItems / minItems, maxProperties / minProperties, formatMaximum / formatMinimum, formatExclusiveMaximum / formatExclusiveMinimum, multipleOf, pattern, required, uniqueItems.

`"$data"`的值应该是指向数据的[JSON-Pointer](https://tools.ietf.org/html/rfc6901)(即使`$data`引用在被引用的子 schema 中，根始终是顶级数据对象)或[relative JSON-Pointer](http://tools.ietf.org/html/draft-luff-relative-json-pointer-00)(相对于数据中的当前点；如果`$data`引用在被引用的子 schema 中，那么它就不能指向这个子 schema 的根以外的数据)。

示例：

该 schema 要求`smaller`属性的值小于或等于`bigger`属性中的值：

```js
var ajv = new Ajv({$data: true});

var schema = {
  "properties": {
    "smaller": {
      "type": "number",
      "maximum": { "$data": "1/larger" }
    },
    "larger": { "type": "number" }
  }
};

var validData = {
  smaller: 5,
  larger: 7
};

ajv.validate(schema, validData); // true
```

该 schema 要求属性与他们的字段名具有相同的格式：

```js
var schema = {
  "additionalProperties": {
    "type": "string",
    "format": { "$data": "0#" }
  }
};

var validData = {
  'date-time': '1963-06-19T08:30:06.283185Z',
  email: 'joe.bloggs@example.com'
}
```

`$data`引用会被安全地解析——即使某些属性未定义也不会抛出错误。如果`$data`解析为`undefined`，则验证成功(排除`const`关键字)。如果`$data`解析为不正确的类型(比方说，`maximum`关键字的值不是"number")，验证将失败。

## $merge 和 $patch 关键字

通过[ajv-merge-patch](https://github.com/ajv-validator/ajv-merge-patch)这个包，您可以使用`$merge`关键字和`$patch`关键字，它们允许使用[JSON Merge Patch (RFC 7396)](https://tools.ietf.org/html/rfc7396)和[JSON Patch (RFC 6902)](https://tools.ietf.org/html/rfc6902)来扩展 JSON Schema。

要向 Ajv 实例中添加`$merge`和`patch`关键字您可以这样：

```js
require('ajv-merge-patch')(ajv);
```

**示例：**

使用`$merge`：

```json
{
  "$merge": {
    "source": {
      "type": "object",
      "properties": { "p": { "type": "string" } },
      "additionalProperties": false
    },
    "with": {
      "properties": { "q": { "type": "number" } }
    }
  }
}
```

使用`$patch`：

```json
{
  "$patch": {
    "source": {
      "type": "object",
      "properties": { "p": { "type": "string" } },
      "additionalProperties": false
    },
    "with": [
      { "op": "add", "path": "/properties/q", "value": { "type": "number" } }
    ]
  }
}
```

上面的 schema 等同于下面的：

```json
{
  "type": "object",
  "properties": {
    "p": { "type": "string" },
    "q": { "type": "number" }
  },
  "additionalProperties": false
}
```

关键字`$merge`和`$patch`中的`source`和`with`属性可以使用绝对或相对的`$ref`来指向之前添加到 Ajv 实例中的其他 schema 或当期 schema 的片段。

参见左边的[Ajv-merge-patch](https://github.com/ajv-validator/ajv-merge-patch)文档获得更多信息。

## 自定义关键字

使用自定义关键字的好处如下：

- 允许创建无法使用 JSON schema 表示的验证场景。
- 简化您的 schema。
- 有助于为 schema 引入更大一部分验证逻辑。
- 使 schema 更具表达性、更简洁、更接近应用。
- 实现自定义数据处理来修改数据(修改项**必须**在关键字定义中使用)和/或在验证数据时创建副作用。

如果一个关键字只用于副作用，并且它的验证结果是预先定义的，那么在关键字定义中使用`valid: true/false`配置项来简化生成的代码(在`valid: true`的情况下没有错误处理)和关键字函数(不需要返回任何验证结果)。

在使用自定义关键字扩展 JSON Schema 标准时，必须注意您的 schema 的可移植性和礼节性。您必须在其他平台上支持这些自定义关键字，且进行正确的文档说明，方便每个人都能理解。

您也可以使用[addKeyword](https://github.com/ajv-validator/ajv#api-addkeyword)方法自定义关键字。关键字是在`ajv`实例级别上定义的----新实例没有以前定义的关键字。

Ajv 允许通过以下方式定义关键字:

- 验证函数
- 编译函数
- 宏函数
- 内联编译函数，它的作用是返回当前编译 schema 中的内联编译代码(作为字符串)。

示例，使用编译 schema 的`range`和`exclusiveRange`关键字：

```js
ajv.addKeyword('range', {
  type: 'number',
  compile: function (sch, parentSchema) {
    var min = sch[0];
    var max = sch[1];

    return parentSchema.exclusiveRange === true
            ? function (data) { return data > min && data < max; }
            : function (data) { return data >= min && data <= max; }
  }
});

var schema = { "range": [2, 4], "exclusiveRange": true };
var validate = ajv.compile(schema);
console.log(validate(2.01)); // true
console.log(validate(3.99)); // true
console.log(validate(2)); // false
console.log(validate(4)); // false
```

在[ajv-keywords](https://github.com/ajv-validator/ajv-keywords)包中定义了数个自定义关键字(`typeof`、`instanceof`、`range`和`propertyNames`)它们可以在您的 schema 中使用，并作为您自己的自定义关键字的起点。

参见[自定义关键字](https://github.com/ajv-validator/ajv/blob/master/CUSTOM.md)获取更多信息。

## 异步 schema 编译

在异步编译期间，使用提供的函数加载远程引用。参见`compileAsync`[方法](https://github.com/ajv-validator/ajv#api-compileAsync)和`loadSchema`[配置项](https://github.com/ajv-validator/ajv#options)。

**示例：**

```js
var ajv = new Ajv({ loadSchema: loadSchema });

ajv.compileAsync(schema).then(function (validate) {
  var valid = validate(data);
  // ...
});

function loadSchema(uri) {
  return request.json(uri).then(function (res) {
    if (res.statusCode >= 400)
      throw new Error('Loading error: ' + res.statusCode);
    return res.body;
  });
}
```

::: warning 请注意
[配置项](https://github.com/ajv-validator/ajv#options)`missingRefs`不应该在异步编译时设置为`"ignore"`或`"fail"`。
:::

## 异步验证

Node.js 交互式编程环境(REPL)的[示例](https://tonicdev.com/esp/ajv-asynchronous-validation)

[addFormat]:https://github.com/ajv-validator/ajv#api-addformat
[addKeyword]:https://github.com/ajv-validator/ajv#api-addkeyword
[定义自定义关键字]:https://github.com/ajv-validator/ajv#defining-custom-keywords

您可以通过访问数据库或其他服务来定义执行异步验证的自定义格式和关键字。您应该在关键字或格式定义中添加`async: true`(参见[addFormat][addFormat]、[addKeyword][addKeyword]和[定义自定义关键字][定义自定义关键字])

如果您的 schema 使用了异步格式/关键字，或者应用了一些包含这些关键字的 schema，那么它应该带有`"$async": true`关键字，以便 Ajv 能够正确编译它。如果在没有`$async`关键字的 schema 中使用异步格式/关键字或对异步 schema 的引用，那么 Ajv 将在 schema 编译期间抛出异常。

::: tip 请注意
从当前 schema 或其他 schema 引用的所有异步子 schema 也应该具有`"$async":true`关键字，否则模式编译将失败。
::: 

异步自定义格式/关键字的验证函数应该返回一个结果为`true`或`false`的 Promise (或者如果希望从关键字函数返回自定义错误，则使用 reject 返回`new Ajv.ValidationError(errors)`)。

Ajv 将异步 schema 编译为 async 函数，它们可以使用[nodent](https://github.com/MatAtBread/nodent)进行转换。Node.js 7+ 和所有现代浏览器都支持 async 函数。您还可以通过`processCode`配置项提供作为函数的其他转换器。参见[配置项](https://github.com/ajv-validator/ajv#options)。

编译后的验证函数具有`$async: true`属性(如果模式是异步的)，因此如果同时使用同步模式和异步模式，您可以将它们区分开来。

验证结果是一个返回验证数据(resolve)或带有`Ajv.ValidationError`(reject)的 Promise。

**示例：**

```js
var ajv = new Ajv;
// require('ajv-async')(ajv);

ajv.addKeyword('idExists', {
  async: true,
  type: 'number',
  validate: checkIdExists
});


function checkIdExists(schema, data) {
  return knex(schema.table)
  .select('id')
  .where('id', data)
  .then(function (rows) {
    return !!rows.length; // true if record is found
  });
}

var schema = {
  "$async": true,
  "properties": {
    "userId": {
      "type": "integer",
      "idExists": { "table": "users" }
    },
    "postId": {
      "type": "integer",
      "idExists": { "table": "posts" }
    }
  }
};

var validate = ajv.compile(schema);

validate({ userId: 1, postId: 19 })
.then(function (data) {
  console.log('Data is valid', data); // { userId: 1, postId: 19 }
})
.catch(function (err) {
  if (!(err instanceof Ajv.ValidationError)) throw err;
  // data is invalid
  console.log('Validation errors:', err.errors);
});
```

### 使用带有异步验证函数的转换器

[ajv-async](https://github.com/ajv-validator/ajv-async)使用[nodent](https://github.com/MatAtBread/nodent)来转换异步函数。要使用另一个转换器，你应该单独安装它(或在浏览器中加载它的包)。

**使用 nodent：**

```js
var ajv = new Ajv;
require('ajv-async')(ajv);
// 在浏览器环境，如果您想单独加载 ajv-async 的包，您可以使用：
// window.ajvAsync(ajv);
var validate = ajv.compile(schema); // 转换 es7 async function
validate(data).then(successFunc).catch(errorFunc);
```

**使用其他转换器：**

```js
var ajv = new Ajv({ processCode: transpileFunc });
var validate = ajv.compile(schema); // 转换 es7 async function
validate(data).then(successFunc).catch(errorFunc);
```

## 安全注意事项

如果使用得当，JSON Schema 可以替代数据清理，但并不会取代其他的 API 安全注意事项。它引入了其它需要考虑的安全方面的事项。

#### 安全隐患汇报

[Tidelift security contact]:https://tidelift.com/security

若要报告安全漏洞，请使用[Tidelift 安全隐患汇报][Tidelift security contact]。Tidelift 将协调修复和披露安全隐患。请不要使用 GitHub 报告安全漏洞。

#### 不可信的 schema

Ajv 将 JSON schema 视为受信任的代码。该安全模型基于最常见的用例，即 schema 是静态的并与应用程序绑定在一起。

如果您的 schema 是从不可信的来源获得的（或是从不可信数据生成的），那么下面几种情况就是您要竭力避免的：

- 编译 schema 可能导致堆栈溢出(如果太深的话)。
- 编译 schema 可能太慢了。
- 验证某些数据较慢。

虽然很难预测所有的场景，但至少它可以帮助限制不可信 schema 的大小(例如限制 JSON 字符串长度)和 schema 对象的最大深度(相对于较小的 JSON 字符串，这个深度可能很高)。您还可以将较慢的正则表达式放到`pattern`和`patternProperties`关键字中。

无论您采取何种措施，使用不受信任的模式都会增加安全风险。

#### JavaScript 对象中的循环引用

[# 802]:https://github.com/ajv-validator/ajv/issues/802

Ajv 不支持在对象中具有循环引用的 schema 和验证数据。参见[这里][# 802]。

尝试编译这样的 schema 或验证这样的数据会导致堆栈溢出(或者异步验证不会完成)。根据所使用的解析器的不同，不受信任的数据可能导致循环引用。

#### 受信任 schema 的安全风险

JSON schema 中的一些关键字可能导致对某些数据的验证非常缓慢。这些数字包括(但可能不限于)：

- 用`pattern`和`format`匹配大量字符串 ———— 在某些情况下`maxLength`可以帮我我们缓解它，但某些正则表达式可能导致验证时间呈指数级增长，即使是相对较短的字符串(参见下面的 ReDoS 攻击)。
- 用`patternProperties`匹配大量属性名称 ———— 使用`propertyNames`来缓解，但是一些正则表达式也可能会有指数级的计算时间。
- 用于大型非表里数组的`uniqueItems` ———— 使用`maxItems`来缓解。

::: warning 请注意
只有在生产环境代码中不使用`allErrors:true`时，上面防止缓慢验证的建议才起效(使用它将在验证错误之后继续验证)。
::: 

[meta-schema]:https://github.com/ajv-validator/ajv/blob/master/lib/refs/json-schema-secure.json

您可以根据[元 schema][meta-schema]来验证您的 JSON schema 以检查是否遵循了以下协议：

```js
const isSchemaSecure = ajv.compile(require('ajv/lib/refs/json-schema-secure.json'));

const schema1 = {format: 'email'};
isSchemaSecure(schema1); // false

const schema2 = {format: 'email', maxLength: MAX_LENGTH};
isSchemaSecure(schema2); // true
```

::: warning 谨记
遵循所有这些建议并不能保证对不可信数据的验证是安全的 ———— 凡事总有意外嘛。
:::

## 正则Dos攻击(ReDos Attack)

即使字符串相对较短，某些正则表达式也可能导致计算时间呈指数级成长。

[safe-regex]:https://github.com/substack/safe-regex

请评估您在模式中使用的正则表达式对这种攻击的抵抗力 —— 参见[安全正则][safe-regex]。

[regular expressions]:https://github.com/ajv-validator/ajv/blob/master/lib/compile/formats.js

::: tip 请注意
Ajv 使用[正则表达式][regular expressions]实现了一些格式，它们容易遭到 ReDoS 攻击，所以如果你使用 Ajv 验证来自不可信来源的数据，强烈建议考虑以下几点：

[addFormat]:https://github.com/ajv-validator/ajv#api-addformat

- 评估 Ajv 中"格式"的实现。
- 使用`format: 'fast'`配置项简化了一些正则表达式(尽管这也不能保证它们是安全的)。
- 将 Ajv 提供的格式实现替换成您自己的`format`关键字实现，这些实现使用不同的正则表达式或另一种格式验证方法。参见[addFormat][addFormat]方法。
- 禁用格式验证，使用`format: false`忽略`format`关键字。

无论您选择哪种措施，请先假定 Ajv 提供的所有格式都不安全，并自行评估它是否适合您的验证场景。
:::

## 过滤数据





























