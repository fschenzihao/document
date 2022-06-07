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