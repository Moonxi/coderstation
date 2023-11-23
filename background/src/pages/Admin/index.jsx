import { useDispatch, useLocation, useModel, useNavigate, useSelector } from '@umijs/max'
import { useEffect, useState } from 'react'

import { PageContainer, ProTable } from '@ant-design/pro-components'
import { App, Button, Modal, Popconfirm, Switch, Tag } from 'antd'
import AdminForm from './components/AdminForm'

function AdminPage(props) {
  const { adminList } = useSelector(state => state.admin)
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const [showList, setShowList] = useState([]) // 展示的列表
  const [isModalOpen, setIsModalOpen] = useState(false) // 模态框是否打开
  const [editingAdminInfo, setEditingAdminInfo] = useState(null) // 正在编辑的管理员信息
  const { message } = App.useApp()
  const { initialState } = useModel('@@initialState')

  // 对应表格每一列的配置
  const columns = [
    {
      title: '登录账号',
      dataIndex: 'loginId',
      align: 'center'
    },
    {
      title: '登录密码',
      dataIndex: 'loginPwd',
      align: 'center',
      search: false
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      align: 'center'
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      align: 'center',
      valueType: 'image',
      search: false
    },
    {
      title: '权限',
      dataIndex: 'permission',
      align: 'center',
      valueEnum: {
        1: { text: <Tag color="orange">超级管理员</Tag> },
        2: { text: <Tag color="blue">普通管理员</Tag> }
      }
    },
    {
      title: '账号状态',
      dataIndex: 'enabled',
      align: 'center',
      search: false,
      render: (_, record) => {
        // 若为当前登录的管理员，则不允许禁用
        if (record._id === initialState._id) {
          return <Tag color="volcano">当前登录</Tag>
        }
        return (
          <Switch
            // checked={record.enabled}
            defaultChecked={record.enabled}
            size="small"
            onChange={checked => switchChangeHandle(checked, record)}
          />
        )
      }
    },
    {
      title: '操作',
      width: 150,
      align: 'center',
      search: false,
      render: (_, record) => {
        return (
          <div>
            <Button type="link" size="small" onClick={() => editAdminHandle(record)}>
              编辑
            </Button>
            <Popconfirm
              title="你确定要删除吗"
              onConfirm={() => deleteHandle(record)}
              // onCancel={cancel}
              okText="删除"
              cancelText="取消"
            >
              <Button type="link" size="small">
                删除
              </Button>
            </Popconfirm>
          </div>
        )
      }
    }
  ]

  useEffect(() => {
    dispatch({
      type: 'admin/_initAdminList'
    })
  }, [])

  useEffect(() => {
    setShowList(adminList)
  }, [adminList])

  // 解决跳转后 message 不显示的问题
  useEffect(() => {
    if (location.state?.message) {
      message[location.state.message.type](location.state.message.content)
      // 重置 location.state 避免刷新重复提示
      navigate(location.pathname, { replace: true })
    }
  }, [location])

  function switchChangeHandle(checked, admin) {
    dispatch({
      type: 'admin/_editAdmin',
      payload: {
        id: admin._id,
        data: {
          enabled: checked
        }
      }
    })
    if (checked) {
      message.success(`管理员「${admin.nickname}」已激活`)
    } else {
      message.warning(`管理员「${admin.nickname}」已禁用`)
    }
  }

  function deleteHandle(admin) {
    // 如果删除的是当前登录的管理员，则不允许删除
    if (admin._id === initialState._id) {
      message.error('当前登录的管理员不允许删除')
      return
    }

    dispatch({
      type: 'admin/_deleteAdmin',
      payload: {
        id: admin._id
      }
    })
    message.success(`管理员「${admin.nickname}」已删除`)
  }

  function editAdminHandle(admin) {
    // 打开模态框
    setIsModalOpen(true)
    // 设置表单初始值
    setEditingAdminInfo({
      ...admin,
      setIsModalOpen
    })
  }

  return (
    <div>
      <PageContainer>
        <ProTable
          headerTitle="管理员列表"
          dataSource={showList}
          rowKey="_id"
          columns={columns}
          onSubmit={params => {
            const newList = adminList.filter(a => {
              let result = true
              for (let k in params) {
                if (params[k] && Object.hasOwn(params, k) && !a[k].toString().includes(params[k])) {
                  result = false
                  break
                }
              }
              return result
            })
            setShowList(newList)
          }}
          onReset={() => setShowList(adminList)}
          search={{
            span: 6
          }}
          pagination={{
            pageSize: 5
          }}
        />
      </PageContainer>
      {/* 模态框 */}
      <Modal
        title={
          <div
            style={{
              marginBottom: 30
            }}
          >
            <span>修改管理员信息</span>
          </div>
        }
        destroyOnClose
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          setIsModalOpen(false)
          setEditingAdminInfo(null)
        }}
      >
        {editingAdminInfo ? <AdminForm type="edit" initialValues={editingAdminInfo} /> : null}
      </Modal>
    </div>
  )
}

export default props => (
  <App>
    <AdminPage {...props} />
  </App>
)

// const mapStateToProps = (state) => {
//   return {
//     adminList: state.admin.adminList
//   }
// }

// export default connect(mapStateToProps)(AdminPage)
