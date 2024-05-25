import{_ as n,r,o as i,c as t,a as e,d as s,b as o,e as c}from"./app-CUvyzFzm.js";const l={},d=c(`<h1 id="cefsharp-cook-book" tabindex="-1"><a class="header-anchor" href="#cefsharp-cook-book"><span>CefSharp Cook Book</span></a></h1><h2 id="_1-异步-js-操作" tabindex="-1"><a class="header-anchor" href="#_1-异步-js-操作"><span>1.异步 js 操作</span></a></h2><div class="language-c# line-numbers-mode" data-ext="c#" data-title="c#"><pre class="language-c#"><code>/* If your script uses a Promise then you must use the EvaluateScriptAsPromiseAsync method, it differs slightly
 * in that you must return the value.
 * The following will return a Promise that after one second resolves with a simple object
 * 如果脚本使用Promise，则必须使用EvaluateScriptAsPromiseSync方法，它略有不同
 * 其中必须返回值
 * 如下所示：该Promise在一秒钟后 resolves 一个 object
*/

var script = &quot;return new Promise(function(resolve, reject) { setTimeout(resolve.bind(null, { a: &#39;CefSharp&#39;, b: 42, }), 1000); });&quot;

JavascriptResponse javascriptResponse = await browser.EvaluateScriptAsPromiseAsync(script);

// You can access the object using the dynamic keyword for convenience.
// 可以使用 dynamic 关键字方便访问对象。
dynamic result = javascriptResponse.Result;
var a = result.a;
var b = result.b;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,3),u={href:"https://github.com/cefsharp/CefSharp/wiki/General-Usage#2-how-do-you-call-a-javascript-method-that-returns-a-result",target:"_blank",rel:"noopener noreferrer"};function v(h,m){const a=r("ExternalLinkIcon");return i(),t("div",null,[d,e("p",null,[s("相关详细信息，请参阅："),e("a",u,[s("2-how-do-you-call-a-javascript-method-that-returns-a-result"),o(a)])])])}const b=n(l,[["render",v],["__file","cefsharp-cookbook.html.vue"]]),f=JSON.parse('{"path":"/dotnet/cefsharp-cookbook.html","title":"CefSharp Cook Book","lang":"zh-CN","frontmatter":{},"headers":[{"level":2,"title":"1.异步 js 操作","slug":"_1-异步-js-操作","link":"#_1-异步-js-操作","children":[]}],"git":{"updatedTime":1676018860000},"filePathRelative":"dotnet/cefsharp-cookbook.md"}');export{b as comp,f as data};
