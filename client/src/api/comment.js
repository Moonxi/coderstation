import request from './request'


// 根据问答 id 获取对应的评论
export function getIssueCommentById(id, params) {
  return request({
    url: `/api/comment/issuecomment/${id}`,
    method: 'get',
    params
  })
}

// 根据书籍 id 获取对应的评论
export function getBookCommentById(id, params) {
  return request({
    url: `/api/comment/bookcomment/${id}`,
    method: 'get',
    params
  })
}

// 新增评论
export function addComment(data) {
  return request({
    url: '/api/comment',
    method: 'post',
    data
  })
}
