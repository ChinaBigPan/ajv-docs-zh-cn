---
title: keywords
sidebarDepth: 2
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

该关键字**仅作用于对象**，如果数据不是对象，则验证会返回成功。

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

该关键字**仅作用于对象**，如果数据不是对象，则验证会返回成功。

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

该关键字要求与通配符相匹配的属性必须存在。

该关键字**仅作用于对象**，如果数据不是对象，则验证会返回成功。

该关键字的值必须是一个字符串数组，每个字符串都是一个正则表达式。若要使对象数据有效，那么数组中的正则表达式应至少匹配一个数据对象中的属性名。

如果数组包含了多个正则表达式，一个以上的表达式可以匹配相同的属性名。

```js
var schema = { patternRequired: [ 'f.*o', 'b.*r' ] };

var validData = { foo: 1, bar: 2 };
var alsoValidData = { foobar: 3 };

var invalidDataList = [ {}, { foo: 1 }, { bar: 2 } ];
```

### `prohibited`

该关键字中列出的任何属性都禁止在对象中的出现。

该关键字**仅作用于对象**，如果数据不是对象，则验证会返回成功。

该关键字的值必须是一个字符串数组，每个字符串都是一个属性名。若要使对象数据有效，那么对象中不允许出现数组中列出的属性。

```js
var schema = { prohibited: ['foo', 'bar']};

var validData = { baz: 1 };
var alsoValidData = {};

var invalidDataList = [
  { foo: 1 },
  { bar: 2 },
  { foo: 1, bar: 2}
];
```

**请注意：** `{prohibited: ['foo', 'bar']}`等同于`{not: {anyRequired: ['foo', 'bar']}}`(它们对任意数据的验证结果没有差别)

### `deepProperties`

该关键字允许验证深层的属性。

该关键字**仅作用于对象**，如果数据不是对象，则验证会返回成功。

该值应该是一个对象，其中对象的键是指向数据的 JSON 指针(属性查找路径)，从数据中的当前位置开始计算，而对象的值则是 JSON schema。若要使对象数据有效，那么每个 JSON 指针的值应匹配对应的 schema。

```js
var schema = {
  type: 'object',
  deepProperties: {
    "/users/1/role": { "enum": ["admin"] }
  }
};

var validData = {
  users: [
    {},
    {
      id: 123,
      role: 'admin'
    }
  ]
};

var alsoValidData = {
  users: {
    "1": {
      id: 123,
      role: 'admin'
    }
  }
};

var invalidData = {
  users: [
    {},
    {
      id: 123,
      role: 'user'
    }
  ]
};

var alsoInvalidData = {
  users: {
    "1": {
      id: 123,
      role: 'user'
    }
  }
};
```

### `deepRequired`

该关键字让我们可以检查一些深层属性是否可用。

该关键字**仅作用于对象**，如果数据不是对象，则验证会返回成功。

该关键字应该是指向数据的 JSON 指针(属性查找路径)数组，从数据中的当前位置开始计算。若要使对象数据有效，那么每个 JSON 指针都应该是数据的一部分。

```js
var schema = {
  type: 'object',
  deepRequired: ["/users/1/role"]
};

var validData = {
  users: [
    {},
    {
      id: 123,
      role: 'admin'
    }
  ]
};

var invalidData = {
  users: [
    {},
    {
      id: 123
    }
  ]
};
```

### 复合关键字

### `switch` (已废弃，不翻了, [链接在这](https://github.com/ajv-validator/ajv-keywords#switch-deprecated))

### `select`/`selectCases`/`selectDefault`

该关键字允许根据已验证数据中某些属性的值选择验证数据的 schema。

这些关键字必须出现在同一个 schema 对象中(`selectDefault`则是可选)。

`select`关键字的值应该是一个`$data`引用，它指向被验证数据中的任何原始 JSON 类型(`string`、`number`、`boolean`或`null`)。您也可以使用一个基本类型的常量作为该关键字的值(比方说，以调试为目的)。

`selectCases`关键字的值必须是一个对象，其中每个属性名都是`select`关键字值的可能字符串表示，而且每个属性值都必须是用于验证数据的对应 schema (根据 draft-06 也可以是布尔值)。

`selectDefault`关键字的值是 schema (根据 draft-06 也可以是布尔值)，他必须用于验证数据从而避免`selectCase`中没有键等于`select`关键字字符串值的情况。

若有下列情况之一则验证返回成功：

- 使用所选的 schema 验证数据成功
- 没有选择任何 schema 进行验证
- select 的值未定义(数据引用所指向的数据中没有属性)

如果(数据中)`select`的值不是原始类型则验证失败。

**请注意：** 这些关键字要求 Ajv `$data`配置项可以支持 `$data` 引用。

```js
require('ajv-keywords')(ajv, 'select');

var schema = {
  type: object,
  required: ['kind'],
  properties: {
    kind: { type: 'string' }
  },
  select: { $data: '0/kind' },
  selectCases: {
    foo: {
      required: ['foo'],
      properties: {
        kind: {},
        foo: { type: 'string' }
      },
      additionalProperties: false
    },
    bar: {
      required: ['bar'],
      properties: {
        kind: {},
        bar: { type: 'number' }
      },
      additionalProperties: false
    }
  },
  selectDefault: {
    propertyNames: {
      not: { enum: ['foo', 'bar'] }
    }
  }
};

var validDataList = [
  { kind: 'foo', foo: 'any' },
  { kind: 'bar', bar: 1 },
  { kind: 'anything_else', not_bar_or_foo: 'any value' }
];

var invalidDataList = [
  { kind: 'foo' }, // no propery foo
  { kind: 'bar' }, // no propery bar
  { kind: 'foo', foo: 'any', another: 'any value' }, // additional property
  { kind: 'bar', bar: 1, another: 'any value' }, // additional property
  { kind: 'anything_else', foo: 'any' } // property foo not allowed
  { kind: 'anything_else', bar: 1 } // property bar not allowed
];
```

