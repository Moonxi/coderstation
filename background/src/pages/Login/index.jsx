import { BarcodeOutlined, LockOutlined, UserOutlined } from '@ant-design/icons'
import { LoginForm, ProFormCaptcha, ProFormCheckbox, ProFormText } from '@ant-design/pro-components'
import { useLocation, useModel, useNavigate } from '@umijs/max'
import { App, Card } from 'antd'
import { useEffect, useState } from 'react'
import ReactCanvasNest from 'react-canvas-nest'

import AdminController from '@/services/admin'
import CaptchaController from '@/services/captcha'

const iconStyles = {
  marginInlineStart: '16px',
  color: 'rgba(0, 0, 0, 0.2)',
  fontSize: '24px',
  verticalAlign: 'middle',
  cursor: 'pointer'
}

function LoginPage(props) {
  const [captcha, setCaptcha] = useState(null)
  const { message } = App.useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const { refresh } = useModel('@@initialState')

  useEffect(() => {
    // 一进来首先需要加载验证码
    getCaptcha()
  }, [])

  // 解决跳转后 message 不显示的问题
  useEffect(() => {
    if (location.state?.message) {
      message[location.state.message.type](location.state.message.content)
      // 重置 location.state 避免刷新重复提示
      navigate(location.pathname, { replace: true })
    }
  }, [location])

  async function getCaptcha() {
    const result = await CaptchaController.getCaptcha()
    setCaptcha(result)
  }
  async function onLonginHandle(values) {
    const res = await AdminController.adminLogin(values)
    if (res.code !== 0) {
      // 验证码错误
      message.error(res.msg)
    } else {
      if (res.data.data) {
        if (res.data.data.enabled) {
          // 登录成功
          localStorage.setItem('adminToken', res.data.token)
          // 重新获取全局初始状态
          refresh()
          // 异步获取全局初始状态需要刷新以阻碍渲染
          window.location.href = '/home'
        } else {
          // 账号被禁用
          message.warning('该管理员账号已被禁用')
        }
      } else {
        // 账号密码错误
        message.error('账号或密码错误')
      }
    }
    getCaptcha()
  }

  return (
    <div>
      <ReactCanvasNest
        config={{
          pointColor: '30, 14, 231',
          count: 66,
          mouseDist: 6000,
          dist: 10000,
          pointR: 1
        }}
        style={{ zIndex: 1 }}
      />
      <Card
        style={{
          width: 520,
          margin: '70px auto',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)',
          zIndex: 99
        }}
      >
        <LoginForm
          logo="https://images-1317947350.cos.ap-nanjing.myqcloud.com/coderstation/logo/icon4.png"
          title="CoderStation"
          subTitle="后台管理系统"
          onFinish={onLonginHandle}
        >
          <ProFormText
            name="loginId"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined className={'prefixIcon'} />
            }}
            placeholder={'管理员账号'}
            rules={[
              {
                required: true,
                message: '请输入管理员账号!'
              }
            ]}
          />
          <ProFormText.Password
            name="loginPwd"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={'prefixIcon'} />
            }}
            placeholder={'管理员密码'}
            rules={[
              {
                required: true,
                message: '请输入管理员密码！'
              }
            ]}
          />
          <ProFormCaptcha
            name="captcha"
            fieldProps={{
              size: 'large',
              prefix: <BarcodeOutlined className={'prefixIcon'} />
            }}
            placeholder={'验证码'}
            rules={[
              {
                required: true,
                message: '请输入验证码!'
              }
            ]}
            captchaProps={{
              size: 'large',
              icon: (
                <div
                  style={{
                    width: 150
                  }}
                  dangerouslySetInnerHTML={{
                    __html: captcha
                  }}
                ></div>
              ),
              style: {
                width: 150,
                height: 60,
                boxSizing: 'border-box',
                padding: 0
              },
              type: 'text',
              disabled: false
            }}
            captchaTextRender={(timing, count) => {
              return null
            }}
            onGetCaptcha={getCaptcha}
          />

          <div
            style={{
              marginBlockEnd: 24
            }}
          >
            <ProFormCheckbox noStyle name="remember" initialValue={true}>
              7天免登录
            </ProFormCheckbox>
          </div>
        </LoginForm>
      </Card>
    </div>
  )
}

export default props => (
  <App>
    <LoginPage {...props} />
  </App>
)
