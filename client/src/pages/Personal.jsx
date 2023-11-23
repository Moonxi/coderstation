import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Card, Image, Upload, message, Modal, Form, Input, Button } from 'antd'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons'
import { editUser, clearUserInfo, changeLoginStatus } from '../redux/userSlice'
import PageHeader from '../components/PageHeader'
import PersonalInfoItem from '../components/PersonalInfoItem'

import { checkPassword } from '../api/user'

import { formatDate, formatTime } from '../utils/tools'

import styles from '../css/Personal.module.css'

export default function Personal() {
  const { userInfo } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [basicInfoForm] = Form.useForm()
  const [socialInfoForm] = Form.useForm()
  const [personalProfileForm] = Form.useForm()

  const [isUploading, setIsUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [initialBasicInfo, setInitialBasicInfo] = useState({
    nickname: userInfo.nickname,
    oldPassword: '',
    newPassword: '',
    passwordConfirm: ''
  })
  const [initialSocialInfo, setInitialSocialInfo] = useState({
    mail: userInfo.mail,
    qq: userInfo.qq,
    wechat: userInfo.wechat
  })
  const [initialPersonalProfile, setInitialPersonalProfile] = useState({
    intro: userInfo.intro
  })

  const uploadButton = <div>{isUploading ? <LoadingOutlined /> : <PlusOutlined />}</div>

  useEffect(() => {
    setInitialBasicInfo({
      ...initialBasicInfo,
      nickname: userInfo.nickname
    })
    setInitialSocialInfo({
      mail: userInfo.mail,
      qq: userInfo.qq,
      wechat: userInfo.wechat
    })
    setInitialPersonalProfile({
      intro: userInfo.intro
    })
  }, [userInfo])

  const showModal = title => {
    setModalTitle(title)
    setIsModalOpen(true)
  }
  const handleOk = () => {
    setIsModalOpen(false)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }

  function basicInfoSubmit(values) {
    handleOk()
    dispatch(
      editUser({
        id: userInfo._id,
        data: {
          nickname: values.nickname,
          loginPwd: values.newPassword
        }
      })
    )
    basicInfoForm.resetFields(['oldPassword', 'newPassword', 'passwordConfirm'])
    message.success('修改密码成功，请重新登录')
    // 退出登录
    localStorage.removeItem('userToken')
    dispatch(clearUserInfo())
    dispatch(changeLoginStatus(false))
    navigate('/')
  }

  function socialInfoSubmit(values) {
    handleOk()
    dispatch(
      editUser({
        id: userInfo._id,
        data: {
          mail: values.mail,
          qq: values.qq,
          wechat: values.wechat
        }
      })
    )
    message.success('修改社交账号成功')
  }

  function personalProfileSubmit(values) {
    handleOk()
    dispatch(
      editUser({
        id: userInfo._id,
        data: {
          intro: values.intro
        }
      })
    )
    message.success('修改个人简介成功')
  }

  async function validateOldPassword(_, value) {
    const { data } = await checkPassword({ userId: userInfo._id, loginPwd: value })
    if (data) {
      return Promise.resolve()
    } else {
      return Promise.reject(new Error('旧密码错误'))
    }
  }

  function uploadHandle(info) {
    if (info.file.status === 'uploading') {
      setIsUploading(true)
      setImageUrl('')
    }
    if (info.file.status === 'done') {
      setIsUploading(false)
      if (info.file.response.code !== 0) {
        message.error(info.file.response.msg)
      } else {
        message.success('上传头像成功!')
        // 更新用户头像信息
        dispatch(
          editUser({
            id: userInfo._id,
            data: {
              avatar: info.file.response.data
            }
          })
        )
        setImageUrl(info.file.response.data)
      }
    }
  }

  // 模态框内容
  let modalContent = null
  switch (modalTitle) {
    case '基本信息':
      modalContent = (
        <>
          <Form
            name="basicInfo"
            autoComplete="off"
            initialValues={initialBasicInfo}
            form={basicInfoForm}
            onFinish={basicInfoSubmit}
          >
            {/* 登录密码 */}
            <Form.Item
              label="登录密码"
              name="oldPassword"
              rules={[
                {
                  required: true,
                  validator: validateOldPassword
                }
              ]}
              validateTrigger="onBlur"
            >
              <Input.Password rows={6} placeholder="如果要修改密码，请先输入旧密码" />
            </Form.Item>

            {/* 新的登录密码 */}
            <Form.Item
              label="新密码"
              name="newPassword"
              rules={[
                { required: true },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (value && value === getFieldValue('oldPassword')) {
                      return Promise.reject(new Error('新密码不能与旧密码相同'))
                    }
                    return Promise.resolve()
                  }
                })
              ]}
              validateTrigger="onBlur"
            >
              <Input.Password rows={6} placeholder="请输入新密码" />
            </Form.Item>

            {/* 确认密码 */}
            <Form.Item
              label="确认密码"
              name="passwordConfirm"
              rules={[
                ({ getFieldValue }) => ({
                  required: true,
                  validator(_, value) {
                    if (getFieldValue('newPassword') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('两次密码不一致'))
                  }
                })
              ]}
              validateTrigger="onBlur"
            >
              <Input.Password rows={6} placeholder="请确认密码" />
            </Form.Item>

            {/* 用户昵称 */}
            <Form.Item label="用户昵称" name="nickname" rules={[{ required: true }]}>
              <Input placeholder="昵称可选，默认为新用户" />
            </Form.Item>

            {/* 确认修改按钮 */}
            <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
              <Button type="primary" htmlType="submit">
                确认
              </Button>

              <Button type="link" htmlType="reset" className="resetBtn">
                重置
              </Button>
            </Form.Item>
          </Form>
        </>
      )
      break
    case '社交账号':
      modalContent = (
        <>
          <Form
            name="socialInfo"
            initialValues={initialSocialInfo}
            form={socialInfoForm}
            autoComplete="off"
            onFinish={socialInfoSubmit}
          >
            <Form.Item label="邮箱" name="mail">
              <Input placeholder="请填写邮箱" />
            </Form.Item>
            <Form.Item label="QQ号" name="qq">
              <Input placeholder="请填写 QQ 号" />
            </Form.Item>
            <Form.Item label="微信" name="wechat">
              <Input placeholder="请填写微信号" />
            </Form.Item>

            {/* 确认修改按钮 */}
            <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
              <Button type="primary" htmlType="submit">
                确认
              </Button>

              <Button type="link" htmlType="reset" className="resetBtn">
                重置
              </Button>
            </Form.Item>
          </Form>
        </>
      )
      break
    case '个人简介':
      modalContent = (
        <>
          <Form
            name="personalProfile"
            form={personalProfileForm}
            initialValues={initialPersonalProfile}
            autoComplete="off"
            onFinish={personalProfileSubmit}
          >
            {/* 自我介绍 */}
            <Form.Item label="自我介绍" name="intro">
              <Input.TextArea
                rows={6}
                placeholder="选填"
                showCount
                maxLength={400}
                rows={6}
                style={{ resize: 'none' }}
              />
            </Form.Item>

            {/* 确认修改按钮 */}
            <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
              <Button type="primary" htmlType="submit">
                确认
              </Button>

              <Button type="link" htmlType="reset" className="resetBtn">
                重置
              </Button>
            </Form.Item>
          </Form>
        </>
      )
      break
  }

  return (
    <div>
      <PageHeader title="个人中心" />
      {/* 信息展示 */}
      <div className={styles.container}>
        {/* 基本信息 */}
        <div className={styles.row}>
          <Card
            title="基本信息"
            extra={
              <div className={styles.edit} onClick={() => showModal('基本信息')}>
                编辑
              </div>
            }
          >
            <PersonalInfoItem info={{ itemName: '登录账号', itemValue: userInfo.loginId }} />
            <PersonalInfoItem info={{ itemName: '账号密码', itemValue: '**** **** ***' }} />
            <PersonalInfoItem info={{ itemName: '用户昵称', itemValue: userInfo.nickname }} />
            <PersonalInfoItem info={{ itemName: '用户积分', itemValue: userInfo.points }} />
            <PersonalInfoItem
              info={{
                itemName: '注册时间',
                itemValue: formatDate(userInfo.registerDate)
              }}
            />
            <PersonalInfoItem
              info={{
                itemName: '上次登录时间',
                itemValue: formatTime(userInfo.lastLoginDate, '{y}-{m}-{d} {h}:{i}:{s} 星期{a}')
              }}
            />
            <div style={{ fontWeight: '100', height: '50px' }}>当前头像</div>
            <Image src={userInfo.avatar} width={100} />
            <div style={{ fontWeight: '100', height: '50px' }}>上传新头像</div>
            <Upload
              listType="picture-card"
              showUploadList={false}
              action="/api/upload"
              maxCount={1}
              onChange={info => uploadHandle(info)}
            >
              {imageUrl ? <Image src={imageUrl} width={100} preview={false} /> : uploadButton}
            </Upload>
          </Card>
        </div>
        {/* 社交账号 */}
        <div className={styles.row}>
          <Card
            title="社交账号"
            extra={
              <div className={styles.edit} onClick={() => showModal('社交账号')}>
                编辑
              </div>
            }
          >
            <PersonalInfoItem
              info={{ itemName: '邮箱', itemValue: userInfo.mail ? userInfo.mail : '未填写' }}
            />
            <PersonalInfoItem
              info={{ itemName: 'QQ号', itemValue: userInfo.qq ? userInfo.qq : '未填写' }}
            />
            <PersonalInfoItem
              info={{ itemName: '微信号', itemValue: userInfo.wechat ? userInfo.wechat : '未填写' }}
            />
          </Card>
        </div>
        {/* 个人简介 */}
        <div className={styles.row}>
          <Card
            title="个人简介"
            extra={
              <div className={styles.edit} onClick={() => showModal('个人简介')}>
                编辑
              </div>
            }
          >
            <p className={styles.intro}>{userInfo.intro ? userInfo.intro : '暂无个人简介'}</p>
          </Card>
        </div>
      </div>
      {/* 编辑信息对话框 */}
      <Modal
        title={modalTitle}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
        destroyOnClose
      >
        {modalContent}
      </Modal>
    </div>
  )
}
