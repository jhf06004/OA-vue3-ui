/* 字典管理 */
import {defineStore} from "pinia";
import {getDicts} from "@/api/system/dict/data.js";

export const useDictStore = defineStore("dict", {
    state: () => ({
        // 存放请求的字典数据
        /*
        * 结构： { 字典名称：{字典数据} }
        *  */
        dictTypeData: {}
    }),
    getters: {
        getDictTypeData(state) {
            return state.dictTypeData
        }
    },
    actions: {
        dictRequest(dictTypeList) {
            if (Array.isArray(dictTypeList) && dictTypeList.length) {
                dictTypeList.forEach(item => {
                    return new Promise((resolve, reject) => {
                        // 判断字典数据中有没有存放，没有则请求
                        if (!this.dictData[item]) {
                            getDicts(item).then(res => {
                                this.dictData[item] = res.data
                                resolve(res)
                            }).catch((error) => {
                                reject(error)
                            })
                        }
                    })
                })
            }
        },
        setDictData(dictType, data) {
            this.dictTypeData[dictType] = data
        }
    }
})
