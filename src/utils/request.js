import axios from 'axios'
import {ElMessage, ElMessageBox} from 'element-plus'
import {useUserStore} from '@/store/user.js'
import {getToken} from '@/utils/auth'
// 是否显示重新登录
export let isResetLogin = {
    show: false
};

const errorCode = {
    '401': '认证失败，无法访问系统资源',
    '403': '当前操作没有权限',
    '404': '访问资源不存在',
    'default': '系统未知错误，请反馈给管理员'
}

let store = null
export const BASE_URL = import.meta.env.VITE_BASE_API
// create an axios instance
const service = axios.create({
    baseURL: BASE_URL, // url = base url + request url
    timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
    config => {
        if (store == null){
            store = useUserStore()
        }        // do something before request is sent
        if (store.getUserToken) {
            config.headers['GtAuthorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
        }
        return config
    },
    error => {
        // do something with request error
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    response => {
        if (store == null) {
            store = useUserStore()
        }
        const res = response.data
        const code = res.code || 200
        const msg = errorCode[code] || res.msg || errorCode['default']
        // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
        if (code == 401) {
            if (!isResetLogin.show) {
                isResetLogin.show = true;
                ElMessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
                    confirmButtonText: '重新登录',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    isResetLogin.show = false;
                    // 重新登录
                    store.logout().then(() => {
                        location.href = '/login';
                    })
                }).catch(() => {
                    isResetLogin.show = false;
                });
            }
            return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
        } else if (code == 500) {
            ElMessage.error(msg)
            return Promise.reject(new Error(msg))
        } else if (code != 200) {
            ElMessage.error(msg)
            return Promise.reject('error')
        } else {
            return res
        }
    },
    error => {
        console.log('err' + error) // for debug
        ElMessage({
            message: error.msg || error,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export default service
