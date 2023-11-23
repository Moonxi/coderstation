import { PageContainer, ProTable } from '@ant-design/pro-components'
import { useDispatch, useLocation, useNavigate, useSelector } from '@umijs/max'
import { App, Button, Popconfirm, Select, Tag, Tooltip } from 'antd'
import { useEffect, useRef, useState } from 'react'

import InterviewController from '@/services/interview'
import { formatTime } from '@/utils/tools'

function InterviewPage(props) {
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
      title: '题目名称',
      dataIndex: 'interviewTitle',
      align: 'center',
      width: 400
    },
    {
      title: '题目分类',
      dataIndex: 'typeId',
      align: 'center',
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
        return <Select options={options} placeholder="请选择"/>
      }
    },

    {
      title: '上架日期',
      dataIndex: 'onShelfDate',
      align: 'center',
      width: 300,
      search: false,
      render: (_, record) => {
        return formatTime(record.onShelfDate, '{y}-{m}-{d} {h}:{i}:{s} 星期{a}')
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
            <Button type="link" size="small" onClick={() => interviewDetailHandle(record)}>
              详情
            </Button>
            <Button type="link" size="small" onClick={() => editInterviewHandle(record)}>
              编辑
            </Button>
            <Popconfirm
              title="正在删除面试题"
              description={`你确定要删除面试题「${record.interviewTitle}」吗？`}
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

async function deleteHandle(interview) {
  await InterviewController.deleteInterviewById(interview._id)
  message.success(`面试题「${interview.interviewTitle}」已删除`)
  // 手动触发表格更新
  actionRef.current.reload()
}

function editInterviewHandle(interview) {
  navigate(`/interview/editInterview/${interview._id}`, {
    state: interview
  })
}
function interviewDetailHandle(interview) {
  navigate(`/interview/interviewList/${interview._id}`, {
    state: interview
  })
}

  return (
    <div>
      <PageContainer>
        <ProTable
          headerTitle="题目列表"
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
            const { data } = await InterviewController.getInterviewByParams(params)
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
    <InterviewPage {...props} />
  </App>
)
