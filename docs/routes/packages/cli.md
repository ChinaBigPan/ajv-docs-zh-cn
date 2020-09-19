---
title: ajv-cli
sidebarDepth: 2
---

# Ajv-cli <Badge text="v 3.2.1" />

[英文原地址](https://github.com/ajv-validator/ajv-cli#compile-schemas)

ajv 的命令行接口，最快的 JSON schema 验证器之一。支持 JSON、JSON5 和 YAML。

## 安装

```bash
npm install -g ajv-cli
```

## Help

```bash
ajv help
ajv help validate
ajv help compile
ajv help migrate
ajv help test
```

## 验证数据

该命令根据 JSON-schema 验证数据文件。

```bash
ajv validate -s test/schema.json -d test/valid_data.json
ajv -s test/schema.json -d test/valid_data.json
```

您可以从[输入文件名](https://nodejs.org/api/modules.html#modules_file_modules)中省略`validate`命令名和`.json`。

### 参数

#### `-s` JSON schema 的文件名

该参数只能传递一个 schema。

#### `-d` JSON 数据

可传入多个数据文件，类似`-r`参数。

```bash
ajv -s test/schema.json -d "test/valid*.json"
```

如果某些文件是无效文件，退出代码为`1`。

#### `-r` 引用 schema

`-s` 参数中的 schema 可以使用`$ref`关键字来引用这些 schema 中的任意一个。

通过多次使用该参数和使用[通配符](https://github.com/isaacs/node-glob#glob-primer)，可以传递多个 schema。通配符应该用引号包裹且扩展名不能省略。

### `-m` 元 schema

schema 可以使用这些 schema 中的任意一个作为元 schema (即在 $schema 关键字中使用的 schema —— 它用于验证 schema 本身)。

可以传入多个元 schema，类似`-r`参数。

### `-c` 自定义关键字/格式定义

您可以传入自定义的关键字/格式的模块。该模块应该导出一个接受 Ajv 实例作为参数的函数。文件名应该以 “.” 开头，它会相对于当前文件夹解析路径。也可以传入包名————它会在`require`中原封不动地使用。

举例来说，您可以使用`-c ajv-keywords`添加来自[ajv-keywords](https://github.com/epoberezkin/ajv-keywords)包的所有关键字，或者使用`-c ajv-keywords/keywords/typeof`仅添加类型的关键字。

### 配置项

- `--errors=`：错误报告格式。可能的值：
    - `js`（默认值）：JavaScript 对象。
    - `json`：带缩进和换行的 JSON。
    - `line`：不带缩进/换行的JSON（为了便于解析）。
    - `text`：带有数据路径的错误消息。

- `--changes=`：在验证后侦测数据中的改变。
  
可以使用[Ajv 配置项](https://github.com/ajv-validator/ajv-cli#ajv-options)`——remove-additional`、`——use-defaults`和`——coerce-types`来修改数据。

这些更改以`JSON-patch`格式([RFC6902](https://tools.ietf.org/html/rfc6902))报告。

可能的值是`js(默认)`、`json`和`line`(参见`--errors`选项)。

## 编译 schema

该命令在不验证任何数据的情况下验证和编译模式。

它可用于检查 schema 是否有效，并创建导出验证函数的独立模块(使用[ajv-pack](https://github.com/epoberezkin/ajv-pack))。

```bash
ajv compile -s schema

# 编译到模块 (BETA)
ajv compile -s schema -o validate.js
```

### 参数

#### `-s` JSON schema 的文件名

通过多次使用该参数和使用[通配符](https://github.com/isaacs/node-glob#glob-primer)，可以传递多个 schema。

```bash
ajv compile -s "test/schema*.json"
```

#### `-o` 已编译验证功能模块的输出文件 (BETA)

只有单个 schema 可以使用该配置项进行编译。

```bash
ajv compile -s "schema.json" -o "validate_schema.js"
```

改命令也支持`-r`、`-m`和`-c`参数。

## 将 schema 迁移到 draft-06

该命令使用[json-schema-migrate](https://github.com/epoberezkin/json-schema-migrate)包验证模式并将其迁移到 draft-06。

```bash
ajv migrate -s schema

# 编译到指定文件名
ajv migrate -s schema -o migrated_schema.json
```

### 参数

#### `-s` JSON schema 的文件名

通过多次使用该参数和使用[通配符](https://github.com/isaacs/node-glob#glob-primer)，可以传递多个 schema。

```bash
ajv migrate -s "test/schema*.json"
```

如果没有指定参数`-o`，则迁移的 schema 会被写入相同的文件，原始文件使用`.bak`扩展名保留下来。

#### `-o` 迁移 schema 的输出文件

只有单个 schema 可以使用该配置项进行编译。

```bash
ajv compile -s "schema.json" -o migrated_schema.json
```

#### **配置项**

- `v5`：如果未指定 $schema，则将 schema 迁移为 v5
- `--indent=`：迁移模式 JSON 文件中的缩进，默认为 4
- `--validate-schema=false`：跳过 schema 验证


## 测试验证结果

该命令断言验证的结果与预期一致。

```bash
ajv test -s test/schema.json -d test/valid_data.json --valid
ajv test -s test/schema.json -d test/invalid_data.json --invalid
```

如果配置项`--valid`(`--invalid`)用于`test`通过(退出代码 0)，那么数据文件应该是有效(无效)的。

此命令支持与`validate`相同的配置项和参数，但`--changes`除外


## Ajv 配置项

您可以传入以下Ajv 配置项(`migrate`命令除外):

| 配置项 | 描述 |
|:---:|----|
| `--data` | 使用[$data 引用](https://github.com/epoberezkin/ajv#data-reference) |
| `--all-errors` | 收集所有错误 |
| `--unknown-formats=` | 处理未知格式 |
| `--verbose` | 在错误中包含 schema 和数据 |
| `--json-pointers` | 使用 json 指针报告错误中的数据路径 |
| `--unique-items=false` | 不验证`uniqueItems`关键字 |
| `--unicode=false` | 将 unicode 对计数为 2 个字符 |
| `--format=full` | 格式模式 |
| `--schema-id=` | 关键字作为 schema ID使用 |
| `--extend-refs=` | 当 schema 中存在$ref时，验证其他关键字  |
| `--missing-refs=` | 处理缺失的引用 schema (`true`/`ignore`/`fail`)  |
| `--inline-refs=` | 引用 schema 编译模式(`true`/`false`/`<number>`) |
| `--remove-additional` | 移除额外属性 (`true`/`all`/`failing`) |
| `--use-defaults` | 用默认关键字中的值替换缺少的属性/项 |
| `--coerce-types` | 更改数据类型以匹配类型关键字 |
| `--multiple-of-precision` | `multipleOf`的精度，传入整数 |
| `--error-data-path=property` | 错误的数据路径 |
| `--messages=false` | 不包括错误中文本信息 |

配置项可以以中横线格式或驼峰格式进行传递。


















