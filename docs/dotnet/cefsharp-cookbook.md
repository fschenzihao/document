# CefSharp Cook Book

## 1.异步 js 操作

```c#
/* If your script uses a Promise then you must use the EvaluateScriptAsPromiseAsync method, it differs slightly
 * in that you must return the value.
 * The following will return a Promise that after one second resolves with a simple object
 * 如果脚本使用Promise，则必须使用EvaluateScriptAsPromiseSync方法，它略有不同
 * 其中必须返回值
 * 如下所示：该Promise在一秒钟后 resolves 一个 object
*/

var script = "return new Promise(function(resolve, reject) { setTimeout(resolve.bind(null, { a: 'CefSharp', b: 42, }), 1000); });"

JavascriptResponse javascriptResponse = await browser.EvaluateScriptAsPromiseAsync(script);

// You can access the object using the dynamic keyword for convenience.
// 可以使用 dynamic 关键字方便访问对象。
dynamic result = javascriptResponse.Result;
var a = result.a;
var b = result.b;
```

相关详细信息，请参阅：[2-how-do-you-call-a-javascript-method-that-returns-a-result](https://github.com/cefsharp/CefSharp/wiki/General-Usage#2-how-do-you-call-a-javascript-method-that-returns-a-result)

