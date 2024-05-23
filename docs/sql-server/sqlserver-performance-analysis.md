# SQL Server 性能分析

## 1 索引

索引的碎片率高或索引缺失都有可能造成SQL Server引擎的CPU使用率高。

### 1.1. 查询索引的情况

```sql
USE [输入数据库名]

declare @database_id smallint,
		@table_id int,
		@mode nvarchar(200)
        
--*** 输入参数 ***--

set @database_id = DB_ID('指定数据库名或空字符串') 	-- 指定数据库名或空字符串。
set @table_id = OBJECT_ID('') 	-- 指定表名，空字符串则为所有表。
set @mode = 'SAMPLED' 	-- 获取统计信息的扫描级别: LIMITED(轻量), SAMPLED（抽样）, DETAILED（详细）

--*** 输入参数 ***--

select 
	DB_NAME(d.database_id) as [数据库],
	OBJECT_NAME(d.object_id) as [表],
    i.name as [索引名称],
	case d.index_type_desc 
		when 'CLUSTERED INDEX' then '聚集索引'
		when 'NONCLUSTERED INDEX' then '非聚集'
		when 'HEAP' then '堆'
		else d.index_type_desc end as [索引类型],
    d.avg_fragmentation_in_percent as [碎片(%)],
    d.avg_page_space_used_in_percent as [平均页面密度(%)],
    i.fill_factor as [填充因子]
from 
sys.dm_db_index_physical_stats( @database_id, @table_id, DEFAULT, DEFAULT, @mode) d
       left join sys.indexes i on 
              i.object_id = d.object_id and 
              i.index_id = d.index_id
where d.index_id > 0
order by d.avg_fragmentation_in_percent desc, d.object_id, d.database_id

GO

```
 **执行结果** 

![执行结果](/images/sqlserver-performance-analysis/indexinformation.jpg "索引情况.png")

### 1.2. 重新生成或重新组织索引

::: warning
- 重新生成或重新组织小型行存储索引可能不会减少碎片。
- 收缩数据库后，可能产生索引碎片。
:::

```sql{9-11}
-- 以下示例将自动重新组织或重新生成数据库中平均碎片超过 10％ 的所有分区。
DECLARE @fragment float,
		@database_id smallint,
    @dataBase_name nvarchar(20)

/********请先修改参数***********
 *↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/

USE [这里写数据库名称]  -- 这里写数据库名称
set @dataBase_name = '这里写数据库名称' -- 这里写数据库名称
set @fragment = 10 -- 碎片百分比，大于此数值的索引将执行重建。

/*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*
*********** 请先修改参数******/

set @database_id = DB_ID(@dataBase_name)
IF @database_id = 0 or @database_id is null
BEGIN
	PRINT '执行失败:[@dataBase_name](数据库名称)参数值无效!'
	return
END
 
SET NOCOUNT ON;  
DECLARE @tagid int;
DECLARE @objectid int;  
DECLARE @indexid int;  
DECLARE @partitioncount bigint;  
DECLARE @schemaname nvarchar(130);   
DECLARE @objectname nvarchar(130);   
DECLARE @indexname nvarchar(130);   
DECLARE @partitionnum bigint;  
DECLARE @partitions bigint;  
DECLARE @frag float;  
DECLARE @command nvarchar(4000);   
DECLARE @indexcount int;
-- Conditionally select tables and indexes from the sys.dm_db_index_physical_stats function   
-- and convert object and index IDs to names.  
SELECT  
	identity(int,1,1) AS tagid,
    object_id AS objectid,  
    index_id AS indexid,  
    partition_number AS partitionnum,  
    avg_fragmentation_in_percent AS frag  
INTO #work_to_do  
FROM sys.dm_db_index_physical_stats (@database_id, NULL, NULL , NULL, 'LIMITED')  
WHERE avg_fragmentation_in_percent > @fragment
	AND index_id > 0;  

SELECT @indexcount = COUNT(*) 
FROM #work_to_do
SET @indexcount = ISNULL( @indexcount, 0 )
PRINT '待重建索引数：' + CAST(@indexcount as NVARCHAR(200))

-- Select * From #work_to_do
-- Declare the cursor for the list of partitions to be processed.  
DECLARE partitions CURSOR FOR SELECT * FROM #work_to_do;  
  
-- Open the cursor.  
OPEN partitions;  
  
-- Loop through the partitions.  
WHILE (1=1)  
    BEGIN;  
        FETCH NEXT  
           FROM partitions  
           INTO @tagid, @objectid, @indexid, @partitionnum, @frag;  
        IF @@FETCH_STATUS < 0 BREAK;  
        SELECT @objectname = QUOTENAME(o.name), @schemaname = QUOTENAME(s.name)  
        FROM sys.objects AS o  
        JOIN sys.schemas as s ON s.schema_id = o.schema_id  
        WHERE o.object_id = @objectid;  
        SELECT @indexname = QUOTENAME(name)  
        FROM sys.indexes  
        WHERE  object_id = @objectid AND index_id = @indexid;  
        SELECT @partitioncount = count (*)  
        FROM sys.partitions  
        WHERE object_id = @objectid AND index_id = @indexid;  
  
-- 30是在重组和重建之间切换的决策点。  
        IF @frag < 30.0  
            SET @command = N'ALTER INDEX ' + @indexname + N' ON ' + @schemaname + N'.' + @objectname + N' REORGANIZE';  
        IF @frag >= 30.0  
            SET @command = N'ALTER INDEX ' + @indexname + N' ON ' + @schemaname + N'.' + @objectname + N' REBUILD';  
        IF @partitioncount > 1  
            SET @command = @command + N' PARTITION=' + CAST(@partitionnum AS nvarchar(10));  
        EXEC (@command);  
        PRINT CAST(@tagid as NVARCHAR(200)) + '/' + CAST(@indexcount as NVARCHAR(200)) + N' Executed: ' + @command;
    END;  
  
-- Close and deallocate the cursor.  
CLOSE partitions;  
DEALLOCATE partitions;  
  
-- Drop the temporary table.  
DROP TABLE #work_to_do;  
GO
```
### 1.3. 查找缺失索引组的缺失索引及其列详细信息

