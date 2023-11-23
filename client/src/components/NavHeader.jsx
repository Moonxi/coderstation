import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Input, Select } from 'antd'
import LoginAvatar from './LoginAvatar'
const { Option } = Select
const { Search } = Input

export default function NavHeader(props) {
  const [selectValue, setSelectValue] = useState('issue') // 选择框的值
  const navigate = useNavigate()
  function onSearchHandle(value) {
    if (!value) {
      // 无搜索内容则跳转至首页
      navigate('/')
      return
    }
    // 有搜索内容则跳转至搜索页
    navigate('/search', {
      state: {
        search: value,
        option: selectValue
      }
    })
  }
  function selectHandle(value) {
    setSelectValue(value)
  }
  return (
    <div className="headerContainer">
      {/* 头部logo */}
      <div className="logoContainer">
        <div className="logo"></div>
      </div>
      {/* 头部导航 */}
      <nav className="navContainer">
        <NavLink to="/issues" className="navigation">
          问答
        </NavLink>
        <NavLink to="/books" className="navigation">
          书籍
        </NavLink>
        <NavLink to="/interviews" className="navigation">
          面试题
        </NavLink>
        <a href="https://duyi.ke.qq.com/" target="_blank" className="navigation" rel="noreferrer">
          视频教程
        </a>
      </nav>
      {/* 搜索框 */}
      <div className="searchContainer">
        <Input.Group compact>
          <Select
            defaultValue={selectValue}
            size="large"
            style={{ width: '20%' }}
            onChange={selectHandle}
          >
            <Option value="issue">问答</Option>
            <Option value="book">书籍</Option>
          </Select>
          <Search
            placeholder="请输入要搜索的内容"
            allowClear
            enterButton="搜索"
            size="large"
            style={{ width: '80%' }}
            onSearch={onSearchHandle}
          />
        </Input.Group>
      </div>
      {/* 登录按钮 */}
      <div className="loginBtnContainer">
        <LoginAvatar loginHandle={props.loginHandle} />
      </div>
    </div>
  )
}
