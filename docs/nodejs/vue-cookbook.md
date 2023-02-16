# Vue Cookbook
## Vue warn 相关错误
### 警告1

[Vue warn] : component inside `<Transition>` renders non-element root node that cannot be animated
`<Transition>`中的组件渲染无法设置动画的非元素根节点
**解决方案：**
Transition 包裹的必须是一个单根的元素。例如：
不能这样 ❌：

``` html
<template>
   <div>1</div>
   <div>2</div>
</template>
```


应该这样 ✔️：

``` html
<template>
  <div>
	 <div>1</div>
	 <div>2</div>
   </div>
</template>
```

---

### 警告2：

[Vue warn] : Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead.
避免依赖于枚举组件实例上的键的应用程序逻辑。在生产模式下，键将为空，以避免性能开销。
**解决方案：**

---

### 警告3：

[Vue warn] : onMounted is called when there is no active component instance tobe associated with. Lifecycle injection APIs can only be used duringexecution of setup(). If you are using async setup(), make sure to reqisterlifecycle hooks before the first await statement.

[Vue warn]：onUnmounted is called when there is no active component instanceto be associated with, lifecycle injection APIs can only be used duringexecution of setup(). If you are using async setup(), make sure to registerlifecycle hooks before the first await statement.

[Vue warn]：withDirectives can only be used inside render functions.

[Vue warn]：resolveDirective can only be used in render() or setup() .

[Vue warn]：Invalid VNode type: Symbol(Fragment) (symbol)



上述问题可能是因为出现了两个 vue 实例。

在 link 模式引用组件库时出现以上错误，具体说明

1.组件项目 `c:\ts-erp-ui` 已设置打包排除 vue

2.页面项目 `C:\ts-erp-page`

3.`ts-erp-page` link  `ts-erp-ui` 

4.当 `ts-erp-page` 打包处理 `c:\ts-erp-ui\dist\index.mjs` 里的 `import { ref } from 'vue'`相关语句时，加载了`c:\ts-erp-ui\node_modules\vue`下的`vue`模块。造成两个 vue 实例。

详细信息：[Node.js_从 node_modules 目录加载](http://nodejs.cn/api-v16/modules.html#loading-from-node_modules-folders)

**疑问：**但是 vite dev 模式下没有出现这个问题。待续。。。

**解决方案：**

`ts-erp-page` 项目设置相关模块的别名

```javascript
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      'vue': resolve(__dirname, 'src/node_modules/vue',
      'element-plus': resolve(__dirname, 'src/node_modules/element-plus',
      '@element-plus/icons-vue': resolve(__dirname, 'src/node_modules/@element-plus/icons-vue',                
    },
  },
})

```

---

