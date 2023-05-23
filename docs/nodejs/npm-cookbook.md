# npm Cookbook

## 1. package.json 变量

`package.json` 中的字段会被附加 `npm_package_` 前缀，然后添加到 `process.env` 环境变量下。

例如，`package.json` 如下所示：

```json
{
  "name":"foo",
  "version":"1.2.5",
  "scripts": {
    "dev": "vite dev"
  }
}
```

执行 `package.json` 中的 `script` 命令时，会将环境变量 `process.env.npm_package_name`  设置为 `foo`， `process.env.npm_package_version` 设置为 `1.2.5`，以此类推其他字段。

你可以在代码中访问这些变量，如下所示：

```javascript
console.log(process.env.npm_package_name) // foo
console.log(process.env.npm_package_version) // 1.2.5
```

有关详细信息，请参阅：[package.json vars (npm Docs)](https://docs.npmjs.com/cli/v9/using-npm/scripts#packagejson-vars)
