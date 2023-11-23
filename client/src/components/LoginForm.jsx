import { Modal, Radio, Form, Input, Row, Col, Checkbox, Button, message } from 'antd'
import styles from '../css/LoginForm.module.css'
import { useState, useRef, useEffect } from 'react'
import { getCaptcha, userIsExist, addUser, userLogin, getUserById } from '../api/user'
import { initUserInfo, changeLoginStatus, editUser} from '../redux/userSlice'
import { useDispatch } from 'react-redux'
export default function LoginForm(props) {
  const [value, setValue] = useState(1)
  // 登录表单的状态数据
  const [loginInfo, setLoginInfo] = useState({
    loginId: '',
    loginPwd: '',
    captcha: '',
    remember: true
  })
  // 注册表单的状态数据
  const [registerInfo, setRegisterInfo] = useState({
    loginId: '',
    nickname: '',
    captcha: ''
  })
  const [captcha, setCaptcha] = useState(null)

  const loginFormRef = useRef()
  const registerFormRef = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    captchaClickHandle()
  }, [props.isShow])

  useEffect(() => {
    freshForm()
  }, [loginInfo, registerInfo, value])

  function onChange(e) {
    setValue(e.target.value)
    captchaClickHandle()
  }

  function handleOk() {
    props.closeModal()
  }
  function freshForm() {
    if (loginFormRef.current) {
      loginFormRef.current.setFieldsValue(loginInfo)
    }

    if (registerFormRef.current) {
      registerFormRef.current.setFieldsValue(registerInfo)
    }
  }
  function reset() {
    setLoginInfo({
      loginId: '',
      loginPwd: '',
      captcha: '',
      remember: false
    })
    setRegisterInfo({
      loginId: '',
      nickname: '',
      captcha: ''
    })
  }
  function handleCancel() {
    // 清除上一次的内容
    reset()
    // 关闭弹窗
    props.closeModal()
  }

  async function loginHandle(loginInfo) {
    const res = await userLogin(loginInfo)
    if (res.data) {
      // 表示验证码正确
      const data = res.data
      if (!data.data) {
        // 账号密码不正确
        message.error('账号或密码不正确')
        captchaClickHandle()
      } else if (!data.data.enabled) {
        // 账号被后台禁用了
        message.warning('该账号已被禁用')
        captchaClickHandle()
      } else {
        // 登录成功
        localStorage.setItem('userToken', data.token)
        const res = await getUserById(data.data._id)
        dispatch(initUserInfo(res.data))
        dispatch(changeLoginStatus(true))
        // 更新最后一次登录时间
        dispatch(
          editUser({
            id: res.data._id,
            data: {
              lastLoginDate: Date.now()
            }
          })
        )
        handleCancel()
      }
    } else {
      message.warning(res.msg)
      captchaClickHandle()
    }
  }

  async function registerHandle() {
    const res = await addUser(registerInfo)
    if (res.data) {
      message.success('用户注册成功，默认密码为 123456')
      const loginInfo = {
        loginId: registerInfo.loginId,
        loginPwd: registerInfo.loginPwd || '123456',
        captcha: registerInfo.captcha
      }
      // 注册成功同时直接登录
      loginHandle(loginInfo)
      // dispatch(initUserInfo(res.data))
      // dispatch(changeLoginStatus(true))
      handleCancel()
    } else {
      message.warning(res.msg)
      captchaClickHandle()
    }
  }
  function updateInfo(oldInfo, value, key, setInfo) {
    setInfo({
      ...oldInfo,
      [key]: typeof value === 'string' ? value.trim() : value
    })
  }
  async function captchaClickHandle() {
    const res = await getCaptcha()
    setCaptcha(res)
  }
  async function checkLoginIdIsExist() {
    if (!registerInfo.loginId) return
    const res = await userIsExist(registerInfo.loginId)
    if (res.data) {
      return Promise.reject('该账号已经存在')
    }
  }
  let container = null
  if (value === 1) {
    // 登录面板
    container = (
      <div className={styles.container}>
        <Form
          name="basic1"
          autoComplete="off"
          onFinish={() => loginHandle(loginInfo)}
          ref={loginFormRef}
        >
          <Form.Item
            label="登录账号"
            name="loginId"
            rules={[
              {
                required: true,
                message: '请输入账号'
              }
            ]}
          >
            <Input
              placeholder="请输入你的登录账号"
              value={loginInfo.loginId}
              onChange={e => updateInfo(loginInfo, e.target.value, 'loginId', setLoginInfo)}
            />
          </Form.Item>

          <Form.Item
            label="登录密码"
            name="loginPwd"
            rules={[
              {
                required: true,
                message: '请输入密码'
              }
            ]}
          >
            <Input.Password
              placeholder="请输入你的登录密码，新用户默认为123456"
              value={loginInfo.loginPwd}
              onChange={e => updateInfo(loginInfo, e.target.value, 'loginPwd', setLoginInfo)}
            />
          </Form.Item>

          {/* 验证码 */}
          <Form.Item
            name="logincaptcha"
            label="验证码"
            rules={[
              {
                required: true,
                message: '请输入验证码'
              }
            ]}
          >
            <Row align="middle">
              <Col span={16}>
                <Input
                  placeholder="请输入验证码"
                  value={loginInfo.captcha}
                  onChange={e => updateInfo(loginInfo, e.target.value, 'captcha', setLoginInfo)}
                />
              </Col>
              <Col span={6}>
                <div
                  className={styles.captchaImg}
                  onClick={captchaClickHandle}
                  dangerouslySetInnerHTML={{ __html: captcha }}
                ></div>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            name="remember"
            wrapperCol={{
              offset: 5,
              span: 16
            }}
          >
            <Checkbox
              onChange={e => updateInfo(loginInfo, e.target.checked, 'remember', setLoginInfo)}
              checked={loginInfo.remember}
            >
              记住我
            </Checkbox>
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 5,
              span: 16
            }}
          >
            <Button type="primary" htmlType="submit" style={{ marginRight: 20 }}>
              登录
            </Button>
            <Button
              type="primary"
              onClick={() => {
                reset()
              }}
            >
              重置
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  } else {
    // 注册面板
    container = (
      <div className={styles.container}>
        <Form name="basic2" autoComplete="off" ref={registerFormRef} onFinish={registerHandle}>
          <Form.Item
            label="登录账号"
            name="loginId"
            rules={[
              {
                required: true,
                message: '请输入账号，仅此项为必填项'
              },
              // 验证用户是否已经存在
              { validator: checkLoginIdIsExist }
            ]}
            validateTrigger="onBlur"
          >
            <Input
              placeholder="请输入账号"
              value={registerInfo.loginId}
              onChange={e => updateInfo(registerInfo, e.target.value, 'loginId', setRegisterInfo)}
            />
          </Form.Item>

          <Form.Item label="用户昵称" name="nickname">
            <Input
              placeholder="请输入昵称，不填写默认为新用户xxx"
              value={registerInfo.nickname}
              onChange={e => updateInfo(registerInfo, e.target.value, 'nickname', setRegisterInfo)}
            />
          </Form.Item>

          <Form.Item
            name="registercaptcha"
            label="验证码"
            rules={[
              {
                required: true,
                message: '请输入验证码'
              },
              { validator: checkLoginIdIsExist }
            ]}
          >
            <Row align="middle">
              <Col span={16}>
                <Input
                  placeholder="请输入验证码"
                  value={registerInfo.captcha}
                  onChange={e =>
                    updateInfo(registerInfo, e.target.value, 'captcha', setRegisterInfo)
                  }
                />
              </Col>
              <Col span={6}>
                <div
                  className={styles.captchaImg}
                  onClick={captchaClickHandle}
                  dangerouslySetInnerHTML={{ __html: captcha }}
                ></div>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 5,
              span: 16
            }}
          >
            <Button type="primary" htmlType="submit" style={{ marginRight: 20 }}>
              注册
            </Button>
            <Button
              type="primary"
              onClick={() => {
                reset()
              }}
            >
              重置
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }

  return (
    <Modal
      title="注册/登录"
      open={props.isShow}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
    >
      <Radio.Group
        value={value}
        onChange={onChange}
        className={styles.radioGroup}
        buttonStyle="solid"
      >
        <Radio.Button value={1} className={styles.radioButton}>
          登录
        </Radio.Button>
        <Radio.Button value={2} className={styles.radioButton}>
          注册
        </Radio.Button>
      </Radio.Group>
      {container}
    </Modal>
  )
}
