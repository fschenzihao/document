# SQL Server 常用功能相关
## 1 标识值

### 1.1 查询当前标识值
```sql
USE [数据库名];
GO  
DBCC CHECKIDENT ('dbo.表名', NORESEED);
GO

/* 示例
 * “标识值”：自增值；“当前列值”：表中的最大值；正常情况“标识值”与“当前列值”相等。
 * 执行输出结果为：

 * 检查标识信息: 当前标识值 '84202'，当前列值 '84202'。
 * DBCC 执行完毕。如果 DBCC 输出了错误信息，请与系统管理员联系。
*/
```

### 1.2 修改当前标识值

#### 自动重置 <Badge type="tip" text="推荐" vertical="top" />
::: warning
以下为不自动重置的情况，需要手工设置
- 当前标识值大于表中的最大值。
- 表中的所有行被删除。
:::
```sql
USE [数据库名];
GO  
DBCC CHECKIDENT ('dbo.表名');
GO
```

#### 手工设置
```sql
USE [数据库名];
GO  
-- 示例:
-- 将AddressType表的标识值设置为 10，后面新插入行将使用 11 作为自增值。
-- DBCC CHECKIDENT ('dbo.AddressType', RESEED, 10);  
DBCC CHECKIDENT ('dbo.表名', RESEED, 表中的最大值/指定数值);
GO
```

有关详细信息，请参阅：
[DBCC CHECKIDENT (Transact-SQL)](https://docs.microsoft.com/zh-cn/sql/t-sql/database-console-commands/dbcc-checkident-transact-sql?view=sql-server-ver15)

## 2 允许将显式值插入到表的标识列中

::: warning
- 任何时候，一个会话中只有一个表的 IDENTITY_INSERT 属性可以设置为 ON。
- 批量插入时目标数据表需要表明列，数据源表则没有要求。

✅ `INSERT INTO dbo.Tool (ID, Name) SELECT * FROM dob.ToolSource`

❌ `INSERT INTO dbo.Tool SELECT * FROM dob.ToolSource`
:::

```sql
USE [数据库名];
GO  

-- 创建示例表“Tool”  
CREATE TABLE dbo.Tool(  
   ID INT IDENTITY NOT NULL PRIMARY KEY,   
   Name VARCHAR(40) NOT NULL  
);

SET IDENTITY_INSERT dbo.Tool ON;
INSERT INTO dbo.Tool (ID, Name) VALUES (3, 'Garden shovel');
SET IDENTITY_INSERT dbo.Tool OFF;
```

有关详细信息，请参阅：
[SET IDENTITY_INSERT (Transact-SQL)](https://learn.microsoft.com/zh-cn/sql/t-sql/statements/set-identity-insert-transact-sql?view=sql-server-2016)

## 3 事务
### 3.1 命名事务

``` sql
DECLARE @TranName VARCHAR(20);  
SELECT @TranName = '示例事务';  
  
BEGIN TRANSACTION @TranName;  
USE AdventureWorks2012;  
DELETE FROM AdventureWorks2012.HumanResources.JobCandidate  
    WHERE JobCandidateID = 13;  
  
COMMIT TRANSACTION @TranName;  
GO  
```

有关详细信息，请参阅:
[BEGIN TRANSACTION (Transact-SQL)](https://learn.microsoft.com/zh-cn/sql/t-sql/language-elements/begin-transaction-transact-sql?view=sql-server-ver16)



### 3.2 在事务内使用 TRY…CATCH
```sql
BEGIN TRANSACTION;  
  
BEGIN TRY  
    -- 假设此表上存在FOREIGN KEY约束。下面语句将生成约束冲突错误。
    DELETE FROM Production.Product  
    WHERE ProductID = 980;  
END TRY  
BEGIN CATCH  
    SELECT   
        ERROR_NUMBER() AS ErrorNumber  -- 错误编号
        ,ERROR_SEVERITY() AS ErrorSeverity  -- 严重性
        ,ERROR_STATE() AS ErrorState  -- 错误状态号
        ,ERROR_PROCEDURE() AS ErrorProcedure  -- 出现错误的存储过程或触发器的名称
        ,ERROR_LINE() AS ErrorLine  -- 导致错误的例程中的行号
        ,ERROR_MESSAGE() AS ErrorMessage;  -- 错误消息的完整文本
  
    IF @@TRANCOUNT > 0  
        ROLLBACK TRANSACTION;  
END CATCH;  
  
IF @@TRANCOUNT > 0  
    COMMIT TRANSACTION;  
GO  
```



**说明：**

`@@TRANCOUNT` 返回在当前连接上执行的 `BEGIN TRANSACTION` 语句的数目，数目变化可以由下列操作引起：

- `BEGIN TRANSACTION` 语句将 `@@TRANCOUNT` 增加 1。
- `ROLLBACK TRANSACTION` 将 `@@TRANCOUNT` 设为 0。 
- `COMMIT TRANSACTION` 或 `COMMIT WORK` 将 `@@TRANCOUNT` 递减 1。

有关详细信息，请参阅:

[TRY...CATCH (Transact-SQL)](https://learn.microsoft.com/zh-cn/sql/t-sql/language-elements/try-catch-transact-sql?view=sql-server-ver16)

[@@TRANCOUNT (Transact-SQL)](https://learn.microsoft.com/zh-cn/sql/t-sql/functions/trancount-transact-sql?view=sql-server-ver16)

## 4 会话

### 4.1 查询数据库的连接会话

```sql
SELECT 
  sess.session_id, login_name, DB_NAME(database_id) AS [数据库], 
  host_name as [主机名称], program_name as [客户端程序名称],
  connect_time, last_request_end_time
FROM sys.dm_exec_sessions AS sess
INNER JOIN sys.dm_exec_connections AS conn
    ON sess.session_id = conn.session_id;
```

有关详细信息，请参阅：[sys.dm_exec_sessions (Transact-SQL)](https://learn.microsoft.com/zh-cn/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-sessions-transact-sql?view=sql-server-ver16)


### 4.2 当前连接的会话 ID
```sql
SELECT @@SPID;
```

### 4.3 结束会话
```sql
-- 51 是 session_id (会话 ID)
KILL 51;
```
有关详细信息，请参阅：[(KILL (Transact-SQL)](https://learn.microsoft.com/zh-cn/sql/t-sql/language-elements/kill-transact-sql?view=sql-server-ver16)
