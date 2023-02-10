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

