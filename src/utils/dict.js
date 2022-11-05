import {getDicts} from "@/api/system/dict/data.js";
import {useDictStore} from "@/store/dict.js";

const dictStore = useDictStore()
//获取动态数据字典
const getDictData = async (dictType) => {
    // 字典数据
    const dictTypeData = dictStore.getDictTypeData
    // 判断全局状态中是否存在，不存在则请求，存在则返回
    if (dictTypeData[dictType]) {
        return dictTypeData[dictType]
    }
    const dictData = await getDictDataFromServer(dictType)
    dictStore.setDictData(dictType, dictData)
    return dictData
}
//获取服务器数据字典
const getDictDataFromServer = async (dictType) => {
    let res = {}
    res = await getDicts(dictType)
    return res.data
}
//重置某项字典
const resetDict = (dictType) => {
    dictStore.setDictData(dictType, null)
}
export {getDictData, resetDict};
