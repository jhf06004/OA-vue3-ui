import getAxios from "./dict.js"
import {getDictApi} from "@/api/system/dict/data.js"; // 接口缓存
/**
 * 返回请求的函数
 * @param {Array} dictType 字典类型的数组
 * @param {Boolean} refresh 是否刷新
 */
// 遍历字典数组数组
export function dictRequest(dictType = [], refresh = false) {
    if (Array.isArray(dictType) && dictType.length) {
        dictType.forEach(item => {
            getAxios(getDictApi(item), {
                cache: true, // 是否开启缓存
                repeat: true, // 是否开启防止同时发起多个相同请求
                refresh: refresh, // 是否刷新
            })
        })
    }

}
