import {createRouter, createWebHistory} from 'vue-router'
import Layout from "@/layout/index.vue";
export const constantRoutes = [
    {
        path: '',
        component: Layout,
        redirect: '/index',
        children: [
            {
                path: '/index',
                component: () => import('@/views/home/index.vue'),
                name: 'Index',
                meta: {title: '首页', icon: 'order' }
            }
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/login/index.vue')
    },
    {
        path: '/personnel',
        component: Layout,
        name: 'PersonnelMgmt',
        redirect: '/staff',
        meta: {title: '人事管理', icon: 'order'},
        children: [
            {
                path: '/staff',
                name: 'StaffMgmt',
                component: () => import('@/views/personnelMgmt/staffMgmt/index.vue'),
                meta: {title: '员工管理', icon: 'order'}
            },
            {
                path: '/hr',
                name: 'HrMgmt',
                component: () => import('@/views/personnelMgmt/hrMgmt/index.vue'),
                meta: {title: '人事管理', icon: 'order'}
            }
        ]
    },
    {
        path: '/system-mgmt',
        component: Layout,
        name: 'SystemMgmt',
        meta: { title: '系统管理', icon: 'order' },
        children: [
            {
                path: '/role',
                name: 'RoleMgmt',
                component: () => import('@/views/systemMgmt/roleMgmt/index.vue'),
                meta: { title: '角色管理', icon: 'order' },
                children: []
            },
            {
                path: '/menu',
                name: 'MenuMgmt',
                component: () => import('@/views/systemMgmt/menuMgmt/index.vue'),
                meta: {title: '菜单管理', icon: 'order'},
                children: []
            },
            {
                path: '/dept',
                name: 'DeptMgmt',
                component: () => import('@/views/systemMgmt/deptMgmt/index.vue'),
                meta: {title: '部门管理', icon: 'order'},
            },
            {
                path: '/job',
                name: 'JobMgmt',
                component: () => import('@/views/systemMgmt/jobMgmt/index.vue'),
                meta: {title: '岗位管理', icon: 'order'},
            },
            {
                path: '/dict',
                name: 'DictMgmt',
                component: () => import('@/views/systemMgmt/dictMgmt/index.vue'),
                meta: {title: '字典管理', icon: 'order'},
            },
            {
                path: '/user',
                name: 'UserMgmt',
                component: () => import('@/views/systemMgmt/userMgmt/index.vue'),
                meta: {title: '用户管理', icon: 'order'},
            }
        ]
    },
    {
        path: '/404',
        name: 'PageNotExist',
        component: () => import('@/views/404.vue'),
    },
    {
        path: "/:catchAll(.*)", // 不识别的path自动匹配404
        redirect: '/404',
    },
]
// 动态路由，基于用户权限动态去加载
export const dynamicRoutes = []
const router = createRouter({
    history: createWebHistory(),
    routes: constantRoutes
})

// reset router
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher
}

export default router
