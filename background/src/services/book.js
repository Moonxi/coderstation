import { request } from '@umijs/max'

// 根据参数分页获取书籍
export function getBookByParams(params) {
  return request('/api/book', {
    method: 'GET',
    params
  })
}

// 新增书籍
export function addBook(data) {
  return request('/api/book', {
    method: 'POST',
    data
  })
}

// 根据 id 修改书籍
export function editBookById(id, data) {
  return request(`/api/book/${id}`, {
    method: 'PATCH',
    data
  })
}
// 根据 id 删除书籍
export function deleteBookById(id) {
  return request(`/api/book/${id}`, {
    method: 'DELETE'
  })
}

// 根据 id 获取书籍
export function getBookById(id) {
  return request(`/api/book/${id}`, {
    method: 'GET'
  })
}

export default {
  getBookByParams,
  addBook,
  editBookById,
  deleteBookById,
  getBookById
}
