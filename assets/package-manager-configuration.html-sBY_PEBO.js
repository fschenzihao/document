import{_ as c,r as t,o as l,c as o,a as n,d as s,b as e,e as i}from"./app-CUvyzFzm.js";const p={},r=i(`<h1 id="包管理器配置" tabindex="-1"><a class="header-anchor" href="#包管理器配置"><span>包管理器配置</span></a></h1><h2 id="npm" tabindex="-1"><a class="header-anchor" href="#npm"><span>npm</span></a></h2><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token comment"># 设置源为淘宝的npmjs.org国内镜像</span>
<span class="token function">npm</span> config <span class="token builtin class-name">set</span> registry https://registry.npmmirror.com/

<span class="token comment"># 设置依赖包的HTTP代理服务器地址</span>
<span class="token function">npm</span> config <span class="token builtin class-name">set</span> proxy http://proxy.example.com:8080

<span class="token comment"># 设置全局包目录（会自动在目录下创建node_modules文件夹）</span>
<span class="token function">npm</span> config <span class="token builtin class-name">set</span> prefix D:<span class="token punctuation">\\</span>dev<span class="token punctuation">\\</span>nodejs

<span class="token comment"># 设置缓存目录（会自动在目录下创建_cacache文件夹）</span>
<span class="token function">npm</span> config <span class="token builtin class-name">set</span> cache D:<span class="token punctuation">\\</span>dev<span class="token punctuation">\\</span>nodejs

<span class="token comment"># 查看设置</span>
<span class="token function">npm</span> config <span class="token function">ls</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>亦可以直接修改当前用户下的<code>C:\\Users\\foo\\.npmrc</code>文件</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token assign-left variable">registry</span><span class="token operator">=</span>https://registry.npmmirror.com/
<span class="token assign-left variable">prefix</span><span class="token operator">=</span>D:<span class="token punctuation">\\</span>dev<span class="token punctuation">\\</span>nodejs<span class="token punctuation">\\</span>node_global
<span class="token assign-left variable">cache</span><span class="token operator">=</span>D:<span class="token punctuation">\\</span>dev<span class="token punctuation">\\</span>nodejs<span class="token punctuation">\\</span>node_cache
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,5),d={href:"https://docs.npmjs.com/cli/v10/commands/npm-config",target:"_blank",rel:"noopener noreferrer"},m=i(`<h2 id="yarn" tabindex="-1"><a class="header-anchor" href="#yarn"><span>yarn</span></a></h2><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token comment"># 全局安装yarn</span>
<span class="token function">npm</span> <span class="token function">install</span> <span class="token parameter variable">-g</span> <span class="token function">yarn</span>

<span class="token comment"># 验证安装-查看yarn版本号</span>
<span class="token function">yarn</span> <span class="token parameter variable">-v</span>

<span class="token comment"># 设置源代理</span>
<span class="token function">yarn</span> config <span class="token builtin class-name">set</span> registry https://registry.npmmirror.com/

<span class="token comment"># 设置缓存目录</span>
<span class="token function">yarn</span> config <span class="token builtin class-name">set</span> cache-folder D:<span class="token punctuation">\\</span>dev<span class="token punctuation">\\</span>nodejs<span class="token punctuation">\\</span>yarn_cache

<span class="token comment"># 设置全局包目录</span>
<span class="token function">yarn</span> config <span class="token builtin class-name">set</span> global-folder D:<span class="token punctuation">\\</span>dev<span class="token punctuation">\\</span>nodejs<span class="token punctuation">\\</span>yarn_global

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2),u={href:"https://classic.yarnpkg.com/en/docs/cli/config",target:"_blank",rel:"noopener noreferrer"},v=n("div",{class:"custom-container warning"},[n("p",{class:"custom-container-title"},"注意"),n("p",null,"注意 命令提示行需要管理员运行")],-1);function k(b,h){const a=t("ExternalLinkIcon");return l(),o("div",null,[r,n("p",null,[s("有关详细信息，请参阅 "),n("a",d,[s("npm-config (npm Docs)"),e(a)])]),m,n("p",null,[s("有关详细信息，请参阅 "),n("a",u,[s("yarn config (yarn 官方文档)"),e(a)])]),v])}const f=c(p,[["render",k],["__file","package-manager-configuration.html.vue"]]),_=JSON.parse('{"path":"/nodejs/package-manager-configuration.html","title":"包管理器配置","lang":"zh-CN","frontmatter":{},"headers":[{"level":2,"title":"npm","slug":"npm","link":"#npm","children":[]},{"level":2,"title":"yarn","slug":"yarn","link":"#yarn","children":[]}],"git":{"updatedTime":1716531979000},"filePathRelative":"nodejs/package-manager-configuration.md"}');export{f as comp,_ as data};
