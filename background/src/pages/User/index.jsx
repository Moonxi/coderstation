import { PageContainer, ProTable } from '@ant-design/pro-components'
import { Access, useAccess, useLocation, useNavigate } from '@umijs/max'
import { App, Button, Modal, Popconfirm, Switch } from 'antd'
import { useEffect, useRef, useState } from 'react'

import UserController from '@/services/user'
import UserDetail from './components/UserDetail'

function UserPage(props) {
  const { message } = App.useApp()
  const access = useAccess()
  const actionRef = useRef()
  const location = useLocation()
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false) // 模态框是否打开
  const [modalTitle, setModalTitle] = useState('') // 模态框标题
  const [userDetail, setUserDetail] = useState(null) // 用户详情
  const [pageSize, setPageSize] = useState(5) // 每页显示条数，修复警告

  const columns = [
    {
      title: '序号',
      align: 'center',
      search: false,
      render: (_, record, index) => (record.current - 1) * record.pageSize + index + 1
    },
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
      title: '账号状态',
      dataIndex: 'enabled',
      align: 'center',
      search: false,
      render: (_, record) => {
        return (
          <Switch
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
            <Button type="link" size="small" onClick={() => openDetailHandle(record)}>
              详情
            </Button>
            <Button type="link" size="small" onClick={() => editAdminHandle(record)}>
              编辑
            </Button>
            {/* 只有超级管理员才能删除用户 */}
            <Access accessible={access.superAdmin}>
              <Popconfirm
                title={`正在删除用户「${record.nickname}」`}
                description="删除该用户的同时会删除所有该用户的问答和评论，你确定要删除吗？"
                overlayStyle={{
                  width: 300
                }}
                onConfirm={() => deleteHandle(record)}
                // onCancel={cancel}
                okText="删除"
                cancelText="取消"
              >
                <Button type="link" size="small">
                  删除
                </Button>
              </Popconfirm>
            </Access>
          </div>
        )
      }
    }
  ]

  // 解决跳转后 message 不显示的问题
  useEffect(() => {
    if (location.state?.message) {
      message[location.state.message.type](location.state.message.content)
      // 重置 location.state 避免刷新重复提示
      navigate(location.pathname, { replace: true })
    }
  }, [location])

  function switchChangeHandle(checked, user) {
    UserController.editUserById(user._id, {
      enabled: checked
    })
    if (checked) {
      message.success(`用户「${user.nickname}」已解封`)
    } else {
      message.warning(`用户「${user.nickname}」已封禁`)
    }
  }

  function openDetailHandle(user) {
    setModalTitle(user.nickname)
    setIsModalOpen(true)
    setUserDetail(user)
  }

  async function deleteHandle(user) {
    await UserController.deleteUserById(user._id)
    message.success(`用户「${user.nickname}」已删除`)
    // 手动触发表格更新
    actionRef.current.reload()
  }

  function editAdminHandle(user) {
    navigate(`/user/editUser/${user._id}`, {
      state: user
    })
  }

  return (
    <div>
      <PageContainer>
        <ProTable
          headerTitle="用户列表"
          rowKey="_id"
          actionRef={actionRef}
          columns={columns}
          search={{
            span: 8
          }}
          pagination={{
            // defaultPageSize: 5,
            pageSize: pageSize,
            showQuickJumper: true,
            pageSizeOptions: [5, 10, 20, 50, 100],
            showSizeChanger: true
          }}
          request={async params => {
            const { data } = await UserController.getUserByParams(params)
            // 修复警告
            setPageSize(params.pageSize)
            return {
              data: data.data.map(u => ({
                ...u,
                current: params.current,
                pageSize: params.pageSize
              })),
              success: true,
              total: data.count
            }
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
            <span
              style={{
                fontSize: 20
              }}
            >
              {modalTitle}
            </span>
          </div>
        }
        destroyOnClose
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          setIsModalOpen(false)
          setUserDetail(null)
        }}
      >
        {userDetail ? <UserDetail user={userDetail} /> : null}
      </Modal>
    </div>
  )
}

export default props => (
  <App>
    <UserPage {...props} />
  </App>
)
