import {useDictStore} from '@/store/dict.js'

const dictStore = useDictStore()

export function getDictData(dictTypeList) {
    if (Array.isArray(dictTypeList) && dictTypeList.length) {
        dictTypeList.forEach(item => {
            dictStore.dictRequest(item).then(res => {
                dictStore.setDictData(item, res.data)
                console.log(dictStore.getDictData)
            })
        })
    }
}
