import { request } from '@umijs/max'

// 获取所有的管理员
export function getAdmin() {
  return request('/api/admin', {
    method: 'GET'
  })
}

// 修改管理员
export function editAdmin(id, data) {
  return request(`/api/admin/${id}`, {
    method: 'PATCH',
    data
  })
}
// 根据 id 获取管理员信息
export function getAdminById(id) {
  return request(`/api/admin/${id}`, {
    method: 'GET'
  })
}

// 根据 id 删除管理员
export function deleteAdminById(id) {
  return request(`/api/admin/${id}`, {
    method: 'DELETE'
  })
}

// 新增管理员
export function addAdmin(data) {
  return request('/api/admin', {
    method: 'POST',
    data
  })
}

// 根据 loginId 检查该管理员 loginId 是否已经存在
export function checkAdminIsExist(loginId) {
  return request(`/api/admin/adminIsExist/${loginId}`, {
    method: 'GET'
  })
}

// 管理员登录
export function adminLogin(data) {
  return request('/api/admin/login', {
    method: 'POST',
    data
  })
}

// 管理员恢复登录
export function adminWhoAmI() {
  return request('/api/admin/whoami', {
    method: 'GET'
  })
}

export default {
  getAdmin,
  editAdmin,
  getAdminById,
  deleteAdminById,
  addAdmin,
  checkAdminIsExist,
  adminLogin,
  adminWhoAmI
}
