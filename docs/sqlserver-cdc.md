> 📃版本: 1.5
>
> 📆日期: 2021-11-02



#  SQL Server 变更数据捕获（CDC） #

# 1. CDC  简介

变更数据捕获 (CDC) 可记录应用于 SQL Server 表的插入、更新和删除活动。

变更数据捕获(CDC)的`捕获数据源`为 `SQL Server 事务日志`

流程图

![变更数据捕获数据流](/images/sqlserver-cdc/cdcdataflow.gif)



- 在将插入、更新和删除应用于跟踪的`源表`时，将会在日志中添加说明这些更改的项。 
- `捕获进程`会读取日志，并在跟踪的表的关联`更改表`中添加有关更改的信息。 
- 系统将提供一些`函数`，以枚举在更改表中指定范围内发生的更改，并以筛选的结果集的形式返回该值。
> **引用**
>
> [变更数据捕获(CDC) MSDN](https://docs.microsoft.com/zh-cn/sql/relational-databases/track-changes/about-change-data-capture-sql-server?view=sql-server-ver15)
---
# 2. 准备工作

## 2.1 创建CDC文件组

为了性能最大化，建议将更改表置于独立于源表的文件组中，并放置在不同的磁盘上。 

``` sql
USE master
GO

-- 创建文件组 CDCFG
ALTER DATABASE AdventureWorks2016
ADD FILEGROUP CDCFG
GO

-- 添加文件 CDCdat1 到 文件组 CDCFG
ALTER DATABASE AdventureWorks2016
ADD FILE
(
    NAME = CDCdat1,
    FILENAME = 'G:\Program Files\Microsoft SQL Server\MSSQL13.SQL16\MSSQL\DATA\CDCdat1.ndf',
    SIZE = 5MB,
    MAXSIZE = UNLIMITED,
    FILEGROWTH = 10%
)
TO FILEGROUP CDCFG;
GO
```

## 2.2 启动SQL Server代理服务

[启动、停止或暂停 SQL Server 代理服务](https://docs.microsoft.com/zh-cn/sql/ssms/agent/start-stop-or-pause-the-sql-server-agent-service?view=sql-server-ver15)

> **注意**
>
> 对表启用变更数据捕获时，SQL Server 代理不必正在运行。 但是，**<u>只有当 SQL Server 代理正在运行时，捕获进程才会处理事务日志并将条目写入更改表。</u>**

## 2.3 检查当前数据库的所有者

启用CDC前，需要先检查当前数据库的所有者，若为`null`或者非`sa`用户时，则建议将所有者更改为登录名`sa`。	

否则后续开启CDC操作可能失败。

```sql
SELECT d.name, d.owner_sid, sl.name
FROM sys.databases AS d
	left JOIN sys.sql_logins AS sl
		ON d.owner_sid = sl.sid;
		
/* 结果
name                owner_sid                         name
------------------- --------------------------------- -----------------------------
master              0x01                              sa
tempdb              0x01                              sa
model               0x01                              sa
msdb                0x01                              sa
AdventureWorks2016  0x010500000000000515000           NULL
*/

-- AdventureWorks2016 name(所有者)为NULL（空）
-- 将所有者变更更改为登录名sa
USE [AdventureWorks2016]
GO
ALTER AUTHORIZATION ON DATABASE::[AdventureWorks2016] TO [sa]
GO
```

---

# 3. 启用更改数据捕获（CDC）流程

## 3.1 数据库启用CDC

为数据库启用“更改数据捕获”，通过 [sys.sp_cdc_enable_db (MSDN Transact-SQL)](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-stored-procedures/sys-sp-cdc-enable-db-transact-sql?view=sql-server-ver15) 存储过程实现：

``` sql	
USE AdventureWorks2016  
GO  

-- 对当前数据库启用变更数据捕获
-- 注意：无法在 系统数据库 或分发数据库上启用变更数据捕获。
-- is_cdc_enabled：是否已启用CDC
IF NOT EXISTS( SELECT  1 FROM sys.databases WHERE name = 'AdventureWorks2016' and is_cdc_enabled  = 1 )
BEGIN
	-- 返回代码值 
	-- 0（成功）或 1（失败） 
	EXEC sys.sp_cdc_enable_db 
END
GO
```

当对数据库成功启用了变更数据捕获之后：

- 如果数据库还原到其他服务器，默认情况下将禁用变更数据捕获，并删除所有相关的元数据。

  若要保留变更数据捕获，请在还原数据库时使用 **KEEP_CDC** 选项。

- 将 `sys.databases`目录视图中的数据库条目的 is_cdc_enabled 列设置为1
- 并将为数据库创建以下对象：

|                           元数据表                           |                          DDL 触发器                          |                      cdc schema（架构）                      |                        cdc 数据库用户                        |
| :----------------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
| ![](/images/sqlserver-cdc/E48E7325.png) | ![](/images/sqlserver-cdc/33EB10F7.png) | ![](/images/sqlserver-cdc/5E20673A.png) | ![](/images/sqlserver-cdc/970FAF5E.png) |

- 即使恢复模式设置为简单恢复，日志截断点也不会向前推进，直到为捕获标记的所有更改都已由捕获进程收集为止。 如果捕获进程未运行且有要收集的更改，执行 CHECKPOINT 将不会截断日志。

## 3.2 表启用CDC

​		对表启用变更数据捕获时，应用于此表的每个数据操纵语言 (DML) 操作的记录都将写入事务日志中。 变更数据捕获进程将从日志中检索此信息，并将其写入更改表中。

通过[sys.sp_cdc_enable_table](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-stored-procedures/sys-sp-cdc-enable-table-transact-sql?view=sql-server-ver15)存储过程实现：

```sql
USE AdventureWorks2016;  
GO  
-- 创建一个捕获实例
EXEC sys.sp_cdc_enable_table  
    @source_schema = N'HumanResources'  -- 源表所属的架构的名称(默认dbo)
  , @source_name = N'Department'  		-- 源表的名称
  , @role_name = null  -- 用于访问更改数据的数据库角色的名称,null则不限制访问。
  , @capture_instance = null -- 捕获实例的名称, null则按源架构名称加上 schemaname_sourcename 格式生成。（例如HumanResources_Department） 
  , @supports_net_changes = 1  -- 是否为此捕获实例启用用于查询净更改的支持。
  , @index_name = null -- 用于唯一标识源表中的行的唯一索引的名称, null则取主键。
  , @captured_column_list = null -- 标识要捕获的源表列（逗号隔开‘ID,Code,Name’），NULL则所有列都将捕获。
  , @filegroup_name = N'CDCFG';  
GO  

/* 执行结果
消息
作业 'cdc.AdventureWorks2016_capture' 已成功启动。
作业 'cdc.AdventureWorks2016_cleanup' 已成功启动。
*/
```

当对表启用变更数据捕获成功之后会修改或创建以下内容：

### 3.2.1 捕获实例

创建一个捕获实例，可以使用 [sys.sp_cdc_help_change_data_capture](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-stored-procedures/sys-sp-cdc-help-change-data-capture-transact-sql?view=sql-server-ver15)存储过程来检索此信息。

```sql
USE AdventureWorks2016;  
GO  
-- 返回 HumanResources.Department 表的变更数据捕获实例配置。
EXECUTE sys.sp_cdc_help_change_data_capture   
    @source_schema = N'HumanResources',   
    @source_name = N'Department';  
GO  
-- 返回 所有启用表的变更数据捕获实例配置。
EXECUTE sys.sp_cdc_help_change_data_capture;  
GO
```



### 3.2.2 `sys.tables`视图

更新`sys.tables`视图的表条目中的`is_tracked_by_cdc` 列为1.



### 3.2.3 更改表

创建更改表`cdc.HumanResources_Department_CT`，

变更表是关联`捕获实例`的，命名方式为：<捕获实例名称>_CT。

![](/images/sqlserver-cdc/3CE944AD.png)



### 3.2.4 查询函数

创建查询函数

- 查询所有更改函数：`cdc.fn_cdc_get_all_changes_HumanResources_Department`

  命名方式为：[cdc.fn_cdc_get_all_changes_<捕获实例名称>](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-functions/cdc-fn-cdc-get-all-changes-capture-instance-transact-sql?view=sql-server-ver15#examples)

  ​	返回指定的时间间隔内出现的所有更改表项。

- 查询Net changes（净更改函数） 函数：`cdc.fn_cdc_get_net_changes_HumanResources_Department`

  ​    命名方式为：[cdc.fn_cdc_get_net_changes_<捕获实例名称>](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-functions/cdc-fn-cdc-get-net-changes-capture-instance-transact-sql?view=sql-server-ver15)

  ​	 Net changes 函数的创建取决于`捕获示例`新建时的`supports_net_changes`属性。

  ​	返回指定的时间间隔内发生更改的每个非重复行，此函数仅返回一项更改

![](/images/sqlserver-cdc/89548E8B.png)



### 3.2.5 元数据表

在**cdc.change_tables**，**cdc.index_columns**，**cdc.captured_columns** 元数据表中插入信息。



### 3.2.6 代理作业

首次启动表启用变更数据捕获时，会创建两个关联数据库的SQL Server代理作业。捕获和清除作业都是使用默认参数创建的。  

​		![](/images/sqlserver-cdc/D874E031.png)

- 捕获更改表作业（capture）

  捕获作业会立即启动。 它连续运行，每个扫描周期最多可处理 1000 个事务，并在两个周期之间停顿 5 秒钟。

- 清除更改表作业（cleanup）

  清除作业在每天凌晨 2 点运行一次。 它将更改表项保留三天（4320 分钟），使用单个删除语句最多可删除 5000 项。

修改作业：[sys.sp_cdc_change_job](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-stored-procedures/sys-sp-cdc-change-job-transact-sql?view=sql-server-ver15)

```sql
USE AdventureWorks2016;  
GO  
-- 修改捕获作业
EXECUTE sys.sp_cdc_change_job   
    @job_type = N'capture',  -- 作业的类型
    @maxscans = 1000,  -- 从日志中提取所有行而要执行的扫描周期的最大数目
    @maxtrans = 15，  -- 每个扫描循环中要处理的最大事务数
    @pollinginterval = 5， -- 扫描间隔（秒）
    @continuous = 1； -- 1循环运行，0只运行一次
GO  
-- 修改清楚作业
EXECUTE sys.sp_cdc_change_job   
    @job_type = N'cleanup', -- 作业的类型
    @retention = 2880;  -- 更改行要在更改表中保留的分钟数
GO  
```

查询作业：[sys.sp_cdc_help_jobs  ](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-stored-procedures/sys-sp-cdc-help-jobs-transact-sql?view=sql-server-ver15)或直接查询[dbo.cdc_jobs](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-tables/dbo-cdc-jobs-transact-sql?view=sql-server-ver15) 表

```sql
USE AdventureWorks2016;  
GO  
-- 查询作业.
EXEC sys.sp_cdc_help_jobs;  
GO  
```

启动作业：[sys.sp_cdc_start_job](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-stored-procedures/sys-sp-cdc-start-job-transact-sql?view=sql-server-ver15)

```sql
USE AdventureWorks2012;  
GO  
-- 启动捕获作业，可以不指定 job_type 的值，因为默认作业类型为 " 捕获"。
EXEC sys.sp_cdc_start_job
	@job_type = N'capture';  
GO  
-- 启动清除作业。
EXEC sys.sp_cdc_start_job 
	@job_type = N'cleanup';  
GO  
```

停止作业：[sys.sp_cdc_stop_job](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-stored-procedures/sys-sp-cdc-stop-job-transact-sql?view=sql-server-ver15)

```sql
USE AdventureWorks2012;  
GO  
-- 停止捕获作业。
EXEC sys.sp_cdc_stop_job @job_type = N'capture';  
GO  
-- 停止清除作业。
EXEC sys.sp_cdc_stop_job @job_type = N'cleanup';  
GO  
```



> 注意
>
> 修改作业后，需要重启作业后才会生效。
>
> 启动和停止捕获作业并不会造成更改数据丢失。 可以在高峰需求时段禁止扫描日志以免增加负载。
>
> 数据库引擎服务或 SQL Server 代理服务在 NETWORK SERVICE 帐户下运行时，变更数据捕获无法正常工作。 这可能导致错误 22832。



## 3.3 禁用数据库变更数据捕获(CDC)

  数据库禁用变更数据捕获，将同时删除所有关联的变更数据捕获元数据（括 **cdc** 用户、架构和变更数据捕获作业）。所以不必先禁用各个表。

  ```sql
  -- 禁用数据库变更数据捕获
  USE AdventureWorks2016  
  GO  
  EXEC sys.sp_cdc_disable_db  
  GO  
  ```

## 3.4 禁用表变更数据捕获

- 如果删除了启用变更数据捕获的表，则会自动删除与该表关联的变更数据捕获元数据。
- 如果在禁用发生后没有对数据库启用任何表，则还会删除变更数据捕获作业。

```sql
USE AdventureWorks2016  
GO  
EXEC sys.sp_cdc_disable_table  
@source_schema = N'dbo',  
@source_name   = N'MyTable',  
@capture_instance = N'dbo_MyTable'  
GO  
```

## 3.5 监视CDC状态

- [sys.dm_cdc_log_scan_sessions](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-dynamic-management-views/change-data-capture-sys-dm-cdc-log-scan-sessions?view=sql-server-ver15)

  自 SQL Server 服务最后一次启动以来，日志扫描会话的状态信息。每个日志扫描会话记录一行，最后一行表示当前会话。

  ```sql
  SELECT session_id, start_time, end_time, duration, scan_phase,  
      error_count, start_lsn, current_lsn, end_lsn, tran_count,  
      last_commit_lsn, last_commit_time, log_record_count, schema_change_count,  
      command_count, first_begin_cdc_lsn, last_commit_cdc_lsn,   
      last_commit_cdc_time, latency, empty_scan_count, failed_sessions_count  
  FROM sys.dm_cdc_log_scan_sessions  
  WHERE session_id = (SELECT MAX(b.session_id) FROM sys.dm_cdc_log_scan_sessions AS b);  
  GO  
  ```

- [sys.dm_cdc_errors](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-dynamic-management-views/change-data-capture-sys-dm-cdc-errors?view=sql-server-ver15)

  变更数据捕获日志扫描会话中遇到的每个错误返回一行。

  ```sql
  SELECT * FROM sys.dm_cdc_errors
  ```

  

# 4 扩展

##  4.1 元数据表

### [cdc.change_tables](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-tables/cdc-change-tables-transact-sql?view=sql-server-ver15)

为数据库中的每个更改表返回一行。 对源表启用变更数据捕获时，将创建一个更改表。

不要直接**查询系统表cdc.change_tables**， 请改为执行 [sys.sp_cdc_help_change_data_capture](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-stored-procedures/sys-sp-cdc-help-change-data-capture-transact-sql?view=sql-server-ver15) 存储过程。

| **cdc.change_tables**（部分列） |              |                                                              |
| ------------------------------- | ------------ | ------------------------------------------------------------ |
| **列名称**                      | **数据类型** | **说明**                                                     |
| object_id                       | int          | 更改表的 ID。在数据库中是唯一的。                            |
| source_object_id                | int          | 更改表的源表的 ID。                                          |
| capture_instance                | sysname      | 用于命名特定于实例的跟踪对象的捕获实例的名称。 默认情况下，该名称从源架构名称加上源表名称派生，格式 *schemaname_sourcename*。 |
| has_drop_pending                | bit          | 捕获进程收到关于源表已被删除的通知。                         |
| filegroup_name                  | sysname      | 更改表所驻留的文件组的名称。NULL = 更改表在数据库的默认文件组中。 |
| create_date                     | datetime     | 启用源表的日期。                                             |
| partition_switch                | bit          | 指示是否可以对启用了变更数据捕获的表执行 **ALTER TABLE** 的 **SWITCH PARTITION** 命令。 0 指示分区切换被阻止。 未分区表始终返回 1。 |



### [cdc.captured_columns](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-tables/cdc-captured-columns-transact-sql?view=sql-server-ver15)

**为在捕获实例中跟踪的每一列返回一行。** 默认情况下，为捕获源表中的所有列。

不要 **直接查询系统表cdc.captured_columns**。 请改为执行 [sys.sp_cdc_get_source_columns](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-stored-procedures/sys-sp-cdc-get-captured-columns-transact-sql?view=sql-server-ver15) 存储过程。

| **cdc.captured_columns** |              |                                                              |
| ------------------------ | ------------ | ------------------------------------------------------------ |
| **列名称**               | **数据类型** | **说明**                                                     |
| object_id                | int          | 捕获的列所属的更改表的 ID。                                  |
| column_name              | sysname      | 捕获的列的名称。                                             |
| column_id                | int          | 捕获的列在源表内的 ID。                                      |
| column_type              | sysname      | 捕获的列的类型。                                             |
| column_ordinal           | int          | 更改表中的列序号（从 1 开始）。 将排除更改表中的元数据列。 序号 1 将分配给捕获到的第一个列。 |
| is_computed              | bit          | 表示捕获到的列是源表中计算所得的列。                         |



### [cdc.ddl_history](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-tables/cdc-ddl-history-transact-sql?view=sql-server-ver15)

**为对启用了变更数据捕获的表所做的每一项数据定义语言 (DDL) 更改返回一行**。 可以使用此表来确定源表发生 DDL 更改的时间以及更改的内容。 此表中不包含未发生 DDL 更改的源表的任何条目。

不要**直接查询系统表cdc.ddl_history**， 请改为执行 [sys.sp_cdc_get_ddl_history](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-stored-procedures/sys-sp-cdc-get-ddl-history-transact-sql?view=sql-server-ver15) 存储过程。

| cdc.ddl_history        |               |                                                              |
| :--------------------- | :------------ | :----------------------------------------------------------- |
| **列名称**             | **数据类型**  | **说明**                                                     |
| source_object_id       | int           | 应用 DDL 更改的源表的 ID。                                   |
| object_id              | int           | 与源表的捕获实例相关联的更改表的 ID。                        |
| required_column_update | bit           | 指示在源表中修改了捕获列的数据类型。 此修改改变了更改表中的列。 |
| ddl_command            | nvarchar(max) | 应用于源表的 DDL 语句。                                      |
| ddl_lsn                | binary(10)    | 与 DDL 修改的提交相关联的日志序列号 (LSN)。                  |
| ddl_time               | datetime      | 对源表所做的 DDL 更改的日期和时间。                          |



### [cdc.index_columns](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-tables/cdc-index-columns-transact-sql?view=sql-server-ver15)

**为与更改表关联的每个索引列返回一行。变更数据捕获使用这些索引列来唯一标识源表中的行。**

默认情况下，将包括源表的主键列。 但是，如果在对源表启用变更数据捕获时指定了源表的唯一索引，则将改用该索引中的列。 如果启用净更改跟踪，则该源表需要主键或唯一索引。

不要直接查询系统表， 请改为执行 [sys.sp_cdc_help_change_data_capture](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-stored-procedures/sys-sp-cdc-help-change-data-capture-transact-sql?view=sql-server-ver15) 存储过程。

| cdc.index_columns |              |                               |
| :---------------- | :----------- | :---------------------------- |
| **列名称**        | **数据类型** | **说明**                      |
| object_id         | int          | 更改表的 ID。                 |
| column_name       | sysname      | 索引列的名称。                |
| index_ordinal     | tinyint      | 索引中的列序号（从 1 开始）。 |
| column_id         | int          | 源表中的列 ID。               |



### [cdc.lsn_time_mapping](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-tables/cdc-lsn-time-mapping-transact-sql?view=sql-server-ver15)

**为每个在更改表中存在行的事务返回一行。** 

该表用于在日志序列号 (LSN) 提交值和提交事务的时间之间建立映射。 没有对应的更改表项的项也可以记录下来， 以便表在变更活动少或者无变更活动期间将 LSN 处理的完成过程记录下来。

不要直接查询系统表， 请改为执行 

[sys.fn_cdc_map_lsn_to_time (transact-sql)](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-functions/sys-fn-cdc-map-lsn-to-time-transact-sql?view=sql-server-ver15) 或 [sys.fn_cdc_map_time_to_lsn (transact-sql)](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-functions/sys-fn-cdc-map-time-to-lsn-transact-sql?view=sql-server-ver15) 系统函数。

| cdc.lsn_time_mapping |                |                               |
| :------------------- | :------------- | :---------------------------- |
| 列名称               | 数据类型       | 说明                          |
| start_lsn            | binary(10)     | 提交的事务的 LSN。            |
| tran_begin_time      | datetime       | 与 LSN 关联的事务开始的时间。 |
| tran_end_time        | datetime       | 事务结束的时间。              |
| tran_id              | varbinary (10) | 事务的 ID。                   |



### systranschemas

**Systranschemas** 表用于跟踪事务发布和快照发布中发布的项目中的架构更改。 此表存储在发布数据库和订阅数据库中

| systranschemas  |          |                              |
| :-------------- | :------- | :--------------------------- |
| 列名称          | 数据类型 | 说明                         |
| tabid           | int      | 标识发生了架构更改的表项目。 |
| startlsn 时发生 | binary   | 架构更改开始时的 LSN 值。    |
| endlsn          | binary   | 架构更改结束时的 LSN 值。    |
| typeid          | int      | 架构更改的类型。             |

### 更改表（xxxx_CT）

**更改表充当捕获进程从事务日志中提取的源表更改的存储库。**

变更数据捕获更改表的前五列是元数据列。 这些列提供与记录的更改有关的附加信息。 其余列镜像源表中按名称标识的捕获列（通常还会按类型进行标识）。 这些列保存从源表中收集的捕获列数据。

例如：

![](/images/sqlserver-cdc/6F740C70.png)

| systranschemas  |          |                              |
| :-------------- | :------- | :--------------------------- |
| 列名称          | 数据类型 | 说明                         |
| __$start_lsn    | binary | 更改指定的提交日志序列号 (LSN)。提交 LSN 不仅标识在同一事务中提交的更改，而且还对这些事务进行排序。 |
| __$end_lsn | binary   |                                                              |
| __$seqval          | binary   | 同一事务中进行的更改排序    |
| __$operation          | int      | 更改相关的操作：1 = 删除、2 = 插入、3 = 更新（前映象）、4 = 更新（后映像）。             |
| __$update_mask  | varbinary |一个可变的位掩码，每个捕获列都有一个对应的定义位。 对于插入和删除项，更新掩码始终设定所有位。 但是，更新行仅设定与更改列对应的那些位								|
| 捕获源表的列... | ... | ... |



## 4.2 数据定义语言（DDL）

  **SQL语言集中负责数据结构定义与数据库对象定义的语言，由CREATE、ALTER与DROP三个语法所组成。**

- CREATE DATABASE
- ALTER DATABASE
- CREATE TABLE
- ALTER TABLE
- CREATE INDEX
- DROP INDEX
- ...

##  4.3 数据操纵语言（DML) 

​	INSERT、UPDATE、DELETE三种指令。

## 4.4 捕获实例

- 在为源表启用变更数据捕获后，会忽略源表的任何新列。 如果删除了某个跟踪的列，则会为在后续更改项中为该列提供 Null 值。但是，如果源表列的数据类型发生了更改，则这种更改会传播到更改表中。

- 可同时与单个源表相关联的最大捕获实例数为两个。
