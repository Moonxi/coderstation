import { request } from '@umijs/max'

// 分页获取某一问答下的评论
export function getCommentByIssueId(id, params) {
  return request(`/api/comment/issuecomment/${id}`, {
    method: 'GET',
    params
  })
}

// 分页获取某一板块下的评论
export function getCommentByCommentType(commentType, params) {
  return request(`/api/comment/${commentType}`, {
    method: 'GET',
    params
  })
}

// 根据 id 删除评论
export function deleteCommentById(id) {
  return request(`/api/comment/${id}`, {
    method: 'DELETE'
  })
}

export default {
  getCommentByIssueId,
  getCommentByCommentType,
  deleteCommentById
}
