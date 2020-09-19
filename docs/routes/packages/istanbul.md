---
title: ajv-istanbul
sidebarDepth: 3
---

# ajv-istanbul

生成验证代码以测量 schema 的测试覆盖率的插件

[英文原链接](https://github.com/ajv-validator/ajv-istanbul)

## 安装

```bash
npm i ajv-istanbul --save-dev
```

## 使用

ajv-istanbul 需要 Ajv 的版本 >= 5.0.1-beta

```js
var Ajv = require('ajv');
var ajv = new Ajv;
require('ajv-istanbul')(ajv);
```

[这里](https://github.com/epoberezkin/ajv-istanbul/blob/master/spec.js)是一些收集覆盖率和生成报告的示例。


