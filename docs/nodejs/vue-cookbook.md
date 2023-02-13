### 问题 1：

component inside `<Transition>` renders non-element root node that cannot be animated
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



### 问题 2：

Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead.
避免依赖于枚举组件实例上的键的应用程序逻辑。在生产模式下，键将为空，以避免性能开销。
**解决方案：**