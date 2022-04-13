import type { NavbarConfig } from '@vuepress/theme-default'
import { version } from '../meta'

export const zh: NavbarConfig = [
  {
    text: '首页',
    link: './',
  },
  {
    text: `v0.0.1`,
    children: [
      {
        text: '更新日志',
        link: 'http://baidu.com',
      }
    ],
  }
]