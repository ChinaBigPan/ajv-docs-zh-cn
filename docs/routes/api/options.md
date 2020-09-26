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
| `useDefaults` ||
| `coerceTypes` ||

| 严格模式配置项 | 描述 |
|:---:|----|
| `strictDefaults` ||
| `strictKeywords` ||
| `strictNumbers` ||

| 异步验证配置项 | 描述 |
|:---:|----|
| `transpile` ||

| 高级配置项 | 描述 |
|:---:|----|
| `meta` ||
| `validateSchema` ||
| `addUsedSchema` ||
| `inlineRefs` ||
| `passContext` ||
| `loopRequired` ||
| `ownProperties` ||
| `multipleOfPrecision` ||
| `errorDataPath` ||
| `messages` ||
| `sourceCode` ||
| `processCode` ||
| `cache` ||
| `serialize`||








