import request from '@/utils/request'

// 查询字典数据列表
export function listData(data = {}) {
  return request({
    url: '/system/dict/data/list',
    method: 'post',
    data
  })
}

// 查询字典数据详细
export function getData(dictCode) {
  return request({
    url: '/system/dict/data/' + dictCode,
    method: 'get'
  })
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
  return request({
    url: '/system/dict/data/type/' + dictType,
    method: 'get'
  })
}

// 根据字典类型查询字典数据信息
export function getDictApi(dictType) {
  return '/system/dict/data/type/' + dictType
}

// 新增字典数据
export function addData(data) {
  return request({
    url: '/system/dict/data',
    method: 'post',
    data: data
  })
}

// 修改字典数据
export function updateData(data) {
  return request({
    url: '/system/dict/data',
    method: 'put',
    data: data
  })
}
// 查询字典数据（根据字典key数组）
export function queryDictList(data) {
  return request({
    url: '/system/dict/data/queryDictList',
    method: 'post',
    data: data
  })
}

// 删除字典数据
export function delData(dictCode) {
  return request({
    url: '/system/dict/data/' + dictCode,
    method: 'delete'
  })
}

// 导出字段类型数据接口
export function exportDictData() {
  return 'system/dict/data/export'
}
