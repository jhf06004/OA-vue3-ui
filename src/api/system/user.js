import request from '@/utils/request'
import {parseStrEmpty} from "@/utils/index.js";

// 根据ID获取用户信息（无入参返回当前用户信息）
// 获取去用户信息
export function getUserInfo(params) {
  return request({
    url: '/system/user/queryInfo',
    method: 'get',
    params
  })
}

// 查询用户列表
export function listUser(data) {
  return request({
    url: '/system/user/list',
    method: 'post',
    data
  })
}

// 查询用户详细
export function getUser(userId) {
  return request({
    url: '/system/user/' + parseStrEmpty(userId),
    method: 'get'
  })
}

// 查询用户所有角色
export function getUserRole() {
  return request({
    url: '/system/user/queryUserRole',
    method: 'get'
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/system/user/add',
    method: 'post',
    data
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/system/user/update',
    method: 'post',
    data
  })
}

// 删除用户
export function delUser(data) {
  return request({
    url: '/system/user/delete',
    method: 'post',
    data
  })
}

// 用户密码重置
export function resetUserPwd(userId, password) {
  const data = {
    userId,
    password
  }
  return request({
    url: '/system/user/resetPwd',
    method: 'put',
    data: data
  })
}

// 用户状态修改
export function changeUserStatus(userId, status) {
  const data = {
    userId,
    status
  }
  return request({
    url: '/system/user/changeStatus',
    method: 'put',
    data: data
  })
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/system/user/profile',
    method: 'get'
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/system/user/profile',
    method: 'put',
    data: data
  })
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: '/system/user/profile/updatePwd',
    method: 'put',
    params: data
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/system/user/profile/avatar',
    method: 'post',
    data: data
  })
}

// 查询授权角色
export function getAuthRole(userId) {
  return request({
    url: '/system/user/authRole/' + userId,
    method: 'get'
  })
}

// 保存授权角色
export function updateAuthRole(data) {
  return request({
    url: '/system/user/authRole',
    method: 'put',
    params: data
  })
}

// 查询部门下拉树结构
export function deptTreeSelect() {
  return request({
    url: '/system/user/deptTree',
    method: 'get'
  })
}

