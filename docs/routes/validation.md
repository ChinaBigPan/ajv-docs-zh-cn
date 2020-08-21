---
title: 验证
---

# 验证关键字

Ajv 支持验证 JSON Schema 标准 draft-07 的所有关键词：

## `type`

`type`关键字要求数据时某种类型(或某些类型)。他的值可以字符串(允许的类型)或字符串数组(允许的多种类型).

值可以为：`number`、`integer`、`string`、`boolean`、`array`、`object`或`null`。

**示例：**

1. schema: `{ "type": "number" }`     
   valid: `1`、`1.5`    
   invalid: `"abc"`、`"1"`、`[]`、`{}`、`null`、`true`

2. schema: `{ "type": "integer" }`     
   valid: `1`、`2`    
   invalid: `"abc"`、`"1"`、`1.5`、`[]`、`{}`、`null`、`true`

3. schema: `{ "type": ["number", "string"] }`     
   valid: `1`、`1.5`、`"abc"`、`"1"`    
   invalid: `[]`、`{}`、`null`、`true`

上面的所有示例都是 JSON Schema，只有特定的类型才有效。

大多数的其他关键字值适用于特定类型的数据。如果数据是不同的类型的，那么关键字将不适用，数据也会被认为是有效数据。

## 数字验证关键字

### `maximum`/`minimum`和`exclusiveMaximum`/`exclusiveMinimum`

关键字`maximum`(`minimum`)的值应该是一个数字。该值是允许的有效数据的最大值(最小值)。

Draft-04：关键字`exclusiveMaximum`(`exclusiveMinimum`)的值应该是**布尔值**。该关键字不能脱离`maximum`(`minimum`)单独使用。如果关键字的值等同于`true`，数据应该不等于`maximum`(`minimum`)中的值才算有效。

Draft-06/07: 关键字`exclusiveMaximum`(`exclusiveMinimum`)的值应该是**数字**。该值是允许数据有效的唯一最大值(最小值)(等于该关键字值的数据是无效的)。

Ajv 同时支持 draft-04 和 draft-06/07 语法。

**示例：**

1. schema: `{ "maximum": 5 }`     
   valid: `4`、`5`、任何非数字的`"abc"`、`[]`、`{}`、`null`、`true`  
   invalid: `6`、`7`

2. schema: `{ "minimum": 5 }`     
   valid: `5`、`6`、任何非数字的`"abc"`、`[]`、`{}`、`null`、`true`    
   invalid: `4`、`4.5`

3. schema:     
        draft-04： `{ "minimum": 5, "exclusiveMinimum": true }`     
        draft-06/07：`{ "exclusiveMinimum": 5 }`       
   valid: `6`、`7`、任何非数字的`"abc"`、`[]`、`{}`、`null`、`true`   
   invalid: `4.5`、`5`

### `multipleOf`  

该关键字的值应该是**数字**。有效的数据应该是关键字的倍数(即数据在值上做除法的结果应该是整数)。

**示例：**

1. schema: `{ "multipleOf": 5 }`     
   valid: `5`、`10`、任何非数字的`"abc"`、`[]`、`{}`、`null`、`true`  
   invalid: `6`、`7`

2. schema: `{ "multipleOf": 2.5 }`     
   valid: `2.5`、`7.5`、任何非数字的`"abc"`、`[]`、`{}`、`null`、`true`    
   invalid: `1`、`4`

## 字符串验证关键字

### `maxLength`/`minLength`

该关键字的值应该是**数字**。应满足这个规则的长度的数据是有效数据。Unicode对被计算为单个字符。

**示例：**

1. schema: `{ "maxLength": 5 }`     
   valid: `"abc"`、`"abcde"`、任何非字符串的`1`、`[]`、`{}`、`null`、`true`  
   invalid: `"abcdef"`

2. schema: `{ "minLength": 2 }`     
   valid: `"ab"`、`"😀😀"`、任何非字符串的`"abc"`、`[]`、`{}`、`null`、`true`    
   invalid: `"a"`、`"😀"`

### `pattern`   

该关键字的值应该是**字符串**。与该关键字定义的正则表达式相匹配的数据是有效数据。

Ajv 使用了`new RegExp(value)`来创建正则表达式以测试数据。

**示例：**

1. schema: `{ "pattern": "[abc]+" }`     
   valid: `"a"`、`"abcd"`、`"cde"`、任何非字符串的`1`、`[]`、`{}`、`null`、`true`  
   invalid: `"def"`、`""`

