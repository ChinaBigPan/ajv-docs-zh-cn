---
title: API
sidebarDepth: 3
---

# API

[英文原地址](https://github.com/ajv-validator/ajv#api)

## `new Ajv(Object options) -> Object`

创建 Ajv 实例。

## `.compile(Object schema) -> Function<Object data>`

生成验证函数并缓存已编译的 schema 以备将来使用。

验证函数返回一个布尔值。该函数拥有`errors`和`schema`属性。在最后一次验证期间遇到的错误将被分配给`errors`属性(如果没有错误，则将其分配为`null`)。`schema`属性包含了对原始 schema 的引用。

[options]:https://github.com/ajv-validator/ajv#options

传递给该方法的 schema 将根据元 schema 进行验证，除非配置项`validateSchema`的值为`false`。如果 schema 无效则会抛出错误。参见[配置项][options]。

## `.compileAsync(Object schema [, Boolean meta] [, Function callback]) -> Promise`

`compile`方法的异步版本，使用`options.loadSchema`中的异步函数加载缺少的远程 schema。该函数返回一个`resolve`结果为验证函数的 Promise。传递给`compileAsync`的可选函数参数将被调用，它有两个参数：error (或 null) 以及验证函数。在下面情况下，将返回`reject`结果的 Promise：

- 丢失的 schema 无法加载(`loadSchema`返回`reject`的 Promise)。
- 加载的 schema 存在引用缺失，且无法解析引用。
- schema (或某些加载/引用的 schema)无效。

该函数编译 schema 并加载第一个缺失的 schema (或元 schema )，直到加载完所有缺失的 schema 为止。

您可以通过传递`true`作为第二个参数来异步编译元 schema 。

[Asynchronous compilation]:https://github.com/ajv-validator/ajv#asynchronous-schema-compilation

参见[异步编译][Asynchronous compilation]示例。

## `.validate(Object schema|String key|String ref, data) -> Boolean`

使用传入的 schema 验证数据(它将被编译和缓存)。

您可以使用之前传递给`addSchema`的键而不是 schema (如果 schema 或以前解析的引用中存在的 schema id)。

验证错误将存储在 Ajv 实例的`errors`属性中(如果没有错误，则为`null`)。

::: tip 请注意
每次调用该方法时，都会覆盖错误，因此如果以后想要使用它们，需要将它们复制到另一个变量中。
::: 

[Asynchronous validation]:https://github.com/ajv-validator/ajv#asynchronous-validation

如果 schema 是异步的(它在最顶层拥有`$async`关键字)，它将返回一个 Promise。参见[异步验证][Asynchronous validation]。

## `.addSchema(Array<Object>|Object schema [, String key]) -> Ajv`

向验证器实例添加 schema 。此方法不编译 schema (但仍然验证)。因此，依赖关系可以以任何顺序添加，并支持循环依赖。它还可以防止作为其他 schema 容器但并非作为一个整体使用的 schema 发生不必要地编译。

可以传入 schema 数组(schema 应该有id)，第二个参数将被忽略。

可以传递可用于引用 schema 的键，如果 schema 中没有id，则将作为 schema 的 id 使用。如果没有传递键，则将使用 schema id作为键。

一旦添加了 schema ，就可以在其他 schema 中(以及其中的所有引用)引用它，并用于验证数据。

虽然`addSchema`不编译 schema ，但不需要显式编译 ———— 该 schema 将在第一次使用时进行编译。

默认情况下，schema 在被添加之前会根据元 schema 进行验证，如果 schema 没有通过验证，就会抛出异常。这种行为由配置项`validateSchema`控制。

::: tip 请注意
Ajv 中所有前缀为`add*`和`remove*`的方法都可以使用链式调用。

```js
var validate = new Ajv().addSchema(schema).addFormat(name, regex).getSchema(uri);
```
:::

## `.addMetaSchema(Array<Object>|Object schema [, String key]) -> Ajv`

添加可用于验证其他 schema 的元 schema 。该函数应该替代`addSchema`，因为可能有实例配置项会不正确地编译一个元 schema(目前它是配置项`removeAdditional`)。

没有必要显式地添加 [draft-07 元 schema](http://json-schema.org/draft-07/schema) —— 它是默认添加的，除非配置项`meta`的值为`false`。只有当您有一个更改过的元 schema，想要使用它来验证您的 schema 时，您才需要使用它。参见`validateSchema`。

## `.validateSchema(Object schema) -> Boolean`

验证 schema。由于 JSON schema 标准中的`uri`格式不一致，应该使用该方法验证 schema 而不是`validate`。

默认在添加 schema 时自动调用此方法，因此很少需要直接使用它。

如果 schema 并没有`$schema`属性，它将根据 draft 6 的元 schema 进行验证(`meta`配置项的值不应该是`false`)。

如果 schema 拥有`$schema`属性，那么使用拥有该`id`的 schema (应该在前面添加)来验证传入的 schema。

错误会放到`ajv.errors`中。

## `.getSchema(String key) -> Function<Object data>`

通过传递给`addSchema`的键或其完整引用(id)检索以前用`addSchema`添加的已编译 schema。返回的验证函数拥有`schema`属性，它是对原始 schema 的引用。

## `.removeSchema([Object schema|String key|String ref|RegExp pattern]) -> Ajv`

移除添加/缓存的 schema。即使 schema 被其他 schema 引用，它也可以安全地删除，因为有本地引用了。

schema 可以用以下方法移除：

- 传入`addSchema`的键。
- 其完全引用(id)。
- 应匹配 schema 或键的正则表达式(元 schema 不会被删除)。
- 实际的 schema 对象，它会被稳定地字符串化以从缓存中移除。

如果没有传递任何参数，除了元 schema 外，所有 schema 都将被删除，缓存也会被清空。

## `.addFormat(String name, String|RegExp|Function|Object format) -> Ajv`

添加自定义格式以验证字符串或数字。它还可以用于替换 Ajv 实例中的预定义格式。

字符串会被转换为正则。

函数应该返回`true`或`false`的验证结果。

如果传入对象，那么它应该具有`validate`、`compare`和`async`属性：

| 对象属性 | 描述 |
|:---:|----|
| `validate` | 字符串、正则或如上所述的函数。 |
| `compare` | 可选的比较函数，它接受两个字符串，并根据格式的含义对它们进行比较。此函数与关键字`formatMaximum/formatMinimum`(在`ajv-keywords`包中定义)一起使用。如果第一个值大于第二个值，它应该返回`1`，如果它小于它应该返回`-1`，如果它等于它应该返回`0`。 |
| `async` | 可选的`true`值，如果验证函数式异步的(无论它是编译或传入的验证属性)；在这种情况下，它应该返回一个 Promise，该 Promise 的值为`true`或`false`。这个选项在“宏(macro)”和“内联(inline)”关键字的情况下被忽略。 |
| `errors` | 选的布尔值或字符串`“full”`，用于指示关键字是否返回错误。如果没有设置该属性，Ajv 将决定验证失败时是否设置错误。 |

编译(compile)、宏(macro)和内联(inline)是互斥的，一次只能使用一个。`validate`可以单独使用，也可以与它们一起使用，以支持`$data`引用。

::: tip 请注意
如果关键字是在其定义中验证数据类型不同的类型，验证函数将不会被调用(且扩展宏也不会被使用)，所以不需要检查数据类型内部验证函数或宏函数返回的内部 schema (除非你想执行一个特定的类型和出于某种原因不想使用一个单独的`type`关键字)。与标准关键字的工作方式相同，如果关键字不适用于被验证的数据类型，则该关键字的验证将通过。

参见[自定义关键字](https://github.com/ajv-validator/ajv#defining-custom-keywords)
:::

## `.getKeyword(String keyword) -> Object|Boolean`

返回自定义关键字的定义。如果是预定义关键字返回`true`，如果是未知关键字返回则`false`。

## `.removeKeyword(String keyword) -> Ajv`

删除自定义或预定义的关键字，以便重新定义它们。

虽然这种方法可以用来扩展预定义的关键字，但它也可以用来完全改变它们的意思 —— 它可能会导致意想不到的结果。

::: tip 请注意
在关键字被删除之前编译的 schema 将继续工作，不需要做任何更改。要重新编译 schema，请使用`removeSchema`方法并再次编译它们。
:::

## `.errorsText([Array<Object> errors [, Object options]]) -> String`

返回字符串中包含所有错误的文本。

配置项有`separator`属性(默认情况下用`“，”`分隔错误的字符串)和`dataVar`属性(默认情况下 dataPath 前缀为“data”的变量名)。



