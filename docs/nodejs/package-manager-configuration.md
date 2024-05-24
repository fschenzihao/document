# 包管理器配置
## npm

```bash
# 设置源为淘宝的npmjs.org国内镜像
npm config set registry https://registry.npmmirror.com/

# 设置依赖包的HTTP代理服务器地址
npm config set proxy http://proxy.example.com:8080

# 设置全局包目录（会自动在目录下创建node_modules文件夹）
npm config set prefix D:\dev\nodejs

# 设置缓存目录（会自动在目录下创建_cacache文件夹）
npm config set cache D:\dev\nodejs

# 查看设置
npm config ls
```

亦可以直接修改当前用户下的`C:\Users\foo\.npmrc`文件

```bash
registry=https://registry.npmmirror.com/
prefix=D:\dev\nodejs\node_global
cache=D:\dev\nodejs\node_cache
```

有关详细信息，请参阅 [npm-config (npm Docs)](https://docs.npmjs.com/cli/v10/commands/npm-config)

## yarn

```bash
# 全局安装yarn
npm install -g yarn

# 验证安装-查看yarn版本号
yarn -v

# 设置源代理
yarn config set registry https://registry.npmmirror.com/

# 设置缓存目录
yarn config set cache-folder D:\dev\nodejs\yarn_cache

# 设置全局包目录
yarn config set global-folder D:\dev\nodejs\yarn_global

```

有关详细信息，请参阅 [yarn config (yarn 官方文档)](https://classic.yarnpkg.com/en/docs/cli/config)

:::warning
注意 命令提示行需要管理员运行
:::



