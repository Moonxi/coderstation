import request from './request.js'

// 获取所有分类的面试题标题
export function getInterviewTitle() {
  return request({
    url: '/api/interview/interviewTitle',
    method: 'get'
  })
}

// 根据 id 获取面试题
export function getInterviewById(id) {
  return request({
    url: `/api/interview/${id}`,
    method: 'get'
  })
}
