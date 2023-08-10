# JavaScript Cookbook

## 1. C# 加密 URL 参数字符串传递到前端

C# 代码

```csharp
string strText = "测试-123";

string unicodeText = System.Web.HttpUtility.UrlEncode(strText);
System.Diagnostics.Debug.WriteLine(unicodeText);
// Expected output:%e6%b5%8b%e8%af%95-123

byte[] bytes = System.Text.Encoding.ASCII.GetBytes(unicodeText);
string ciphertext = Convert.ToBase64String(bytes);
System.Diagnostics.Debug.WriteLine(ciphertext);
// Expected output:JWU2JWI1JThiJWU4JWFmJTk1LTEyMw==
```



JavaScript 代码

```javascript
const ciphertext = 'JWU2JWI1JThiJWU4JWFmJTk1LTEyMw==';
const translation = decodeURIComponent(window.atob(ciphertext));
console.log(translation);
// Expected output:"测试-123"
```



有关详细信息，请参阅：

- [HttpUtility.UrlEncode 方法[MSDN]](https://learn.microsoft.com/zh-cn/dotnet/api/system.web.httputility.urlencode)
- [decodeURIComponent()[MDN]](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent)

---

