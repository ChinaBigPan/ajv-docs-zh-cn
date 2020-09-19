---
title: ajv-errors
sidebarDepth: 3
---

# ajv-errors

自定义 JSON schema 中的错误信息插件。

[英文原地址]:https://github.com/ajv-validator/ajv-errors

## 安装

```bash
npm install ajv-errors
```

## 使用

向 Ajv 实例中添加`errorMessage`关键字：

```js
var Ajv = require('ajv');
var ajv = new Ajv({allErrors: true, jsonPointers: true});
// Ajv options allErrors and jsonPointers are required
require('ajv-errors')(ajv /*, {singleError: true} */);
```

### 单个信息

用一条消息替换当前 schema 和子鸡 schema 中的所有错误:

```js
var schema = {
  type: 'object',
  required: ['foo'],
  properties: {
    foo: { type: 'integer' }
  },
  additionalProperties: false,
  errorMessage: 'should be an object with an integer property foo only'
};

var validate = ajv.compile(schema);
console.log(validate({foo: 'a', bar: 2})); // false
console.log(validate.errors); // 处理后的错误信息
```

处理后的错误信息：

```js
[
  {
    keyword: 'errorMessage',
    message: 'should be an object with an integer property foo only',
    // ...
    params: {
      errors: [
        { keyword: 'additionalProperties', dataPath: '' /* , ... */ },
        { keyword: 'type', dataPath: '.foo' /* , ... */ }
      ]
    }
  }
]
```

### 关键字信息

仅替换当前 schema 中的某些关键字错误。

```js
var schema = {
  type: 'object',
  required: ['foo'],
  properties: {
    foo: { type: 'integer' }
  },
  additionalProperties: false,
  errorMessage: {
    type: 'should be an object', // 不会替换属性“foo”的内部“type”错误
    required: 'should have property foo',
    additionalProperties: 'should not have properties other than foo'
  }
};

var validate = ajv.compile(schema);
console.log(validate({foo: 'a', bar: 2})); // false
console.log(validate.errors); // 处理后的错误信息
```

处理后的错误信息:

```js
[
  {
    // 原本的错误
    keyword: type,
    dataPath: '/foo',
    // ...
    message: 'should be integer'
  },
  {
    // 生成的错误
    keyword: 'errorMessage',
    message: 'should not have properties other than foo',
    // ...
    params: {
      errors: [
        { keyword: 'additionalProperties' /* , ... */ }
      ]
    },
  }
]
```

对于关键字`required`和`dependencies`，可以为不同的属性指定不同的错误信息：

```js
var schema = {
  type: 'object',
  required: ['foo', 'bar'],
  properties: {
    foo: { type: 'integer' },
    bar: { type: 'string' }
  },
  errorMessage: {
    type: 'should be an object', // 不会替换属性“foo”的内部“type”错误
    required: {
      foo: 'should have an integer property "foo"',
      bar: 'should have a string property "bar"'
    }
  }
};
```

### 属性和项的信息

替换属性/项(和更深层次)的错误，不管它们是在 schema 的什么地方创建的:

```js
var schema = {
  type: 'object',
  required: ['foo', 'bar'],
  allOf: [{
    properties: {
      foo: { type: 'integer', minimum: 2 },
      bar: { type: 'string', minLength: 2 }
    },
    additionalProperties: false
  }],
  errorMessage: {
    properties: {
      foo: 'data.foo should be integer >= 2',
      bar: 'data.bar should be string with length >= 2'
    }
  }
};

var validate = ajv.compile(schema);
console.log(validate({foo: 1, bar: 'a'})); // false
console.log(validate.errors); // 处理后的错误信息
```

处理后的错误信息:

```js
[
  {
    keyword: 'errorMessage',
    message: 'data.foo should be integer >= 2',
    dataPath: '/foo',
    // ...
    params: {
      errors: [
        { keyword: 'minimum' /* , ... */ }
      ]
    },
  },
  {
    keyword: 'errorMessage',
    message: 'data.bar should be string with length >= 2',
    dataPath: '/bar',
    // ...
    params: {
      errors: [
        { keyword: 'minLength' /* , ... */ }
      ]
    },
  }
]
```

### 默认信息

当关键字`errorMessage`的值为一个对象。您可以指定出现任何未经关键字/属性/项目覆盖的错误时，使用的信息：

```js
var schema = {
  type: 'object',
  required: ['foo', 'bar'],
  allOf: [{
    properties: {
      foo: { type: 'integer', minimum: 2 },
      bar: { type: 'string', minLength: 2 }
    },
    additionalProperties: false
  }],
  errorMessage: {
    type: 'data should be an object',
    properties: {
      foo: 'data.foo should be integer >= 2',
      bar: 'data.bar should be string with length >= 2'
    },
    _: 'data should have properties "foo" and "bar" only'
  }
};

var validate = ajv.compile(schema);
console.log(validate({})); // false
console.log(validate.errors); // 处理后的错误信息
```

处理后的错误信息：

```js
[
  {
    keyword: 'errorMessage',
    message: 'data should be an object with properties "foo" and "bar" only',
    dataPath: '',
    // ...
    params: {
      errors: [
        { keyword: 'required' /* , ... */ },
        { keyword: 'required' /* , ... */ }
      ]
    },
  }
]
```

`errorMessage`的属性`_`中的消息替换了`errorMessage`是字符串时将被替换的相同错误。


## 模板

[JSON-pointers]:https://tools.ietf.org/html/rfc6901
[relative JSON-pointers]:http://tools.ietf.org/html/draft-luff-relative-json-pointer-00
[examples]:https://gist.github.com/geraintluff/5911303

在`errorMessage`关键字中使用的自定义错误消息可以为模板，它们使用[JSON指针][JSON-pointers]或[JSON相对指针][relative JSON-pointers]来验证数据。这样的话就会插入值。请参阅相关[文档][examples]。

插入值的模板语法是`${<pointer>}`。

错误消息中的值会转换为字符串：

- 以区分`false`和`"false"`等类似情况。
- 以支持结构性的值。

```js
{
  "type": "object",
  "properties": {
    "size": {
      "type": "number",
      "minimum": 4
    }
  },
  "errorMessage": {
    "properties": {
      "size": "size should be a number bigger or equal to 4, current value is ${/size}"
    }
  }
}
```

## 配置项

默认：

```js
{
  keepErrors: false,
  singleError: false
}
```

| 配置项 | 描述 |
|:---:|----|
| `keepErrors` | 保持原来的错误。默认是删除匹配到的错误(它们仍然在生成错误的`params.error`属性中)。如果一个错误被匹配并包含在由`errorMessage`关键字生成的错误中，那么将具有属性`emUsed: true`。 |
| `singleError` | 为`errorMessage`关键字中使用的所有关键字创建一个错误(为属性和项定义的错误消息不会合并，因为它们具有不同的数据路径`dataPath`)。多个错误消息会连接起来：<br /><br /> - `false（默认值）`：创建多个错误，每个错误都有信息。<br /> - `true` 创建单个错误，错误信息通过`";"`进行连接。<br /> - 非空的字符串：用作连接消息的分隔符。|



















