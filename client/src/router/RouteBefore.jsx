import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { message } from 'antd'
import RouterConfig from './index.jsx'
import RouteBeforeConfig from './RouteBeforeConfig'
import { getInfo, getUserById } from '../api/user'
import { useDispatch } from 'react-redux'
import { changeLoginStatus, initUserInfo } from '../redux/userSlice'

export default function RouteBefore(props) {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    const needLogin = RouteBeforeConfig.find(p => p.path === location.pathname)?.needLogin
    if (localStorage.getItem('userToken') && location.pathname !== '/' && !needLogin) {
      // 如果有token且路径不为"/"且该路径不需要登录，则尝试恢复登录
      resumeLogin()
    }
    if (needLogin) {
      // 如果需要登录，则尝试恢复登录
      resumeLogin().then(() => {
        // 恢复登录后若是没有token，则跳转到首页
        if (!localStorage.getItem('userToken')) {
          navigate('/')
          props.openLoginModal()
        }
      })
    }
  }, [location])

  // 恢复登录
  async function resumeLogin() {
    const res = await getInfo()
    if (res.data) {
      // 说明token有效
      const { data } = await getUserById(res.data._id)
      if (data.enabled) {
        dispatch(initUserInfo(data))
        dispatch(changeLoginStatus(true))
      } else {
        message.warning('该账号已被禁用')
        localStorage.removeItem('userToken')
        dispatch(initUserInfo({}))
        dispatch(changeLoginStatus(false))
      }
    } else {
      message.warning(res.msg)
      localStorage.removeItem('userToken')
      dispatch(initUserInfo({}))
      dispatch(changeLoginStatus(false))
    }
  }
  return <RouterConfig />
}
