import type { NavbarConfig } from '@vuepress/theme-default'
import { version } from '../meta'

export const zh: NavbarConfig = [
  {
    text: '首页',
    link: '/',
  },
  {
    text: version,
    children: [
      {
        text: '更新日志',
        link: 'https://github.com/fschenzihao/document/commits/master',
      }
    ],
  }
]