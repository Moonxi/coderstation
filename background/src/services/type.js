import { request } from '@umijs/max'

// 获取所有类型
export function getTypeList() {
  return request('/api/type', {
    method: 'GET'
  })
}

// 新增类型
export function addType(data) {
  return request('/api/type', {
    method: 'POST',
    data
  })
}

// 删除类型
export function deleteType(id) {
  return request(`/api/type/${id}`, {
    method: 'DELETE'
  })
}

// 修改类型
export function editType(id, data) {
  return request(`/api/type/${id}`, {
    method: 'PATCH',
    data
  })
}

export default {
  getTypeList,
  addType,
  deleteType,
  editType
}
