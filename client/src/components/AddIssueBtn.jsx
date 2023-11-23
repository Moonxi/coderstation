import React from 'react'
import { Button, message } from 'antd'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function AddIssueBtn() {
  const { isLogin } = useSelector(state => state.user)
  const navigate = useNavigate()
  function clickHandle() {
    // 跳转到提问页面，需要登录
    if (isLogin) {
      // 跳转
      navigate('/addIssue')
    } else {
      message.warning('请先登录')
    }
  }
  return (
    <Button
      type="primary"
      size="large"
      style={{
        width: '100%',
        marginBottom: '30px'
      }}
      onClick={clickHandle}
    >
      我要发问
    </Button>
  )
}
