import type { SidebarConfig } from '@vuepress/theme-default'

export const zh: SidebarConfig = {
  '/':[{
    text : '列表',
    children:[
      '/sqlserver-performance-analysis.md',
      '/sqlserver-profiler.md',
      '/sqlserver-cdc.md',
      'dottrace.md',
      'windows-server-performance-analysis.md',
    ]
  }]
}