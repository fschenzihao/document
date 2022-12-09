# 如何写一个 TypeScript 库

## 第 1 步：初始化一个 Node.js 项目
 在本教程中，演示类库包名为 `sample-library`
``` javascript
npm init
```

初始化生成的 package.json 看起来像这样：
``` javascript
// sample-library/package.json
{
  "name": "sample-library",
  "version": "1.0.0",
  "description": "Can log \"hello world\" and \"goodbye world\" to the console!",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": [
    "/dist"
  ]
}
```

::: warning
`package.json` 中的`types`选项，用作声明在哪里可以找到声明文件，否则使用者将找不到您的模块！
::: 

## 第 2 步：设置 tsconfig.json
在项目根目录下创建 `tsconfig.json` 文件，如下所示：
``` javascript
//  sample-library/tsconfig.json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es2015",
    "declaration": true,
    "outDir": "./dist"
  },
  "include": [
    "src/**/*"
  ]
}

```
选项说明：
- `“declaration”：true` ：这将生成包含代码类型的.d.ts文件（也称为声明文件）。如果有人正在使用你的库，并且他们也使用 TypeScript，那么他们将获得类型安全和自动完成的好处！

- `“module”：“commonjs”`：为 node.js 应用程序构建库。如果要为浏览器构建库，请将`“commonjs”`替换为`“esnext”`。

- `“target”：“es2015”` 指定代码将被转译到哪个版本的JavaScript。选择es2015作为编译目标使你的库兼容 node.js 8及更高版本。

- `“outDir”：“./dist”` 将编译文件写入dist文件夹；

- `include` 选项指定源代码所在的位置。

## 第 3 步：实现你的库
创建一个src文件夹，并将库的所有源文件（应用程序逻辑、数据等）放在里面。

在这个演示中，我们设置一个简单的 hello-word.ts 文件，如下所示：
``` javascript
// sample-library/src/hello-world.ts
export function sayHello() {
  console.log('hi')
}
export function sayGoodbye() {
  console.log('goodbye')
}
```

## 第 4 步：创建 index.ts 文件
添加 index.ts 文件到src文件夹。它的目的是导出类库中，所有公开给使用者使用的内容，如下所示：
``` javascript
// sample-library/src/index.ts
export {sayHello, sayGoodbye} from './hello-world'
```

然后使用者可以像这样使用该库：
``` javascript
// otherproject/src/somefile.ts
import {sayHello} from 'sample-library'
sayHello();
```

## 第 5 步：发布到npm
发布第一个版本到npm，请运行：
``` javascript
tsc
npm publish
```


::: tip 对于后续更新发布，可以参照以下原则

- 当你对库进行修补程序/错误修复时，可以运行 npm version patch，
- 对于新功能，运行 npm version minor，
- 在api发生更改时，运行 npm version major。

::: 

以上教程包含构建和发布工作库所需的所有步骤。