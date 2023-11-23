import request from './request'

// 分页获取书籍
export function getBookByPage(params) {
  return request({
    url: '/api/book',
    method: 'get',
    params
  })
}
// 根据 id 获取书籍
export function getBookById(id) {
  return request({
    url: `/api/book/${id}`,
    method: 'get'
  })
}

// 根据 id 修改书籍信息
export function editBookById(id, data) {
  return request({
    url: `/api/book/${id}`,
    method: 'patch',
    data
  })
}
