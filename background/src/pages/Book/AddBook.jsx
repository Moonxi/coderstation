import { PageContainer } from '@ant-design/pro-components'
import { Navigate, useLocation } from '@umijs/max'

import BookForm from './components/BookForm'
function AddBookPage() {
  const location = useLocation()
  const isAdd = location.pathname.includes('/book/addBook')
  const isEdit = location.pathname.includes('/book/editBook')

  let bookForm = null

  if (isAdd) {
    bookForm = <BookForm type="add" />
  } else if (isEdit) {
    // 对于并非点击编辑按钮跳转的情况
    if (!location.state) {
      // 这里使用Navigate组件而非useNavigate，因为跳转需要发生在组件第一次渲染完成之后
      return (
        <Navigate
          to="/book/bookList"
          state={{
            message: {
              type: 'warning',
              content: '找不到这本书'
            }
          }}
          replace={true}
        />
      )
    }
    bookForm = <BookForm type="edit" initialValues={location.state} />
  }

  return (
    <PageContainer>
      <div className="container" style={{ width: '500px' }}>
        {bookForm}
      </div>
    </PageContainer>
  )
}

export default AddBookPage