### `format` 

该关键字的值应该是**字符串**。与它格式相匹配的数据才是有效数据。

Ajv 定义了这些格式：`date`、`date-time`、`uri`、`email`、`hostname`、`ipv4`、`ipv6`、`regex`。

**示例：**  

1. schema: `{ "format": "ipv4" }`     
   valid: `"192.168.0.1"`、任何非字符串的`1`、`[]`、`{}`、`null`、`true`       
   invalid: `"abc"`

### `formatMaximum`/`formatMinimum`和`formatExclusiveMaximum`/`formatExclusiveMinimum`(提案)。

在[ajv-keywords](/ajv-docs-cn/routes/keywords)包中定义的。

`formatMaximum`(`formatMinimum`)关键字的值应该是**字符串**。该值是由`format`关键字决定的允许有效的最大值(最小值)。

Ajv 定义了`"date"`、`"time"`和`"date-time"`格式的比较规则。

`formatExclusiveMaximum`(`formatExclusiveMinimum`)关键字的值应该是**布尔值**。它们不能脱离`formatMaximum`(`formatMinimum`)而存在。如果该值等于`true`。 有效的数据不应当等于`formatMaximum`(`formatMinimum`)关键字的值。

**示例：**  

schema：

```json
{
    "format": "date",
    "formatMaximum": "2016-02-06",
    "formatExclusiveMaximum": true
}
```

valid: `"2015-12-31"`、`2016-02-05`和任何非字符串     
invalid: `"2016-02-06"`、`"2016-02-07"`、`"abc"`


## 数组验证关键字   

### `maxItems`/`minItems`    

该关键字的值应该是**数字**。有效的数组项目个数应当不多于(少于)该关键字的值。

**示例：**  

1. schema: `{ "maxItems": 3 }`        
   valid: `[]`、`[1]`、`["1", 2, "3"]`、任何非数组的(`"abc"`、`1`、`{}`、`null`、`true`)     
   invalid: `[1, 2, 3, 4]`

### `uniqueItems`   

关键字的值应该是**布尔值**。如果关键字的值为`true`，那么有效的数据数组应该具有唯一的项。

**示例：**  

1. schema: `{ "uniqueItems": true }`     
   valid: `[]`、`[1]`、`["1", 2, "3"]`、任何非数组的(`"abc"`、`1`、`{}`、`null`、`true`)     
   invalid: `[1, 2, 1]`、`[{ "a": 1, "b": 2 }, { "b": 2, "a": 1 }]`

### `items`   

该关键字的值应该是**对象**或**对象数组**。

如果关键字的值是一个对象，那么根据该值的 schema，要使数据数组有效则数组中的每项都是有效数据。在这种情况下，`additionalItems`关键字被忽略。

如果关键字的值是数组，那么根据具有相同索引的 schema，索引值小于关键字中项数的项应该是有效值。额外项是否有效则取决于`additionalItems`关键字。

1. schema: `{ "items": { "type": "integer" } }`        
   valid: `[1,2,3]`、`[]`、任何非数组的(`1`、`"abc"`、`{}`、`null`、`true`)    
   invalid: `[1, "abc"]`

2. schema:
    ```json
    {
        "items": [
            { "type": "integer" },
            { "type": "string" }
        ]
    }
    ```
    valid: `[1]`、`[1, "abc"]`、`[1,"abc",2]`、`[]`、任何非数组的(`1`、`"abc"`、`{}`、`null`、`true`)    
    invalid: `["abc", 1]`, `["abc"]`

### `additionalItems`

关键字的值应该是**布尔值**或**对象**。

如果`item`关键字不存在或者是一个对象，那么`additionalItems`关键字会被忽略。

如果`item`关键字是一个数组且数据数组的长度不超过`items`关键字值的长度，那么`additionalItems`关键字也会被忽略。

如果数据数组的长度大于`items`关键字的长度，验证的结果就取决于`additionalItems`关键字的值了：

- `false`: 数据无效
- `true`: 数据有效
- 对象: 如果所有额外项的值(即索引大于或等于`items`关键字值长度的项)通过了`additionalItems`关键字的 schema 验证，则数据有效。

**示例：**  

1. schema: `{ "additionalItems": { "type": "integer" } }`       
    任何有效的数据都会让`additionalItems`被忽略。

2. schema:    
   ```js
    {
        "items": { "type": "integer" },
        "additionalItems": { "type": "string" }
    }
   ``` 
    valid: `[]`、`[1, 2]`和任何非数组元素(`additionalItems`被忽略)     
    invalid: `[1, "abc"]`、(任何带有除整数以外项的任意数组)

