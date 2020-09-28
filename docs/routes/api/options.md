---
title: 配置项
sidebarDepth: 3
---

# 配置项

[英文原地址](https://github.com/ajv-validator/ajv#options)

默认值：

```js
{
  // 验证 和 报告 配置项:
  $data:            false,
  allErrors:        false,
  verbose:          false,
  $comment:         false, // Ajv 6.0 中新增的属性
  jsonPointers:     false,
  uniqueItems:      true,
  unicode:          true,
  nullable:         false,
  format:           'fast',
  formats:          {},
  unknownFormats:   true,
  schemas:          {},
  logger:           undefined,
  // 引用 schema 的配置项
  schemaId:         '$id',
  missingRefs:      true,
  extendRefs:       'ignore', // 推荐 'fail'
  loadSchema:       undefined, // function(uri: string): Promise {}
  // 修改验证数据的配置项:
  removeAdditional: false,
  useDefaults:      false,
  coerceTypes:      false,
  // 严格模式配置项
  strictDefaults:   false,
  strictKeywords:   false,
  strictNumbers:    false,
  // 异步验证配置项：
  transpile:        undefined, // 需要 ajv-async 包
  // 高级配置项
  meta:             true,
  validateSchema:   true,
  addUsedSchema:    true,
  inlineRefs:       true,
  passContext:      false,
  loopRequired:     Infinity,
  ownProperties:    false,
  multipleOfPrecision: false,
  errorDataPath:    'object', // 已废弃
  messages:         true,
  sourceCode:       false,
  processCode:      undefined, 
  // ↑ function (str: string, schema: object): string {}
  cache:            new Cache,
  serialize:        undefined
}
```

[$data references]:https://github.com/ajv-validator/ajv#data-reference
[JSON 指针]:https://tools.ietf.org/html/rfc6901
[Open API 3 specification]:https://swagger.io/docs/specification/data-models/data-types/
[Formats]:https://github.com/ajv-validator/ajv#formats
[Error logging]:https://github.com/ajv-validator/ajv#error-logging
[JSON 引用]:https://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03#section-3
[异步编译]:https://github.com/ajv-validator/ajv#asynchronous-schema-compilation
[Filtering data]:https://github.com/ajv-validator/ajv#filtering-data
[Assigning defaults]:https://github.com/ajv-validator/ajv#assigning-defaults
[Coercing data types]:https://github.com/ajv-validator/ajv#coercing-data-types
[coercion rules]:https://github.com/ajv-validator/ajv/blob/master/COERCION.md
[ajv-async]:https://github.com/ajv-validator/ajv-async

| 验证和报告配置项 | 描述 |
|:---:|----|
| `$data` | 支持[$data 引用][$data references]。默认添加了 Draft 6 的元 schema。如果您希望使用其他元 schema，则需要使用`$dataMetaSchema`方法来添加对`$data 引用`的支持。|
| `allErrors` | 检查所有收集了全部错误的规则。默认在第一个错误后返回。 |
| `verbose` | 默认值为`false`。在报错中涵盖了对部分 schema (`schema`和`parentSchema`)和验证数据的引用。 |
| `$comment` <br /> <Badge text="Ajv 6.0 中新增的属性" /> | 将`$comment`关键字的值记录或传递给函数。<br /><br />**可配置的值为：**<br />- `false(默认值)` 忽略`$comment`关键词。<br />- `true` 将关键字的值记录到控制台。<br />- 函数：传入关键字的值、其 schema 路径和根 schema 传入指定函数。 |
| `jsonPointers` | 不使用常规 JavaScript 属性访问方式而是使用[JSON 指针][JSON 指针]而来设置错误的`dataPath`属性。 |
| `uniqueItems` | 默认为`true`。验证`uniqueItems`关键字。|
| `unicode` | 默认值为`true`。使用 unicode 对来计算字符串的正确长度。若设置为`false`，则使用`.length`来计算，速度更快但按照 unicode 对来计算的字符串长度就“不正确”了 —— 每个 unicode 对都被计算为两个字符。|
| `nullable` | 支持[第三版开放 API 规范][Open API 3 specification]中的`nullable`关键字。|
| `format` | 格式验证模式。配置项的值：<br /><br />- `"fast"(默认值)`：简单且快速地验证(请参阅[Formats][Formats]，了解可用的格式以及受此配置项影响的详细信息)。<br />- `"full"`：严格且缓慢的验证。例如：25:00:00和2015/14/33在`full`模式下是无效的时间和日期，但在`fast`模式下则有效。<br />- 忽略所有格式关键字。|
| `formats` | 具有自定义格式的对象。键和值将传给`addFormat`方法。|
| `keywords` | 具有自定义关键字的对象。键和值将传给`addKeyword`方法。|
| `unknownFormats` | 对未知格式的处理方法。可配置的值如下：<br /><br />- `true(默认值)`：如果遇到未知的格式，则在 schema 编译期间抛出异常。如果格式关键字值是[$data 引用][$data references]，并且未知，验证将失败。<br />- `[String]`：一个将要忽略掉的未知格式名称的数组。该配置项可用来允许使用并未定义格式的第三方 schema，但如果使用了其他未知格式，则仍然失败。如果`format`关键字的值是[$data 引用][$data references]，并且它不在这个数组中，验证将失败。<br />- `"ignore"`：在 schema 编译期间记录警告并始终通过验证(5.0.0之前版本中的默认行为)。不建议使用此选项，因为它允许输入错误的格式名称，并且在没有任何错误消息的情况下不会对其进行验证。这个行为是 JSON schema 规范所要求的。|
| `schemas` | 将添加到实例中的 schema 数组或对象。为了传递数组，schema 中必须包含id。当传递对象时，将为该对象中的每个 schema 调用方法`addSchema(value, key)`。 |
| `logger` | 设置日志方法。默认是在控制台输出，有`log`、`warning`和`error`三种。参见[错误日志][Error logging]。配置项的值：<br /><br />- 自定义日志：应该有`log`、`warning`和`error`三种方法，如果缺少任意一个则会抛出异常。<br />- `false`：禁用日志。|


| 引用 schema 的配置项 | 描述 |
|:---:|----|
| `schemaId` | 该配置项定义将哪些关键字用作 schema URI。它的值如下： <br /><br />- `"$id"(默认值)`：只使用(在JSON schema draft-06/07 中指定的)`$id`关键字作为 schema URI，忽略`id`关键字(如果出现警告将记录到日志中)。<br />-`"id"`：只使用(在 JSON schema draft-04 中指定的)`id`关键字作为 schema URI，忽略`$id`关键字(如果出现警告将记录到日志中)。<br />- `"auto"`： 使用`$id`和`id`关键字作为 schema URI。如果(在同一个 schema 对象中)两者都存在且不同，则在 schema 编译期间将抛出异常。 |
| `missingRefs` | 处理丢失的引用 schema 的方法。它的值如下：<br /><br />- `true(default)`： 如果在编译期间无法解析引用，则抛出异常。抛出的错误拥有`missingRef`(带有散列片段)和`missingSchema`(没有散列片段)属性。这两个属性都是相对于当前基本id(通常是 schema id，除非被替换)进行解析的。<br />- `"ignore"`：在编译期间打印错误并始终通过验证。<br />- `"fail"`：以打印错误并成功编译 schema，但如果规则已检查，则验证失败。 |
| `extendRefs` | 当 schema 中存在`$ref`时，验证其他关键字。它的值如下：<br /><br />- `"ignore"(默认)`：当使用`$ref`时，将会(按照[JSON 引用][JSON 引用]标准)忽略其他关键字。在 schema 编译期间将记录一个警告。<br />- `"fail"(推荐)`：如果其他验证关键字与`$ref`一起使用，则在编译 schema 时将抛出异常。建议使用此配置项以确保 schema 中没有忽略的关键字，否则可能会造成混淆。<br />- `true`：使用`$ref`(5.0.0 之前版本中的默认行为)验证 schema 中的所有关键字。 |
| `loadSchema` | 当使用`compileAsync`方法并且缺少一些引用(配置项项`missingRefs`不是`‘fail’`或`‘ignore’`)时，用来加载远程 schema 的异步函数。此函数应接受远程 schema uri 作为参数，并返回结果为 schema 的 Promise。参见[异步编译][异步编译]中的示例。|



| 修改验证数据的配置项 | 描述 |
|:---:|----|
| `removeAdditional` | 删除额外属性 —— 参见[筛选数据][Filtering data]中的示例。如果使用`addMetaSchema`方法添加 schema，则不使用此选项。它的值如下：<br /><br />- `false`：并不移除额外属性。<br />- `"all"`：删除所有额外属性，无论 schema 中的`additionalProperties`关键字如何(并且没有对它们进行验证)。<br />- `true`：只有添加了`additionalProperties`关键字等于`false`的额外属性才会被删除。<br />- `"failing"`：schema 验证失败的额外属性将被删除(其中`additionalProperties`关键字为`false`或 schema)。 |
| `useDefaults` | 使用相应的`default`关键字的值替换丢失的或未定义的属性和项。默认行为是忽略`default`关键字。如果使用`addMetaSchema`方法添加 schema，则不使用此选项。参见[配置默认值][Assigning defaults]中的示例。它的值如下：<br /><br />- `false(默认值)`：不使用默认值。<br />- `true`：按值插入默认值(使用对象文字)。<br />- `"empty"`：除了缺失或未定义，属性和项的默认值为`null`或`""`(一个空字符串)。<br />- `"shared"`：已废弃，不翻了。 |
| `coerceTypes` | 更改数据的数据类型以匹配类型关键字。请参见强制[数据类型][Coercing data types]和[强制转换规则][coercion rules]的示例。它的值如下：<br /><br />- `false(默认值)`：无强制类型。<br />- `true`：强制值数据类型。<br />- `"array"`：除了在值类型之间强制使用外，还可将值数据强制转换为只有一个元素的数组，反之亦然(根据 schema 的要求)。|

| 严格模式配置项 | 描述 |
|:---:|----|
| `strictDefaults` | 报告会忽略 schema 中的`default`关键字。它的值如下：<br /><br />- `false(默认值)`：忽略的默认值不会报告。<br />- `true`：如果存在忽略的默认值，则抛出错误。<br />- `"log"`：如果出现忽略的默认值，则记录并警告。 |
| `strictKeywords` | 报告会忽略 schema 中的未知关键字。它的值如下：<br /><br />- `false(默认值)`：未知的关键字不会报告。<br />- `true`：如果存在未知的关键字，则抛出错误。<br />- `"log"`：如果出现未知的关键字，则记录并警告。 |
| `strictNumbers` | 严格验证数字，`NaN`和`Infinity`会验证失败。它的值如下：<br /><br />- `false(默认值)`：`NaN`和`Infinity`将通过数字类型验证。<br />- `true`：`NaN`和`Infinity`不会数字类型验证。 |

[nodent]:https://github.com/MatAtBread/nodent
[draft07]:http://json-schema.org/draft-07/schema

| 异步验证配置项 | 描述 |
|:---:|----|
| `transpile` | 需要[ajv-async][ajv-async]包。它将决定 Ajv 是否转换编译的异步验证函数。它的值如下: <br /><br />- `undefined`：如果不支持异步函数，则使用[nodent][nodent]进行转换。<br />- `true`：总是使用[nodent][nodent]进行转换。<br />- `false`：不转换。如果不支持异步函数则抛出错误。|

[meta-schema]:http://json-schema.org/documentation.html
[ajv-i18n]:https://github.com/ajv-validator/ajv-i18n
[js-beautify]:https://github.com/beautify-web/js-beautify
[Asynchronous validation]:https://github.com/ajv-validator/ajv#asynchronous-validation
[sacjs]:https://github.com/epoberezkin/sacjs
[fast-json-stable-stringify]:https://github.com/epoberezkin/fast-json-stable-stringify

| 高级配置项 | 描述 |
|:---:|----|
| `meta` | (默认值：`true`) 添加[元 schema][meta-schema]，以便它可以被其他 schema 使用。如果传入了一个对象，它将作为没有`$schema`关键字的 schema 的默认元 schema。这个默认的元 schema **必须**具有`$schema`关键字。 |
| `validateSchema` | (默认值：`true`) 根据元 schema 验证添加/编译的 schema。schema 中的`$schema`属性可以是[draft07][draft07]或为空(将使用 draft07 元 schema)，也可以是对之前通过`addMetaSchema`方法添加的 schema 的引用。它的值如下：<br /><br />- `true(默认值)`：如果验证失败则抛出错误。<br />- `"log"`：如果验证失败，抛出错误。<br />- `false`：跳过 schema 验证。|
| `addUsedSchema` | 如果有不以"#"开头的`$id`(或`id`)属性，则使用默认方法`compile`和`validate`向实例中添加 schema。如果存在`$id`且不是唯一的，则会抛出异常。将该配置项设置为`false`可以跳过向实例添加 schema 和使用这些方法时的`$id`惟一性检查。此配置项不影响`addSchema`方法。|
| `inlineRefs` | 影响引用 schema 的编译。它的值如下: <br /><br />- `true(默认值)`：引用的 schema 若不存在 refs 则是内联引用，不管它们的尺寸如何 —— 这在很大程度上提高了性能，但代价是编译的 schema 函数更大。<br />- `false`：以非内联引用的 schema (它们将被编译为单独的函数)。<br /> 整数：限制将要内联 schema 的关键字的最大数量。 |
| `passContext` | 向自定义关键词函数传入验证上下文。如果设置为`true`并且您通过`validate.call(context, data)`将某个上下文传入编译验证函数，那么就可以在您的自定义关键词中的`this`使用`context`。默认的`this`是 Ajv 实例。|
| `loopRequired` | 默认情况下`required`关键字会被编译为单个表达式(或是`allErrors`的语句序列)。如果在这个关键字中有大量的属性，这可能会导致一个非常大的验证函数。通过传入一个整数来设置在循环中验证`required`关键字的属性数 ———— 更小的验证函数但性能更差。|
| `ownProperties` | 默认情况下，Ajv 遍历所有可枚举的对象属性；该值为`true`时，只迭代自己的可枚举对象属性(即直接在对象上找而不是在其原型上找)。 |
| `multipleOfPrecision` | 默认情况下，`multipleOf`关键字通过将除法结果与该结果`parseInt()`后的值进行比较来验证。它适用于大于 1 的除数。对于像 0.01 这样除数，除法的结果通常不是整数(即使它应该是个整数)。如果您需要使用分数，请将该项设置为正整数 N，以便验证`multipleOf`时可以使用这个公式：`Math.abs(Math.round(division) - division) < 1e-N`(它的速度虽然慢一点，但允许浮点数计算偏差)。  |
| `errorDataPath` | 已废弃，不翻了。 |
| `messages` | 默认值`true`。在错误中包含易于识别的信息，若要自定义信息可以设置为`false`。(比方说搭配[ajv-i18n][ajv-i18n]) |
| `sourceCode` | 为验证函数添加`sourceCode`属性(用于调试；这段代码可能与`toString`调用的结果不同)。 |
| `processCode` | 函数，用于在将生成的代码传递给函数构造函数之前对其进行处理。它既可以用来美化函数(生成的验证函数没有换行)，也可以用来置换代码。从 5.0.0 版本开始，使用下面的值: <br /><br />- `beautify`：使用[js-beautify][js-beautify]格式化生成的函数。如果您想要美化生成的代码，可以传入调用`require('js-beautify').js_beautify`的函数，如`processCode: code => js_beautify(code)`。 <br />- `transpile` 转换异步验证功能。您仍然可以在[ajv-async][ajv-async]包中使用`transpile`选项。有关更多信息，请参阅[异步验证][Asynchronous validation]。 |
| `cache` | 缓存实例，用于存储使用稳定字符串化 schema 作为键的已编译模式。例如，可以使用集合关联缓存[sacjs][sacjs]。如果没有传入任何值将使用一个简单的 hash 表，这对于常见用例(静态定义且数量有限的 schema)来说已经足够了。缓存应该有`put(key, value)`、`get(key)`、`del(key)`和`clear()`方法。 |
| `serialize`| 函数序列化模式以缓存键。传递`false`以使用 schema 本身作为键(比方说用`WeakMap`作缓存的话)。默认使用了[fast-json-stable-stringify][fast-json-stable-stringify] |








