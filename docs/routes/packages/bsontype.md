---
title: ajv-bsontype
sidebarDepth: 3
---

# ajv-bsontype

添加 mongodb 的 bsonType 格式验证器

[英文原地址](https://github.com/BoLaMN/ajv-bsontype)

## 安装

```bash
npm install ajv-bsontype --save
```

## 设置

```js
var Ajv = require('ajv');
var ajv = new Ajv;
require('ajv-bsontype')(ajv);
```

## 使用

```js
const schema = {
   required: [ "name", "year", "major", "gpa" ],
   properties: {
      name: {
         bsonType: "string",
         description: "must be a string and is required"
      },
      gender: {
         bsonType: "string",
         description: "must be a string and is not required"
      },
      year: {
         bsonType: "int",
         description: "must be an integer in [ 2017, 3017 ] and is required"
      },
      major: {
         enum: [ "Math", "English", "Computer Science", "History", null ],
         description: "can only be one of the enum values and is required"
      },
      gpa: {
         bsonType: [ "double" ],
         description: "must be a double and is required"
      }
   }
}

const data = {
   name: "Alice",
   year: 2019,
   major: "History",
   gpa: 3
}

ajv.validate(schema, data)
```


















