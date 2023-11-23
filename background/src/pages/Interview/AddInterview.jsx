import { PageContainer } from '@ant-design/pro-components'
import { Navigate, useLocation } from '@umijs/max'

import InterviewForm from './components/InterviewForm'

function AddInterviewPage() {
  const location = useLocation()
  const isAdd = location.pathname.includes('/interview/addInterview')
  const isEdit = location.pathname.includes('/interview/editInterview')

  let interviewForm = null

  if (isAdd) {
    interviewForm = <InterviewForm type="add" />
  } else if (isEdit) {
    // 对于并非点击编辑按钮跳转的情况
    if (!location.state) {
      // 这里使用Navigate组件而非useNavigate，因为跳转需要发生在组件第一次渲染完成之后
      return (
        <Navigate
          to="/interview/interviewList"
          state={{
            message: {
              type: 'warning',
              content: '面试题不存在'
            }
          }}
          replace={true}
        />
      )
    }
    interviewForm = <InterviewForm type="edit" initialValues={location.state} />
  }
  return (
    <PageContainer>
      <div className="container" style={{ width: '500px' }}>
        {interviewForm}
      </div>
    </PageContainer>
  )
}

export default AddInterviewPage
