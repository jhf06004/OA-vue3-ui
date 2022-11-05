// 通用下载方法
import {ElMessage, ElLoading} from "element-plus";
import {Loading} from "@element-plus/icons-vue"
import service from "@/utils/request.js";
import errorCode from "@/utils/errorCode.js";

/**
 * 参数处理
 * @param {*} params  参数
 */
export function tansParams(params) {
    let result = ''
    for (const propName of Object.keys(params)) {
        const value = params[propName];
        var part = encodeURIComponent(propName) + "=";
        if (value !== null && value !== "" && typeof (value) !== "undefined") {
            if (typeof value === 'object') {
                for (const key of Object.keys(value)) {
                    if (value[key] !== null && value[key] !== "" && typeof (value[key]) !== 'undefined') {
                        let params = propName + '[' + key + ']';
                        var subPart = encodeURIComponent(params) + "=";
                        result += subPart + encodeURIComponent(value[key]) + "&";
                    }
                }
            } else {
                result += part + encodeURIComponent(value) + "&";
            }
        }
    }
    return result
}

/* 验证是否为blob格式 */
export async function blobValidate(data) {
    try {
        const text = await data.text();
        JSON.parse(text);
        return false;
    } catch (error) {
        return true;
    }
}

let downloadLoadingInstance;
/* 导出下载excel */
export function downloadExcel(url, params, filename) {
    downloadLoadingInstance = ElLoading.service({
        text: "正在下载数据，请稍候",
        spinner: Loading,
        background: "rgba(0, 0, 0, 0.7)",
    })
    return service.post(url, params, {
        transformRequest: [(params) => {
            return tansParams(params)
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        responseType: 'blob'
    }).then(async (data) => {
        const isLogin = await blobValidate(data);
        if (isLogin) {
            const blob = new Blob([data])
            saveAs(blob, filename)
        } else {
            const resText = await data.text();
            const rspObj = JSON.parse(resText);
            const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
            ElMessage.error(errMsg);
        }
        downloadLoadingInstance.close();
    }).catch((r) => {
        console.error(r)
        ElMessage.error('下载文件出现错误！')
        downloadLoadingInstance.close();
    })
}
