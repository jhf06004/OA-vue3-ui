import {createApp} from 'vue'
import App from './App.vue'

import 'element-plus/dist/index.css'
import '@/styles/index.scss' // global css

import '@/permission.js' // 路由守卫
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'


import router from '@/router'
import pinia from '@/store'

import dayjs from 'dayjs'
import 'virtual:svg-icons-register'
import svgIcon from "@/components/SvgIcon/index.vue";

// 引入vxe-table
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import { IconPark } from '@/plugins/iconPark'

const app = createApp(App)
app.config.productionTip = false
// 全局挂载dayjs
app.config.globalProperties.dayjs = dayjs
app
    .use(pinia)
    .use(router)
    .use(IconPark)
    .use(VXETable)
    .use(ElementPlus, {locale: zhCn,size:'default'})
    .component('svg-icon', svgIcon)
    .mount('#app')
