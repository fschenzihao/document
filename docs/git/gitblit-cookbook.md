# Gitblit Cookbook

## Tickets 工单

### 流程图

```mermaid
flowchart TB
    A([项目仓库]) --> B[创建工单]
    B --> C{是否已存在工单分支}
    C -->|是| D[检出远程工单分支]
    C -->|否| E[创建本地工单分支]
    E --> F[代码修改]
    D --> F
    F --> G[提交并推送]
    G --> H{是否已完成全部工作}
    H -->|否| F
    H -->|是| I[修改工单状态为 OPEN]
    I --> J[工单补丁审查]
    J --> K[工单审核]
    K --> L{工单审核结果}
    L -->|同意| M[合并工单补丁]
    L -->|否决| F
    M --> N((结束))
```

### 1. 创建标准工单

#### 1.1.  UI 图形用户界面

可以使用Web用户界面创建标准工单

##### 1.1.1. 进入仓库主页点击`新建`按钮

   ![repo-home](/images/git/gitblit-cookbook/repo-home.png)

###### 1.1.2. 填写工单详情

工单字段说明
​	![tickets-add](/images/git/gitblit-cookbook/tickets-add.png)

- **标题**：简要工作内容

- **主题**：topic 话题、标签或类别，相当于工单的分类，可为空

- **描述**：详细的工作内容

- **类型**：
  - enhancement - 增强；提高；增加
  - task - 任务、需求
  - bug - 错误、漏洞
  - question - 问题
  - maintenance - 维护

- **severity** - 严重等级
  - unrated - 未分级的
  - negligible - 不重要的
  - minor - 次要的
  - serious - 严重的
  - critical - 关键的
  - catastrophic - 灾难性的


​	**以下选项是拥有推送（RW）权限的用户才会显示**

- **priority** - 优先级
  - urgent - 加急
  - high - 紧急
  - normal - 一般
  - low - 次要

- **负责人** - 项目中拥有推送权限的用户，可以不指定

- **合并到** - 选择`工单`完结后需要合并到的分支，例如 `dev` / `master`

###### 1.1.3. 工单信息

![tickets-detail](/images/git/gitblit-cookbook/tickets-detail.png)


####  1.2. CLI 命令行界面


### 2. 管理工单
可在`项目`-`工单`页面中`查询`/`编辑`/`删除`历史工单

![tickets-list](/images/git/gitblit-cookbook/tickets-list.png)

### 3. 创建工单补丁集
#### 3.1. 创建工单本地分支

分支名格式为 `ticket/{id}`，`id` 为需要关联的工单ID

例如：`ticket/2` 分支关联工单2，以下示例已工单2举例

##### 3.1.1. **使用 SourceTree (图形用户界面)**

1. 从远程仓库中获取所有分支

![git-fetch](/images/git/gitblit-cookbook/git-fetch.png)

2. 检查是否远程中是否已存在分支 `ticket/2`
   - 存在 - 直接选中右键检出
   - 不存在 - 继续后续的第 3 点操作

![tickets-check-exist-branch](/images/git/gitblit-cookbook/tickets-check-exist-branch.png)

3. 新建分支 `ticket/2`

![tickets-checkout-branch](/images/git/gitblit-cookbook/tickets-checkout-branch.png)

4. 提交修改到分支 `ticket/2`

5. 新增工单补丁集（将分支 `ticket/2` 的提交推送到远程仓库）

![tickets-push-branch](/images/git/gitblit-cookbook/tickets-push-branch.png)

   **只有以下用户可以推送工单分支：**
   - 工单作者
   - 初始化工单补丁集作者
   - 工单制定的负责人
   - 对仓库具有推送（RW）权限的用户

   **否则推送会报错**
![tickets-push-patchset-error](/images/git/gitblit-cookbook/tickets-push-patchset-error.png)



##### 3.1.2. 使用 CLI (命令行界面)

```bash
# 获取所有分支最新提交 &&  以 dev 分支为起点创建 ticket/{id} 分支
git fetch && git checkout ticket/{id} dev

# 修改提交...

# 推送分支
git git push -u origin ticket/{id}

```

#### 3.2.  查询工单提交记录

在工单页面可以查看所有提交记录

![tickets-commits](/images/git/gitblit-cookbook/tickets-commits.png)

#### 3.3. 工单完成

将工单状态修改为 `open`

![tickets-edit-open](/images/git/gitblit-cookbook/tickets-edit-open.png)

### 4. 审查工单

####  4.1. 检查修订内容

![tickets-review-1](/images/git/gitblit-cookbook/tickets-review-1.png)


####  4.2. 修订审核

   工单通过则选择 `同意 +2` 选项，否则选择 `否决 -2` 选项。

![tickets-review-2](/images/git/gitblit-cookbook/tickets-review-2.png)

   ::: warning
   - 拥有仓库 `RW(推送)` 权限以上的用户才会出现 `同意` 和 `否决` 按钮。
   - 如果工单补丁集被更新或重写，所有以前的审查分数都将被忽略。
   :::

####  4.3. 评论

![tickets-review-3](/images/git/gitblit-cookbook/tickets-review-3.png)


### 5. 合并工单补丁

#### 5.1. 自动合并

工单页面中的 `合并` 按钮，可自动合并工单补丁。但满足以下所有条件时，才会显示，否则需要手动合并

- 修订评分至少有一个 `+2` 且没有 ` -2` 
- 补丁修改不存在冲突

![tickets-merge](/images/git/gitblit-cookbook/tickets-merge.png)

::: tip
当进行工单自动合并操作后，工单状态变为 `MERGED`， 后续将无法再次推送提交到对应工单分支，需要新建工单。
:::

#### 5.2. 手动合并

工单补丁无法自动合并时，则需要手动合并。

![tickets-merge-user](/images/git/gitblit-cookbook/tickets-merge-user.png)

以下示例为，使用命令行合并`工单2`补丁：

1. 以 `dev`  分支为起点，新建本地分支 `patch-2`。

   ``` bash
   git checkout -b patch-2 dev
   ```

2. 拉取工单2分支 `ticket/2` 的提交修改到当前分支 `patch-2`。

   ```bash
   git pull origin ticket/2
   ```

3. 若存在冲突，则解决冲突，然后提交修改。

4. 切换到 `dev` 分支，合并 `patch-2` 分支到 `dev` 分支，推送修改。

5. 删除本地分支 `patch-2`。

   ```bash	
   git branch -d patch-2
   ```

6. 将工单2状态修改为 `FIXED`。

   ![tickets-fixed](/images/git/gitblit-cookbook/tickets-fixed.png)

7. 完成。

::: tip
当工单状态不为 `MERGED` 时，若再次推送提交到工单分支，则工单状态会重置为 `OPEN`。并且新的提交被归为新的补丁集，可以再次合并。
:::

### 6. 仓库设置
#### 6.1 用户权限设置

   - 需要审查代码的用户：R(克隆） 权限
   - 可以审批和推送代码的用户：RW(推送) 权限

   ![repo-permissions](/images/git/gitblit-cookbook/repo-permissions.png)

#### 6.2. 工单设置
   ![repo-tickets](/images/git/gitblit-cookbook/repo-tickets.png)

>有关详细信息，请参阅:
>[Using Tickets (Gitblit)](https://www.gitblit.com/tickets_using.html)