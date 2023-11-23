import { request } from '@umijs/max'

// 获取验证码
export function getCaptcha() {
  return request('/res/captcha', {
    method: 'GET'
  })
}

export default {
  getCaptcha
}