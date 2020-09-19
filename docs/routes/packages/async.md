---
title: ajv-async
sidebarDepth: 2
---

# ajv-async

配置 Ajv 的异步验证模式。

[英文原地址]:https://github.com/ajv-validator/ajv-async

## 安装

```bash
npm install ajv-async
```

## 使用

下面的代码展示了如何在 Ajv 实例中配置异步模式，以及按需使用[nodent](https://github.com/MatAtBread/nodent)转换 async 函数。

```js
var Ajv = require('ajv');
var setupAsync = require('ajv-async');

var ajv = setupAsync(new Ajv);
```

`transpile`配置项可以设置为布尔值来让 Ajv 实例执行强制(或 禁止)转换。

## 在浏览器中使用

ajv-async 的 npm 包中已经包含了 nodent。 如果您使用 browserify 或 webpack 来打包您的代码，当您`require('ajv-async')`的时候， nodent 也会一并打包。




