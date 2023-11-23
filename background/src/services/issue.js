import { request } from '@umijs/max'

// 根据参数分页获取问答
export function getIssueByParams(params) {
  return request('/api/issue', {
    method: 'GET',
    params
  })
}

// 根据 id 修改问答
export function editIssueById(id, data) {
  return request(`/api/issue/${id}`, {
    method: 'PATCH',
    data
  })
}

// 根据 id 删除问答
export function deleteIssueById(id) {
  return request(`/api/issue/${id}`, {
    method: 'DELETE'
  })
}

// 根据 id 获取问答
export function getIssueById(id) {
  return request(`/api/issue/${id}`, {
    method: 'GET'
  })
}

export default {
  getIssueByParams,
  editIssueById,
  deleteIssueById,
  getIssueById
}
