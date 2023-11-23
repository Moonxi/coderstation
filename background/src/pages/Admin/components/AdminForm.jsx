import UploadAvatar from '@/components/UploadAvatar'
import { ProForm, ProFormRadio, ProFormText } from '@ant-design/pro-components'
import { useDispatch, useNavigate } from '@umijs/max'
import { App, Image, Tag } from 'antd'

import AdminController from '@/services/admin'
/**
 * 新增和编辑管理员表单
 * @returns
 */

function AdminForm(props) {
  const { message } = App.useApp()
  const [adminForm] = ProForm.useForm()
  const currentAvatar = ProForm.useWatch('avatar', adminForm)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  function formSubmitHandle(values) {
    // 服务器端要求每个字段都必须存在
    const payload = {
      loginId: '',
      loginPwd: '',
      nickname: '',
      avatar: '',
      permission: 2, // 默认为普通管理员
      ...values
    }
    if (props.type === 'add') {
      // 新增管理员
      dispatch({
        type: 'admin/_addAdmin',
        payload
      })
      navigate('/admin/adminList', {
        state: {
          message: {
            type: 'success',
            content: '新增管理员成功'
          }
        },
        replace: true
      })
    } else if (props.type === 'edit') {
      // 编辑管理员
      dispatch({
        type: 'admin/_editAdmin',
        payload: {
          id: props.initialValues._id,
          data: payload
        }
      })
      // 关闭模态框
      props.initialValues.setIsModalOpen(false)
      navigate('/admin/adminList', {
        state: {
          message: {
            type: 'success',
            content: '管理员信息修改成功'
          }
        },
        replace: true
      })
    }
  }
  return (
    <>
      <ProForm
        name="adminForm"
        form={adminForm}
        initialValues={props.type === 'edit' ? props.initialValues : { permission: 2 }}
        preserve={false}
        layout="horizontal"
        labelAlign="right"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
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
          label="管理员账号"
          placeholder="请输入管理员账号"
          disabled={props.type === 'edit'}
          rules={[
            {
              required: true,
              validator: async (_, value) => {
                if (!value) {
                  return Promise.reject('管理员账号不能为空')
                }
                const { data: isAdminExist } = await AdminController.checkAdminIsExist(value)
                if (isAdminExist && props.type === 'add') {
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
          label="管理员密码"
          placeholder={
            props.type === 'edit' ? '请输入管理员密码' : '密码选填，若不填写，则默认为123123'
          }
          rules={
            props.type === 'edit'
              ? [
                  {
                    required: true,
                    message: '管理员密码不能为空'
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
          label="管理员昵称"
          placeholder={
            props.type === 'edit' ? '请输入管理员昵称' : '昵称选填，默认为「新增管理员」'
          }
          rules={
            props.type === 'edit'
              ? [
                  {
                    required: true,
                    message: '管理员昵称不能为空'
                  }
                ]
              : []
          }
        />
        <ProFormRadio.Group
          name="permission"
          label="权限选择"
          options={[
            { label: <Tag color="blue">普通管理员</Tag>, value: 2 },
            { label: <Tag color="orange">超级管理员</Tag>, value: 1 }
          ]}
          rules={[{ required: true, message: '请选择权限' }]}
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
      </ProForm>
    </>
  )
}

export default props => (
  <App>
    <AdminForm {...props} />
  </App>
)
