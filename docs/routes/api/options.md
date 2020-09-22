---
title: 配置项
sidebarDepth: 3
---

# 配置项

[英文原地址](https://github.com/ajv-validator/ajv#options)

默认值：

```js
{
  // 验证 和 报告 配置项:
  $data:            false,
  allErrors:        false,
  verbose:          false,
  $comment:         false, // Ajv 6.0 中新增的属性
  jsonPointers:     false,
  uniqueItems:      true,
  unicode:          true,
  nullable:         false,
  format:           'fast',
  formats:          {},
  unknownFormats:   true,
  schemas:          {},
  logger:           undefined,
  // 引用 schema 的配置项
  schemaId:         '$id',
  missingRefs:      true,
  extendRefs:       'ignore', // 推荐 'fail'
  loadSchema:       undefined, // function(uri: string): Promise {}
  // 修改验证数据的配置项:
  removeAdditional: false,
  useDefaults:      false,
  coerceTypes:      false,
  // 严格模式配置项
  strictDefaults:   false,
  strictKeywords:   false,
  strictNumbers:    false,
  // 异步验证配置项：
  transpile:        undefined, // 需要 ajv-async 包
  // 高级配置项
  meta:             true,
  validateSchema:   true,
  addUsedSchema:    true,
  inlineRefs:       true,
  passContext:      false,
  loopRequired:     Infinity,
  ownProperties:    false,
  multipleOfPrecision: false,
  errorDataPath:    'object', // 已废弃
  messages:         true,
  sourceCode:       false,
  processCode:      undefined, 
  // ↑ function (str: string, schema: object): string {}
  cache:            new Cache,
  serialize:        undefined
}
```

| 验证和报告配置项 | 描述 |
|:---:|----|
| `$data` ||
| `allErrors` ||
| `verbose` ||
| `$comment` <br /> <Badge text="Ajv 6.0 中新增的属性" /> ||
| `jsonPointers` ||
| `uniqueItems` ||
| `unicode` ||
| `nullable` ||
| `format` ||
| `formats` ||
| `keywords` ||
| `unknownFormats` ||
| `schemas` ||
| `logger` ||


| 引用 schema 的配置项 | 描述 |
|:---:|----|
| `schemaId` ||
| `missingRefs` ||
| `extendRefs` ||
| `loadSchema` ||

| 修改验证数据的配置项 | 描述 |
|:---:|----|
| `removeAdditional` ||
| `useDefaults` ||
| `coerceTypes` ||

| 严格模式配置项 | 描述 |
|:---:|----|
| `strictDefaults` ||
| `strictKeywords` ||
| `strictNumbers` ||

| 异步验证配置项 | 描述 |
|:---:|----|
| `transpile` ||

| 高级配置项 | 描述 |
|:---:|----|
| `meta` ||
| `validateSchema` ||
| `addUsedSchema` ||
| `inlineRefs` ||
| `passContext` ||
| `loopRequired` ||
| `ownProperties` ||
| `multipleOfPrecision` ||
| `errorDataPath` ||
| `messages` ||
| `sourceCode` ||
| `processCode` ||
| `cache` ||
| `serialize`||








