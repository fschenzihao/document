> ðçæ¬: 1.5
>
> ðæ¥æ: 2021-11-02



#  SQL Server åæ´æ°æ®æè·ï¼CDCï¼ #

# 1. CDC  ç®ä»

åæ´æ°æ®æè· (CDC) å¯è®°å½åºç¨äº SQL Server è¡¨çæå¥ãæ´æ°åå é¤æ´»å¨ã

åæ´æ°æ®æè·(CDC)ç`æè·æ°æ®æº`ä¸º `SQL Server äºå¡æ¥å¿`

æµç¨å¾

![åæ´æ°æ®æè·æ°æ®æµ](/images/sqlserver-cdc/cdcdataflow.gif)



- å¨å°æå¥ãæ´æ°åå é¤åºç¨äºè·è¸ªç`æºè¡¨`æ¶ï¼å°ä¼å¨æ¥å¿ä¸­æ·»å è¯´æè¿äºæ´æ¹çé¡¹ã 
- `æè·è¿ç¨`ä¼è¯»åæ¥å¿ï¼å¹¶å¨è·è¸ªçè¡¨çå³è`æ´æ¹è¡¨`ä¸­æ·»å æå³æ´æ¹çä¿¡æ¯ã 
- ç³»ç»å°æä¾ä¸äº`å½æ°`ï¼ä»¥æä¸¾å¨æ´æ¹è¡¨ä¸­æå®èå´ååççæ´æ¹ï¼å¹¶ä»¥ç­éçç»æéçå½¢å¼è¿åè¯¥å¼ã
> **å¼ç¨**
>
> [åæ´æ°æ®æè·(CDC) MSDN](https://docs.microsoft.com/zh-cn/sql/relational-databases/track-changes/about-change-data-capture-sql-server?view=sql-server-ver15)
---
# 2. åå¤å·¥ä½

## 2.1 åå»ºCDCæä»¶ç»

ä¸ºäºæ§è½æå¤§åï¼å»ºè®®å°æ´æ¹è¡¨ç½®äºç¬ç«äºæºè¡¨çæä»¶ç»ä¸­ï¼å¹¶æ¾ç½®å¨ä¸åçç£çä¸ã 

``` sql
USE master
GO

-- åå»ºæä»¶ç» CDCFG
ALTER DATABASE AdventureWorks2016
ADD FILEGROUP CDCFG
GO

-- æ·»å æä»¶ CDCdat1 å° æä»¶ç» CDCFG
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

## 2.2 å¯å¨SQL Serverä»£çæå¡

[å¯å¨ãåæ­¢ææå SQL Server ä»£çæå¡](https://docs.microsoft.com/zh-cn/sql/ssms/agent/start-stop-or-pause-the-sql-server-agent-service?view=sql-server-ver15)

> **æ³¨æ**
>
> å¯¹è¡¨å¯ç¨åæ´æ°æ®æè·æ¶ï¼SQL Server ä»£çä¸å¿æ­£å¨è¿è¡ã ä½æ¯ï¼**<u>åªæå½ SQL Server ä»£çæ­£å¨è¿è¡æ¶ï¼æè·è¿ç¨æä¼å¤çäºå¡æ¥å¿å¹¶å°æ¡ç®åå¥æ´æ¹è¡¨ã</u>**

## 2.3 æ£æ¥å½åæ°æ®åºçææè

å¯ç¨CDCåï¼éè¦åæ£æ¥å½åæ°æ®åºçææèï¼è¥ä¸º`null`æèé`sa`ç¨æ·æ¶ï¼åå»ºè®®å°ææèæ´æ¹ä¸ºç»å½å`sa`ã	

å¦ååç»­å¼å¯CDCæä½å¯è½å¤±è´¥ã

```sql
SELECT d.name, d.owner_sid, sl.name
FROM sys.databases AS d
	left JOIN sys.sql_logins AS sl
		ON d.owner_sid = sl.sid;
		
/* ç»æ
name                owner_sid                         name
------------------- --------------------------------- -----------------------------
master              0x01                              sa
tempdb              0x01                              sa
model               0x01                              sa
msdb                0x01                              sa
AdventureWorks2016  0x010500000000000515000           NULL
*/

-- AdventureWorks2016 name(ææè)ä¸ºNULLï¼ç©ºï¼
-- å°ææèåæ´æ´æ¹ä¸ºç»å½åsa
USE [AdventureWorks2016]
GO
ALTER AUTHORIZATION ON DATABASE::[AdventureWorks2016] TO [sa]
GO
```

---

# 3. å¯ç¨æ´æ¹æ°æ®æè·ï¼CDCï¼æµç¨

## 3.1 æ°æ®åºå¯ç¨CDC

ä¸ºæ°æ®åºå¯ç¨âæ´æ¹æ°æ®æè·âï¼éè¿ [sys.sp_cdc_enable_db (MSDN Transact-SQL)](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-stored-procedures/sys-sp-cdc-enable-db-transact-sql?view=sql-server-ver15) å­å¨è¿ç¨å®ç°ï¼

``` sql	
USE AdventureWorks2016  
GO  

-- å¯¹å½åæ°æ®åºå¯ç¨åæ´æ°æ®æè·
-- æ³¨æï¼æ æ³å¨ ç³»ç»æ°æ®åº æååæ°æ®åºä¸å¯ç¨åæ´æ°æ®æè·ã
-- is_cdc_enabledï¼æ¯å¦å·²å¯ç¨CDC
IF NOT EXISTS( SELECT  1 FROM sys.databases WHERE name = 'AdventureWorks2016' and is_cdc_enabled  = 1 )
BEGIN
	-- è¿åä»£ç å¼ 
	-- 0ï¼æåï¼æ 1ï¼å¤±è´¥ï¼ 
	EXEC sys.sp_cdc_enable_db 
END
GO
```

å½å¯¹æ°æ®åºæåå¯ç¨äºåæ´æ°æ®æè·ä¹åï¼

- å¦ææ°æ®åºè¿åå°å¶ä»æå¡å¨ï¼é»è®¤æåµä¸å°ç¦ç¨åæ´æ°æ®æè·ï¼å¹¶å é¤ææç¸å³çåæ°æ®ã

  è¥è¦ä¿çåæ´æ°æ®æè·ï¼è¯·å¨è¿åæ°æ®åºæ¶ä½¿ç¨ **KEEP_CDC** éé¡¹ã

- å° `sys.databases`ç®å½è§å¾ä¸­çæ°æ®åºæ¡ç®ç is_cdc_enabled åè®¾ç½®ä¸º1
- å¹¶å°ä¸ºæ°æ®åºåå»ºä»¥ä¸å¯¹è±¡ï¼

|                           åæ°æ®è¡¨                           |                          DDL è§¦åå¨                          |                      cdc schemaï¼æ¶æï¼                      |                        cdc æ°æ®åºç¨æ·                        |
| :----------------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
| ![](/images/sqlserver-cdc/E48E7325.png) | ![](/images/sqlserver-cdc/33EB10F7.png) | ![](/images/sqlserver-cdc/5E20673A.png) | ![](/images/sqlserver-cdc/970FAF5E.png) |

- å³ä½¿æ¢å¤æ¨¡å¼è®¾ç½®ä¸ºç®åæ¢å¤ï¼æ¥å¿æªæ­ç¹ä¹ä¸ä¼ååæ¨è¿ï¼ç´å°ä¸ºæè·æ è®°çæææ´æ¹é½å·²ç±æè·è¿ç¨æ¶éä¸ºæ­¢ã å¦ææè·è¿ç¨æªè¿è¡ä¸æè¦æ¶éçæ´æ¹ï¼æ§è¡ CHECKPOINT å°ä¸ä¼æªæ­æ¥å¿ã

## 3.2 è¡¨å¯ç¨CDC

â		å¯¹è¡¨å¯ç¨åæ´æ°æ®æè·æ¶ï¼åºç¨äºæ­¤è¡¨çæ¯ä¸ªæ°æ®æçºµè¯­è¨ (DML) æä½çè®°å½é½å°åå¥äºå¡æ¥å¿ä¸­ã åæ´æ°æ®æè·è¿ç¨å°ä»æ¥å¿ä¸­æ£ç´¢æ­¤ä¿¡æ¯ï¼å¹¶å°å¶åå¥æ´æ¹è¡¨ä¸­ã

éè¿[sys.sp_cdc_enable_table](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-stored-procedures/sys-sp-cdc-enable-table-transact-sql?view=sql-server-ver15)å­å¨è¿ç¨å®ç°ï¼

```sql
USE AdventureWorks2016;  
GO  
-- åå»ºä¸ä¸ªæè·å®ä¾
EXEC sys.sp_cdc_enable_table  
    @source_schema = N'HumanResources'  -- æºè¡¨æå±çæ¶æçåç§°(é»è®¤dbo)
  , @source_name = N'Department'  		-- æºè¡¨çåç§°
  , @role_name = null  -- ç¨äºè®¿é®æ´æ¹æ°æ®çæ°æ®åºè§è²çåç§°,nullåä¸éå¶è®¿é®ã
  , @capture_instance = null -- æè·å®ä¾çåç§°, nullåææºæ¶æåç§°å ä¸ schemaname_sourcename æ ¼å¼çæãï¼ä¾å¦HumanResources_Departmentï¼ 
  , @supports_net_changes = 1  -- æ¯å¦ä¸ºæ­¤æè·å®ä¾å¯ç¨ç¨äºæ¥è¯¢åæ´æ¹çæ¯æã
  , @index_name = null -- ç¨äºå¯ä¸æ è¯æºè¡¨ä¸­çè¡çå¯ä¸ç´¢å¼çåç§°, nullååä¸»é®ã
  , @captured_column_list = null -- æ è¯è¦æè·çæºè¡¨åï¼éå·éå¼âID,Code,Nameâï¼ï¼NULLåææåé½å°æè·ã
  , @filegroup_name = N'CDCFG';  
GO  

/* æ§è¡ç»æ
æ¶æ¯
ä½ä¸ 'cdc.AdventureWorks2016_capture' å·²æåå¯å¨ã
ä½ä¸ 'cdc.AdventureWorks2016_cleanup' å·²æåå¯å¨ã
*/
```

å½å¯¹è¡¨å¯ç¨åæ´æ°æ®æè·æåä¹åä¼ä¿®æ¹æåå»ºä»¥ä¸åå®¹ï¼

### 3.2.1 æè·å®ä¾

åå»ºä¸ä¸ªæè·å®ä¾ï¼å¯ä»¥ä½¿ç¨ [sys.sp_cdc_help_change_data_capture](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-stored-procedures/sys-sp-cdc-help-change-data-capture-transact-sql?view=sql-server-ver15)å­å¨è¿ç¨æ¥æ£ç´¢æ­¤ä¿¡æ¯ã

```sql
USE AdventureWorks2016;  
GO  
-- è¿å HumanResources.Department è¡¨çåæ´æ°æ®æè·å®ä¾éç½®ã
EXECUTE sys.sp_cdc_help_change_data_capture   
    @source_schema = N'HumanResources',   
    @source_name = N'Department';  
GO  
-- è¿å ææå¯ç¨è¡¨çåæ´æ°æ®æè·å®ä¾éç½®ã
EXECUTE sys.sp_cdc_help_change_data_capture;  
GO
```



### 3.2.2 `sys.tables`è§å¾

æ´æ°`sys.tables`è§å¾çè¡¨æ¡ç®ä¸­ç`is_tracked_by_cdc` åä¸º1.



### 3.2.3 æ´æ¹è¡¨

åå»ºæ´æ¹è¡¨`cdc.HumanResources_Department_CT`ï¼

åæ´è¡¨æ¯å³è`æè·å®ä¾`çï¼å½åæ¹å¼ä¸ºï¼<æè·å®ä¾åç§°>_CTã

![](/images/sqlserver-cdc/3CE944AD.png)



### 3.2.4 æ¥è¯¢å½æ°

åå»ºæ¥è¯¢å½æ°

- æ¥è¯¢æææ´æ¹å½æ°ï¼`cdc.fn_cdc_get_all_changes_HumanResources_Department`

  å½åæ¹å¼ä¸ºï¼[cdc.fn_cdc_get_all_changes_<æè·å®ä¾åç§°>](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-functions/cdc-fn-cdc-get-all-changes-capture-instance-transact-sql?view=sql-server-ver15#examples)

  â	è¿åæå®çæ¶é´é´éååºç°çæææ´æ¹è¡¨é¡¹ã

- æ¥è¯¢Net changesï¼åæ´æ¹å½æ°ï¼ å½æ°ï¼`cdc.fn_cdc_get_net_changes_HumanResources_Department`

  â    å½åæ¹å¼ä¸ºï¼[cdc.fn_cdc_get_net_changes_<æè·å®ä¾åç§°>](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-functions/cdc-fn-cdc-get-net-changes-capture-instance-transact-sql?view=sql-server-ver15)

  â	 Net changes å½æ°çåå»ºåå³äº`æè·ç¤ºä¾`æ°å»ºæ¶ç`supports_net_changes`å±æ§ã

  â	è¿åæå®çæ¶é´é´éååçæ´æ¹çæ¯ä¸ªééå¤è¡ï¼æ­¤å½æ°ä»è¿åä¸é¡¹æ´æ¹

![](/images/sqlserver-cdc/89548E8B.png)



### 3.2.5 åæ°æ®è¡¨

å¨**cdc.change_tables**ï¼**cdc.index_columns**ï¼**cdc.captured_columns** åæ°æ®è¡¨ä¸­æå¥ä¿¡æ¯ã



### 3.2.6 ä»£çä½ä¸

é¦æ¬¡å¯å¨è¡¨å¯ç¨åæ´æ°æ®æè·æ¶ï¼ä¼åå»ºä¸¤ä¸ªå³èæ°æ®åºçSQL Serverä»£çä½ä¸ãæè·åæ¸é¤ä½ä¸é½æ¯ä½¿ç¨é»è®¤åæ°åå»ºçã  

â		![](/images/sqlserver-cdc/D874E031.png)

- æè·æ´æ¹è¡¨ä½ä¸ï¼captureï¼

  æè·ä½ä¸ä¼ç«å³å¯å¨ã å®è¿ç»­è¿è¡ï¼æ¯ä¸ªæ«æå¨ææå¤å¯å¤ç 1000 ä¸ªäºå¡ï¼å¹¶å¨ä¸¤ä¸ªå¨æä¹é´åé¡¿ 5 ç§éã

- æ¸é¤æ´æ¹è¡¨ä½ä¸ï¼cleanupï¼

  æ¸é¤ä½ä¸å¨æ¯å¤©åæ¨ 2 ç¹è¿è¡ä¸æ¬¡ã å®å°æ´æ¹è¡¨é¡¹ä¿çä¸å¤©ï¼4320 åéï¼ï¼ä½¿ç¨åä¸ªå é¤è¯­å¥æå¤å¯å é¤ 5000 é¡¹ã

ä¿®æ¹ä½ä¸ï¼[sys.sp_cdc_change_job](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-stored-procedures/sys-sp-cdc-change-job-transact-sql?view=sql-server-ver15)

```sql
USE AdventureWorks2016;  
GO  
-- ä¿®æ¹æè·ä½ä¸
EXECUTE sys.sp_cdc_change_job   
    @job_type = N'capture',  -- ä½ä¸çç±»å
    @maxscans = 1000,  -- ä»æ¥å¿ä¸­æåææè¡èè¦æ§è¡çæ«æå¨æçæå¤§æ°ç®
    @maxtrans = 15ï¼  -- æ¯ä¸ªæ«æå¾ªç¯ä¸­è¦å¤ççæå¤§äºå¡æ°
    @pollinginterval = 5ï¼ -- æ«æé´éï¼ç§ï¼
    @continuous = 1ï¼ -- 1å¾ªç¯è¿è¡ï¼0åªè¿è¡ä¸æ¬¡
GO  
-- ä¿®æ¹æ¸æ¥ä½ä¸
EXECUTE sys.sp_cdc_change_job   
    @job_type = N'cleanup', -- ä½ä¸çç±»å
    @retention = 2880;  -- æ´æ¹è¡è¦å¨æ´æ¹è¡¨ä¸­ä¿ççåéæ°
GO  
```

æ¥è¯¢ä½ä¸ï¼[sys.sp_cdc_help_jobs  ](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-stored-procedures/sys-sp-cdc-help-jobs-transact-sql?view=sql-server-ver15)æç´æ¥æ¥è¯¢[dbo.cdc_jobs](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-tables/dbo-cdc-jobs-transact-sql?view=sql-server-ver15) è¡¨

```sql
USE AdventureWorks2016;  
GO  
-- æ¥è¯¢ä½ä¸.
EXEC sys.sp_cdc_help_jobs;  
GO  
```

å¯å¨ä½ä¸ï¼[sys.sp_cdc_start_job](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-stored-procedures/sys-sp-cdc-start-job-transact-sql?view=sql-server-ver15)

```sql
USE AdventureWorks2012;  
GO  
-- å¯å¨æè·ä½ä¸ï¼å¯ä»¥ä¸æå® job_type çå¼ï¼å ä¸ºé»è®¤ä½ä¸ç±»åä¸º " æè·"ã
EXEC sys.sp_cdc_start_job
	@job_type = N'capture';  
GO  
-- å¯å¨æ¸é¤ä½ä¸ã
EXEC sys.sp_cdc_start_job 
	@job_type = N'cleanup';  
GO  
```

åæ­¢ä½ä¸ï¼[sys.sp_cdc_stop_job](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-stored-procedures/sys-sp-cdc-stop-job-transact-sql?view=sql-server-ver15)

```sql
USE AdventureWorks2012;  
GO  
-- åæ­¢æè·ä½ä¸ã
EXEC sys.sp_cdc_stop_job @job_type = N'capture';  
GO  
-- åæ­¢æ¸é¤ä½ä¸ã
EXEC sys.sp_cdc_stop_job @job_type = N'cleanup';  
GO  
```



> æ³¨æ
>
> ä¿®æ¹ä½ä¸åï¼éè¦éå¯ä½ä¸åæä¼çæã
>
> å¯å¨ååæ­¢æè·ä½ä¸å¹¶ä¸ä¼é ææ´æ¹æ°æ®ä¸¢å¤±ã å¯ä»¥å¨é«å³°éæ±æ¶æ®µç¦æ­¢æ«ææ¥å¿ä»¥åå¢å è´è½½ã
>
> æ°æ®åºå¼ææå¡æ SQL Server ä»£çæå¡å¨ NETWORK SERVICE å¸æ·ä¸è¿è¡æ¶ï¼åæ´æ°æ®æè·æ æ³æ­£å¸¸å·¥ä½ã è¿å¯è½å¯¼è´éè¯¯ 22832ã



## 3.3 ç¦ç¨æ°æ®åºåæ´æ°æ®æè·(CDC)

  æ°æ®åºç¦ç¨åæ´æ°æ®æè·ï¼å°åæ¶å é¤ææå³èçåæ´æ°æ®æè·åæ°æ®ï¼æ¬ **cdc** ç¨æ·ãæ¶æååæ´æ°æ®æè·ä½ä¸ï¼ãæä»¥ä¸å¿åç¦ç¨åä¸ªè¡¨ã

  ```sql
  -- ç¦ç¨æ°æ®åºåæ´æ°æ®æè·
  USE AdventureWorks2016  
  GO  
  EXEC sys.sp_cdc_disable_db  
  GO  
  ```

## 3.4 ç¦ç¨è¡¨åæ´æ°æ®æè·

- å¦æå é¤äºå¯ç¨åæ´æ°æ®æè·çè¡¨ï¼åä¼èªå¨å é¤ä¸è¯¥è¡¨å³èçåæ´æ°æ®æè·åæ°æ®ã
- å¦æå¨ç¦ç¨åçåæ²¡æå¯¹æ°æ®åºå¯ç¨ä»»ä½è¡¨ï¼åè¿ä¼å é¤åæ´æ°æ®æè·ä½ä¸ã

```sql
USE AdventureWorks2016  
GO  
EXEC sys.sp_cdc_disable_table  
@source_schema = N'dbo',  
@source_name   = N'MyTable',  
@capture_instance = N'dbo_MyTable'  
GO  
```

## 3.5 çè§CDCç¶æ

- [sys.dm_cdc_log_scan_sessions](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-dynamic-management-views/change-data-capture-sys-dm-cdc-log-scan-sessions?view=sql-server-ver15)

  èª SQL Server æå¡æåä¸æ¬¡å¯å¨ä»¥æ¥ï¼æ¥å¿æ«æä¼è¯çç¶æä¿¡æ¯ãæ¯ä¸ªæ¥å¿æ«æä¼è¯è®°å½ä¸è¡ï¼æåä¸è¡è¡¨ç¤ºå½åä¼è¯ã

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

  åæ´æ°æ®æè·æ¥å¿æ«æä¼è¯ä¸­éå°çæ¯ä¸ªéè¯¯è¿åä¸è¡ã

  ```sql
  SELECT * FROM sys.dm_cdc_errors
  ```

  

# 4 æ©å±

##  4.1 åæ°æ®è¡¨

### [cdc.change_tables](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-tables/cdc-change-tables-transact-sql?view=sql-server-ver15)

ä¸ºæ°æ®åºä¸­çæ¯ä¸ªæ´æ¹è¡¨è¿åä¸è¡ã å¯¹æºè¡¨å¯ç¨åæ´æ°æ®æè·æ¶ï¼å°åå»ºä¸ä¸ªæ´æ¹è¡¨ã

ä¸è¦ç´æ¥**æ¥è¯¢ç³»ç»è¡¨cdc.change_tables**ï¼ è¯·æ¹ä¸ºæ§è¡ [sys.sp_cdc_help_change_data_capture](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-stored-procedures/sys-sp-cdc-help-change-data-capture-transact-sql?view=sql-server-ver15) å­å¨è¿ç¨ã

| **cdc.change_tables**ï¼é¨ååï¼ |              |                                                              |
| ------------------------------- | ------------ | ------------------------------------------------------------ |
| **ååç§°**                      | **æ°æ®ç±»å** | **è¯´æ**                                                     |
| object_id                       | int          | æ´æ¹è¡¨ç IDãå¨æ°æ®åºä¸­æ¯å¯ä¸çã                            |
| source_object_id                | int          | æ´æ¹è¡¨çæºè¡¨ç IDã                                          |
| capture_instance                | sysname      | ç¨äºå½åç¹å®äºå®ä¾çè·è¸ªå¯¹è±¡çæè·å®ä¾çåç§°ã é»è®¤æåµä¸ï¼è¯¥åç§°ä»æºæ¶æåç§°å ä¸æºè¡¨åç§°æ´¾çï¼æ ¼å¼ *schemaname_sourcename*ã |
| has_drop_pending                | bit          | æè·è¿ç¨æ¶å°å³äºæºè¡¨å·²è¢«å é¤çéç¥ã                         |
| filegroup_name                  | sysname      | æ´æ¹è¡¨æé©»ççæä»¶ç»çåç§°ãNULL = æ´æ¹è¡¨å¨æ°æ®åºçé»è®¤æä»¶ç»ä¸­ã |
| create_date                     | datetime     | å¯ç¨æºè¡¨çæ¥æã                                             |
| partition_switch                | bit          | æç¤ºæ¯å¦å¯ä»¥å¯¹å¯ç¨äºåæ´æ°æ®æè·çè¡¨æ§è¡ **ALTER TABLE** ç **SWITCH PARTITION** å½ä»¤ã 0 æç¤ºååºåæ¢è¢«é»æ­¢ã æªååºè¡¨å§ç»è¿å 1ã |



### [cdc.captured_columns](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-tables/cdc-captured-columns-transact-sql?view=sql-server-ver15)

**ä¸ºå¨æè·å®ä¾ä¸­è·è¸ªçæ¯ä¸åè¿åä¸è¡ã** é»è®¤æåµä¸ï¼ä¸ºæè·æºè¡¨ä¸­çææåã

ä¸è¦ **ç´æ¥æ¥è¯¢ç³»ç»è¡¨cdc.captured_columns**ã è¯·æ¹ä¸ºæ§è¡ [sys.sp_cdc_get_source_columns](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-stored-procedures/sys-sp-cdc-get-captured-columns-transact-sql?view=sql-server-ver15) å­å¨è¿ç¨ã

| **cdc.captured_columns** |              |                                                              |
| ------------------------ | ------------ | ------------------------------------------------------------ |
| **ååç§°**               | **æ°æ®ç±»å** | **è¯´æ**                                                     |
| object_id                | int          | æè·çåæå±çæ´æ¹è¡¨ç IDã                                  |
| column_name              | sysname      | æè·çåçåç§°ã                                             |
| column_id                | int          | æè·çåå¨æºè¡¨åç IDã                                      |
| column_type              | sysname      | æè·çåçç±»åã                                             |
| column_ordinal           | int          | æ´æ¹è¡¨ä¸­çååºå·ï¼ä» 1 å¼å§ï¼ã å°æé¤æ´æ¹è¡¨ä¸­çåæ°æ®åã åºå· 1 å°åéç»æè·å°çç¬¬ä¸ä¸ªåã |
| is_computed              | bit          | è¡¨ç¤ºæè·å°çåæ¯æºè¡¨ä¸­è®¡ç®æå¾çåã                         |



### [cdc.ddl_history](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-tables/cdc-ddl-history-transact-sql?view=sql-server-ver15)

**ä¸ºå¯¹å¯ç¨äºåæ´æ°æ®æè·çè¡¨æåçæ¯ä¸é¡¹æ°æ®å®ä¹è¯­è¨ (DDL) æ´æ¹è¿åä¸è¡**ã å¯ä»¥ä½¿ç¨æ­¤è¡¨æ¥ç¡®å®æºè¡¨åç DDL æ´æ¹çæ¶é´ä»¥åæ´æ¹çåå®¹ã æ­¤è¡¨ä¸­ä¸åå«æªåç DDL æ´æ¹çæºè¡¨çä»»ä½æ¡ç®ã

ä¸è¦**ç´æ¥æ¥è¯¢ç³»ç»è¡¨cdc.ddl_history**ï¼ è¯·æ¹ä¸ºæ§è¡ [sys.sp_cdc_get_ddl_history](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-stored-procedures/sys-sp-cdc-get-ddl-history-transact-sql?view=sql-server-ver15) å­å¨è¿ç¨ã

| cdc.ddl_history        |               |                                                              |
| :--------------------- | :------------ | :----------------------------------------------------------- |
| **ååç§°**             | **æ°æ®ç±»å**  | **è¯´æ**                                                     |
| source_object_id       | int           | åºç¨ DDL æ´æ¹çæºè¡¨ç IDã                                   |
| object_id              | int           | ä¸æºè¡¨çæè·å®ä¾ç¸å³èçæ´æ¹è¡¨ç IDã                        |
| required_column_update | bit           | æç¤ºå¨æºè¡¨ä¸­ä¿®æ¹äºæè·åçæ°æ®ç±»åã æ­¤ä¿®æ¹æ¹åäºæ´æ¹è¡¨ä¸­çåã |
| ddl_command            | nvarchar(max) | åºç¨äºæºè¡¨ç DDL è¯­å¥ã                                      |
| ddl_lsn                | binary(10)    | ä¸ DDL ä¿®æ¹çæäº¤ç¸å³èçæ¥å¿åºåå· (LSN)ã                  |
| ddl_time               | datetime      | å¯¹æºè¡¨æåç DDL æ´æ¹çæ¥æåæ¶é´ã                          |



### [cdc.index_columns](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-tables/cdc-index-columns-transact-sql?view=sql-server-ver15)

**ä¸ºä¸æ´æ¹è¡¨å³èçæ¯ä¸ªç´¢å¼åè¿åä¸è¡ãåæ´æ°æ®æè·ä½¿ç¨è¿äºç´¢å¼åæ¥å¯ä¸æ è¯æºè¡¨ä¸­çè¡ã**

é»è®¤æåµä¸ï¼å°åæ¬æºè¡¨çä¸»é®åã ä½æ¯ï¼å¦æå¨å¯¹æºè¡¨å¯ç¨åæ´æ°æ®æè·æ¶æå®äºæºè¡¨çå¯ä¸ç´¢å¼ï¼åå°æ¹ç¨è¯¥ç´¢å¼ä¸­çåã å¦æå¯ç¨åæ´æ¹è·è¸ªï¼åè¯¥æºè¡¨éè¦ä¸»é®æå¯ä¸ç´¢å¼ã

ä¸è¦ç´æ¥æ¥è¯¢ç³»ç»è¡¨ï¼ è¯·æ¹ä¸ºæ§è¡ [sys.sp_cdc_help_change_data_capture](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-stored-procedures/sys-sp-cdc-help-change-data-capture-transact-sql?view=sql-server-ver15) å­å¨è¿ç¨ã

| cdc.index_columns |              |                               |
| :---------------- | :----------- | :---------------------------- |
| **ååç§°**        | **æ°æ®ç±»å** | **è¯´æ**                      |
| object_id         | int          | æ´æ¹è¡¨ç IDã                 |
| column_name       | sysname      | ç´¢å¼åçåç§°ã                |
| index_ordinal     | tinyint      | ç´¢å¼ä¸­çååºå·ï¼ä» 1 å¼å§ï¼ã |
| column_id         | int          | æºè¡¨ä¸­çå IDã               |



### [cdc.lsn_time_mapping](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-tables/cdc-lsn-time-mapping-transact-sql?view=sql-server-ver15)

**ä¸ºæ¯ä¸ªå¨æ´æ¹è¡¨ä¸­å­å¨è¡çäºå¡è¿åä¸è¡ã** 

è¯¥è¡¨ç¨äºå¨æ¥å¿åºåå· (LSN) æäº¤å¼åæäº¤äºå¡çæ¶é´ä¹é´å»ºç«æ å°ã æ²¡æå¯¹åºçæ´æ¹è¡¨é¡¹çé¡¹ä¹å¯ä»¥è®°å½ä¸æ¥ï¼ ä»¥ä¾¿è¡¨å¨åæ´æ´»å¨å°æèæ åæ´æ´»å¨æé´å° LSN å¤ççå®æè¿ç¨è®°å½ä¸æ¥ã

ä¸è¦ç´æ¥æ¥è¯¢ç³»ç»è¡¨ï¼ è¯·æ¹ä¸ºæ§è¡ 

[sys.fn_cdc_map_lsn_to_time (transact-sql)](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-functions/sys-fn-cdc-map-lsn-to-time-transact-sql?view=sql-server-ver15) æ [sys.fn_cdc_map_time_to_lsn (transact-sql)](https://docs.microsoft.com/zh-cn/sql/relational-databases/system-functions/sys-fn-cdc-map-time-to-lsn-transact-sql?view=sql-server-ver15) ç³»ç»å½æ°ã

| cdc.lsn_time_mapping |                |                               |
| :------------------- | :------------- | :---------------------------- |
| ååç§°               | æ°æ®ç±»å       | è¯´æ                          |
| start_lsn            | binary(10)     | æäº¤çäºå¡ç LSNã            |
| tran_begin_time      | datetime       | ä¸ LSN å³èçäºå¡å¼å§çæ¶é´ã |
| tran_end_time        | datetime       | äºå¡ç»æçæ¶é´ã              |
| tran_id              | varbinary (10) | äºå¡ç IDã                   |



### systranschemas

**Systranschemas** è¡¨ç¨äºè·è¸ªäºå¡åå¸åå¿«ç§åå¸ä¸­åå¸çé¡¹ç®ä¸­çæ¶ææ´æ¹ã æ­¤è¡¨å­å¨å¨åå¸æ°æ®åºåè®¢éæ°æ®åºä¸­

| systranschemas  |          |                              |
| :-------------- | :------- | :--------------------------- |
| ååç§°          | æ°æ®ç±»å | è¯´æ                         |
| tabid           | int      | æ è¯åçäºæ¶ææ´æ¹çè¡¨é¡¹ç®ã |
| startlsn æ¶åç | binary   | æ¶ææ´æ¹å¼å§æ¶ç LSN å¼ã    |
| endlsn          | binary   | æ¶ææ´æ¹ç»ææ¶ç LSN å¼ã    |
| typeid          | int      | æ¶ææ´æ¹çç±»åã             |

### æ´æ¹è¡¨ï¼xxxx_CTï¼

**æ´æ¹è¡¨åå½æè·è¿ç¨ä»äºå¡æ¥å¿ä¸­æåçæºè¡¨æ´æ¹çå­å¨åºã**

åæ´æ°æ®æè·æ´æ¹è¡¨çåäºåæ¯åæ°æ®åã è¿äºåæä¾ä¸è®°å½çæ´æ¹æå³çéå ä¿¡æ¯ã å¶ä½åéåæºè¡¨ä¸­æåç§°æ è¯çæè·åï¼éå¸¸è¿ä¼æç±»åè¿è¡æ è¯ï¼ã è¿äºåä¿å­ä»æºè¡¨ä¸­æ¶éçæè·åæ°æ®ã

ä¾å¦ï¼

![](/images/sqlserver-cdc/6F740C70.png)

| systranschemas  |          |                              |
| :-------------- | :------- | :--------------------------- |
| ååç§°          | æ°æ®ç±»å | è¯´æ                         |
| __$start_lsn    | binary | æ´æ¹æå®çæäº¤æ¥å¿åºåå· (LSN)ãæäº¤ LSN ä¸ä»æ è¯å¨åä¸äºå¡ä¸­æäº¤çæ´æ¹ï¼èä¸è¿å¯¹è¿äºäºå¡è¿è¡æåºã |
| __$end_lsn | binary   |                                                              |
| __$seqval          | binary   | åä¸äºå¡ä¸­è¿è¡çæ´æ¹æåº    |
| __$operation          | int      | æ´æ¹ç¸å³çæä½ï¼1 = å é¤ã2 = æå¥ã3 = æ´æ°ï¼åæ è±¡ï¼ã4 = æ´æ°ï¼åæ åï¼ã             |
| __$update_mask  | varbinary |ä¸ä¸ªå¯åçä½æ©ç ï¼æ¯ä¸ªæè·åé½æä¸ä¸ªå¯¹åºçå®ä¹ä½ã å¯¹äºæå¥åå é¤é¡¹ï¼æ´æ°æ©ç å§ç»è®¾å®ææä½ã ä½æ¯ï¼æ´æ°è¡ä»è®¾å®ä¸æ´æ¹åå¯¹åºçé£äºä½								|
| æè·æºè¡¨çå... | ... | ... |



## 4.2 æ°æ®å®ä¹è¯­è¨ï¼DDLï¼

  **SQLè¯­è¨éä¸­è´è´£æ°æ®ç»æå®ä¹ä¸æ°æ®åºå¯¹è±¡å®ä¹çè¯­è¨ï¼ç±CREATEãALTERä¸DROPä¸ä¸ªè¯­æ³æç»æã**

- CREATE DATABASE
- ALTER DATABASE
- CREATE TABLE
- ALTER TABLE
- CREATE INDEX
- DROP INDEX
- ...

##  4.3 æ°æ®æçºµè¯­è¨ï¼DML) 

â	INSERTãUPDATEãDELETEä¸ç§æä»¤ã

## 4.4 æè·å®ä¾

- å¨ä¸ºæºè¡¨å¯ç¨åæ´æ°æ®æè·åï¼ä¼å¿½ç¥æºè¡¨çä»»ä½æ°åã å¦æå é¤äºæä¸ªè·è¸ªçåï¼åä¼ä¸ºå¨åç»­æ´æ¹é¡¹ä¸­ä¸ºè¯¥åæä¾ Null å¼ãä½æ¯ï¼å¦ææºè¡¨åçæ°æ®ç±»ååçäºæ´æ¹ï¼åè¿ç§æ´æ¹ä¼ä¼ æ­å°æ´æ¹è¡¨ä¸­ã

- å¯åæ¶ä¸åä¸ªæºè¡¨ç¸å³èçæå¤§æè·å®ä¾æ°ä¸ºä¸¤ä¸ªã
