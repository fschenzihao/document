# Vite Cook Book

## 1.打包去除 console， debugger 内容

### terser

``` javascript
build:{
    minify: "terser",
	terserOptions: {
   		compress: {
      		drop_console: true,
     	 	drop_debugger: true
   		}
	}
}
```

### esbuild

``` javascript
 esbuild:{
    drop: ["console","debugger"],
},
```

## 2.rollup 解析 CommonJS 模块

```javascript
// todo
// npm install @rollup/plugin-commonjs --save-dev

import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/index.js',
  output: {
    dir: 'output',
    format: 'cjs'
  },
  plugins: [commonjs()]
};
```

## 3.自定义模式

演示使用 `import.meta.env.VITE_APP_Version` 环境变量区分项目的版本：
- 在 `docs` 模式下值为 `文档`。
- 在 `library` 模式下值为 `类库`。

### 开始

- 新增 `package.json` 脚本

  ``` json
  {
    "scripts": {
      "dev:docs": "vite dev --mode docs",
      "dev:library": "vite build --mode library",
    }
  }
  ```

- 新增 `.env.docs` 文件

  ```
  # .env.docs
  VITE_APP_Version=文档
  ```
  ::: tip
  只有以 `VITE_` 开头的变量名，才能附加到 `import.meta.env`。
  :::

- 新增 `.env.library` 文件

  ```
  # .env.library
  VITE_APP_Version=类库
  NODE_ENV=production
  ```
  ::: warning
  - `vite dev` : 默认为 `development` (开发) 模式。
  - `vite build` : 默认为 `production` (生产) 模式。
  - `vite dev --mode library` 或 `vite build --mode library`: 自定义模式下，无论 `build` 还是 `dev` 命令都为 `development` (开发) 模式 `import.meta.env.PROD` = `false`，
    但可以通过 `.env` 文件的 `NODE_ENV=production`设置为 `production` (生产) 模式 `import.meta.env.PROD` = `true`。
  :::

- 新增 `env.d.ts` 文件
  ``` typescript
  /// <reference types="vite/client" />
  
  interface ImportMetaEnv {
    readonly VITE_APP_Version: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
  ```
- 使用
  ``` javascript
  console.log(import.meta.env.VITE_APP_Version) // '文档' 或者 '类库'
  ```