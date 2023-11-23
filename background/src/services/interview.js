import { request } from '@umijs/max'

// 根据参数分页获取面试题
export function getInterviewByParams(params) {
  return request('/api/interview', {
    method: 'GET',
    params
  })
}

// 根据 id 修改面试题
export function editInterviewById(id, data) {
  return request(`/api/interview/${id}`, {
    method: 'PATCH',
    data
  })
}

// 根据 id 删除面试题
export function deleteInterviewById(id) {
  return request(`/api/interview/${id}`, {
    method: 'DELETE'
  })
}

// 新增面试题
export function addInterview(data) {
  return request('/api/interview', {
    method: 'POST',
    data
  })
}

// 根据 id 获取面试题
export function getInterviewById(id) {
  return request(`/api/interview/${id}`, {
    method: 'GET'
  })
}

export default {
  getInterviewByParams,
  editInterviewById,
  deleteInterviewById,
  addInterview,
  getInterviewById
}
