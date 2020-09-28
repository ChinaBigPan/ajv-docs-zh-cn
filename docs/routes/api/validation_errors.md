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

- `maxItems`、`minItems`、`maxLength`、`minLength`、`maxProperties`、`minProperties` ———— `limit`属性(关键字的 schema，值为数字)。
- `additionalItems` ———— `limit`属性(如果`items`关键字是 schema 数组且`additionalItems`为`false`，则允许的最大项数量)。
- `additionalProperties` ———— `additionalProperty`属性(该属性并未在`properties`和`patternProperties`关键字中使用)。
- `dependencies` - 属性：
    - `property`(依赖属性)。
    - `missingProperty`

















