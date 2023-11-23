import { PageContainer, ProTable } from '@ant-design/pro-components'
import { useDispatch, useLocation, useNavigate, useSelector } from '@umijs/max'
import { App, Button, Popconfirm, Select, Switch, Tag, Tooltip } from 'antd'
import { useEffect, useRef, useState } from 'react'

import IssueController from '@/services/issue'

function IssuePage(props) {
  const { message } = App.useApp()
  const actionRef = useRef()
  const { typeList } = useSelector(state => state.type)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [pageSize, setPageSize] = useState(5) // 每页显示条数，修复警告

  const colorArr = ['#108ee9', '#2db7f5', '#f50', 'green', '#87d068', 'blue', 'red', 'purple']

  const columns = [
    {
      title: '序号',
      align: 'center',
      search: false,
      render: (_, record, index) => (record.current - 1) * record.pageSize + index + 1
    },
    {
      title: '问答标题',
      dataIndex: 'issueTitle',
      align: 'center',
      width: 200,
      ellipsis: { showTitle: false },
      render: (_, record) => {
        const issueTitle =
          record.issueTitle.length > 100
            ? record.issueTitle.slice(0, 100) + '...'
            : record.issueTitle
        return (
          <Tooltip title={issueTitle} placement="topLeft">
            {record.issueTitle}
          </Tooltip>
        )
      }
    },
    {
      title: '问答描述',
      dataIndex: 'issueContent',
      align: 'center',
      width: 300,
      search: false,
      ellipsis: { showTitle: false },
      render: (_, record) => {
        const reg = /<[^<>]*>/g
        const issueContentStr = record.issueContent.replace(reg, '')
        const issueContent =
          issueContentStr.length > 100 ? issueContentStr.slice(0, 100) + '...' : issueContentStr
        return (
          <Tooltip title={issueContent} placement="topLeft">
            {issueContentStr}
          </Tooltip>
        )
      }
    },
    {
      title: '浏览数',
      dataIndex: 'scanNumber',
      align: 'center',
      search: false
    },
    {
      title: '评论数',
      dataIndex: 'commentNumber',
      align: 'center',
      search: false
    },
    {
      title: '问答分类',
      dataIndex: 'typeId',
      align: 'center',
      width: 150,
      render: (_, record) => {
        const typeIndex = typeList.findIndex(t => t._id === record.typeId)
        const typeName = typeList[typeIndex]?.typeName
        const color = colorArr[typeIndex % colorArr.length]
        return <Tag color={color}>{typeName}</Tag>
      },
      renderFormItem: () => {
        const options = typeList.map((t, index) => ({
          label: <Tag color={colorArr[index % colorArr.length]}>{t.typeName}</Tag>,
          value: t._id
        }))
        return <Select options={options} placeholder="请选择" />
      }
    },

    {
      title: '审核状态',
      dataIndex: 'issueStatus',
      align: 'center',
      render: (_, record) => {
        return (
          <Switch
            defaultChecked={record.issueStatus}
            size="small"
            onChange={checked => switchChangeHandle(checked, record)}
          />
        )
      },
      renderFormItem: () => {
        const options = [
          { label: <Tag color="green">已审核</Tag>, value: true },
          { label: <Tag color="red">未审核</Tag>, value: false }
        ]
        return <Select options={options} placeholder="请选择" />
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
            <Button type="link" size="small" onClick={() => issueDetailHandle(record)}>
              详情
            </Button>
            <Popconfirm
              title={`正在删除问答「${record.issueTitle}」`}
              description="删除该问答的同时会删除所有该问答的评论，你确定要删除吗？"
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
          </div>
        )
      }
    }
  ]

  // 刷新类型列表
  useEffect(() => {
    dispatch({
      type: 'type/_initTypeList'
    })
  }, [])

  // 解决跳转后 message 不显示的问题
  useEffect(() => {
    if (location.state?.message) {
      message[location.state.message.type](location.state.message.content)
      // 重置 location.state 避免刷新重复提示
      navigate(location.pathname, { replace: true })
    }
  }, [location])

  function switchChangeHandle(checked, issue) {
    IssueController.editIssueById(issue._id, {
      issueStatus: checked
    })
    if (checked) {
      message.success(`问答「${issue.issueTitle}」已审核通过`)
    } else {
      message.warning(`问答「${issue.issueTitle}」状态已更改为未通过`)
    }
  }

  async function deleteHandle(issue) {
    await IssueController.deleteIssueById(issue._id)
    message.success(`问答「${issue.issueTitle}」已删除`)
    // 手动触发表格更新
    actionRef.current.reload()
  }

  function issueDetailHandle(issue) {
    navigate(`/issue/${issue._id}`, {
      state: issue
    })
  }
  return (
    <div>
      <PageContainer>
        <ProTable
          headerTitle="问答列表"
          rowKey="_id"
          actionRef={actionRef}
          columns={columns}
          search={{
            span: 6
          }}
          pagination={{
            // defaultPageSize: 5,
            pageSize: pageSize,
            showQuickJumper: true,
            pageSizeOptions: [5, 10, 20, 50, 100],
            showSizeChanger: true
          }}
          request={async params => {
            const { data } = await IssueController.getIssueByParams(params)
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
    </div>
  )
}

export default props => (
  <App>
    <IssuePage {...props} />
  </App>
)
