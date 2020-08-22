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

### 类型

### `typeof`

基于 JavaScript 的`typeof`语句。

该关键字的值应该是字符串(`"undefined"`、`"string"`、`"number"`、`"object"`、`"function"`、`"boolean"`或`"symbol"`)或字符串数组。

为了通过验证，`typeof`的结果应该等于上面字符串(或数组中字符串的其中之一)。

```js
ajv.validate({ typeof: 'undefined' }, undefined); // true
ajv.validate({ typeof: 'undefined' }, null); // false
ajv.validate({ typeof: ['undefined', 'object'] }, null); // true
```

### `instanceof`

基于 JavaScript 的`instanceof`语句。

该关键字的值应该是字符串(`"Object"`、`"Array"`、`"Function"`、`"Number"`、`"String"`、`"Date"`、`"Promise"`、`"Buffer"`或`"RegExp"`)或字符串数组。

为了通过验证，`data instanceof ...`的结果应该为`true`：

```js
ajv.validate({ instanceof: 'Array' }, []); // true
ajv.validate({ instanceof: 'Array' }, {}); // false
ajv.validate({ instanceof: ['Array', 'Function'] }, function(){}); // true
```

您可以添加自己的构造函数来识别这个关键字：

```js
function MyClass() {}
var instanceofDefinition = require('ajv-keywords').get('instanceof').definition;
// or require('ajv-keywords/keywords/instanceof').definition;
instanceofDefinition.CONSTRUCTORS.MyClass = MyClass;

ajv.validate({ instanceof: 'MyClass' }, new MyClass); // true
```

### 数字关键字

### `range`和`exclusiveRange`

用于组合最小和最大关键字的语法糖，当然如果范围内没有数字会导致表以失败。

该关键字的值**必须是包含两个数字的数组**，且第二个必须大于等于第一个。

验证的值应该大于等于数组中的第一个值，小于等于第二个值。如果`exclusiveRange`关键字出现在同一个 schema 中且值为`true`，那么待验证的值就**不可等于**范围边界了。

```js
var schema = { range: [1, 3] };
ajv.validate(schema, 1); // true
ajv.validate(schema, 2); // true
ajv.validate(schema, 3); // true
ajv.validate(schema, 0.99); // false
ajv.validate(schema, 3.01); // false

var schema = { range: [1, 3], exclusiveRange: true };
ajv.validate(schema, 1.01); // true
ajv.validate(schema, 2); // true
ajv.validate(schema, 2.99); // true
ajv.validate(schema, 1); // false
ajv.validate(schema, 3); // false
```

### 字符串关键字

### `regexp`

该关键字允许在 schema 中使用带 flag 的正则表达式(标准的`pattern`关键字不支持正则的 flag)

该关键字**仅接受字符串**。如果数据不是字符，验证会返回成功。

该关键字的值可以是字符串(`regexp.toString()`)或带有属性`pattern`和`flags`的对象(同样的字符串应传给 RegExp 构造器)。

```js
var schema = {
  type: 'object',
  properties: {
    foo: { regexp: '/foo/i' },
    bar: { regexp: { pattern: 'bar', flags: 'i' } }
  }
};

var validData = {
  foo: 'Food',
  bar: 'Barmen'
};

var invalidData = {
  foo: 'fog',
  bar: 'bad'
};
```

### `formatMaximum` / `formatMinimum`和`formatExclusiveMaximum` / `formatExclusiveMinimum`

当 format 关键字定义了顺序时，这些关键字的作用就是定义最小/最大数字的约束条件。

这些关键字**仅接受字符串**。如果数据不是字符串，则验证会返回成功。

关键字`formatMaximum (formatMinimum)`的值应该是一个字符串。这个值是数据有效的最大允许值(最小允许值)，由`format`关键字决定。如果没有设置`format`关键字，则 schema 编译将抛出异常。

