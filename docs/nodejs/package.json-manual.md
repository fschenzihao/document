# package.json 指南

| **基本要素** | **脚本** | **文件**配置 | **第三方配置** | **依赖**配置 | **系统** |
|:---:|:---:|:---:|:---:|:---:|:---:|
| [name](#name) | [scripts](#scripts) | [files](#files) | [types](#types-typings) | [dependencies](#dependencies) | [engines](#engines) |
| [version](#version) | [config](#config) | [main](#main) | [typings](#types-typings) | [devDependencies](#devdependencies) | [os](#os) |
| [author](#author) |  | [module](#module) | [unpkg](#unpkg) | [peerDependencies](#peerdependencies) | [cpu](#cpu) |
| [description](#description) |  | [exports](#exports) | [jsdelivr](#jsdelivr) | [peerDependenciesMeta](#peerdependenciesmeta) |  |
| [keywords](#keywords) |  |  [workspaces](#workspaces)  | [browserslist](#browserslist) | [optionalDependencies](#optionaldependencies) |  |
| [license](#license) |  | [bin](#bin) | [sideEffects](#sideeffects) | [bundledDependencies](#bundleddependencies) |  |
| [homepage](#homepage) |  | [man](#man) | [lint-staged](#lint-staged) | [resolutions](#resolutions-overrides) |  |
| [bugs](#bugs) |  | [directories](#directories) |  | [overrides](#resolutions-overrides) |  |
| [repository](#repository) |  | [type](#type) |  |                                               |  |
| [contributors](#contributors) |  |  |  |  |  |
| [private](#private) |  |  |  |  |  |
| [publishConfig](#publishconfig) |  |  |  |  |  |

## 基本要素

### name

```json
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

``` json
{
    "version": "x.y.z-alpha.1"
｝
```

包的当前版本。

简单说明：

- x 代表主版本号 Major，通常在涉及重大功能更新，产生了破坏性变更时会更新此版本号
- y 代表次版本号 Minor，在引入了新功能，但未产生破坏性变更，依然向下兼容时会更新此版本号
- z 代表修订号 Patch，在修复了一些问题，也未产生破坏性变更时会更新此版本号
- -alpha.1 代表预发布版本号 pre-release，有以下选择 alpha(内测), beta(灰度测试), rc(生产候选)

::: tip 
版本号大小排序

16.7.1-alpha.1 < 16.7.1-beta.1 < 16.7.1-rc.1 < 16.7.1
:::

### author

``` json
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

```json
{
  "description": "My short description of my package"
}
```

包的描述。帮助使用者理解软件包的用途。它也可以在包管理器中搜索包时使用。

### keywords

```json
{
  "keywords": ["typescript", "vue", "component", "components"]
}
```

包的技术关键词（字符串数组）。帮助在软件包管理器中搜索软件包时，更好地检索到。

### license

```json
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

```json
{
  "homepage": "https://your-package.org"
}
```

包主页。包的仓库或文档的URL。

### bugs

```json
{
  "bugs": "https://github.com/user/repo/issues"
}
```

问题反馈地址。通常是 github issue 页面的链接，也可以是电子邮件地址。

### repository

``` json
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

```json
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

```json
{
  "private": true
}
```

如果是私有包，若不发布到公共 npm 仓库上，则将 private 设为 true。

### publishConfig

```json
"publishConfig": {
  "registry": "https://registry.npmjs.org/"
}
```

包发布时使用的配置。

例如在安装依赖时指定了 registry 为 taobao 镜像源，但发布时希望在公网发布，就可以指定 publishConfig.registry。



## 脚本

### scripts

```json
{
  "scripts": {
    "prebuild": "echo prebuild",
    "build": "echo build",
    "postbuild": "echo postbuild",
    "prepublish": "echo prepublish",
    "prepare": "echo prepare"
  }
}
```

脚本命令。这些命令可以通过 `npm run <script>`、`yarn run <script>` 运行。

#### 脚本钩子
npm 脚本有 `pre` 和 `post` 两个钩子。

例如：`build` 脚本命令的钩子就是 `prebuild` 和 `postbuild`。
执行 `npm run build`时，会自动按照下面的顺序执行。

```sh
npm run prebuild && npm run build && npm run postbuild
```

- `preinstall`： 在 `npm install` 之前自动执行。
- `postinstall`、`prepare`、：在 `npm install` 之后自动自动执行。


[更新信息，请参阅：](http://ruanyifeng.com/blog/2016/10/npm_scripts.html)
### config

```json
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



## 文件

### files

```json
{
  "files": ["filename.js", "directory/", "glob/*.{js,json}"]
}
```

包发布时包含的文件。

您可以指定单个文件、整个目录或使用通配符来包含满足特定条件的文件。

默认会包括 package.json，license，README 和main 字段里指定的文件。忽略 node_modules，lockfile 等文件。

### main

```json
{
  "main": "./dist/filename.js"
}
```

包的入口文件。默认值为根目录下的  `index.js`。

### module

```json
"module": "./index.mjs"
```

`ES 模块`的入口文件

### exports

```json
{
  "name": "my-package",
  "exports": {
    "require": "./index.js",  // require('my-package')
    "import": "./index.mjs",  // import 'my-package'
  }
}
```

```json
{
  "exports": {
    ".": {
      "require": "./index.js",
      "import": "./index.mjs"
    },
    "node": "./index-node.js",
    "./style": "./dist/css/index.css'  // import 'my-package/style' 
  }
}

```

`exports` 字段可以配置不同环境对应的模块入口文件。

::: warning

当指定了 `exports` 字段时，会忽略 `main` 字段配置。只有声明了的模块是可用的，其他的模块会抛出 `ModuleNotFound Error`。

:::

### workspaces

```json
{
  "workspaces": ["packages/*"]
}
```

项目的工作区配置，用于在本地的根目录下管理多个子项目。可以自动地在 npm install 时将 workspaces 下面的包，软链到根目录的 node_modules 中，不用手动执行 npm link 操作。

### bin

```json
{
  "bin": "bin.js",
  "bin": {
    "command-name": "bin/command-name.js",
    "other-command": "bin/other-command"
  }
}
```

安装的项目时，包含的可执行文件。

### man

```json
{
  "man": "./man/doc.1",
  "man": ["./man/doc.1", "./man/doc.2"]
}
```

项目相关的手册页

### directories

```json
{
  "directories": {
    "lib": "path/to/lib/",
    "bin": "path/to/bin/",
    "man": "path/to/man/",
    "doc": "path/to/doc/",
    "example": "path/to/example/"
  }
}
```

指定放置二进制文件、手册页、文档、示例等的位置。

### type

```json
{
   "type": "module"
}
```

设置为 `module` 后，该目录里面的 `.js` 文件，就被解释用 ES6 模块。

::: tip

- `.mjs` 文件总是以 ES6 模块加载，`.cjs` 文件总是以 `CommonJS` 模块加载，`.js` 文件的加载取决于 `type` 字段的设置。

- [`exports`](#exports) 字段，则可以指明两种格式模块各自的加载入口。

有关详细信息，请参阅：[Node.js 如何处理 ES6 模块](https://www.ruanyifeng.com/blog/2020/08/how-nodejs-use-es6-module.html)

:::

## 第三方配置

### types / typings

```json
{
  "types": "./index.d.ts"
}
```

`TypeScript` 的声明文件的入口。

### unpkg

```json
{
  "unpkg": "dist/vue.global.js" // unpkg.com/vue
}
```

`CDN` 链接入口。

### jsdelivr

``` json
{
  "jsdelivr": "dist/vue.global.js" // cdn.jsdelivr.net/npm/vue
}
```

`jsdelivr` 链接入口。

### browserslist

```json
{
  "browserslist": [
  "> 1%",
  "last 2 versions"
]
}
```

设置包的浏览器兼容情况。也可使用 `.browserslistrc` 单文件配置。

### sideEffects

```json
{
  "sideEffects": [
  "dist/*",
  "es/**/style/*",
  "lib/**/style/*",
  "*.less"
  ]
}
```

显示设置某些模块具有副作用，用于 `webpack` 的 `tree-shaking` 优化。



例如 在项目中整体引入 Ant Design 组件库的 css 文件。

```javascript
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
```

如果 Ant Design 的 package.json 里不设置 sideEffects，那么 `webapck` 构建打包时会认为这段代码只是引入了但并没有使用，可以 `tree-shaking` 剔除掉，最终导致缺少样式。

### lint-staged

```json
{
  "lint-staged": {
    "src/**/*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "git add -A"
    ]
  }
}
```

lint-staged 是用于对 git 的暂存区的文件进行操作的工具，比如可以在代码提交前执行 lint 校验，类型检查，图片优化等操作。

lint-staged 通常配合 husky 这样的 git-hooks 工具一起使用。git-hooks 用来定义一个钩子，这些钩子方法会在 git 工作流程中比如 pre-commit，commit-msg 时触发，可以把 lint-staged 放到这些钩子方法中。



## 依赖

### dependencies

```json
{
  "dependencies": {
    "package-1": "^3.1.4"
  }
}
```

开发和生产过程中都需要的依赖项。

使用 `npm install xxx`、 `npm install xxx --save`、`yarn add xxx` 时，会被自动插入到该字段中。

::: tip

- **指定版本**：比如 `1.2.2`，遵循“大版本.次要版本.小版本”的格式规定，安装时只安装指定版本
- **波浪号+指定版本**：比如 `~1.2.2`，表示  `1.2.2` <= 安装版本 <= `1.3.x`，也就是说安装时不改变大版本号和次要版本号。
- **插入号+指定版本**：比如ˆ1.2.2，表示 `1.2.2` <= 安装版本 <= `2.x.x`，也就是说安装时不改变大版本号。
- **latest**：安装最新版本。

:::

### devDependencies

```json
{
  "devDependencies": {
    "package-2": "^0.4.2"
  }
}
```

只有在开发软件包时才需要，但不会在生产环境中安装的依赖项。

使用 `npm install xxx -D` 、 `npm install xxx --save-dev`、 `yarn add xxx --dev` 时，会被自动插入到该字段中。

### peerDependencies

对等依赖关系。用于声明项目的一个或多个直接依赖项，这些依赖项并不是由该包自身直接提供，而是期望在其宿主项目中安装相应依赖。

当用户安装含有 `peerDependencies` 的包时，如果宿主项目中没有满足版本要求的对应依赖，NPM 7 及以后版本会尝试自动安装它们。

如果宿主项目已存在相应依赖但版本不符合 `peerDependencies` 中指定的范围，那么 `npm install` 安装项目所有依赖时将会报错中断。

```json
{
  "peerDependencies": {
    "package-foo": "^2.7.18"
  }
}
```

例如上述代码中，宿主项目在使用时必须安装 `package-foo` 依赖包，并且依赖版本为 `^2.7.18`。

::: tip 何时使用 
- **插件系统:** 当开发一个插件或库，它设计为扩展另一个库或框架的功能时，常常使用 `peerDependencies`。例如，一个针对 `Vue.js` 框架编写的插件在 `peerDependencies` 中声明对 `vue` 的依赖，意味着使用该插件的项目必须先安装了 `Vue.js`。

- **共享依赖避免重复安装:** 如果宿主项目已安装了某个包(例如 `lodash`)，并且这个包不应该被重复打包，可由宿主项目提供，那么这个库就应作为 `peerDependency`。
:::

### peerDependenciesMeta

```json
{
  "peerDependenciesMeta": {
    "package-3": {
      "optional": true
    }
  }
}
```

向对等依赖项添加元数据，将其指定为可选的。（目前只有 `optional` 标记可用）

### optionalDependencies

```json
{
  "optionalDependencies": {
    "package-5": "^1.6.1"
  }
}
```

可选的依赖项。如果可选依赖项安装失败，安装不受影响仍将继续。

使用 `npm install xxx -O` 或者 `npm install xxx --save-optional` 时，依赖会被自动插入到该字段中。

### bundledDependencies

```json
{
  "bundledDependencies": ["package-4"]
}
```

打包依赖项。打包依赖项是一个包名数组，在发布包时将捆绑在一起发布。

::: tip

- 这个打包依赖项中的包名必须是在 `dependencies`，`devDependencies` 两个里面声明过的依赖才行。
- 当你想用一个不在 npm registry 里的包，或者一个被修改过的第三方包时，打包依赖会比普通依赖更好用。

:::

### resolutions / overrides

```json
{
  "resolutions": {
    "transitive-package-1": "0.0.29",
    "transitive-package-2": "file:./local-forks/transitive-package-2",
    "dependencies-package-1/transitive-package-3": "^2.1.1"
  },
  "overrides": {
    "foo": "1.1.0-patch"
  }
}
```

允许重写特定嵌套依赖项的版本。其中 `resolutions` 字段用于 `yarn`

## 系统

### engines

```json
{
  "engines": {
    "node": ">=4.4.7 <7.0.0",
    "yarn": "^0.14.0"
  }
}
```

要求 node 版本大于等于 `4.4.7` 且小于 `7.0.0`，同时 `yarn` 版本号需要大于 `0.14.0`。

### os

```json
{
  "os": ["darwin", "linux"],
  "os": ["!win32"]
}
```

指定包的操作系统兼容性。

### cpu

```json
{
  "cpu": ["x64", "ia32"],
  "cpu": ["!arm", "!mips"]
}
```

指定包只能在某些 CPU 架构上运行