::: warning
 `sys.dm_db_missing_index_group_stats`记录的使用情况统计信息。
 - 由每次查询执行更新，而不是每次查询编译或重新编译更新。 
 - 使用情况统计信息不会持久保存，重新启动数据库引擎后会重置。 如果要保留使用情况统计信息，则应该定期制作缺失索引信息的备份副本。

有关详细信息，请参阅[与索引相关的动态管理视图和函数](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-dynamic-management-views/index-related-dynamic-management-views-and-functions-transact-sql?view=sql-server-ver15)

相关章节：[查询上次数据库引擎启动时间](#_5-1-查询sql-server启动时间)
:::

```sql
/* 查找缺失索引组的缺失索引及其列详细信息
   此 DMV 的结果集限制为600行。 每一行都包含一个缺失索引。 如果缺少超过600个索引
*/
SELECT
  -- DMV 信息
  gStats.avg_total_user_cost * (gStats.avg_user_impact / 100.0) *(gStats.user_seeks + gStats.user_scans) AS 实现索引的收益指数,
  gStats.avg_total_user_cost AS 缺失索引的查询成本, -- 可通过组中的索引减少的用户查询的平均成本
  gStats.avg_user_impact AS [实现索引 用户的收益（%）], -- 实现此缺失索引组后，用户查询可能获得的平均百分比收益
  gStats.avg_system_impact AS [实现索引 系统的收益（%）], -- 实现此缺失索引组后，系统查询可能获得的平均百分比收益。
  gStats.user_seeks AS 查找次数, -- 由可能使用了组中建议索引的用户查询所导致的查找次数
  gStats.user_scans AS 扫描次数, -- 由可能使用了组中建议索引的用户查询所导致的扫描次数

  i.database_id AS 数据库ID, 
  DB_NAME( i.database_id ) AS 数据库,
  i.[object_id] AS 缺失索引的表ID,
  OBJECT_NAME( i.[object_id], i.database_id ) AS 缺失索引的表,

  -- 创建索引的SQL语句
  'CREATE INDEX [IX_' + OBJECT_NAME( i.[object_id], i.database_id ) + '_' + CONVERT (varchar, g.index_group_handle) + '_' + CONVERT (varchar, i.index_handle) 
  +  ']'
  + ' ON ' + i.statement
  + ' (' + ISNULL (i.equality_columns,'')
  + CASE WHEN i.equality_columns IS NOT NULL AND i.inequality_columns IS NOT 
NULL THEN ',' ELSE '' END
  + ISNULL (i.inequality_columns, '')
  + ')'
  + ISNULL (' INCLUDE (' + i.included_columns + ')', '') AS [创建索引的SQL语句]

FROM sys.dm_db_missing_index_groups g -- 缺失索引组（一个索引组仅包含一个索引）
       INNER JOIN sys.dm_db_missing_index_group_stats gStats ON -- 缺失索引组的摘要信息
               gStats.group_handle = g.index_group_handle
       INNER JOIN sys.dm_db_missing_index_details i ON  -- 缺失索引的详细信息
              g.index_handle = i.index_handle
-- where i.database_id = DB_ID( '指定数据库' )
ORDER BY gStats.avg_total_user_cost * gStats.avg_user_impact * (gStats.user_seeks + gStats.user_scans) DESC
```
### 1.4 指定索引的填充因子

当创建/重新生成索引时，`填充因子`的值可确定每个叶级页上要填充数据的空间百分比。

`填充因子`的值是 1 到 100 之间的百分比（0 和 100 是相同的），服务器范围的默认值为 0。

例如：

- 指定`填充因子`的值为 80 表示每个叶级页上保留 20% 可用空间（可用空间在索引行之间保留，而不是在索引的末尾保留），以便随着向基础表中添加数据而为扩展索引提供空间。 

- 指定`填充因子`的值为 0或100，则表示将完全填充叶级页。

`填充因子`的值建议：

- 如果新数据在表中均匀分布，则设置 0 到 100 之间对性能有利。
- 如果新数据都添加到表的末尾，则设置0或100对性能有利。

::: warning
在许多工作负载中，提高页面密度会比减少碎片更能提升性能。

为避免在不必要的情况下降低页面密度，Microsoft 不建议将填充因子设置为 100 或 0 以外的值，除非索引遇到大量[页面拆分](https://docs.microsoft.com/zh-cn/sql/relational-databases/indexes/specify-fill-factor-for-an-index?view=sql-server-ver15#page-splits)，例如，包含非顺序 GUID 值的前导列并且频繁修改的索引。
::: 

```sql
USE [数据库名];  
GO  

-- 重新生成索引
ALTER INDEX IX_Employee ON HumanResources.Employee  
REBUILD WITH (FILLFACTOR = 80);   
GO
-- 创建索引
CREATE INDEX IX_Employee ON HumanResources.Employee(OrganizationLevel, OrganizationNode)   
WITH (DROP_EXISTING = ON, FILLFACTOR = 80);   
GO  
```

有关详细信息，请参阅[为索引指定填充因子 MSDN](https://docs.microsoft.com/zh-cn/sql/relational-databases/indexes/specify-fill-factor-for-an-index?view=sql-server-ver15)

### 1.5 查询表的所有索引和索引列

```sql
USE [数据库名];  
GO  
SELECT i.name AS [索引]  
    ,COL_NAME(ic.object_id,ic.column_id) AS [索引列]  
    ,ic.index_column_id  
    ,ic.key_ordinal AS [索引列的序号]
    ,ic.is_included_column AS [索引列是否属包含列]
FROM sys.indexes AS i  
INNER JOIN sys.index_columns AS ic
    ON i.object_id = ic.object_id AND i.index_id = ic.index_id  
WHERE i.object_id = OBJECT_ID('SMInvoiceDetail'); --  表名
```

> 有关详细信息，请参阅[sys.index_columns](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-catalog-views/sys-index-columns-transact-sql?view=sql-server-ver15)

### 1.6 查询索引使用统计

返回索引操作的计数以及上次执行每种操作的时间。

统计结果中的 `user_updates` (用户更新次数) 列是基础表或视图上插入、更新或删除操作导致的索引的维护计数器。 可以使用此视图确定应用程序极少使用的索引。 还可以使用此视图确定引发维护开销的索引。 您可能要删除引发维护开销但不用于查询或只是偶尔用于查询的索引。

::: warning
每当进行 SQL Server 服务重启和数据库分离\关闭时，统计信息都将会被清空重置。
:::

```sql
USE [输入数据库名]
GO
SELECT
  DB_Name(dm_ius.database_id) AS [数据库名]
  , o.name AS [表名]
  , p.TableRows AS 表行数
  , i.name AS [索引名]
  , i.type_desc AS [索引类型]
  , QUOTENAME(dm_ius.user_seeks) 
    + '/' + QUOTENAME(dm_ius.user_scans) 
    + '/' + QUOTENAME(dm_ius.user_lookups) 
    + '/' + QUOTENAME(dm_ius.user_updates) AS [用户【搜索/扫描/查找/更新】次数]
  , dm_ius.last_user_seek AS [用户上次执行搜索的时间]
  , 'DROP INDEX ' + QUOTENAME(i.name) + ' ON ' + QUOTENAME(s.name) + '.' + QUOTENAME(OBJECT_NAME(dm_ius.OBJECT_ID)) AS '删除索引语句'
FROM sys.dm_db_index_usage_stats dm_ius
	Left JOIN sys.indexes i 
	  ON i.index_id = dm_ius.index_id AND dm_ius.OBJECT_ID = i.OBJECT_ID
	Left JOIN sys.objects o 
	  ON dm_ius.OBJECT_ID = o.OBJECT_ID
	Left JOIN sys.schemas s 
	  ON o.schema_id = s.schema_id
	Left JOIN (SELECT SUM(p.rows) TableRows, p.index_id, p.OBJECT_ID FROM sys.partitions p GROUP BY p.index_id, p.OBJECT_ID) p 
	  ON p.index_id = dm_ius.index_id AND dm_ius.OBJECT_ID = p.OBJECT_ID
WHERE 
-- 用户定义的表
OBJECTPROPERTY(dm_ius.OBJECT_ID,'IsUserTable') = 1
-- 非聚集索引
AND i.type_desc = 'NONCLUSTERED'
AND i.is_primary_key = 0
AND i.is_unique_constraint = 0

/** 指定数据库条件 */
--AND dm_ius.database_id = DB_ID('输入数据库名')
/** 指定表名条件 */
--AND o.name='表名'  

ORDER BY (dm_ius.user_seeks + dm_ius.user_scans + dm_ius.user_lookups) ASC
```
**执行结果**
![执行结果](/images/sqlserver-performance-analysis/1.6.jpg)

> 有关详细信息，请参阅[sys.dm_db_index_usage_stats (Transact-SQL)](https://docs.microsoft.com/zh-cn/previous-versions/sql/sql-server-2012/ms188755(v=sql.110))
------

## 2 数据库文件和文件组

### 2.1 数据库文件

SQL Server 数据库具有三种类型的文件，如下表所示：

| 文件     | 说明                                                         |
| :------- | :----------------------------------------------------------- |
| 主       | 包含数据库的启动信息，并指向数据库中的其他文件。 每个数据库有一个主要数据文件。 主要数据文件的建议文件扩展名是 .mdf。 |
| 辅助副本 | 用户定义的可选数据文件。 通过将每个文件放在不同的磁盘驱动器上，可将数据分散到多个磁盘中。 次要数据文件的建议文件扩展名是 .ndf。 |
| 事务日志 | 此日志包含用于恢复数据库的信息。 每个数据库必须至少有一个日志文件。 事务日志的建议文件扩展名是 .ldf。 |

### 2.2 文件组

- 此文件组包含主要数据文件和未放入其他文件组的所有次要文件。
- 可以创建用户定义的文件组，用于将数据文件集合起来，以便于管理、数据分配和放置。

例如：可以分别在`三个磁盘驱动器`上创建 `Data1.ndf`、`Data2.ndf` 和 `Data3.ndf`，然后将它们分配给文件组 `fgroup1`。 然后，可以明确地在文件组 `fgroup1` 上创建一个表。 对表中数据的查询将分散到三个磁盘上，从而提高了性能。 通过使用在 RAID（独立磁盘冗余阵列）条带集上创建的单个文件也能获得同样的性能提高。 

下表列出了存储在文件组中的所有数据文件。

| 文件组       | 说明                                                      |
| :----------- | :-------------------------------------------------------- |
| 主           | 包含主要文件的文件组。 所有系统表都是主要文件组的一部分。 |
| 内存优化数据 | 内存优化文件组基于 Filestream 文件组                      |
| 文件流       |                                                           |
| 用户定义     | 用户首次创建数据库或以后修改数据库时创建的任何文件组。    |

**``建议``**

- 将数据和日志文件放在不同的磁盘上。

- 若要使性能最大化，请在尽可能多的不同可用磁盘上创建文件或文件组。 将争夺空间最激烈的对象置于不同的文件组中。

- 大多数数据库在只有单个数据文件和单个事务日志文件的情况下性能良好。

- 如果使用多个数据文件，请为附加文件创建第二个文件组，并将其设置为默认文件组。 这样，主文件将只包含系统表和对象。

- 使用文件组将对象放置在特定的物理磁盘上。

- 将在同一联接查询中使用的不同表置于不同的文件组中。 由于采用并行磁盘 I/O 对联接数据进行搜索，所以此步骤可改善性能。
> **引用**
>
> [数据库文件和文件组 MSDN](https://docs.microsoft.com/zh-cn/sql/relational-databases/databases/database-files-and-filegroups?view=sql-server-2016)

### 2.3 添加文件和文件组

```sql
-- ”AdventureWorks2012”为示例数据库，请修改为需要操作的目标数据库。
USE master
GO

-- 创建文件组 Test1FG1
ALTER DATABASE AdventureWorks2012
ADD FILEGROUP Test1FG1;
GO

-- 添加文件 test1dat1 到 文件组 Test1FG1
ALTER DATABASE AdventureWorks2012
ADD FILE
(
    NAME = test1dat1,
    FILENAME = 'C:\Program Files\Microsoft SQL Server\MSSQL13.MSSQLSERVER\MSSQL\DATA\t1dat1.ndf',
    SIZE = 5MB,
    MAXSIZE = UNLIMITED,
    FILEGROWTH = 10%
)
TO FILEGROUP Test1FG1;
GO
```

### 2.4 移动文件

- **移动用户数据库**

  1. 查询数据库的逻辑文件名称

     ```sql
     SELECT name as [逻辑名称], physical_name AS CurrentLocation, state_desc  
     FROM sys.master_files  
     WHERE database_id = DB_ID(N'数据库名');  
     ```

  2. 更改文件位置

     ```sql
     ALTER DATABASE 数据库名 
     MODIFY FILE ( NAME = 逻辑名称, FILENAME = '新路径 C:\Gitee\document\xxx.ldf' );
     ```

  3. 设置数据库脱机\停止SQL Server服务

     ```sql
     ALTER DATABASE database_name SET OFFLINE;
     ```

  4. 将文件移动到新位置

  5. 设置数据库联机\启动SQL Server服务

     ```sql
     ALTER DATABASE database_name SET ONLINE;
     ```

- **移动TempDB数据库**

::: warning
由于每次启动 SQL Server 实例时都将重新创建 tempdb，所以不必实际移动数据和日志文件。
:::

  1. 查询`tempdb` 数据库的逻辑文件名称

     ```sql	
     SELECT name as [逻辑名称], physical_name AS CurrentLocation  
     FROM sys.master_files  
     WHERE database_id = DB_ID(N'tempdb');  
     GO  
     ```

  2. 更改每个文件的位置

     ```sql
     USE master;  
     GO  
     ALTER DATABASE tempdb   
     MODIFY FILE (NAME = 逻辑名称, FILENAME = '新路径 E:\SQLData\tempdb.mdf');  
     GO  
     ALTER DATABASE tempdb   
     MODIFY FILE (NAME = 逻辑名称, FILENAME = '新路径 F:\SQLLog\templog.ldf');  
     GO  
     ```

  3. 停止再重新启动 SQL Server的实例。

  4. 将 `tempdb.mdf` 和 `templog.ldf` 文件从其原始位置删除。

>**引用 MSDN**
>
>[移动用户数据库](https://docs.microsoft.com/zh-cn/sql/relational-databases/databases/move-user-databases?view=sql-server-2016)
>
>[移动系统数据库](https://docs.microsoft.com/zh-cn/sql/relational-databases/databases/move-system-databases?view=sql-server-2016#examples)


---
## 3 日志文件

### 3.1 收缩日志

```sql
-- 以下示例将 AdventureWorks2022 数据库中的日志文件收缩到 1 MB。
USE AdventureWorks2022;
GO
-- 首先需要通过将数据库恢复模式设置为 SIMPLE 来截断该文件
ALTER DATABASE AdventureWorks2022
SET RECOVERY SIMPLE;
GO
-- 日志文收缩到 1 MB
-- AdventureWorks2022_Log 为日志文件的“逻辑名称
DBCC SHRINKFILE (AdventureWorks2022_Log, 1);
GO
-- Reset the database recovery model.
ALTER DATABASE AdventureWorks2022
SET RECOVERY FULL;
GO
```

有关详细信息，请参阅[DBCC SHRINKFILE (Transact-SQL)](https://learn.microsoft.com/zh-cn/sql/t-sql/database-console-commands/dbcc-shrinkfile-transact-sql?view=sql-server-ver16#examples)

### 3.2 日志无法收缩的部分解决办法

> [MSDN文档： 可能延迟日志截断的因素](https://docs.microsoft.com/zh-cn/sql/relational-databases/logs/the-transaction-log-sql-server?view=sql-server-ver15#factors-that-can-delay-log-truncation)

1. 查询日志无法收缩的原因

```sql
/**********************************/ 
/* 查看影响日志无法收缩的原因       */
/*********************************/
select log_reuse_wait_desc 
from sys.databases 
where name = '数据库名称'
```

2. 查询结果说明

 - **NOTHING**
    **说明：**

  当前有一个或多个可重复使用的虚拟日志文件 (VLF)。

  **解决**：

  显示`NOTHING`时，一般情况都是可以收缩。

- **LOG_BACKUP**
	**说明**：
	在截断事务日志前，需要进行日志备份。 （仅限完整恢复模式或大容量日志恢复模式）
	**解决**：
	通常情况备份事务日志后*(如果无法备份事务日志，就需要先进行完整备份，再备份事务日志)*，再次查询结果为`NOTHING`，就可以收缩到日志文件了。
	
- **REPLICATION**
  **说明**：在事务复制过程中，与发布相关的事务仍未传递到分发数据库。 （仅限完整恢复模式）
  **解决**：
  1.将日志中的所有复制的事务都被标记为已分发，再次查询结果为`NOTHING`，就可以收缩到日志文件。

```sql
/**********************************/ 
/* 将日志中的所有复制的事务都被标记为已分发 */
/*********************************/
EXEC sp_repldone @xactid = NULL, @xact_seqno = NULL, @numtrans = 0, @time = 0, @reset = 1
```

​		2.禁用发布，再次查询结果为`NOTHING`，就可以收缩到日志文件。

```sql
/****************/ 
/* 禁用发布和分发 */
/****************/
EXEC sp_removedbreplication [数据库名称]
```



::: warning
如果手动执行 sp_repldone，则可以使已传送的事务的次序和一致性无效。

有关详细信息，请参阅[sp_repldone (Transact-SQL)](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-stored-procedures/sp-repldone-transact-sql?view=sql-server-ver15)   [sp_removedbreplication(Transact-SQL)](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-stored-procedures/sp-removedbreplication-transact-sql?view=sql-server-ver15)
:::
---

## 4 执行计划

### 4.1  清除计划缓存

::: warning
- DBCC FREEPROCCACHE 不清除本机编译的存储过程的执行统计信息。
- 清除过程（计划）缓存会逐出所有计划，并且传入查询执行将编译新计划，而不是重复使用任何以前缓存的计划，这可能导致查询性能骤降。

有关详细信息，请参阅[DBCC FREEPROCCACHE(Transact-SQL)](https://docs.microsoft.com/zh-cn/sql/t-sql/database-console-commands/dbcc-freeproccache-transact-sql?view=sql-server-ver15#examples-ssnoversion)
:::

1. 清除所有计划缓存

   ``` sql
   -- **** 清除所有计划缓存 ****
   DBCC FREEPROCCACHE
   ```

2. 清除指定计划缓存

   ``` sql
   -- **** 清除指定计划 ****
   USE [数据库名];  
   GO  
   -- 1.查询语句
   SELECT * FROM Person.Address;  
   GO  
   -- 2.查询语句的执行计划
   SELECT plan_handle, st.text  
   FROM sys.dm_exec_cached_plans   
   CROSS APPLY sys.dm_exec_sql_text(plan_handle) AS st  
   WHERE text LIKE N'SELECT * FROM Person.Address%';  
   GO  
   /* 执行结果
   plan_handle                                         text  
   --------------------------------------------------  -----------------------------  
   0x060006001ECA270EC0215D05000000000000000000000000  SELECT * FROM Person.Address;  
   */
   -- 3.清除指定执行计划缓存
   DBCC FREEPROCCACHE (0x060006001ECA270EC0215D05000000000000000000000000);  
   ```

## 5 系统信息

### 5.1 查询SQL Server启动时间
``` sql
-- **** 查询SQL Server启动时间 ****
select  
sqlserver_start_time as [启动日期],
(ms_ticks-sqlserver_start_time_ms_ticks)/1000/60/60.0 as [持续运行时间（小时）]
from sys.dm_os_sys_info
```
**执行结果**

![](/images/sqlserver-performance-analysis/5.1.jpg)