添加该关键字后，它将会定义`"date"`、`"time"`和`"date-time"`比较规则，自定义格式也可以有比较规则。参见[addFormat](https://github.com/epoberezkin/ajv#api-addformat)方法

关键字`formatExclusiveMaximum (formatExclusiveMinimum)`的值应该是**布尔值**。如果没有`formatMaximum (formatMinimum)`则无法使用这些关键字。如果该关键字的值`true`，则有效的数据不应该等于`formatMaximum (formatMinimum)`关键字中的值。

```js
require('ajv-keywords')(ajv, ['formatMinimum', 'formatMaximum']);

var schema = {
  format: 'date',
  formatMinimum: '2016-02-06',
  formatMaximum: '2016-12-27',
  formatExclusiveMaximum: true
}

var validDataList = ['2016-02-06', '2016-12-26', 1];

var invalidDataList = ['2016-02-05', '2016-12-27', 'abc'];
```

### `transform`

该关键字允许在验证之前修改字符串。

这些关键字**仅接受字符串**。如果数据不是字符串，则`transform`会被跳过。

根据 ajv 的写法不同，有一些限制.

- 单独的字符串不能转换。举例来说：`data = 'a'; ajv.validate(schema, data);`
- 目前尚不能和`ajv-pack`搭配使用。

**支持的配置项：**

- `trim`：移除开头和结尾的空格
- `trimLeft`：移除开头的空格
- `trimRight`：移除结尾的空格
- `toLowerCase`: 转为小写
- `toUpperCase`: 转为大写
- `toEnumCase`: 大小写字符串匹配 schema 中的大小写
 
配置项按照设置的顺序依次应用。

注意：`toEnumCase`要求所有允许的值在不区分大小写的时候是唯一的。

**示例：多配置项**

```js
require('ajv-keywords')(ajv, ['transform']);

var schema = {
  type: 'array',
  items: {
    type:'string',
    transform:['trim','toLowerCase']
  }
};

var data = ['  MixCase  '];
ajv.validate(schema, data);
console.log(data); // ['mixcase']
```

**示例：`enumcase`**

```js
require('ajv-keywords')(ajv, ['transform']);

var schema = {
  type: 'array',
  items: {
    type:'string',
    transform:['trim','toEnumCase'],
    enum:['pH']
  }
};

var data = ['ph',' Ph','PH','pH '];
ajv.validate(schema, data);
console.log(data); // ['pH','pH','pH','pH']
```

### 数组关键字

### `uniqueItemProperties`

该关键字允许检查数组中的某些属性是否唯一。

该关键字**仅接受数组**。如果数据不是数组，则验证会返回成功。

该关键字的值必须是字符串数组 —— 属性值在所有项中唯一。

```js
var schema = { uniqueItemProperties: [ "id", "name" ] };

var validData = [
  { id: 1 },
  { id: 2 },
  { id: 3 }
];

var invalidData1 = [
  { id: 1 },
  { id: 1 }, // 重复 "id"
  { id: 3 }
];

var invalidData2 = [
  { id: 1, name: "taco" },
  { id: 2, name: "taco" }, // 重复 "name"
  { id: 3, name: "salsa" }
];
```

### 对象关键字

`allRequired`

该关键字要求在同一个 schema 对象中的`properties`关键字中使用的所有属性必须出现。

该关键字**仅作用于对象**。如果数据不是对象，验证会返回成功。

该关键字的值必须是布尔值。

如果该关键字的值为`false`，验证会返回成功。

如果该关键字的值为`true`，则如果数据中包含了`properties`关键字中定义的所有属性(在同一个 schema 对象中)，则验证成功。

如果`properties`关键字没有出现在相同的 schema 对象中，那么 schema 编译会抛出异常。

```js
var schema = {
  properties: {
    foo: {type: 'number'},
    bar: {type: 'number'}
  }
  allRequired: true
};

var validData = { foo: 1, bar: 2 };
var alsoValidData = { foo: 1, bar: 2, baz: 3 };

var invalidDataList = [ {}, { foo: 1 }, { bar: 2 } ];
```

### `anyRequired`

该关键字所列出的属性必须出现(至少一个)。

该关键字仅应用于对象，如果数据不是对象，则验证会返回成功。

该关键字的值必须是一个字符串数组，每个字符串都是一个属性名。若要使对象数据有效，那么对象中至少要有一个数组中列出的属性。

```js
var schema = {
  anyRequired: ['foo', 'bar']
};

var validData = { foo: 1 };
var alsoValidData = { foo: 1, bar: 2 };

var invalidDataList = [ {}, { baz: 3 } ];
```

### `oneRequired`

该关键字所列出的属性只允许出现一个。

该关键字仅应用于对象，如果数据不是对象，则验证会返回成功。

该关键字的值必须是一个字符串数组，每个字符串都是一个属性名。若要使对象数据有效，那么对象中要有且只有一个数组中列出的属性。

```js
var schema = {
  oneRequired: ['foo', 'bar']
};

var validData = { foo: 1 };
var alsoValidData = { bar: 2, baz: 3 };

var invalidDataList = [ {}, { baz: 3 }, { foo: 1, bar: 2 } ];
```

### `patternRequired`




