**请注意：** 当前的实现是 BETA 版。它不允许在`selectCases`和`selectDefault`内的 schema 中的 $ref 关键字中使用指向这些 schema 之外的相对 URI。解决方法是使用绝对 URI (它可以指向添加到 Ajv 的任何(子) schema，包括当前根 schema 中使用`select`的那些 schema)。

### 所有类型的关键字

### `dynamicDefault`

该关键字允许为属性分配动态默认值，如时间戳、惟一id等。

该关键字仅在配置了`useDefaults`时才会起效，而非在`anyOf`关键字中等等，和 Ajv 处理默认关键字一样。

该关键字应该添加到对象级别。它的值应该是一个对象，每个属性对应一个属性名，与标准的`properties`关键字中的方法相同。每个属性中的值应该是：

- 默认函数的标识符(字符串)
- 具有`func`(标识符)和`args`(带参数的对象，将在模式编译期间传递给此函数—参见示例)属性的对象。

`dynamicDefaults`中使用的属性不应该添加到`required`关键字中(否则验证将失败)，因为与`default`不同，这个关键字是在验证之后处理的。

这里有几个预定义的动态默认函数：

- `"timestamp"` - 以毫秒计的当前时间戳。
- `"datetime"` - 当前日期和时间的字符串(ISO，符合`date-time`格式)。
- `"date"` - 当前日期的字符串(ISO，符合`date`格式)。
- `"time"` - 当前时间的字符串(ISO，符合`time`格式)。
- `"random"` - 在 [0,1) 区间的伪随机数。
- `"randomint"` - 伪随机整数。如果使用字符串作为属性值，那么函数将随机返回`0`或`1`。如果使用对象`{ func: 'randomint', args: { max: N } }`，那么默认值将是 [0,1) 区间内的整数。
- `"seq"` - 从 0 开始的连续整数。如果使用字符串作为属性值，则使用默认顺序。如果使用对象`{func: 'seq'， args: {name: 'foo'}}`，那么将使用名称为`"foo"`的序列。序列是全局的，即使使用了不同的 ajv 实例。

```js
var schema = {
  type: 'object',
  dynamicDefaults: {
    ts: 'datetime',
    r: { func: 'randomint', args: { max: 100 } },
    id: { func: 'seq', args: { name: 'id' } }
  },
  properties: {
    ts: {
      type: 'string',
      format: 'date-time'
    },
    r: {
      type: 'integer',
      minimum: 0,
      exclusiveMaximum: 100
    },
    id: {
      type: 'integer',
      minimum: 0
    }
  }
};

var data = {};
ajv.validate(data); // true
data; // { ts: '2016-12-01T22:07:28.829Z', r: 25, id: 0 }

var data1 = {};
ajv.validate(data1); // true
data1; // { ts: '2016-12-01T22:07:29.832Z', r: 68, id: 1 }

ajv.validate(data1); // true
data1; // didn't change, as all properties were defined
```

当使用了`useDefaults`配置项的值`"empty"`时，属性和项等于`null`或`""(空字符串)`将被赋值为默认值。在验证之前，使用`allOf`复合关键字来执行`dynamicDefaults`。

```js
var schema = {
  allOf: [
    {
      dynamicDefaults: {
        ts: 'datetime',
        r: { func: 'randomint', args: { min: 5, max: 100 } },
        id: { func: 'seq', args: { name: 'id' } }
      }
    },
    {
      type: 'object',
      properties: {
        ts: {
          type: 'string'
        },
        r: {
          type: 'number',
          minimum: 5,
          exclusiveMaximum: 100
        },
        id: {
          type: 'integer',
          minimum: 0
        }
      }
    }
  ]
};

var data = { ts: '', r: null };
ajv.validate(data); // true
data; // { ts: '2016-12-01T22:07:28.829Z', r: 25, id: 0 }
```

您可以添加自己的动态默认函数，以识别该关键字：

```js
var uuid = require('uuid');

function uuidV4() { return uuid.v4(); }

var definition = require('ajv-keywords').get('dynamicDefaults').definition;
// or require('ajv-keywords/keywords/dynamicDefaults').definition;
definition.DEFAULTS.uuid = uuidV4;

var schema = {
  dynamicDefaults: { id: 'uuid' },
  properties: { id: { type: 'string', format: 'uuid' } }
};

var data = {};
ajv.validate(schema, data); // true
data; // { id: 'a1183fbe-697b-4030-9bcc-cfeb282a9150' };

var data1 = {};
ajv.validate(schema, data1); // true
data1; // { id: '5b008de7-1669-467a-a5c6-70fa244d7209' }
```

你也可以定义接受参数的动态默认值，例如 uuid 的版本:

```js
var uuid = require('uuid');

function getUuid(args) {
  var version = 'v' + (arvs && args.v || 4);
  return function() {
    return uuid[version]();
  };
}

var definition = require('ajv-keywords').get('dynamicDefaults').definition;
definition.DEFAULTS.uuid = getUuid;

var schema = {
  dynamicDefaults: {
    id1: 'uuid', // v4
    id2: { func: 'uuid', v: 4 }, // v4
    id3: { func: 'uuid', v: 1 } // v1
  }
};
```

