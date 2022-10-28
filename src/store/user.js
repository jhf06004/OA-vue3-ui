import {login, logout, getInfo,refreshToken} from '@/api/user'
import {getToken, setToken, removeToken, setExpiresIn} from '@/utils/auth'
// 密码加密
import {encrypt} from '@/utils/jsencrypt'
import companyLogo from '@/assets/images/avatar@2x.png'
// 重置路由
import {resetRouter} from '@/router'
import {defineStore} from "pinia";

export const useUserStore = defineStore({
    id: 'userStore',
    state: () => {
        return {
            expires_in: '', // 加密信息
            token: getToken(),
            name: '',
            avatar: '', // 头像
            roles: [], // 用户身份
            permissions: [] // 用户权限
        }
    },
    getters: {
        getUserToken(state) {
            return state.token
        },
        getUserName(state) {
            return state.name
        },
        getUserAvatar(state) {
            return state.avatar
        },
        getUserPermissions(state) {
            return state.permissions
        },
        getUserRoles(state) {
            return state.roles
        }
    },
    actions: {
        // 用户登录
        login({userInfo, keyPair}) {
            return new Promise((resolve, reject) => {
                const username = userInfo.username.trim()
                const password = encrypt(userInfo.password, keyPair)
                const code = userInfo.code
                const uuid = userInfo.uuid
                login(username, password).then(res => {
                    const data = res.data
                    setToken(data.access_token)
                    // token信息
                    this.token = data.access_token
                    // expires_in--加密信息
                    setExpiresIn(data.expires_in)
                    this.expires_in = data.expires_in
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 获取用户信息
        getInfo() {
            return new Promise((resolve, reject) => {
                getInfo({userId: ''}).then(result => {
                    const res = result.data
                    // const user = res.user
                    const user = res
                    const avatar = !user.avatar ? companyLogo : user.avatar;
                    if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
                        this.roles = res.roles
                        this.permissions = res.permissions
                    } else {
                        this.roles = ['ROLE_DEFAULT']
                    }
                    // this.name = user.userName
                    this.name = user.userName
                    this.avatar = avatar
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 退出登录
        logout() {
            return new Promise((resolve, reject) => {
                logout(this.token).then(() => {
                    this.token = ''
                    this.roles = []
                    this.permissions = []
                    removeToken()
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 刷新token
        refreshToken() {
            return new Promise((resolve, reject) => {
                refreshToken(this.token).then(res => {
                    setExpiresIn(res.data)
                    this.expires_in = res.data
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
    }
})