3. schema:  
    ```json
    {
        "items": [
            { "type": "integer" },
            { "type": "integer" }
        ],
        "additionalItems": true
    }
    ```  
    valid: `[]`、`[1, 2]`、`[1, 2, 3]`、`[1, 2, "abc"]`、任何非数组。    
    invalid: `["abc"]`、`[1, "abc", 3]`  

4. schema:
    ```json
    {
        "items": [
            { "type": "integer" },
            { "type": "integer" }
        ],
        "additionalItems": { "type": "string" }
    }
    ```   
    valid: `[]`、`[1, 2]`、`[1, 2, "abc"]`、任何非数组。    
    invalid: `["abc"]`、`[1, 2, 3]`

### `contains`   

关键字的值时 JSON Schema。如果根据该 schema，数组中至少包含一个符合该 Schema 的有效项，则该数组是有效数据。

**示例：**  

schema: `{ "contains": { "type": "integer" } }`      
valid: `[1]`、`[1, "foo"]`、任何带有至少一个整数的数组、任何非数组。        
invalid: `[]`、`["foo", "bar"]`、任何无整数的数组。   

该 schema 按上面的例子等同于：

```json
{
    "not": {
        "type": "array",
        "items": {
            "not": { "type": "integer" }
        }
    }
}
```

## 对象验证关键字

### `maxProperties`/`minProperties`  

关键字应该是**数字**。有效的数据对象的属性不应该比关键字值多(少)。

**示例：**

schema: `{ "maxProperties": 2 }`

valid: `{}`、`{"a": 1}`、`{"a": "1", "b": 2}`和任何非对象

invalid: `{"a": 1, "b": 2, "c": 3}`

### `required`

关键字的值应该是**唯一字符串数组**。包含与关键字值当中元素所有属性名相同的属性才是有效的对象数据。

**示例：**

schema: `{ "required": ["a", "b"] }`

valid: `{"a": 1, "b": 2}`、`{"a": 1, "b": 2, "c": 3}`和任何非对象

invalid: `{}`, `{"a": 1}`, `{"c": 3, "d":4}`

### `properties`

关键字应该是**键等于数据对象属性的映射**。映射中的每个值都应该是一个 JSON Schema。要使数据对象有效，数据对象属性中的对应值应该符合这些 schema。

:::  warning 请注意
`properties`关键字并不要求其中提到的属性出现在对象中(参见示例)。
:::

**示例：**

schema:
```json
{
    "properties": {
        "foo": { "type": "string" },
        "bar": {
            "type": "number",
            "minimum": 2
        }
    }
}
```

valid: `{}`、`{"foo": "a"}`、`{"foo": "a", "bar": 2}`和任何非对象

invalid: `{"foo": 1}`、`{"foo": "a", "bar": 1}`

### `patternProperties`

该关键字的值应该是一个**映射**，其中键是正则表达式，值为 JSON Schema。若要使数据对象有效，匹配正则表达式的数据对象属性的值也应该符合相应的 schema。

::: warning 请注意
`patternProperties`关键字并不要求匹配通配符的属性出现在对象中(参见示例)。
:::

**示例：**

schema:
```json
{
    "patternProperties": {
        "^fo.*$": { "type": "string" },
        "^ba.*$": { "type": "number" }
    }
}
```
valid: `{}`、`{"foo": "a"}`、`{"foo": "a", "bar": 1}`和任何非对象

invalid: `{"foo": 1}`、`{"foo": "a", "bar": "b"}`

### `additionalProperties`

该关键字的值应该是**布尔值**或**JSON Schema**。

如果值为`true`则关键字会被忽略。

如果值为`false`则数据对象若要有效则不应该含有"额外属性"(例如，除了那些在`properties`关键字中使用的属性和那些在`patternProperties`关键字中匹配通配符的属性)。

如果该值是测试数据对象的 schema，那么根据 schema，所有"额外属性"中的值都应该有效。

**示例：**

1.schema

    ```json
    {
        "properties": {
            "foo": { "type": "number" }
        },
        "patternProperties": {
            "^.*r$": { "type": "number" }
        },
        "additionalProperties": false
    }
    ```

    valid: `{}`、`{"foo": 1}`、`{"foo": 1, "bar": 2}`和任何非对象

    invalid: `{"a": 3}`、`{"foo": 1, "baz": 3}`

