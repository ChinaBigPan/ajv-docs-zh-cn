---
title: Ajv
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



















