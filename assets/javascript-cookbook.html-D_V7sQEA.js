import{_ as e,r as o,o as p,c,a as n,d as a,b as t,e as i}from"./app-CUvyzFzm.js";const l={},u=i(`<h1 id="javascript-cookbook" tabindex="-1"><a class="header-anchor" href="#javascript-cookbook"><span>JavaScript Cookbook</span></a></h1><h2 id="_1-c-加密-url-参数字符串传递到前端" tabindex="-1"><a class="header-anchor" href="#_1-c-加密-url-参数字符串传递到前端"><span>1. C# 加密 URL 参数字符串传递到前端</span></a></h2><p>C# 代码</p><div class="language-csharp line-numbers-mode" data-ext="cs" data-title="cs"><pre class="language-csharp"><code><span class="token class-name"><span class="token keyword">string</span></span> strText <span class="token operator">=</span> <span class="token string">&quot;测试-123&quot;</span><span class="token punctuation">;</span>

<span class="token class-name"><span class="token keyword">string</span></span> unicodeText <span class="token operator">=</span> System<span class="token punctuation">.</span>Web<span class="token punctuation">.</span>HttpUtility<span class="token punctuation">.</span><span class="token function">UrlEncode</span><span class="token punctuation">(</span>strText<span class="token punctuation">)</span><span class="token punctuation">;</span>
System<span class="token punctuation">.</span>Diagnostics<span class="token punctuation">.</span>Debug<span class="token punctuation">.</span><span class="token function">WriteLine</span><span class="token punctuation">(</span>unicodeText<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// Expected output:%e6%b5%8b%e8%af%95-123</span>

<span class="token class-name"><span class="token keyword">byte</span><span class="token punctuation">[</span><span class="token punctuation">]</span></span> bytes <span class="token operator">=</span> System<span class="token punctuation">.</span>Text<span class="token punctuation">.</span>Encoding<span class="token punctuation">.</span>ASCII<span class="token punctuation">.</span><span class="token function">GetBytes</span><span class="token punctuation">(</span>unicodeText<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token class-name"><span class="token keyword">string</span></span> ciphertext <span class="token operator">=</span> Convert<span class="token punctuation">.</span><span class="token function">ToBase64String</span><span class="token punctuation">(</span>bytes<span class="token punctuation">)</span><span class="token punctuation">;</span>
System<span class="token punctuation">.</span>Diagnostics<span class="token punctuation">.</span>Debug<span class="token punctuation">.</span><span class="token function">WriteLine</span><span class="token punctuation">(</span>ciphertext<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// Expected output:JWU2JWI1JThiJWU4JWFmJTk1LTEyMw==</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>JavaScript 代码</p><div class="language-javascript line-numbers-mode" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="token keyword">const</span> ciphertext <span class="token operator">=</span> <span class="token string">&#39;JWU2JWI1JThiJWU4JWFmJTk1LTEyMw==&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> translation <span class="token operator">=</span> <span class="token function">decodeURIComponent</span><span class="token punctuation">(</span>window<span class="token punctuation">.</span><span class="token function">atob</span><span class="token punctuation">(</span>ciphertext<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>translation<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// Expected output:&quot;测试-123&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>有关详细信息，请参阅：</p>`,7),r={href:"https://learn.microsoft.com/zh-cn/dotnet/api/system.web.httputility.urlencode",target:"_blank",rel:"noopener noreferrer"},k={href:"https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent",target:"_blank",rel:"noopener noreferrer"},d=n("hr",null,null,-1);function v(m,b){const s=o("ExternalLinkIcon");return p(),c("div",null,[u,n("ul",null,[n("li",null,[n("a",r,[a("HttpUtility.UrlEncode 方法[MSDN]"),t(s)])]),n("li",null,[n("a",k,[a("decodeURIComponent()[MDN]"),t(s)])])]),d])}const _=e(l,[["render",v],["__file","javascript-cookbook.html.vue"]]),g=JSON.parse('{"path":"/Javascript/javascript-cookbook.html","title":"JavaScript Cookbook","lang":"zh-CN","frontmatter":{},"headers":[{"level":2,"title":"1. C# 加密 URL 参数字符串传递到前端","slug":"_1-c-加密-url-参数字符串传递到前端","link":"#_1-c-加密-url-参数字符串传递到前端","children":[]}],"git":{"updatedTime":1691661334000},"filePathRelative":"Javascript/javascript-cookbook.md"}');export{_ as comp,g as data};