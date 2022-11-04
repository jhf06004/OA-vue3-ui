/* 字典管理 */
import {defineStore} from "pinia";
import {getDicts} from "@/api/system/dict/data.js";

export const useDictStore = defineStore("dict", {
    state: () => ({
        // 存放请求的字典数据
        /*
        * 结构： { 字典名称：{字典数据} }
        *  */
        dictData: {}
    }),
    getters: {
        getDictData() {
            return this.dictData
        }
    },
    actions: {
        dictRequest(dictType) {
            return new Promise((resolve, reject) => {
                // 判断字典数据中有没有存放，没有则请求
                if (!this.dictData[dictType]) {
                    getDicts(dictType).then(res => {
                        resolve(res)
                    }).catch((error) => {
                        reject(error)
                    })
                }
            })
        },
        setDictData(dictType, dictTypeData) {
            this.dictData[dictType] = dictTypeData
        }
    }
})
