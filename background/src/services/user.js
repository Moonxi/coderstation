import { request } from '@umijs/max'

// 根据参数分页获取用户数据
export function getUserByParams(params) {
  return request('/api/user', {
    method: 'GET',
    params
  })
}

// 根据 id 修改用户数据
export function editUserById(id, data) {
  return request(`/api/user/${id}`, {
    method: 'PATCH',
    data
  })
}

// 根据 id 删除用户
export function deleteUserById(id) {
  return request(`/api/user/${id}`, {
    method: 'DELETE'
  })
}

// 根据 loginId 检查该用户 loginId 是否已经存在
export function checkUserIsExist(loginId) {
  return request(`/api/user/userIsExist/${loginId}`, {
    method: 'GET'
  })
}

// 新增用户
export function addUser(data) {
  // 标识为后台添加，无需验证码
  data.type = 'background'
  return request('/api/user', {
    method: 'POST',
    data
  })
}

// 根据 id 获取用户
export function getUserById(id) {
  return request(`/api/user/${id}`, {
    method: 'GET'
  })
}

// 获取积分前十用户
export function getTopTenUser() {
  return request('/api/user/pointsrank', {
    method: 'GET'
  })
}

export default {
  getUserByParams,
  editUserById,
  deleteUserById,
  checkUserIsExist,
  addUser,
  getUserById,
  getTopTenUser
}
