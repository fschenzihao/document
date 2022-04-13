import { defineUserConfig } from 'vuepress'
import type { DefaultThemeOptions } from 'vuepress'
import { navbar, sidebar } from './configs'

export default defineUserConfig<DefaultThemeOptions>({
  base: '/document/',
  // public:'docs/.vuepress/public',

  // 站点配置
  lang: 'zh-CN',
  title: 'Document',
  description: '',

  // 主题和它的配置
  theme: '@vuepress/theme-default',
  themeConfig: {
    logo: 'images/logo/logo.png',
    navbar: navbar.zh,
    sidebar: sidebar.zh,
  }
})