---
title: ajv-cli
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
























