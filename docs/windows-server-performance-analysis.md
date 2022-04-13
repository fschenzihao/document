>📃版本: 1.0
>
>📆日期: 2021-12-16

[Toc]

# Windows Server 系统的性能分析

windows系统的性能分析可以通过以下两种工具进行：

- 资源监视器：实时查看系统性能数据。可以查看系统的硬件资源（CPU、内存、硬盘、网络）的详细实时信息。
- 性能监视器：记录到日志。可以通过创建`数据收集器`，将系统性能数据写到日志文件中。

---

## 1 资源监视器

### 1.1打开资源监视器

- 通过开始菜单打开。

  依次单击"开始"、"**Windows 管理工具**"，右键单击"**资源监视器**"，然后点击"**以管理员身份运行**"。

  ![Open](https://gitee.com/ChanHowe/document/raw/master/%E5%9B%BE%E5%BA%8A/%E8%B5%84%E6%BA%90%E7%9B%91%E8%A7%86%E5%99%A8/Open.jpg)

- 通过命令提示符打开。

  在**"运行"**窗口中输入命令`perfmon /res`

  ![Open_cmd](https://gitee.com/ChanHowe/document/raw/master/%E5%9B%BE%E5%BA%8A/%E8%B5%84%E6%BA%90%E7%9B%91%E8%A7%86%E5%99%A8/Open_cmd.jpg)

### 1.2 CPU

可以通过对`CPU`或`平均CPU`列倒序排序，获得使用CPU资源最大的应用程序或服务。

![CPU](https://gitee.com/ChanHowe/document/raw/master/%E5%9B%BE%E5%BA%8A/%E8%B5%84%E6%BA%90%E7%9B%91%E8%A7%86%E5%99%A8/CPU.JPG)

### 1.3 内存

![Memory](https://gitee.com/ChanHowe/document/raw/master/%E5%9B%BE%E5%BA%8A/%E8%B5%84%E6%BA%90%E7%9B%91%E8%A7%86%E5%99%A8/Memory.JPG)

### 1.4 硬盘

![HardDisk](https://gitee.com/ChanHowe/document/raw/master/%E5%9B%BE%E5%BA%8A/%E8%B5%84%E6%BA%90%E7%9B%91%E8%A7%86%E5%99%A8/HardDisk.JPG)

### 1.5 网络

![NetWork](https://gitee.com/ChanHowe/document/raw/master/%E5%9B%BE%E5%BA%8A/%E8%B5%84%E6%BA%90%E7%9B%91%E8%A7%86%E5%99%A8/NetWork.JPG)

---

## 2 性能监视器

### 2.1 打开性能监视器

- 通过开始菜单打开。

  依次单击"开始"、"**Windows 管理工具**"，右键单击"**性能监视器**"，然后点击"**以管理员身份运行**"。

- 通过命令提示符打开。

  在**"运行"**窗口中输入命令`perfmon`

![Summary](https://gitee.com/ChanHowe/document/raw/master/%E5%9B%BE%E5%BA%8A/%E6%80%A7%E8%83%BD%E7%9B%91%E8%A7%86%E5%99%A8/Summary.jpg)

### 2.2 新建数据收集器

#### 2.2.1 新建数据收集器

![CreateNewDataCollector](https://gitee.com/ChanHowe/document/raw/master/%E5%9B%BE%E5%BA%8A/%E6%80%A7%E8%83%BD%E7%9B%91%E8%A7%86%E5%99%A8/CreateNewDataCollector.jpg)

####  2.2.2 设置"数据收集器"名称和创建方式

![CreateNewDataCollector_Name](https://gitee.com/ChanHowe/document/raw/master/%E5%9B%BE%E5%BA%8A/%E6%80%A7%E8%83%BD%E7%9B%91%E8%A7%86%E5%99%A8/CreateNewDataCollector_Name.jpg)

#### 2.2.3 选择收集的类型数据

![CreateNewDataCollector_Type](https://gitee.com/ChanHowe/document/raw/master/%E5%9B%BE%E5%BA%8A/%E6%80%A7%E8%83%BD%E7%9B%91%E8%A7%86%E5%99%A8/CreateNewDataCollector_Type.jpg)

#### 2.2.4 选择性能计数器

![CreateNewDataCollector_AddCounter](https://gitee.com/ChanHowe/document/raw/master/%E5%9B%BE%E5%BA%8A/%E6%80%A7%E8%83%BD%E7%9B%91%E8%A7%86%E5%99%A8/CreateNewDataCollector_AddCounter.jpg)

添加以下计数器：

- `PhysicalDisk`：物理磁盘

![CreateNewDataCollector_SelectCounter](https://gitee.com/ChanHowe/document/raw/master/%E5%9B%BE%E5%BA%8A/%E6%80%A7%E8%83%BD%E7%9B%91%E8%A7%86%E5%99%A8/CreateNewDataCollector_SelectCounter.jpg)

- `Processor`： CPU。步骤同上。

​	添加计数器后继续`"下一页"`。

#### 2.2.5 设置日志保存路径

![CreateNewDataCollector_DataFilePath](https://gitee.com/ChanHowe/document/raw/master/%E5%9B%BE%E5%BA%8A/%E6%80%A7%E8%83%BD%E7%9B%91%E8%A7%86%E5%99%A8/CreateNewDataCollector_DataFilePath.jpg)

#### 2.2.6 创建完成

![CreateNewDataCollector_Finish](https://gitee.com/ChanHowe/document/raw/master/%E5%9B%BE%E5%BA%8A/%E6%80%A7%E8%83%BD%E7%9B%91%E8%A7%86%E5%99%A8/CreateNewDataCollector_Finish.jpg)

==设置"性能收集器"的持续时间==

![DataCollector_Properties_StopCondition](https://gitee.com/ChanHowe/document/raw/master/%E5%9B%BE%E5%BA%8A/%E6%80%A7%E8%83%BD%E7%9B%91%E8%A7%86%E5%99%A8/DataCollector_Properties_StopCondition.jpg)

### 2.3 启动"数据收集器"

![CreateNewDataCollector](https://gitee.com/ChanHowe/document/raw/master/%E5%9B%BE%E5%BA%8A/%E6%80%A7%E8%83%BD%E7%9B%91%E8%A7%86%E5%99%A8/DataCollector_Start.jpg)



### 计数器的日志解读*

#### Physical Disk

- 单次I/O大小

  Avg. Disk Bytes/Read 单次Read I/O大小（bytes）

  Avg. Disk Bytes/Write 单次Write I/O大小（bytes）

- I/O响应时间

  Avg. Disk sec/Read   每次读取所需时间(ms)，理想范围<15ms

  Avg. Disk sec/Write   每次写入所需时间(ms)，理想范围<15ms

  Avg. Disk sec/Transfer 每次读取/写入所需时间(ms)

- 队列长度

  Avg. Disk Queue Length 磁盘平均队列长度，理想范围<=2（资源监视器中的磁盘队列长度）

- 当前IOPS

  Disk Reads/sec 每秒读取操作的速率。

  Disk Writes/sec 每秒写入操作的速率。

  Disk Transfers/sec 每秒读取/写入操作总速率。

  > **IOPS参考值**
  >
  > ==机械硬盘==
  >
  > ​	理论最大IOPS计算公式：IOPS = 1000 ms/ ( `SeekTime` + `RotationalLatency` )
  >
  > ​	`SeekTime`：磁头寻道时间。硬盘标称数据，一般产品范围在3-15ms。
  >
  > ​	`RotationalLatency`:盘片旋转延迟时间。例如，若机械硬盘转速7200rpm，则每圈用时≈8.33ms（60*1000/7200≈8.33），然后取半圈中间值≈4.16。
  >
  > ​	
  >
  > ​	最大IOPS参考值：
  >
  > ​	SATA 7200 rpm ≈ 80 IOPS
  >
  > ​	SAS 10K rpm ≈  140 IOPS
  >
  > ​	SAS 15 rpm ≈ 180 IOPS
  >
  > ==固态硬盘==
  >
  > ​	参考官方IOPS数据
  >
  > **IOPS实际值**
  >
  > ​	可以通过 `CrystalDiskMark`、`AS SSDBenchMark`等硬盘测试跑分软件实测得出。

  

- RAID阵列的每块硬盘IOPS计算
| RAID           | 每块硬盘的IOPS(n)              |
| :------------- | :----------------------------- |
| RAID 0         | n = (reads+writes)/硬盘数      |
| RAID 1/RAID 10 | n = (reads+ (2*writes))/硬盘数 |
| RAID 5         | n = (reads+ (4*writes))/硬盘数 |

例如：跟踪到硬盘最大负荷时(Disk Reads/sec = 320，Disk Writes/sec = 100)，RAID 5组合，硬盘数=4，硬盘的最大IOPS=140.

​	根据公式计算得出：每块硬盘的IOPS=(320+(4*100))/4 =180；则大于实际的140 IOPS。

​	那么要多少块硬盘组RAID 5才能满足180IOPS：720/140≈5.1428，则需要6块硬盘。
