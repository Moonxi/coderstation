import { useAccess, useNavigate } from '@umijs/max'
import { useEffect } from 'react'

// 鉴权失败页面，只有两种情况，一种是登录过期，一种是权限不够
const AccessPage = () => {
  const access = useAccess()
  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('adminToken')) {
      // 登录过期
      navigate('/login', {
        state: {
          message: {
            type: 'warning',
            content: '登录过期，请重新登录'
          }
        },
        replace: true
      })
    } else {
      // 权限不够
      if (!access.enabled) {
        // 管理员账号被禁用
        navigate('/login', {
          state: {
            message: {
              type: 'warning',
              content: '该管理员账号已被禁用'
            }
          },
          replace: true
        })
        localStorage.removeItem('adminToken')
      } else {
        navigate('/home', {
          state: {
            message: {
              type: 'warning',
              content: '当前管理员权限不足'
            }
          },
          replace: true
        })
      }
    }
  }, [])
  return <div>unAccessible</div>
}

export default AccessPage
