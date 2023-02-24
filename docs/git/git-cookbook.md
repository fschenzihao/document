# Git Cook Book

## 退出编辑

- ` W` + `Q`
- :wq

## git blame 

`git blame` - 命令显示文件每一行的最后修改版本和作者。

```bash
git blame <file>
git blame [-L <start>,<end>] <file> 
```



以下示例用 `git blame [-L <start>,<end>] <file> ` 确定了 Linux 内核源码顶层的 `Makefile` 中的第 69 行到第 82 行的最后修改版本和作者。然后可以使用 `git show <提交ID> ` 查询指定提交的日志消息和文本差异。

```bash
$ git blame -L 69,82 Makefile
b8b0618cf6fab (Cheng Renquan  2009-05-26 16:03:07 +0800 69) ifeq ("$(origin V)", "command line")
b8b0618cf6fab (Cheng Renquan  2009-05-26 16:03:07 +0800 70)   KBUILD_VERBOSE = $(V)
^1da177e4c3f4 (Linus Torvalds 2005-04-16 15:20:36 -0700 71) endif
^1da177e4c3f4 (Linus Torvalds 2005-04-16 15:20:36 -0700 72) ifndef KBUILD_VERBOSE
^1da177e4c3f4 (Linus Torvalds 2005-04-16 15:20:36 -0700 73)   KBUILD_VERBOSE = 0
^1da177e4c3f4 (Linus Torvalds 2005-04-16 15:20:36 -0700 74) endif
^1da177e4c3f4 (Linus Torvalds 2005-04-16 15:20:36 -0700 75)
066b7ed955808 (Michal Marek   2014-07-04 14:29:30 +0200 76) ifeq ($(KBUILD_VERBOSE),1)
066b7ed955808 (Michal Marek   2014-07-04 14:29:30 +0200 77)   quiet =
066b7ed955808 (Michal Marek   2014-07-04 14:29:30 +0200 78)   Q =
066b7ed955808 (Michal Marek   2014-07-04 14:29:30 +0200 79) else
066b7ed955808 (Michal Marek   2014-07-04 14:29:30 +0200 80)   quiet=quiet_
066b7ed955808 (Michal Marek   2014-07-04 14:29:30 +0200 81)   Q = @
066b7ed955808 (Michal Marek   2014-07-04 14:29:30 +0200 82) endif
```

详情参阅:[cli-git-blame](https://git-scm.com/docs/git-blame)，[Git-工具-使用-Git-调试](https://git-scm.com/book/zh/v2/Git-%E5%B7%A5%E5%85%B7-%E4%BD%BF%E7%94%A8-Git-%E8%B0%83%E8%AF%95)



## git show

`git-show` - 命令用于显示各种类型的对象

```bash
git show [<options>] [<object>…]
```



以下示例用 `git show` 查询指定提交[94ab698e] 的日志消息和文本差异。

```bash
$ git show 94ab698e
commit 94ab698e8de2ddd70219aabc14807581c62a17cb
Author: Thomas <724611259@qq.com>
Date:   Sat Dec 10 01:28:19 2022 +0800

    新增文档 如何写一个 TypeScript 库 Ver. 1.0

diff --git a/docs/README.md b/docs/README.md
index 95e602f..f16fcbd 100644
--- a/docs/README.md
+++ b/docs/README.md
@@ -1,18 +1,26 @@

 # 首页

-#### 介绍
+### 介绍

 Hello,这里是M3开发陈梓豪的共享文档。😃


-#### 文档列表
+### 文档列表

+#### SQLServer
 1.  [SQL Server 性能相关](./sqlserver-performance-analysis.md)
 <br/>└ 1.2 [SQL Server 性能相关-执行计划的统计信息(编写中...)](./sqlserver-performance-analysis-query-satas.md)
 2.  [SQL Server Profiler（数据库跟踪）使用说明](./sqlserver-profiler.md)
 3.  [SQL Server 变更数据捕获（CDC）](./sqlserver-cdc.md)
-4.  [dotTrace 性能分析器使用说明](./dottrace.md)
```

详情参阅:[cli-git-show](https://git-scm.com/docs/git-show)，[Git-工具-选择修订版本](https://git-scm.com/book/zh/v2/Git-%E5%B7%A5%E5%85%B7-%E9%80%89%E6%8B%A9%E4%BF%AE%E8%AE%A2%E7%89%88%E6%9C%AC)



## git commit --amend

有时候我们提交完了才发现漏掉了几个文件没有添加，或者提交信息写错了，就需要用到 `git commit --amend` 命令。

1. 输入命令 `git commit --amend`
2. 键入`：i`  进入了输入模式
3. 修改完成后，按下 `Esc` 键退出编辑模式，在键入 `:wq` `回车键` 退出并保存修改，完成提交。

::: tip 
这个命令会将暂存区中的文件提交。如果暂存区为空，则只是修改提交信息。
::: 
详情参阅:[git-commit]( https://git-scm.com/docs/git-commit), [Git-基础-撤消操作](https://git-scm.com/book/zh/v2/Git-%E5%9F%BA%E7%A1%80-%E6%92%A4%E6%B6%88%E6%93%8D%E4%BD%9C)