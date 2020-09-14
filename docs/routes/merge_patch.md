---
title: ajv-merge-patch
---

# ajv-merge-patch

方便 Ajv 扩展 JSON Schema的`$merge`关键字和`$patch`关键字。

[英文源文档](https://github.com/ajv-validator/ajv-merge-patch)

## 解决的问题

允许使用[JSON Merge Patch (RFC 7396)](https://tools.ietf.org/html/rfc7396)和[JSON Patch (RFC 6902)](https://tools.ietf.org/html/rfc6902)中的模式补丁来扩展 JSON Schema 的`$merge`和`$patch`关键字。

如果您想要向递归 schema (例如元 schema)中添加额外的属性，那么 schema 的扩展就是是必不可少的。考虑一下这个例子:

原本的 schema：

```json
{
  "id": "mySchema.json#",
  "type": "object",
  "properties": {
    "foo": { "type": "string" },
    "bar": { "$ref": "#" }
  },
  "additionalProperties": false
}
```

验证数据：`{ foo: 'a' }`、`{ foo: 'a', bar: { foo: 'b' } }`等。

如果您想要定义更多属性的 schema，那么在不使用`$merge`或`$patch`关键字的情况下，唯一的方法就是复制粘贴并编辑原始的 schema。

使用`$merge`关键字您可以这样创建扩展后的`schema`：

```json
{
  "id": "mySchemaExtended.json#",
  "$merge": {
    "source": { "$ref": "mySchema.json#" },
    "with": {
      "properties": {
        "baz": { "type": "number" }
      }
    }
  }
}
```

验证数据：`{ foo: 'a', baz: 1 }`、`{ foo: 'a', baz: 1, bar: { foo: 'b', baz: 2 } }`等。

`$merge`是使用[json-merge-patch](https://github.com/pierreinglebert/json-merge-patch)实现的[自定义宏关键字](https://github.com/pierreinglebert/json-merge-patch)。

若使用`$patch`关键字则是这样扩展：

```json
{
  "id": "mySchemaExtended.json#",
  "$patch": {
    "source": { "$ref": "mySchema.json#" },
    "with": [
      {
        "op": "add",
        "path": "/properties/baz",
        "value": { "type": "number" }
      }
    ]
  }
}
```

`$patch`是使用[fast-json-patch](https://github.com/Starcounter-Jack/JSON-Patch)实现的[自定义宏关键字](https://github.com/pierreinglebert/json-merge-patch)。


在大多数情况下，`$merge`格式更容易理解和维护。`$patch`可以用于`$merge`无法表达的扩展和更改，例如[添加数组值](https://tools.ietf.org/html/rfc6902#page-18)。

关键字中的`with`属性还可以是对某个 schema 的**部分引用**，在这种情况下，将使用解析的值，而不是使用带有`$ref`属性的实际对象。

**请注意：**

1. 如果`source`schema 或`with`关键字的`patch`使用了`$ref`，它们将不会考虑福对象定义的内部`$ref`的解析作用域——它们将会作为单独的对象来使用。
2. 在`source`schema或`with`中的`$ref`都考虑了当前`$ref`的解析作用域（从 2.0.0 版本开始）。

参考资料：

1. [V5 proposal](https://github.com/daveclayton/json-schema-validator/wiki/v5:-merge);
2. [$merge and $patch tests](https://github.com/epoberezkin/ajv-merge-patch/blob/master/spec);
3. [JSON-Schema-Org 的讨论](https://github.com/json-schema-org/json-schema-spec/issues/15)

## 在 Ajv 中使用

这些关键字需要兼容的 Ajv 版本 >= 5.1.0-beta.0。

将这些关键字加入到 Ajv 实例：

```bash
var Ajv = require('ajv');
var ajv = new Ajv();
require('ajv-merge-patch')(ajv);
```

## 在浏览器中使用

您也可以使用 browserify 添加这些关键字。

```js
// merge
require('ajv-merge-patch/keywords/merge')(ajv);
// patch
require('ajv-merge-patch/keywords/patch')(ajv);
```



