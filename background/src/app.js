// 运行时配置
import AdminController from '@/services/admin'
import { Navigate } from '@umijs/max'

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState() {
  const { data } = await AdminController.adminWhoAmI()
  const adminId = data?._id
  if (adminId) {
    const { data: admin } = await AdminController.getAdminById(adminId)
    return {
      ...admin,
      name: admin.nickname
    }
  }
  localStorage.removeItem('adminToken')
  return { name: '未登录' }
}

export const layout = () => {
  return {
    logo: 'https://images-1317947350.cos.ap-nanjing.myqcloud.com/coderstation/logo/icon4.png',
    menu: {
      locale: false
    },
    unAccessible: <Navigate to="/access" />,
    logout: () => {
      localStorage.removeItem('adminToken')
      location.href = '/login'
    }
  }
}

export const request = {
  timeout: 5000,
  requestInterceptors: [
    (url, options) => {
      const token = localStorage.getItem('adminToken')
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`
        }
      }
      return { url, options }
    }
  ]
}
