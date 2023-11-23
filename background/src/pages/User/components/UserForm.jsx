import UploadAvatar from '@/components/UploadAvatar'
import { ProForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components'
import { useDispatch, useNavigate } from '@umijs/max'
import { App, Image } from 'antd'

import UserController from '@/services/user'

function UserForm(props) {
  const { message } = App.useApp()
  const [userForm] = ProForm.useForm()
  const currentAvatar = ProForm.useWatch('avatar', userForm)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  function formSubmitHandle(values) {
    if (props.type === 'add') {
      // 新增用户
      UserController.addUser(values)
      navigate('/user/userList', {
        state: {
          message: {
            type: 'success',
            content: '新增用户成功'
          }
        },
        replace: true
      })
    } else if (props.type === 'edit') {
      // 编辑用户
      UserController.editUserById(props.initialValues._id, values)
      navigate('/user/userList', {
        state: {
          message: {
            type: 'success',
            content: '用户信息修改成功'
          }
        },
        replace: true
      })
    }
  }

  return (
    <>
      <ProForm
        style={{ width: 1000 }}
        name="userForm"
        form={userForm}
        initialValues={props.type === 'edit' ? props.initialValues : {}}
        preserve={false}
        layout="horizontal"
        labelAlign="right"
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 22 }}
        onFinish={formSubmitHandle}
        submitter={{
          searchConfig: {
            resetText: '重置',
            submitText: props.type === 'edit' ? '修改' : '确认添加'
          },
          render(_, dom) {
            return (
              <div
                style={{
                  marginLeft: 125,
                  display: 'flex',
                  gap: 40
                }}
              >
                {dom[1]}
                {dom[0]}
              </div>
            )
          }
        }}
      >
        <ProFormText
          width="lg"
          name="loginId"
          label="登录账号"
          placeholder="请输入登录账号"
          disabled={props.type === 'edit'}
          rules={[
            {
              required: true,
              validator: async (_, value) => {
                if (!value) {
                  return Promise.reject('登录账号不能为空')
                }
                const { data: isUserExist } = await UserController.checkUserIsExist(value)
                if (isUserExist && props.type === 'add') {
                  return Promise.reject('该账号已存在')
                }
                return Promise.resolve()
              }
            }
          ]}
          validateTrigger="onBlur"
          normalize={value => value.trim()}
        />
        <ProFormText.Password
          width="lg"
          name="loginPwd"
          label="登录密码"
          placeholder={props.type === 'edit' ? '请输入登录密码' : '密码选填，默认密码为123456'}
          rules={
            props.type === 'edit'
              ? [
                  {
                    required: true,
                    message: '登录密码不能为空'
                  }
                ]
              : []
          }
          validateTrigger="onBlur"
          normalize={value => value.trim()}
        />
        <ProFormText
          width="lg"
          name="nickname"
          label="用户昵称"
          placeholder={
            props.type === 'edit' ? '请输入用户昵称' : '昵称选填，默认为「新用户XXXXXXXXX」'
          }
          rules={
            props.type === 'edit'
              ? [
                  {
                    required: true,
                    message: '用户昵称不能为空'
                  }
                ]
              : []
          }
          validateTrigger="onBlur"
        />
        {/* 当前头像 */}
        {props.type === 'edit' ? (
          <ProForm.Item label="当前头像">
            {currentAvatar ? (
              <Image alt="当前头像" src={currentAvatar} width={100} placeholder />
            ) : null}
          </ProForm.Item>
        ) : null}
        <ProForm.Item name="avatar" label="上传头像">
          <UploadAvatar title="头像可选" />
        </ProForm.Item>
        <ProFormText width="lg" name="mail" label="用户邮箱" placeholder="选填" />
        <ProFormText width="lg" name="qq" label="QQ号码" placeholder="选填" />
        <ProFormText width="lg" name="wechat" label="微信号" placeholder="选填" />
        <ProFormTextArea
          width="lg"
          name="intro"
          label="自我介绍"
          placeholder="选填"
          fieldProps={{
            style: {
              resize: 'none'
            },
            maxLength: 400,
            showCount: true
          }}
        />
      </ProForm>
    </>
  )
}

export default props => (
  <App>
    <UserForm {...props} />
  </App>
)
