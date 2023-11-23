import request from './request.js'

// 分页获取问答
export function getIssueByPage(params) {
  return request({
    url: '/api/issue',
    method: 'get',
    params
  })
}

// 新增问答
export function addIssue(newIssue) {
  return request({
    url: '/api/issue',
    method: 'post',
    data: newIssue
  })
}

// 根据 id 获取问答详情
export function getIssueById(id) {
  return request({
    url: `/api/issue/${id}`,
    method: 'get'
  })
}

// 根据 id 修改问答
export function editIssueById(id, data) {
  return request({
    url: `/api/issue/${id}`,
    method:'patch',
    data
  })
}
