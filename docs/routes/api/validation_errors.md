---
title: 验证错误
sidebarDepth: 3
---

# 验证错误

[英文原地址](https://github.com/ajv-validator/ajv#validation-errors)

[Asynchronous validation]:https://github.com/ajv-validator/ajv#asynchronous-validation
[ajv-i18n]:https://github.com/ajv-validator/ajv-i18n

在验证失败的情况下，Ajv 将错误数组分配各验证函数的`errors`属性(或在调用`validate`或`validateSchema`方法时分配给`Ajv`实例的`errors`属性)。在[异步验证][Asynchronous validation]的情况下，返回拥有`errors`属性的`Ajv.ValidationError`错误的 rejected Promise。

## 错误对象

每个错误对象都拥有下面的属性：

| 属性 | 描述 |
|:---:|---|
| `keyword` | 验证关键词 |
| `dataPath` | 已验证的那部分数据的路径。默认情况下`dataPath`使用 JavaScript 的属性访问(如 `".prop[1].subProp"`)。当`jsonPointers`为`true`时，`dataPath`将使用 JSON 指针标准进行设置(如 `"/prop/1/subProp"`) |
| `schemaPath` | 验证失败的关键字的 schema 的路径(JSON 指针作为 URI 片段)。 |
| `params` | 带有关于错误的附加信息的对象，可用于创建自定义错误消息(例如，使用[ajv-i18n][ajv-i18n]包)。请参阅下面所有关键字设置的参数。 |
| `message` | 标准错误消息(可以通过将配置项`messages`设置为`false`来排除)。 |
| `schema` | 关键字的 schema (使用`verbose`配置项添加)。|
| `parentSchema` | 包含关键字的 schema (使用`verbose`配置项添加)。|
| `data` | 通过关键字验证数据(使用`verbose`配置项添加)。|

::: tip 请注意
`propertyNames`关键字 schema 验证错误拥有指向对象的附加属性`propertyName`、`dataPath`。对每个属性名进行 schema 验证之后，如果无效，则会添加一个附加错误，其`keyword`属性和`propertyName`相等。
:::

## 错误参数

错误中的`params`对象的属性取决于验证失败的关键字。

- `maxItems`、`minItems`、`maxLength`、`minLength`、`maxProperties`、`minProperties` —— `limit`属性(关键字的 schema，数字类型)。
- `additionalItems` —— `limit`属性(如果`items`关键字是 schema 数组且`additionalItems`为`false`，则允许的最大项数量)。
- `additionalProperties` —— `additionalProperty`属性(该属性并未在`properties`和`patternProperties`关键字中使用)。
- `dependencies` - 属性：
    - `property`(依赖属性)。
    - `missingProperty`(所需缺少的依赖项 —— 目前只报告第一个)。
    - `deps`(所需的依赖，用逗号分隔的字符串列表)。
    - `depsCount`(所需依赖数)。
- `format` —— `format`属性(关键字的 schema)。
- `maximum`、`minimum` —— 属性：
    - `limit`(关键字的 schema，数字类型)。
    - `exclusive`(`exclusiveMaximum`或`exclusiveMinimum`的 schema，布尔类型)。
    - `comparison`(比较运算，将位于左侧的数据与位于右侧限制条件进行比较；可以为`"<"`、`"<="`、`">"`、`">="`、字符串类型)。
- `multipleOf` - `multipleOf`属性(关键字的 schema)。
- `pattern` - `pattern`(关键字的 schema)。
- `required` - `missingProperty`属性(缺失的属性)。
- `propertyNames` - `propertyName`属性(无效的属性名称)。
- `patternRequired` - (ajv-keyword 中的)`missingPattern`属性(不匹配任何属性的必需通配符)。
- `type` - `type`属性(所需的类型，用逗号分隔的字符串列表)。
- `uniqueItems` - `i`和`j`属性(重复的索引项)。
- `const` - `allowedValue`属性指向的值(关键字的 schema)。
- `enum` - `allowedValue`属性指向的值的数组(关键字的 schema)。
- `$ref` - `ref`属性引用的 schema URI。
- `oneOf` - `passingSchemas`属性(传入 schema 的索引数组，如果没有传入 schema 则为空)。
- 自定义关键字(防止关键字定义不会产生错误) - `keyword`属性(关键字的名称)。

## 错误日志

在初始化 Ajv 时使用`logger`配置项将允许您定义自定义日志。这里您可以构建现有的日志。也可以使用其他的日志库，只要该库向外暴露了所需的方法即可。如果缺少所需的方法会抛出异常。

- **所需的方法：**`log`、`warn`、`error`

```js
var otherLogger = new OtherLogger();
var ajv = new Ajv({
  logger: {
    log: console.log.bind(console),
    warn: function warn() {
      otherLogger.logWarn.apply(otherLogger, arguments);
    },
    error: function error() {
      otherLogger.logError.apply(otherLogger, arguments);
      console.error.apply(console, arguments);
    }
  }
});
```

