2.schema

    ```json
    {
        "properties": {
            "foo": { "type": "number" }
        },
        "patternProperties": {
            "^.*r$": { "type": "number" }
        },
        "additionalProperties": { "type": "string" }
    }
    ```

    valid: {}, {"a": "b"}, {"foo": 1}, {"foo": 1, "bar": 2}, {"foo": 1, "bar": 2, "a": "b"}, any non-object

    invalid: {"a": 3}, {"foo": 1, "baz": 3}

3. schema

    ```json
    {
        "properties": {
            "foo": { "type": "number" }
        },
        "additionalProperties": false,
        "anyOf": [
            {
                "properties": {
                    "bar": { "type": "number" }
                }
            },
            {
                "properties": {
                    "baz": { "type": "number" }
                }
            }
        ]
    }
    ```

    valid: `{}`、`{"foo": 1}`和任何非对象

    invalid: `{"bar": 2}`、`{"baz": 3}`、`{"foo": 1, "bar": 2}`等.

### `dependencies`

该关键字的值是一个**键等于对象属性的映射**。映射中的每个值应该是一个唯一的属性名称数组("属性依赖")或 JSON Schema("schema 依赖")。

属性依赖指的是，如果数据对象包含关键字值中键的属性，那么若要被判定为有效数据，数据对象还应该包含属性数组中的所有属性。

Schema 依赖指的是，如果数据对象包含关键字值中键的属性，那么若要被判定为有效数据，数据对象本身(注意不是属性值)应该是有效的。

**示例：**

1. schema(属性依赖)：

    ```json
    {
        "dependencies": {
            "foo": ["bar", "baz"]
        }
    }
    ```

    valid: `{"foo": 1, "bar": 2, "baz": 3}`、`{}`、`{"a": 1}`和任何非对象

    invalid: `{"foo": 1}`、`{"foo": 1, "bar": 2}`、`{"foo": 1, "baz": 3}`

2. schema(schema 依赖)

    ```json
    {
        "dependencies": {
            "foo": {
                "properties": {
                    "bar": { "type": "number" }
                }
            }
        }
    }
    ```

    valid: `{}`、`{"foo": 1}`、`{"foo": 1, "bar": 2}`、`{"a": 1}`和任何非对象

    invalid: `{"foo": 1, "bar": "a"}`

### `propertyNames`

该关键字的值是 JSON Schema。

若要使数据对象有效，该对象中的每个属性名都应该通过该 schema 的验证。

**示例：**

schema:

```json
{
    "propertyNames": { "format": "email" }
}
```

valid: `{"foo@bar.com": "any", "bar@bar.com": "any"}`和任何非对象

invalid: `{"foo": "any value"}`

### `patternRequired`（提案）

定义`ajv-keywords`包。

该关键字的值应该是字符串数组，每个字符串都是正则表达式。若要使数据对象有效，该数组中的每个正则表达式应该至少匹配数据对象中的一个属性名。

如果数组包含多个正则表达式，则可以有多个表达式匹配相同的属性名。

**示例：**

1.schema: `{ "patternRequired": [ "f.*o" ] }`

  valid: `{ "foo": 1 }`、`{ "-fo-": 1 }`、`{ "foo": 1, "bar": 2 }`和任何非对象

  invalid: `{}`、`{ "bar": 2 }`、`{ "Foo": 1 }`

2.schema: `{ "patternRequired": [ "f.*o", "b.*r" ] }`

  valid: `{ "foo": 1, "bar": 2 }`、`{ "foobar": 3 }`和任何非对象

  invalid: `{}`、`{ "foo": 1 }`、`{ "bar": 2 }`

## 全类型验证关键字

### `enum`

关键字的值应该是**由任何类型的唯一项组成的数组**。如果数据深等于数组中的一项，则该数据是有效的。

**示例：**

schema: `{ "enum": [ 2, "foo", {"foo": "bar" }, [1, 2, 3] ] }`

valid: 2、`"foo"`、`{"foo": "bar"}`、`[1, 2, 3]`

invalid: 1、`"bar"`、`{"foo": "baz"}`、`[1, 2, 3, 4]`和任何不在数组中的值

### `const`

该关键字的值可以是**任何东西**。如果数据深等于关键字的值，则该数据是有效的。

**示例：**  

schema: `{ "const": "foo" }`

valid: `"foo"`

invalid: 其他值

