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
















