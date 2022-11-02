import router, {constantRoutes, dynamicRoutes} from '@/router'
import {defineStore} from "pinia";
import {getRouters} from "@/api/menu.js";
import auth from "@/plugins/auth.js";
import ParentView from '@/components/ParentView/index.vue'
import Layout from '@/layout/index.vue'
import {defineAsyncComponent} from "vue";

export const usePermissionStore = defineStore({
  id: 'permissionStore',
  state: () => {
    return {
      routes: [],
      addRoutes: [],
      currentRoutes: [],

      defaultRoutes: [], // 默认路由
      topBarRouters: [], // 顶部导航路由
      sidebarRouters: [] // 侧边栏路由
    }
  },
  getters: {
    getRoutes() {
      return this.routes
    },
    getCurrentRoutes(state) {
      return state.currentRoutes
    },
    getTopBarRouters(state) {
      return state.topBarRouters
    },
    getSidebarRouters(state) {
      return state.sidebarRouters
    }
  },
  actions: {
    setRoutes(routes) {
      this.addRoutes = routes
      this.routes = constantRoutes.push(...routes)
    },
    // 生成路由
    generateRoutes() {
      return new Promise(resolve => {
        // 向后端请求路由数据
        getRouters().then(res => {
          const sdata = JSON.parse(JSON.stringify(res.data))
          const rdata = JSON.parse(JSON.stringify(res.data))
          const sidebarRoutes = filterAsyncRouter(sdata)
          const rewriteRoutes = filterAsyncRouter(rdata, false, true)
          const asyncRoutes = filterDynamicRoutes(dynamicRoutes);
          rewriteRoutes.push({path: '*', redirect: '/404', hidden: true})
          if (asyncRoutes && asyncRoutes.length) {
            asyncRoutes.forEach(asyncRoute => {
              router.addRoute(asyncRoute);
            })
          }
          this.addRoutes = rewriteRoutes
          this.routes = constantRoutes.concat(rewriteRoutes)
          this.sidebarRouters = constantRoutes.concat(sidebarRoutes)
          // TODO--待优化
          this.sidebarRouters.forEach(item => {
            router.addRoute(item)
          })
          this.defaultRoutes = sidebarRoutes
          this.topBarRouters = sidebarRoutes
          resolve(rewriteRoutes)
        })
      })
    },
    setCurrentRoutes(routes) {
      this.currentRoutes = routes
    }
  }
})

// 递归添加层级路由
function addRouterItem(routerData) {
  console.log('routerData', routerData)
  if (routerData && routerData.length) {
    routerData.forEach(item => {
      if (item.children && item.children.length) {
        addRouterItem(item.children)
      } else {
        item.path = '/' + item.path
        router.addRoute(item)
      }
    })
  }
}

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
  return asyncRouterMap.filter(route => {
    if (type && route.children) {
      route.children = filterChildren(route.children)
    }
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
      } else if (route.component === 'ParentView') {
        route.component = ParentView
      } else if (route.component === 'InnerLink') {
        // TODO--iframe内嵌页面暂未开发
        // route.component = InnerLink
      } else {
        route.component = loadView(route.component)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type)
    } else {
      delete route['children']
      delete route['redirect']
    }
    return true
  })
}

function filterChildren(childrenMap, lastRouter = false) {
  var children = []
  childrenMap.forEach((el, index) => {
    if (el.children && el.children.length) {
      if (el.component === 'ParentView' && !lastRouter) {
        el.children.forEach(c => {
          c.path = el.path + '/' + c.path
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c))
            return
          }
          children.push(c)
        })
        return
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + '/' + el.path
    }
    children = children.concat(el)
  })
  return children
}

// 动态路由遍历，验证是否具备权限
export function filterDynamicRoutes(routes) {
  const res = []
  routes.forEach(route => {
    if (route.permissions) {
      if (auth.hasPermiOr(route.permissions)) {
        res.push(route)
      }
    } else if (route.roles) {
      if (auth.hasRoleOr(route.roles)) {
        res.push(route)
      }
    }
  })
  return res
}

const time = (t, callback = () => {
}) => {
  return new Promise(resolve => {
    setTimeout(() => {
      callback()
      resolve()
    }, t)
  })
}
export const loadView = (view) => {
  /*----*/
  // if (process.env.NODE_ENV === 'development') {
  //   return (resolve) => require([`@/views/${view}`], resolve)
  // } else {
  //   // 使用 import 实现生产环境的路由懒加载
  //   return () => import(`@/views/${view}`)
  // }
  /* 路由导出 */
  if (process.env.NODE_ENV === 'development') {
    let modules = import.meta.glob('../views/**/*.vue')
    return modules[`../views/${view}.vue`]
    // return new Promise((resolve, reject) => {
    //   (async function () {
    //     try {
    //       await time(2000) // 延迟加载时间
    //       let modules = import.meta.glob('../views/**/*.vue')
    //       const res = await modules[`../views/${view}.vue`]
    //       resolve(res)
    //     } catch (error) {
    //       reject(error)
    //     }
    //   })()
    // })
  } else {
    // 使用 import 实现生产环境的路由懒加载
    return () => defineAsyncComponent(() => import(`@/views/${view}.vue`))
  }
}
