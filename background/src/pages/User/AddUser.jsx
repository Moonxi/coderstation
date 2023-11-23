import { PageContainer } from '@ant-design/pro-components'
import { Navigate, useLocation } from '@umijs/max'

import UserForm from './components/UserForm'
function AddUserPage() {
  const location = useLocation()
  const isAdd = location.pathname.includes('/user/addUser')
  const isEdit = location.pathname.includes('/user/editUser')

  let userForm = null

  if (isAdd) {
    userForm = <UserForm type="add" />
  } else if (isEdit) {
    // 对于并非点击编辑按钮跳转的情况
    if (!location.state) {
      // 这里使用Navigate组件而非useNavigate，因为跳转需要发生在组件第一次渲染完成之后
      return (
        <Navigate
          to="/user/userList"
          state={{
            message: {
              type: 'warning',
              content: '找不到该用户'
            }
          }}
          replace={true}
        />
      )
    }
    userForm = <UserForm type="edit" initialValues={location.state} />
  }

  return (
    <PageContainer>
      <div className="container" style={{ width: '500px' }}>
        {userForm}
      </div>
    </PageContainer>
  )
}

export default AddUserPage
