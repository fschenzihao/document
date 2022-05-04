import { defineUserConfig } from 'vuepress'
import type { DefaultThemeOptions } from 'vuepress'
import { navbar, sidebar } from './configs'
import  copyCode  from 'vuepress-plugin-copy-code2'
const { docsearchPlugin } = require('@vuepress/plugin-docsearch')
const { defaultTheme } = require('@vuepress/theme-default')

module.exports = {
  base: '/document/',
  public: 'docs/.vuepress/public',

  // 站点配置
  lang: 'zh-CN',
  title: 'Document',
  description: '',

  // 主题和它的配置
  theme: defaultTheme({
    logo: 'images/logo/logo.png',
    // 导航栏配置
    navbar: navbar.zh,
    // 侧边栏配置
    sidebar: sidebar.zh,

    // 参与编辑页信息相关
    // 项目仓库的 URL
    repo: 'fschenzihao/document',
    // 仓库分支
    docsBranch: 'master',
    // 文档源文件存放在仓库中的目录名
    docsDir: 'docs',

    // page meta
    editLink: true,
    editLinkText: '在 GitHub 上编辑此页',
    lastUpdated: true,
    lastUpdatedText: '上次更新',
    contributors: true,
    contributorsText: '贡献者',

    // 自定义容器缺省文本
    tip: '提示',
    warning: '注意',
    danger: '警告',

    // 404 页面随机显示文本
    notFound: [
      '兄弟不要乱搞哟🔞🍌',
      '进错地方了⛔',
    ],
    backToHome: '返回首页',
  }),
  plugins: [
    copyCode({
      duration: 2500,
      pure: true,
    }),
    docsearchPlugin({
      apiKey: 'b33f6df6a3320c1166275edae4db2d80',
      appId:'9XT7J1NNVO',
      indexName:'fschenzihao',
      placeholder: '搜索文档',
      translations: {
        button: {
          buttonText: '搜索文档',
        },
      },
    }),
  ]
}