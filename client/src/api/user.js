import request from './request'

/**
 * 用户相关api
 */

// 获取验证码
export function getCaptcha() {
  return request({
    url: '/res/captcha',
    method: 'get'
  })
}

// 查询用户是否存在
export function userIsExist(loginId) {
  return request({
    url: `/api/user/userIsExist/${loginId}`,
    method: 'get'
  })
}

// 注册新用户
export function addUser(newUserInfo) {
  return request({
    url: '/api/user/',
    method: 'post',
    data: newUserInfo
  })
}

// 用户登录
export function userLogin(userInfo) {
  return request({
    url: '/api/user/login',
    method: 'post',
    data: userInfo
  })
}

// 根据 id 查找用户
export function getUserById(id) {
  return request({
    url: `/api/user/${id}`,
    method: 'get'
  })
}

// 恢复登录
export function getInfo() {
  return request({
    url: '/api/user/whoami',
    method: 'get'
  })
}

// 获取积分前十用户
export function getUserByPointsRank() {
  return request({
    url: '/api/user/pointsrank',
    method: 'get'
  })
}

// 根据 id 修改用户
export function editUserById(id, data) {
  return request({
    url: `/api/user/${id}`,
    method: 'patch',
    data
  })
}

// 检查用户密码是否正确
export function checkPassword(data) {
  return request({
    url: '/api/user/passwordcheck',
    method: 'post',
    data
  })
}
