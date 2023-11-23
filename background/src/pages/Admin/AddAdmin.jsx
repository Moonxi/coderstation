import { PageContainer } from '@ant-design/pro-components'
import AdminForm from './components/AdminForm'

function AddAdminPage() {
  return (
    <PageContainer>
      <div className="container" style={{ width: '500px' }}>
        <AdminForm type="add" />
      </div>
    </PageContainer>
  )
}

export default AddAdminPage
