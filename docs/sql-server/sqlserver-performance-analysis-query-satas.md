# 执行计划的统计信息

返回 SQL Server 中缓存的查询计划的聚合性能统计信息。 

与“活动监视器”中的“最近耗费大量资源的查询”页签中的数据同源。

::: warning
重启SQL Server服务或删除执行计划缓存都会影响当前查询结果
:::

## SQL语句

```sql
/*
 * 查询平均每次执行用时大于100ms的SQL语句
*/
SELECT
ISNULL(ST.dbid, SP.dbid) as [数据库ID],
DB_NAME(isnull(ST.dbid, SP.dbid)) as [数据库名称],
QS.query_hash as [查询哈希], -- 可以使用查询哈希确定仅仅是文字值不同的查询的聚合资源使用情况
QS.total_worker_time / 1000 as [CPU使用时间(ms)], 
QS.total_elapsed_time / 1000 as [执行总用时(ms)],
QS.execution_count as [执行总次数],
QS.total_elapsed_time / QS.execution_count /1000 as [平均每次执行用时(ms)],
ST.encrypted as [语句已加密],
SUBSTRING(ST.text, (QS.statement_start_offset/2) + 1,  
  ((CASE statement_end_offset   
   WHEN -1 THEN DATALENGTH(ST.text)  
   ELSE QS.statement_end_offset END   
   - QS.statement_start_offset)/2) + 1) AS [查询语句],
SP.query_plan as [执行计划]
FROM sys.dm_exec_query_stats AS QS  
CROSS APPLY sys.dm_exec_sql_text(QS.sql_handle) as ST
CROSS APPLY sys.dm_exec_query_plan(QS.plan_handle) as SP
WHERE ISNULL(ST.dbid, SP.dbid) = DB_ID('数据库名')
And QS.total_elapsed_time / QS.execution_count /1000 > 100
ORDER BY [平均每次执行用时(ms)] DESC;

```

有关详细信息，请参阅：

[sys.dm_exec_query_stats (Transact-SQL)](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-query-stats-transact-sql?view=sql-server-ver15#examples)

[sys.dm_exec_sql_text (Transact-SQL)](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-sql-text-transact-sql?view=sql-server-ver15)

[sys.dm_exec_query_plan (Transact-SQL)](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-query-plan-transact-sql?view=sql-server-ver15)

---

## 存储过程

```sql	
/*
 * 查询存储过程的平均每次执行用时
*/
SELECT 
d.database_id as [数据库ID],
DB_Name(d.database_id) as [数据库名称],
d.object_id as [存储过程ID],
OBJECT_NAME(object_id, database_id) as [存储过程名称],   
d.cached_time as [创建缓存日期],
d.last_execution_time as [最后一次执行日期],
d.last_elapsed_time/1000 as [最后一次执行用时(ms)],
d.execution_count as [执行总次数],
d.total_elapsed_time/1000 as [执行总用时(ms)],  
d.total_elapsed_time/d.execution_count/1000 AS [平均每次执行用时(ms)]
FROM sys.dm_exec_procedure_stats AS d  
WHERE d.database_id = DB_ID('数据库名')
ORDER BY [平均每次执行用时(ms)] DESC;  
```

有关详细信息，请参阅：[sys.dm_exec_procedure_stats (Transact-SQL)](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-procedure-stats-transact-sql?view=sql-server-ver15)

---

## 触发器

```sql
/*
 * 查询触发器的平均每次执行用时
*/
SELECT 
d.database_id as [数据库ID],
DB_NAME(database_id) as [数据库名称], 
d.object_id as [触发器ID],
OBJECT_NAME(object_id, database_id) as [触发器名称],
d.cached_time as [创建缓存日期],
d.last_execution_time as [最后一次执行日期],
d.last_elapsed_time as [最后一次执行用时(ms)],
d.total_elapsed_time/1000 as [执行总用时(ms)],  
d.execution_count/1000 as [执行总用时(ms)],
d.total_elapsed_time/d.execution_count/1000 as [平均每次执行用时(ms)]  
FROM sys.dm_exec_trigger_stats AS d  
WHERE d.database_id = DB_ID('数据库名')
ORDER BY [total_worker_time] DESC;  
```

有关详细信息，请参阅：[sys.dm_exec_trigger_stats (Transact-SQL)](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-trigger-stats-transact-sql?view=sql-server-ver15)

