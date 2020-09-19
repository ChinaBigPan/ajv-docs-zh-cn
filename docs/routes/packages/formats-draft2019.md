---
title: ajv-formats-draft2019
sidebarDepth: 3
---

# ajv-formats-draft2019

向 Ajv 中添加尚未包含的 draft2019 格式验证器。

当前已支持`idn-hostname`、`idn-email`、`iri`、`iri-reference`和`duration`。`uuid`是 draft2019 中添加到，但是 Ajv 已经支持了。

## 使用 pre-draft2019 JSON schema 配置国际化格式

`idn-email`和`idn-hostname`格式时按照 RFC 1123 实现的，但是早期的 JSON schema 则是 RFC 1034。需要提醒一波...

## 安装

```bash
npm install ajv-formats
```

## 使用

默认的导出是一个`apply`函数，用于对现有的 ajv 实例进行补强。

```js
const Ajv = require('ajv');
const apply = require('ajv-formats-draft2019');
const ajv = new Ajv();
apply(ajv); // 返回 ajv 实例，允许链式调用

let schema = {
  type: 'string',
  format: 'idn-email',
};
ajv.validate(schema, 'квіточка@пошта.укр'); // 返回 true
```

`apply`函数还接受第二个可选参数，用于指定要向`ajv`实例添加哪些格式。

```js
const Ajv = require('ajv');
const apply = require('ajv-formats-draft2019');
const ajv = new Ajv();

// 仅安装 idn-email 和 iri 格式
apply(ajv, { formats: ['idn-email', 'iri'] });
```

该模块还提供了另一个入口点`ajv-formats-draft2019/formats`，和 ajv 构造函数相配合将格式添加到新实例。

```js
const Ajv = require('ajv');
const formats = require('ajv-formats-draft2019/formats');
const ajv = new Ajv({ formats });

let schema = {
  type: 'string',
  format: 'idn-email',
};
ajv.validate(schema, 'квіточка@пошта.укр'); // 返回 true
```

使用`ajv-formats-draft2019/formats`入口点也允许您"挑三拣四"。注意，下面的方法只适用于名称中不包含连字符`-`的格式。这种方法可能产生更小的包，因为它允许摇树优化(tree-shaking)来删除不需要的验证器和相关依赖项。

```js
const Ajv = require('ajv');
const { duration, iri } = require('ajv-formats-draft2019/formats');
const ajv = new Ajv({ formats: { duration, iri } });
```

## 国际格式

该库还提供了一个`idn`导出，方便只加载国际格式(即`iri`、`iri-reference`、`idn-hostname`和`idn-email`)。

```js
const Ajv = require('ajv');
const formats = require('ajv-formats-draft2019/idn');
const ajv = new Ajv({ formats });
```

## 格式

### `iri`

该字符串使用`uri-js`进行解析，并根据著名的 IANA schema 列表检查。如果是"mailto" schema，则验证所有的`to:`地址，否则会检查 IRI 是否包含路径和绝对引用。

### `iri-reference`

所有有效的 IRIs 都可以。片段必须有一个有效的路径，并且类型为“relative”、“same-document”或“uri”。如果存在一个 schema，它必须是有效的。

验证 IRI 引用可不容易，因为它的语法比较灵活。基本上任何安全的 URL 字符串都是一个有效的 IRI。在编写单元测试时，我们极尽全力地寻找负面测试用例：

- `google.com`不是有效的IRI，因为它不包含 schema。 
- `file.txt`是有效的 IRI-reference。
- `/this:that`是有效的 IRI-reference。
- `this:that`不是有效的 IRI-reference。

### `idn-email`

使用[isemail](https://www.npmjs.com/package/isemail)来验证 email。

### `idn-hostname`

使用域名代码(punycode)将 hostname 转换为 ascii 码并检查是否是有效的顶级域(tld)。

### `duration`

根据正则表达式检查字符串。




















