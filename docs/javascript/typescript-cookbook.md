# TypeScript Cookbook

### 1. 使用含有通配符的模块声明文件 `d.ts`

项目 `docs/examples/erp-configs` 文件夹下存在多个自动生成同一个结构的 `erp_x.js` 配置文件。当在 `TypeScript` 项目中直接引入 `js` 文件使用会提示缺少类型声明文件。

```typescript
import config from 'docs/examples/erp-configs/erp_1';
// error 找不到模块“docs/examples/erp-configs/erp_1”或其相应的类型声明。
```

解决方案：为 `erp-configs` 文件夹下所有 `js` 文件新建类型声明文件 `d.ts`。

- 项目结构。

  ```tex
  项目
  |-- docs
  	|-- examples
  		|-- erp-configs
  			|-- erp_1.js
  			|-- erp_2.js
  			|-- ...
  ```

- 配置文件。

  ```javascript
  // erp_1.js 文件的伪代码
  export default {
      ERP_BizObj: { ID: 10010, Name: '对象1'},
      ERP_BizMTButton: { ID: 10086, Name: '按钮1'},
  }
  ```

- 首先使用 `vite` 的 `resolve.alias` 文件系统路径别名功能统一配置的入口。

  ``` typescript
  // vite.config.ts
  import { resolve } from 'node:path'
  import { defineConfig } from 'vite'
  
  export default defineConfig({
    resolve: {
      alias: {
        'examples-configs': resolve(__dirname, './docs/examples/erp-   configs')
      }
    }
  })
  ```

- 然后在新建 `erp-configs.d.ts` 类型声明文件，declare module 描述的模块名可以使用通配符。

  下面示例中，模块名 `examples-configs/*` 表示适配所有以 `examples-configs/` 开头的模块名（比如 `examples-configs/erp_1`）。

  ```typescript
  // docs/erp-configs.d.ts
  declare module 'examples-configs/*' {
      interface ERPBizObjConfig {
          ERP_BizObj: Record<string, any>;
          ERP_BizMTButton: Array<Record<string, any>>;
      }
      
      const config: ERPBizObjConfig;
      export default config;
  }
  ```

- 配置 `tsconfig.json` 文件。

  ```json
  {
    "compilerOptions": {
      "include" : ["docs/**/*.d.ts"]
    }
  }

- 通过 `examples-configs` 模块名引入配置文件就可以匹配到类型声明了。

  ```typescript
  import config from 'examples-configs/erp_1'
  ```

  

有关详细信息，请参阅：
- [resolve.alias(Vite)](https://cn.vitejs.dev/config/shared-options#resolve-alias)

- [declare module(网道-TypeScript 教程-declare 关键字)](https://wangdoc.com/typescript/declare#declare-moduledeclare-namespace)

- [tsconfig.include(网道-TypeScript 教程-tsconfig.json 文件)](https://wangdoc.com/typescript/tsconfig.json#include)
