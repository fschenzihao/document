# package.json 指南

| **基本要素** | **脚本** | **文件** | **第三方** | **依赖** | **系统** |
|:---:|:---:|:---:|:---:|:---:|:---:|
| [name](#name) | [scripts](#scripts) | files | types | dependencies | engines |
| [version](#version) | [config](#config) | main | typings | devDependencies | os |
| [author](#author) |  | module | unpkg | peerDependencies | cpu |
| [description](#description) |  | workspaces | jsdelivr | peerDependenciesMeta |  |
| [keywords](#keywords) |  | exports | browserslist | optionalDependencies |  |
| [license](#license) |  | bin | sideEffects | bundledDependencies |  |
| [homepage](#homepage) |  | man | lint-staged | flat |  |
| [bugs](#bugs) |  | directories |  | resolutions |  |
| [repository](#repository) |  |  |  | overrides |  |
| [contributors](#contributors) |  |  |  |  |  |
| [private](#private) |  |  |  |  |  |
| [publishConfig](#publishconfig) |  |  |  |  |  |


## 基本要素
### name

```javascript
{
    "name": "my-package"
}
```

包的名称。它可用于URL，或命令行上的参数，以及作为node_modules中的目录名。

```shell
yarn add [name]

node_modules/[name]

https://registry.npmjs.org/[name]/-/[name]-[version].tgz
```

::: tip

- 名称不要与 `Node.js` 核心模块相同。
- 不要把 `js` 或`node`放在名称中。
- 保持名称简短且具有描述性。它将会出现在 `import` 、`require` 调用中。
- 名称在  [registry](https://www.npmjs.com/) 未被使用。

:::

### version

``` javascript
{
    "version": "x.y.z"
｝
```

包的当前版本。

简单说明：

- x 代表主版本号 Major，通常在涉及重大功能更新，产生了破坏性变更时会更新此版本号
- y 代表次版本号 Minor，在引入了新功能，但未产生破坏性变更，依然向下兼容时会更新此版本号
- z 代表修订号 Patch，在修复了一些问题，也未产生破坏性变更时会更新此版本号

### author

``` javascript
{
  "author": {
    "name": "Your Name",
    "email": "you@example.com",
    "url": "http://your-website.com"
  },
  "author": "Your Name <you@example.com> (http://your-website.com)"，
  "author": "Li jiaxun"
}
```

包作者信息。

### description

```javas
{
  "description": "My short description of my package"
}
```

包的描述。帮助使用者理解软件包的用途。它也可以在包管理器中搜索包时使用。

### keywords

```javascript
{
  "keywords": ["typescript", "vue", "component", "components"]
}
```

包的技术关键词（字符串数组）。帮助在软件包管理器中搜索软件包时，更好地检索到。

### license

```javascript
{
  "license": "MIT",
  "license": "(MIT or GPL-3.0)",
  "license": "SEE LICENSE IN LICENSE_FILENAME.txt",
  "license": "UNLICENSED"
}
```

包的许可证。

::: tip

UNLICENSED： 您不想根据任何条款授予其他人使用私有或未发布软件包的许可证。

:::

### homepage

```javas
{
  "homepage": "https://your-package.org"
}
```

包主页。包的仓库或文档的URL。

### bugs

```javas
{
  "bugs": "https://github.com/user/repo/issues"
}
```

问题反馈地址。通常是 github issue 页面的链接，也可以是电子邮件地址。

### repository

``` javascript
{
  "repository": { "type": "git", "url": "https://github.com/user/repo.git" },
  "repository": "github:user/repo",
  "repository": "gitlab:user/repo",
  "repository": "bitbucket:user/repo",
  "repository": "gist:a1b2c3d4e5f"
}
```

包的仓库地址。

### contributors

```javascript
{
  "contributors": [
    { "name": "Your Friend", "email": "friend@example.com", "url": "http://website.com" },
    { "name": "Other Friend", "email": "other@example.com", "url": "http://website.com" }
  ],
  "contributors": [
    "Your Friend <friend@example.com> (http://website.com)",
    "Other Friend <other@example.com> (http://website.com)"
  ]
}
```

贡献者信息。

### private

```javascript
{
  "private": true
}
```

如果是私有包，若不发布到公共 npm 仓库上，则将 private 设为 true。

### publishConfig

```javascript
"publishConfig": {
  "registry": "https://registry.npmjs.org/"
}
```

包发布时使用的配置。

例如在安装依赖时指定了 registry 为 taobao 镜像源，但发布时希望在公网发布，就可以指定 publishConfig.registry。

## 脚本

### scripts

```javascript
{
  "scripts": {
    "preinstall": "echo preinstall",
    "install": "echo install",
    "postinstall": "echo postinstall",
    "prepublish": "echo prepublish",
    "prepare": "echo prepare"
  }
}
```

脚本命令。这些命令可以通过 `npm run <script>`、`yarn run <script>` 运行。

特殊脚本名称：

- `preinstall`： 在 `npm install` 之前自动执行。
- `preinstall`、 `prepare`、`prepublish`：在 `npm install` 之后自动自动执行。
- `prebuild`：在 `npm build` 之前自动执行。
- `postbuild`：在 `npm build` 之后自动执行。
- ...



### config

```javas
{
  "config": {
    "port": "8080"
  }
}
```

脚本中使用的配置选项或参数。



```javascript
// 用户可以改变这个值
npm config set port 9080

// 在执行脚本时，可以通过 npm_package_config_port 这个变量访问到 8080
console.log(process.env.npm_package_config_port);
```





