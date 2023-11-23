import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, List, Popover, Avatar, Image } from 'antd'
import styles from '../css/LoginAvatar.module.css'
import { UserOutlined } from '@ant-design/icons'
import { changeLoginStatus, clearUserInfo } from '../redux/userSlice'
import { useNavigate } from 'react-router-dom'

// 该组件用于显示用户头像，如果没有登录则显示登录按钮
export default function LoginAvatar(props) {
  const { isLogin, userInfo } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  function listClickHandle(item) {
    if (item === '个人中心') {
      // 跳转到个人中心
      navigate('/personal')
    } else {
      // 退出登录
      localStorage.removeItem('userToken')
      dispatch(clearUserInfo())
      dispatch(changeLoginStatus(false))
      navigate('/')
    }
  }

  let loginStatus = null
  if (isLogin) {
    const content = (
      <List
        dataSource={['个人中心', '退出登录']}
        size="large"
        renderItem={item => (
          <List.Item style={{ cursor: 'pointer' }} onClick={() => listClickHandle(item)}>
            {item}
          </List.Item>
        )}
      />
    )
    loginStatus = (
      <Popover content={content} placement="bottom" trigger="hover">
        <div className={styles.avatarContainer}>
          <Avatar
            size="large"
            src={<Image src={userInfo?.avatar} preview={false} />}
            icon={<UserOutlined />}
          />
        </div>
      </Popover>
    )
  } else {
    loginStatus = (
      <Button type="primary" size="large" onClick={props.loginHandle}>
        注册/登录
      </Button>
    )
  }
  return loginStatus
}
