# 对 Windows 窗体控件进行线程安全调用

## 不安全的跨线程调用

直接从未创建控件的线程调用该控件是不安全的。 

以下代码片段演示了对 `TextBox` 控件的不安全调用。

```csharp
// Button1_Click 事件处理程序创建一个新的 WriteTextUnsafe 线程，该线程直接设置主线程的 TextBox.Text 属性。

private void button1_Click(object sender, EventArgs e)
{
    var thread = new Thread(new ThreadStart(WriteTextUnsafe));
    thread.Start();
}

private void WriteTextUnsafe()
{
    textBox1.Text = "This text was set unsafely.";
}
```

Visual Studio 调试器通过引发 `InvalidOperationException` 异常，并显示消息“跨线程操作无效。控件从创建它的线程以外的线程访问。”



## 安全的跨线程调用

以下代码示例演示了两种从非 Windows 窗体控件的线程安全调用该窗体的方法：

1. `System.Windows.Forms.Control.Invoke` 方法，它从主线程调用委托以调用控件。
2. `System.ComponentModel.BackgroundWorker` 组件，它提供事件驱动模型。



### 示例：将 Invoke 方法与委托配合使用

下面的示例演示了使用 `Invoke` 方法对 Windows 窗体控件进行线程安全调用 。 

- 使用 `Thread` 来创建线程任务

  通过查询 [System.Windows.Forms.Control.InvokeRequired](https://learn.microsoft.com/zh-cn/dotnet/api/system.windows.forms.control.invokerequired) 属性，该属性将控件的创建线程 ID 与调用线程 ID 进行比较。  如果线程 ID 相同，则直接调用控件。 如果线程 ID 不同，它会使用来自主线程的委托调用 [Control.Invoke](https://learn.microsoft.com/zh-cn/dotnet/api/system.windows.forms.control.invoke) 方法，从而实现调用控件。

```csharp
// Button1_Click 事件处理程序创建新线程并运行 WriteTextSafe 方法
private void button1_Click(object sender, EventArgs e)
{
    var threadParameters = new System.Threading.ThreadStart(delegate { WriteTextSafe("This text was set safely."); });
    var thread = new System.Threading.Thread(threadParameters);
    thread.Start();
}

public void WriteTextSafe(string text)
{
    if (textBox1.InvokeRequired)
    {
        Action safeWrite = delegate { WriteTextSafe($"{text} (THREAD)"); };
        textBox1.Invoke(safeWrite);
    }
    else
        textBox1.Text = text;
}
```

- 使用 `Task` 来创建线程任务

``` csharp
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;

public partial class MainForm : Form
{
    public MainForm()
    {
        InitializeComponent();
        
        // 启动一个返回结果的任务
        Task<string> task = Task.Factory.StartNew(() =>
        {
            Thread.Sleep(2000); // 模拟耗时操作
            return "Hello from Task!";
        });
        

        // 使用 ContinueWith 避免阻塞UI线程, 在任务完成后处理结果，并确保在UI线程执行
        task.ContinueWith(t =>
        {
            if (t.IsFaulted)
            {
                MessageBox.Show("任务出错：" + t.Exception.InnerException.Message);
            }
            else
            {
                // 安全地更新UI
                Invoke((Action)(() => 
                {
                    labelResult.Text = t.Result; 
                }));
            }
        }, TaskScheduler.FromCurrentSynchronizationContext());
    }
}
```



### 示例：使用 BackgroundWorker 事件处理程序

下面的示例演示了使用 `BackgroundWorker` 组件对 Windows 窗体控件进行线程安全调用 。

`BackgroundWorker` 组件的后台线程引发不与主线程交互的 [BackgroundWorker.DoWork](https://learn.microsoft.com/zh-cn/dotnet/api/system.componentmodel.backgroundworker.dowork#system-componentmodel-backgroundworker-dowork) 事件。 主线程运行 [BackgroundWorker.ProgressChanged](https://learn.microsoft.com/zh-cn/dotnet/api/system.componentmodel.backgroundworker.progresschanged#system-componentmodel-backgroundworker-progresschanged) 和 [BackgroundWorker.RunWorkerCompleted](https://learn.microsoft.com/zh-cn/dotnet/api/system.componentmodel.backgroundworker.runworkercompleted#system-componentmodel-backgroundworker-runworkercompleted) 事件处理程序，通过它们实现调用主线程的控件。

```csharp
using System;
using System.ComponentModel;
using System.Drawing;
using System.Threading;
using System.Windows.Forms;

public class BackgroundWorkerForm : Form
{
    private BackgroundWorker backgroundWorker1;
    private Button button1;
    private TextBox textBox1;

    [STAThread]
    static void Main()
    {
        Application.SetCompatibleTextRenderingDefault(false);
        Application.EnableVisualStyles();
        Application.Run(new BackgroundWorkerForm());
    }
    
    public BackgroundWorkerForm()
    {
        // 使用 RunWorkerCompleted 事件处理程序来设置 TextBox 控件的 Text 属性。
        backgroundWorker1 = new BackgroundWorker();
        backgroundWorker1.DoWork += new DoWorkEventHandler(BackgroundWorker1_DoWork);
        backgroundWorker1.RunWorkerCompleted += new RunWorkerCompletedEventHandler(BackgroundWorker1_RunWorkerCompleted);
        button1 = new Button
        {
            Location = new Point(15, 55),
            Size = new Size(240, 20),
            Text = "Set text safely with BackgroundWorker"
        };
        button1.Click += new EventHandler(Button1_Click);
        textBox1 = new TextBox
        {
            Location = new Point(15, 15),
            Size = new Size(240, 20)
        };
        Controls.Add(button1);
        Controls.Add(textBox1);
    }
    
    private void Button1_Click(object sender, EventArgs e)
    {
        backgroundWorker1.RunWorkerAsync();
    }

    private void BackgroundWorker1_DoWork(object sender, DoWorkEventArgs e)
    {
        // Sleep 2 seconds to emulate getting data.
        Thread.Sleep(2000);
        e.Result = "This text was set safely by BackgroundWorker.";
    }

    private void BackgroundWorker1_RunWorkerCompleted(object sender, RunWorkerCompletedEventArgs e)
    {
        textBox1.Text = e.Result.ToString();
    }
}
```



相关详细信息，请参阅：[如何：对 Windows 窗体控件进行线程安全调用](https://learn.microsoft.com/zh-cn/dotnet/desktop/winforms/controls/how-to-make-thread-safe-calls-to-windows-forms-controls?view=netframeworkdesktop-4.8)
