---
title: ajv-pack
sidebarDepth: 2
---

# Ajv-pack <Badge text="v 0.3.1" />

[英文原地址](https://github.com/ajv-validator/ajv-pack)

生成一个输出由 Ajv 编译的 JSON-schema 验证函数的模块。

## 目的

这个包允许为验证函数创建独立的模块，这些模块是预编译的，不需要 Ajv 就可以使用。它的必要性如下：

- 为了减少浏览器包的大小 —— Ajv 没有包含在其中(尽管您拥有大量的 schema，当生成的验证码的总尺寸大于 Ajv 时，包可以变大)。
- 为了减少启动时间 —— schema 的验证和编译将在构建期间进行。
- 为了避免使用构造函数(用于 schema 编译)进行动态代码求值，可以在使用[内容安全策略](http://www.html5rocks.com/en/tutorials/security/content-security-policy/)时禁用它。

::: warning 请注意
在很多情况下，在很多情况下，Ajv 可以正常工作，而 Ajv-pack 却不能。**下面**列出了其中一些情况。与使用 Ajv (它非常稳定并且经过了良好的测试)相比，建议更彻底地测试用这个包编译的模式。
:::

## 搭配 CLI

在大多数情况下，您可以通过 ajv-cli (>= 1.0.0) 使用这个包来生成导出验证函数的模块。

```bash
npm install -g ajv-cli
ajv compile -s schema.json -o validate_schema.js
```

`validate_schema.js`包含了导出验证函数的模块，可以绑定到应用程序中。

## 使用

```bash
npm install ajv-pack
```

```js
var Ajv = require('ajv'); // version >= 4.7.4
var ajv = new Ajv({sourceCode: true}); // 需要配置该项
var pack = require('ajv-pack');

var schema = {
  type: 'object',
  properties: {
    foo: {
      type: 'string',
      pattern: '^[a-z]+$'
    }
  }
};

var validate = ajv.compile(schema);
var moduleCode = pack(ajv, validate);

// 现在你可以
// 1. 将模块代码写入文件
var fs = require('fs');
var path = require('path');
fs.writeFileSync(path.join(__dirname, '/validate.js'), moduleCode);

// 2. 引用模块
var requireFromString = require('require-from-string');
var packedValidate = requireFromString(moduleCode);
```

Ajv 仍然是一个运行时依赖项，但是生成的模块将只依赖于它的某些部分，如果您需要从代码中获取这些模块，那么整个 Ajv 将不会包含在其中。

## 限制条件

目前，ajv-pack 不支持以下 schema:

- 自定义了`compiled`和`validated`关键字；支持自定义的`inline`和`macro`关键字。
- 自定义格式(它们会在验证期间被忽略)。
- 递归引用(支持对当前 schema `{ "$ref": "#" }`)的引用。
- 异步模式(它们需要自定义关键字/格式)。