使用只包含一个项的数组的`enum`关键字也可以实现同样的效果。但是`const`关键字不仅仅是`enum`的语法糖。与`$data`引用结合起来后，可以定义数据不同部分间的相等关系。这是`enum`做不到的，即便是它也搭配了`$data`引用也做不到这一点，因为`$data`不能用于替换某一项————它只能替换`enum`关键字中的整个数组。

**示例：**  

schema:
```json
{
    "properties": {
        "foo": { "type": "number" },
        "bar": { "const": { "$data": "1/foo" } }
    }
}
```

valid: `{ "foo": 1, "bar": 1 }`、`{}`

invalid: `{ "foo": 1 }`、`{ "bar": 1 }`、`{ "foo": 1, "bar": 2 }`

## 复合关键字

### `not`

该关键字的值应该是 JSON Schema。如果**没有通过** schema 验证，那就是有效数据。

**示例：**

1. schema: `{ "not": { "minimum": 3 } }`

   valid: `1`、`2`

   invalid: `3`、`4`任何非数字

2. schema: 
   ```json
    {
        "not": {
            "items": {
                "not": { "type": "string" }
            }
        }
    }
   ```

    valid: `["a"]`、`[1, "a"]`任何包括只收一个字符串的数组。

    invalid: `[]`、`[1]`、任何非数组、任何不包含字符串的数组。

### `oneOf`

该关键字的值应该是**JSON Schema 数组**。如果数据恰好与该数组中的其中一个 JSON Schema 相匹配，则该数据是有效数据。验证过程会针对所有的 schema 进行以满足该关键字。

**示例：**

schema:
```json
{
    "oneOf": [
        { "maximum": 3 },
        { "type": "integer" }
    ]
}
```

valid: `1.5`、`2.5`、`4`、`5`和任何非数字。

invalid: `2`、`3`、`4.5`、`5.5`

### `anyOf`

关键字的值应该是一个**JSON Schema 数组**。如果数据满足其中的一个或多个 JSON Schema，那么就是有效数据。验证过程只需要根据 Schema 按顺序验证数据直到匹配到有效数据(或尝试验证了所有 schema)为止。因此，在大多数情况下，针对该关键字的验证要比`oneOf`快。

**示例：**

schema:
```json
{
    "anyOf": [
        { "maximum": 3 },
        { "type": "integer" }
    ]
}
```

valid: `1.5`、`2`、`2.5`、`3`、`4`、`5`及任何非数字

invalid: `4.5`、`5.5`

### `allOf`

该关键字的值应该是一个**JSON Schema 数组**。如果数据符合该数组中的所有 JSON Schema，则为有效数据。

**示例：**

schema:
```json
{
    "allOf": [
        { "maximum": 3 },
        { "type": "integer" }
    ]
}
```

valid: `2`、`3`

invalid: `1.5`、`2.5`、`4`、`4.5`、`5`、`5.5`及任何非数字

### `if`/`then`/`else`

该关键字让实现**条件验证**成为可能。它们的值应该是有效的 JSON Schema（对象或布尔值）。

如果没有`if`关键字，验证将成功。

如果数据**通过**了`if`关键字中的次级 schema，那么验证结果和`then`关键字中的次级 schema 验证结果相等（如果`then`不存在，则验证成功）。

如果数据**没有通过**`if`关键字中的次级 schema，那么验证结果和`else`关键字中的次级 schema 验证结果相等（如果`else`不存在，则验证成功）。

**示例：**

1. schema
   ```json
    {
        "if": { "properties": { "power": { "minimum": 9000 } } },
        "then": { "required": [ "disbelief" ] },
        "else": { "required": [ "confidence" ] }
    }
   ```

   valid:
   - `{ "power": 10000, "disbelief": true }`
   - `{}`
   - `{ "power": 1000, "confidence": true }`
   - 任何非对象

    invalid:

    - `{ "power": 10000 }` (`disbelief`是必需的)
    - `{ "power": 10000, "confidence": true }` (`disbelief`是必需的)
    - `{ "power": 1000 }` (`confidence`是必需的)

2. schema
    ```json
    {
        "type": "integer",
        "minimum": 1,
        "maximum": 1000,
        "if": { "minimum": 100 },
        "then": { "multipleOf": 100 },
        "else": {
            "if": { "minimum": 10 },
            "then": { "multipleOf": 10 }
        }
    }
    ```

    valid: `1`、`5`、`10`、`20`、`50`、`100`、`200`、`500`、`1000`

    invalid:
    - `-1`、`0` (<1)
    - `2000` (>1000)
    - `11`、`57`、`123` (超过非零数字的任何数字)
    - 非整数   












