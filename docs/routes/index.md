---
title: Ajv
---

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
























