# 执行计划的统计信息

返回 SQL Server 中缓存的查询计划的聚合性能统计信息。 

与“活动监视器”中的“最近耗费大量资源的查询”页签中的数据同源。

::: warning
重启SQL Server服务或删除执行计划缓存都会影响当前查询结果
:::

```sql
SELECT
ISNULL(ST.dbid, SP.dbid) as [数据库ID],
DB_NAME(isnull(ST.dbid, SP.dbid)) as [数据库名称],
QS.query_hash as [查询哈希], -- 可以使用查询哈希确定仅仅是文字值不同的查询的聚合资源使用情况
QS.total_worker_time / 1000 as [CPU使用时间(ms)], 
QS.total_elapsed_time / 1000 as [执行总用时(ms)],
QS.execution_count as [执行次数],
SUBSTRING(ST.text, (QS.statement_start_offset/2) + 1,  
  ((CASE statement_end_offset   
   WHEN -1 THEN DATALENGTH(ST.text)  
   ELSE QS.statement_end_offset END   
   - QS.statement_start_offset)/2) + 1) AS [查询语句],
ST.query_plan as [执行计划]

FROM sys.dm_exec_query_stats AS QS  
CROSS APPLY sys.dm_exec_sql_text(QS.sql_handle) as ST
CROSS APPLY sys.dm_exec_query_plan(QS.plan_handle) as SP
ORDER BY 1, 3;
```

有关详细信息，请参阅:

[sys.dm_exec_query_stats (Transact-SQL)](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-query-stats-transact-sql?view=sql-server-ver15#examples)

[sys.dm_exec_sql_text (Transact-SQL)](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-sql-text-transact-sql?view=sql-server-ver15)

[sys.dm_exec_query_plan (Transact-SQL)](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-query-plan-transact-sql?view=sql-server-ver15)

