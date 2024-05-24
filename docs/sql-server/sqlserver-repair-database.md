# SQL Server 修复数据库

## 1 检查数据库

### DBCC CHECKDB

执行 `DBCC CHECKDB` 检查数据库中所有对象的逻辑和物理完整性

```sql
-- 检查当前数据库。
DBCC CHECKDB;

-- 检查指定的数据库。
DBCC CHECKDB (database_name);
```

::: tip
`DBCC CHECKDB` 命令会执行以下操作：

- 对数据库中的每个表和视图运行 `DBCC CHECKTABLE`。
- 对数据库运行 `DBCC CHECKALLOC`。
- 对数据库运行 `DBCC CHECKCATALOG`。
- 验证数据库中每个索引视图的内容。
- 使用 FILESTREAM 在文件系统中存储 varbinary(max) 数据时，验证表元数据和文件系统目录和- 文件之间的链接级一致性。
- 验证数据库中的 Service Broker 数据。
  :::

有关详细信息，请参阅 [DBCC CHECKDB (Transact-SQL)](https://learn.microsoft.com/zh-cn/sql/t-sql/database-console-commands/dbcc-checkdb-transact-sql?view=sql-server-ver16)。

### DBCC CHECKTABLE

执行 `DBCC CHECKTABLE` 检查指定表的逻辑和物理完整性

```sql
-- 检查当前数据库中所有表。
DBCC CHECKTABLE;

-- 检查当前数据库中指定的表。
DBCC CHECKTABLE (table_name);

-- 检查指定的数据库和指定的表（eg：'AdventureWorks2022.dbo.MyTable'）。
DBCC CHECKTABLE ('database_name.schema_name.table_name');
```

有关详细信息，请参阅 [DBCC CHECKTABLE (Transact-SQL)](https://learn.microsoft.com/zh-cn/sql/t-sql/database-console-commands/dbcc-checktable-transact-sql?view=sql-server-ver16)。

## 2 分析 DBCC 结果

检查 `DBCC CHECKDB` 或者 `DBCC CHECKTABLE` 命令的结果，若存错误信息，则表示数据库存在错误，需要执行数据库修复。

例如，下面的结果说明 `SMInvoiceDetailWPDoorInfo` 表存在错误。
<div class="sqlserver-repair-database-dbcc-checkdb-result">
  <div class="error-message">
  <p>消息 2575，级别 16，状态 1，第 1 行</p>
  <p>索引分配映射(IAM)页 (1:2047648) (位于对象 ID 253217394，索引 ID 1，分区 ID 72057594780712960，分配单元 ID 72057594789625856 (类型为 In-row data))的下一个指针指向了 IAM 页 (1:2567845)，但扫描过程中检测不到它。</p>
  <p>消息 2576，级别 16，状态 1，第 1 行</p>
  <p>索引分配映射(IAM)页 (1:3027795) (位于对象 ID 253217394，索引 ID 1，分区 ID 72057594780712960，分配单元 ID 72057594789625856 (类型为 In-row data))的上一个指针指向了 IAM 页 (1:2567845)，但扫描过程中检测不到它。</p>
  <p>消息 7965，级别 16，状态 2，第 1 行</p>
  <p>表错误: 由于无效的分配(IAM)页，无法检查对象 ID 253217394，索引 ID 1，分区 ID 72057594780712960，分配单元 ID 72057594789625856 (类型为 In-row data)。</p>
  </div>
  <p>SMInvoiceDetailWPDoorInfo的 DBCC 结果。</p>
  <p>对象 'SMInvoiceDetailWPDoorInfo' 的 0 页中有 0 行。</p>
  <p>CHECKDB 在表 'SMInvoiceDetailWPDoorInfo' (对象 ID 253217394)中发现 2 个分配错误和 1 个一致性错误。</p>
</div>

## 3 将数据库设置单用户模式

```sql
-- 将 AdventureWorks2019 数据库设置为单用户模式，并指定 ROLLBACK IMMEDIATE 立刻回滚所有未完成的事务。
ALTER DATABASE AdventureWorks2019
SET SINGLE_USER
WITH ROLLBACK IMMEDIATE;
GO
```

有关详细信息，请参阅 [ALTER DATABASE SET 选项 (Transact-SQL)](https://learn.microsoft.com/zh-cn/sql/t-sql/statements/alter-database-transact-sql-set-options?view=sql-server-ver16#single_user)。

## 4 执行修复操作

Microsoft 始终建议用户从上次已知成功备份还原，作为从 DBCC CHECKDB 报告的错误恢复的主要方法。

### 执行不会丢失数据的修复

使用 `REPAIR_REBUILD` 选项会重建损坏的索引，并重建损坏的表，但可能无法修复所有错误。
```sql
DBCC CHECKDB ( AdventureWorks2019, REPAIR_REBUILD );
-- 修复 AdventureWorks2019 数据库
DBCC CHECKDB ( AdventureWorks2019, REPAIR_REBUILD );
-- 修复 AdventureWorks2019 数据库中的 DatabaseLog 表
DBCC CHECKTABLE( [AdventureWorks2019.dbo.DatabaseLog], REPAIR_REBUILD );
```

### 执行可能会丢失数据的修复

使用 `REPAIR_ALLOW_DATA_LOSS` 选项尝试修复所有错误，但可能会导致一些数据丢失。

::: danger
`REPAIR_ALLOW_DATA_LOSS` 选项仅当不可从备份恢复时建议作为“最后手段”使用。
因为就算执行成功，但是它可能导致的数据丢失多于用户从上次已知成功备份还原数据库导致的数据丢失。
:::

```sql
-- 修复 AdventureWorks2019 数据库
DBCC CHECKDB ( AdventureWorks2019, REPAIR_ALLOW_DATA_LOSS );
-- 修复 AdventureWorks2019 数据库中的 DatabaseLog 表
DBCC CHECKTABLE( 'AdventureWorks2016.dbo.DatabaseLog', REPAIR_ALLOW_DATA_LOSS );

```

有关详细信息，请参阅：
- [DBCC CHECKDB (Transact-SQL)](https://learn.microsoft.com/zh-cn/sql/t-sql/database-console-commands/dbcc-checkdb-transact-sql?view=sql-server-ver16)。
- [DBCC CHECKTABLE (Transact-SQL)](https://learn.microsoft.com/zh-cn/sql/t-sql/database-console-commands/dbcc-checktable-transact-sql?view=sql-server-ver16)。

## 5 重新检查数据库
查询数据库（步骤1），若结果无错误，则表示数据库修复成功，继续往下操作（步骤6），否则继续执行修复操作（步骤4）。

## 6 将数据库恢复多用户模式

```sql
-- 恢复 AdventureWorks2019 数据库多用户模式。
ALTER DATABASE AdventureWorks2019
SET MULTI_USER;
GO
```

## 7 完成

<style lang="scss">
/** 展示 DBCC 结果的样式 */
.sqlserver-repair-database-dbcc-checkdb-result {
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  padding: 10px;
  text-wrap: nowrap;
  overflow: auto;
  .error-message {
    color: red;
  }

  p {
    margin: 0;
    font-size: 12px;
  }
}
</style>
