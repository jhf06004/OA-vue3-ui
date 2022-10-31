# 项目安装
yarn install
# 项目运行
yarn run dev
# 项目打包
yarn run build

# vite官网
https://cn.vitejs.dev/
# element-plus组件库官网
https://element-plus.gitee.io/zh-CN
# 全局状态管理-pinia官网
https://pinia.web3doc.top/
# 时间格式化-dayjs官网
https://day.js.org/docs/zh-CN

# 表格组件库- vxe-table文档网址

https://vxetable.cn/v4

### 注意事项

本项目使用技术栈 vue3 + vite + pinia + element-plus组件库
1、node版本使用12以上
2、全局状态管理请使用pinia而不是vuex
3、前端时间格式化尽量使用dayjs来操作

## 项目说明

oa-vue3-ui
├─public --公共文件
├─languages
├─src
│ ├─api：接口文件
│ ├─assets：静态文件
│ ├─components：组件文件夹
│ ├─icon：存放svg文件图标
│ ├─layout：整体项目布局、
│ │ └─components
│ │ ├─sidebar：侧边栏布局
│ │ └─topNav：顶部导航栏布局
│ ├─plugins： 插件配置文件，包含权限配置以及IconPark图标库配置
│ ├─router：路由管理
│ ├─store：全局状态管理
│ ├─styles：全局样式文件
│ ├─utils：工具方法文件夹
│ ├─views：视图文件夹
│ ├─App.vue
│ ├─main.vue: 入口文件
│ ├─permission: 菜单权限
│ ├─settings: 项目设置文件
├─.env.development： 开发环境配置文件
├─.env.production： 生产环境配置文件
├─.eslintrc：.eslint检测文件
├─.gitignore： git配置文件
├─babel.config：babel配置文件
├─index.html
├─package.json:项目运行以及插件版本
└─vite.config： vit项目配置文件
