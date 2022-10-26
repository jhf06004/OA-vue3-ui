import router from '@/router/index.js'
import {ElMessage} from 'element-plus'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {getToken} from '@/utils/auth' // get token from cookie
import {useUserStore} from "@/store/user.js";
import getPageTitle from "@/utils/get-page-title.js";
import {usePermissionStore} from "@/store/permission.js";

NProgress.configure({showSpinner: false}) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

let userStore = null
router.beforeEach(async (to, from, next) => {
    // 全局状态里面的用户信息
    if (userStore === null) {
        userStore = useUserStore()
    }
    // start progress bar
    NProgress.start()

    // set page title
    document.title = getPageTitle(to.meta.title)

    // determine whether the user has logged in
    const hasToken = getToken()
    if (hasToken) {
        if (to.path === '/login') {
            // if is logged in, redirect to the home page
            next({path: '/'})
            NProgress.done()
        } else {
            const hasGetUserRoles = userStore.getUserRoles
            console.log('userStore.getUserRoles', userStore.getUserRoles)
            if (hasGetUserRoles.length) {
                next()
            } else {
                try {
                    console.log("try-beforeEach")
                    // // 获取用户信息
                    userStore.getInfo().then((res) => {
                        const permissionStore = usePermissionStore()
                        permissionStore.generateRoutes().then(accessRoutes => {
                            // 根据roles权限生成可访问的路由表
                            if (accessRoutes && accessRoutes.length) {
                                accessRoutes.forEach(item => {
                                    router.addRoute(item) // 动态添加可访问路由表
                                })
                            }
                            next({path: '/'})
                            // next({...to, replace: true}) // hack方法 确保addRoutes已完成
                        })
                    }).catch(err => {
                        userStore.logout().then(() => {
                            ElMessage.error(err)
                            next({path: '/'})
                        })
                    })
                } catch (error) {
                    // remove token and go to login page to re-login
                    // 退出登录以清除token
                    await userStore.logout()
                    ElMessage.error(error || 'Has Error')
                    next(`/login?redirect=${to.path}`)
                    NProgress.done()
                }
            }
        }
    } else {
        /* has no token*/

        if (whiteList.indexOf(to.path) !== -1) {
            // in the free login whitelist, go directly
            next()
        } else {
            // other pages that do not have permission to access are redirected to the login page.
            next(`/login?redirect=${to.path}`)
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    // finish progress bar
    NProgress.done()
})
