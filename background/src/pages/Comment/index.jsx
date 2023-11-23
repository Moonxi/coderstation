import { Comment } from '@ant-design/compatible'
import { PageContainer, ProTable } from '@ant-design/pro-components'
import { useDispatch, useLocation, useNavigate, useSelector } from '@umijs/max'
import { App, Avatar, Button, Card, Modal, Popconfirm, Radio, Select, Tag, Tooltip } from 'antd'
import { useEffect, useRef, useState } from 'react'

import BookController from '@/services/book'
import CommentController from '@/services/comment'
import IssueController from '@/services/issue'
import UserController from '@/services/user'

import { formatDate, formatTime } from '@/utils/tools'

function CommentPage() {
  const [commentType, setCommentType] = useState(1) // 评论类型， 1 为问答评论， 2 为书籍评论
  const { message } = App.useApp()
  const actionRef = useRef()
  const { typeList } = useSelector(state => state.type)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [pageSize, setPageSize] = useState(5) // 每页显示条数，修复警告
  const [isModalOpen, setIsModalOpen] = useState(false) // 模态框是否打开
  const [commentDetail, setCommentDetail] = useState({}) //评论详情

  const colorArr = ['#108ee9', '#2db7f5', '#f50', 'green', '#87d068', 'blue', 'red', 'purple']
  const columns = [
    {
      title: '序号',
      align: 'center',
      search: false,
      render: (_, record, index) => (record.current - 1) * record.pageSize + index + 1
    },
    {
      title: commentType === 1 ? '问答标题' : '书籍标题',
      dataIndex: commentType === 1 ? 'issueTitle' : 'bookTitle',
      align: 'center',
      width: 250,
      search: false,
      ellipsis: { showTitle: false },
      render: (_, record) => {
        const title = commentType === 1 ? record.issueInfo?.issueTitle : record.bookInfo?.bookTitle
        const toolTipTitle = title?.length > 100 ? title.slice(0, 100) + '...' : title
        return (
          <Tooltip title={toolTipTitle} placement="topLeft">
            {title}
          </Tooltip>
        )
      }
    },
    {
      title: '评论内容',
      dataIndex: 'commentContent',
      align: 'center',
      width: 350,
      ellipsis: { showTitle: false },
      render: (_, record) => {
        const reg = /<[^<>]*>/g
        const commentContentStr = record.commentContent.replace(reg, '')
        const commentContent =
          commentContentStr.length > 100
            ? commentContentStr.slice(0, 100) + '...'
            : commentContentStr
        return (
          <Tooltip title={commentContent} placement="topLeft">
            {commentContentStr}
          </Tooltip>
        )
      }
    },
    {
      title: '评论用户',
      dataIndex: 'nickname',
      align: 'center',
      width: 150,
      search: false,
      render: (_, record) => {
        return <Tag color="volcano">{record.userInfo.nickname}</Tag>
      }
    },
    {
      title: '评论分类',
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
      title: '操作',
      width: 150,
      align: 'center',
      search: false,
      render: (_, record) => {
        return (
          <div>
            <Button type="link" size="small" onClick={() => commentDetailHandle(record)}>
              详情
            </Button>
            <Popconfirm
              title="你确定要删除这条评论吗？"
              overlayStyle={{
                width: 220
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

  async function deleteHandle(comment) {
    await CommentController.deleteCommentById(comment._id)
    message.success('删除评论成功!')
    // 手动触发表格更新
    actionRef.current.reload()
  }

  function commentDetailHandle(comment) {
    setIsModalOpen(true)
    setCommentDetail(comment)
  }

  return (
    <div>
      <PageContainer>
        <Radio.Group
          defaultValue={1}
          size="middle"
          onChange={e => {
            setCommentType(e.target.value)
            // 重置表格（包括表单）
            actionRef.current.reset()
          }}
          buttonStyle="solid"
          style={{ marginBottom: 30 }}
        >
          <Radio.Button value={1}>问答评论</Radio.Button>
          <Radio.Button value={2}>书籍评论</Radio.Button>
        </Radio.Group>
        <ProTable
          headerTitle="评论列表"
          rowKey="_id"
          actionRef={actionRef}
          columns={columns}
          search={{
            span: 8
          }}
          pagination={{
            defaultPageSize: 5,
            pageSize: pageSize,
            showQuickJumper: true,
            pageSizeOptions: [5, 10, 20, 50, 100],
            showSizeChanger: true
          }}
          request={async params => {
            const { data } = await CommentController.getCommentByCommentType(commentType, params)
            const comments = data.data.map(u => ({
              ...u,
              current: params.current,
              pageSize: params.pageSize
            }))
            // 添加用户信息
            for (const c of comments) {
              const { data } = await UserController.getUserById(c.userId)
              c.userInfo = data
            }
            if (commentType === 1) {
              // 添加问答信息
              for (const c of comments) {
                const { data } = await IssueController.getIssueById(c.issueId)
                c.issueInfo = data
              }
            } else if (commentType === 2) {
              // 添加书籍信息
              for (const c of comments) {
                const { data } = await BookController.getBookById(c.bookId)
                c.bookInfo = data
              }
            }
            // 修复警告
            setPageSize(params.pageSize)
            return {
              data: comments,
              success: true,
              total: data.count
            }
          }}
        />
      </PageContainer>
      {/* 模态框 */}
      <Modal
        width={600}
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
              评论详情
            </span>
          </div>
        }
        destroyOnClose
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          setIsModalOpen(false)
        }}
      >
        <Card>
          <Comment
            avatar={<Avatar src={commentDetail.userInfo?.avatar} />}
            content={<div dangerouslySetInnerHTML={{ __html: commentDetail.commentContent }}></div>}
            author={commentDetail.userInfo?.nickname}
            datetime={
              <Tooltip title={formatDate(commentDetail.commentDate)}>
                <span>{formatTime(commentDetail.commentDate, '{y}-{m}-{d}')}</span>
              </Tooltip>
            }
          />
        </Card>
      </Modal>
    </div>
  )
}

export default props => (
  <App>
    <CommentPage {...props} />
  </App>
)
