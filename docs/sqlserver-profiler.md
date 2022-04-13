>📃版本: 1.2
>
>📆日期: 2021-07-26


# SQL Server Profiler 简介

SQL Server Profiler 是一个图形界面工具，用于创建和管理跟踪并分析和重播跟踪结果。 这些事件保存在一个跟踪文件中，稍后诊断问题时，可以对该文件进行分析或用它来重播一系列特定的步骤。

> 提示
> 微软官方提示 Microsoft SQL Server 2014 或更高版本，已弃用 SQL 跟踪和 SQL Server Profiler。后续版本的 Microsoft SQL Server 将删除该功能。 请避免在新的开发工作中使用该功能，并着手修改当前还在使用该功能的应用程序。
> 请改用[扩展事件](https://docs.microsoft.com/zh-cn/sql/relational-databases/extended-events/quick-start-extended-events-in-sql-server?view=sql-server-ver15)。
---
# SQL Server Profiler 运行

 1. 从 Windows“开始”菜单启动 SQL Server Profiler

 ![在这里插入图片描述](/images/sqlserver-profiler/start-menu.png)

 2. 在 SQL Server Management Studio 的“工具”菜单中，单击“SQL Server Profiler”
![在这里插入图片描述](/images/sqlserver-profiler/ssms-menu.png)
---
# 跟踪管理
## 导入跟踪模板
 1. 若系统关联了扩展名，则可以直接双击.tdf模板文件。

![输入图片说明](/images/sqlserver-profiler/template1.png)

 2.双击.tdf模板文件后，会自动打开SQL Server Profiler并显示模板添加成功提示。

![输入图片说明](/images/sqlserver-profiler/template2.png)

 3. 若第1步自动添加失败，则请在 “文件” 菜单上，单击 “模板” ，再单击 “导入模板” 。

![导入模板](/images/sqlserver-profiler/template3.png)

 4. 在“打开文件”对话框中，选择要导入的跟踪模板文件（.tdf 文件）并单击“打开”。
 ![选择模板](/images/sqlserver-profiler/template4.png)

 5. 新建跟踪时可以看到，跟踪模板文件就添加为 “跟踪属性” 对话框的 “使用模板” 列表中的可用模板。 用户定义的模板将在模板名称后追加 (用户或者user) 。
![新建跟踪](/images/sqlserver-profiler/template5.png)
---
## 新建运行
 1. 在 “文件” 菜单上，单击 “新建跟踪” ，并连接到 SQL Server实例。此时，将显示 “跟踪属性” 对话框。
 2. 在 “跟踪名称” 框中，输入跟踪的名称。例如：死锁跟踪_202107030800
 3. 在 “使用模板” 列表中，选择一个跟踪模板。例如：死锁跟踪（用户）
 4. 单击“保存到文件”，指定跟踪内容保存的目录。 
 5. 指定 “设置最大文件大小” 的值为 200 MB（根据实际情况调整）
 6. 选择 “启用文件滚动更新” 。（生成的跟踪文件大小达到最大值时自动创建新文件，例如：死锁跟踪_202107030800.trc,死锁跟踪_202107030800_1.trc，死锁跟踪_202107030800_2.trc）
 7. “启用跟踪停止时间” ，根据需要指定停止日期和时间。
 8. 运行
![新建跟踪](/images/sqlserver-profiler/start-profiler.png)
---
 ## 暂停或停止
  1. 选中一个包含正在运行的跟踪的窗口。在 “文件” 菜单上，单击 “暂停跟踪” 或“停止跟踪”。
  2. 在包含正在运行的跟踪的窗口，右击，在右击菜单上，单击 “暂停跟踪” 或“停止跟踪”。
  3. 选中一个包含正在运行的跟踪的窗口。在工具栏上，点击“暂停跟踪”或“停止跟踪”。
![暂停或停止跟踪](/images/sqlserver-profiler/stop-profiler.png)

> 注意
> 跟踪运行时，可以查看属性，但是不能修改属性。 若要修改属性，请停止或暂停跟踪。
> 停止或暂停后，可以更改名称、事件、列和筛选器。 但是不能更改服务器连接
---
## 收集跟踪文件
 1. 停止跟踪。
 2. 到跟踪保存目录找到跟踪文件.trc。（可在跟踪属性中查看保存文件目录）
 3. 压缩后传回。==压缩率可达1%，强烈建议压缩==

 ![跟踪文件](/images/sqlserver-profiler/file-profiler.png)
---
# 进阶
## 1.  根据报错信息查找出错的SQL语句

1.1  新建跟踪时，选择 **Errors and Warnings**组下的**Exception**和**User Error Message**事件

![在这里插入图片描述](/images/sqlserver-profiler/eg-1.png)

1.2. 例如 执行SQL语句

```sql
select * from SMInvoiceDetail where InvoiceNo = d
```
> 消息
消息 207，级别 16，状态 1，第 1 行
列名 'd' 无效。

1.3. 跟踪结果

![在这里插入图片描述](/images/sqlserver-profiler/eg-2.png)

## 2. T-SQL语句创建跟踪

跟踪可以由SQL Server工具 [SQL Server Profiler](https://docs.microsoft.com/zh-cn/sql/tools/sql-server-profiler/sql-server-profiler?view=sql-server-ver15) 图形界面创建，也可以由T-SQL语句创建。后面小点介绍使用T-SQL

### 2.1. 创建跟踪

```sql
/**************************************/ 
/* 1 新建跟踪（新的跟踪将处于停止状态） */
/**************************************/

/*返回代码	描述
0	没有错误。
1	未知错误。
10	无效选项。 指定的选项不兼容时返回此代码。
12	文件未创建。
13	内存不足。 在没有足够内存执行指定的操作时返回此代码。
14	无效停止时间。 在指定的停止时间已发生时返回此代码。
15	参数无效。 在用户已提供不兼容的参数时返回此代码。
*/
declare @rc int
declare @TraceID int
-- 生成的跟踪文件最大大小（MB），默认值为 5
declare @maxfilesize bigint 

-- 指定跟踪将写入的位置和文件名。
-- 例如c:\MyFolder\MyTrace\test 
-- SQL Server 会将 .trc 扩展名追加到所有跟踪文件名
declare @tracefile nvarchar(245) 

set @maxfilesize = 5 

exec @rc = sp_trace_create @TraceID output, 0, @tracefile, @maxfilesize, NULL 
if (@rc != 0) 
begin
	select ErrorCode=@rc
	return
end
```
### 2.2. 在跟踪中添加事件或事件列

> 注意：下列事件模板为 **SQL执行耗时跟踪**。可根据实际情况增删事件或事件列。
> 	详细事件ID和事件列ID见：[MSDN文档： sp_trace_setevent (Transact-SQL) ](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-stored-procedures/sp-trace-setevent-transact-sql?view=sql-server-ver15)

```sql
/**********************************/ 
/* 2 在跟踪中添加事件或事件列       */
/* 注意：下列事件模板为 SQL执行耗时跟踪   */
/**********************************/
declare @on bit
set @on = 1
exec sp_trace_setevent @TraceID, 10, 10, @on
exec sp_trace_setevent @TraceID, 10, 3, @on
exec sp_trace_setevent @TraceID, 10, 8, @on
exec sp_trace_setevent @TraceID, 10, 12, @on
exec sp_trace_setevent @TraceID, 10, 13, @on
exec sp_trace_setevent @TraceID, 10, 14, @on
exec sp_trace_setevent @TraceID, 10, 15, @on
exec sp_trace_setevent @TraceID, 10, 16, @on
exec sp_trace_setevent @TraceID, 10, 17, @on
exec sp_trace_setevent @TraceID, 10, 18, @on
exec sp_trace_setevent @TraceID, 10, 31, @on
exec sp_trace_setevent @TraceID, 10, 35, @on
exec sp_trace_setevent @TraceID, 10, 48, @on
exec sp_trace_setevent @TraceID, 12, 1, @on
exec sp_trace_setevent @TraceID, 12, 3, @on
exec sp_trace_setevent @TraceID, 12, 8, @on
exec sp_trace_setevent @TraceID, 12, 10, @on
exec sp_trace_setevent @TraceID, 12, 12, @on
exec sp_trace_setevent @TraceID, 12, 13, @on
exec sp_trace_setevent @TraceID, 12, 14, @on
exec sp_trace_setevent @TraceID, 12, 15, @on
exec sp_trace_setevent @TraceID, 12, 16, @on
exec sp_trace_setevent @TraceID, 12, 17, @on
exec sp_trace_setevent @TraceID, 12, 18, @on
exec sp_trace_setevent @TraceID, 12, 31, @on
exec sp_trace_setevent @TraceID, 12, 35, @on
exec sp_trace_setevent @TraceID, 12, 48, @on
```
### 2.3. 设置跟踪的过滤条件

```sql
/**********************************/ 
/* 3 设置跟踪的过滤条件	          */
/**********************************/

/* 比较的类型
值	比较运算符
0	= (等于)
1	<> (不等于)
2	>（大于）
3	< (小于)
4	>= (大于或等于)
5	<= (小于或等于)
6	LIKE
7	不类似于
*/
declare @operator int 
set @operator = 0
-- 数据库名
exec sp_trace_setfilter @TraceID, 35, @operator, 6, N'test'
```
### 2.4. 启动跟踪

```sql
/**********************************/ 
/* 4 启动跟踪	          */
/**********************************/

/*状态	说明
0	停止指定的跟踪。
1	启动指定的跟踪。
2	关闭指定的跟踪并从服务器中删除其定义。
*/
exec sp_trace_setstatus @TraceID, 1

select TraceID=@TraceID
```
### 2.5. 停止跟踪

```sql
/**********************************/ 
/* 5 停止跟踪          */
/**********************************/
/*状态	说明
0	停止指定的跟踪。
1	启动指定的跟踪。
2	关闭指定的跟踪并从服务器中删除其定义。
*/
exec sp_trace_setstatus @TraceID, 0
exec sp_trace_setstatus @TraceID, 2
```
### 2.6. 查询跟踪信息

```sql
/**********************************/ 
/* 附录 查询正在运行的跟踪          */
/**********************************/

/*  参数： 
	指定 NULL、0 或 DEFAULT 可返回 SQL Server 实例中所有跟踪的信息

	返回的表：
	列名称	 数据类型	 说明
	traceid	 int	跟踪的 ID。
	property int	跟踪的属性：
					1= 跟踪选项。 有关详细信息，请 @options 参阅 (transact-sql)sp_trace_create
					2 = 文件名
					3 = 最大大小
					4 = 停止时间
					5 = 当前跟踪状态。 0 = 停止。 1 = 正在运行。
	value sql_variant	有关指定跟踪的属性的信息。
*/

SELECT * FROM sys.fn_trace_getinfo(@TraceID)
```
