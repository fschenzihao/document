import { navbar, sidebar } from './configs';
import { docsearchPlugin } from '@vuepress/plugin-docsearch';
import { defaultTheme } from '@vuepress/theme-default';
import { viteBundler } from '@vuepress/bundler-vite';
import { mdEnhancePlugin } from "vuepress-plugin-md-enhance";
import { defineUserConfig } from 'vuepress';

export default defineUserConfig({
  base: '/document/',
  public: 'docs/.vuepress/public',

  // 站点配置
  lang: 'zh-CN',
  title: 'Document',
  description: '',

  bundler: viteBundler(),
  // 主题和它的配置
  theme: defaultTheme({
    logo: 'images/logo/logo.png',
    // 导航栏配置
    navbar: navbar.zh,
    // 侧边栏配置
    sidebar: 'auto', // sidebar.zh

    // 参与编辑页信息相关
    // 项目仓库的 URL
    repo: 'fschenzihao/document',
    // 仓库分支
    docsBranch: 'master',
    // 文档源文件存放在仓库中的目录名
    docsDir: 'docs',

    // page meta
    editLink: true,
    editLinkText: '编辑此页',
    lastUpdated: true,
    lastUpdatedText: '上次编辑于',
    contributors: false,
    contributorsText: '贡献者',

    // 自定义容器缺省文本
    tip: '提示',
    warning: '注意',
    danger: '警告',

    // 404 页面随机显示文本
    notFound: ['兄弟不要乱搞哟🔞🍌', '进错地方了⛔'],
    backToHome: '返回首页',
  }),
  plugins: [
    // Algolia DocSearch 网站搜索功能
    docsearchPlugin({
      apiKey: 'b33f6df6a3320c1166275edae4db2d80',
      appId: '9XT7J1NNVO',
      indexName: 'fschenzihao',
      placeholder: '搜索文档',
      translations: {
        button: {
          buttonText: '搜索文档',
        },
      },
    }),
    // Markdown mermaid 插件
    mdEnhancePlugin({
      // 启用 mermaid
      mermaid: true,
    }),
  ],
});
