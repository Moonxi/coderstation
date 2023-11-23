import { useState, useEffect } from 'react'
import NavHeader from './components/NavHeader'
import PageFooter from './components/PageFooter'
import { Layout, message } from 'antd'
import './css/App.css'
import RouteBefore from './router/RouteBefore.jsx'
import LoginForm from './components/LoginForm'
import { useSelector, useDispatch } from 'react-redux'

import { getTypeList } from './redux/typeSlice'

const { Header, Footer, Content } = Layout

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { typeList } = useSelector(state => state.type)
  const dispatch = useDispatch()

  useEffect(() => {
    // 获取分类填充至仓库
    if (!typeList.length) {
      dispatch(getTypeList())
    }
  }, [])

  // 打开弹框
  function loginHandle() {
    setIsModalOpen(true)
  }
  // 关闭弹框
  function closeModal() {
    setIsModalOpen(false)
  }
  return (
    <div className="App">
      {/* 头部 */}
      <Header className="header">
        <NavHeader loginHandle={loginHandle} />
      </Header>
      {/* 路由页面 */}
      <Content className="content">
        <RouteBefore openLoginModal={loginHandle} />
      </Content>
      {/* 底部 */}
      <Footer className="footer">
        <PageFooter />
      </Footer>
      {/* 登录弹窗 */}
      <LoginForm isShow={isModalOpen} closeModal={closeModal} />
    </div>
  )
}

export default App
