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

3. schema: draft-04： `{ "minimum": 5, "exclusiveMinimum": true }` draft-06/07：`{ "exclusiveMinimum": 5 }`    
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



























