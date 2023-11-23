import axios from 'axios'

const request = axios.create({
  timeout: 5000 // 请求超时时间
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('userToken')
    if(token) {
      config.headers['Authorization'] = 'Bearer ' + token // 请求头部添加token
    }
    return config
  },
  err => {
    console.log('请求拦截出错，错误信息：', err)
  }
)
// 响应拦截器
request.interceptors.response.use(
  response => {
    return response.data
  },
  err => {
    console.log('响应拦截出错，错误信息：', err)
  }
)

export default request
