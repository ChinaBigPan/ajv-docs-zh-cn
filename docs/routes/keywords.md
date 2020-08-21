---
title: keywords
---

# Ajv-keywords

[英文原地址](https://github.com/ajv-validator/ajv-keywords)

用于 Ajv 验证的自定义 JSON Schema 关键字。

## 安装

```bash
npm install ajv-keywords
```

## 使用

添加所有可用的关键字

```js
var Ajv = require('ajv');
var ajv = new Ajv;
require('ajv-keywords')(ajv);

ajv.validate({ instanceof: 'RegExp' }, /.*/); // true
ajv.validate({ instanceof: 'RegExp' }, '.*'); // false
```

添加单个关键字：

```js
require('ajv-keywords')(ajv, 'instanceof');
```

添加多个关键字：

```js
require('ajv-keywords')(ajv, ['typeof', 'instanceof']);
```

在浏览器中添加单个关键字(以避免添加未使用的代码)：

```js
require('ajv-keywords/keywords/instanceof')(ajv);
```

## 关键字




























