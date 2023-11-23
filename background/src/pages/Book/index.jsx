import { PageContainer, ProTable } from '@ant-design/pro-components'
import { useDispatch, useLocation, useNavigate, useSelector } from '@umijs/max'
import { App, Button, Popconfirm, Select, Tag, Tooltip } from 'antd'
import { useEffect, useRef, useState } from 'react'

import BookController from '@/services/book'
import { formatTime } from '@/utils/tools'

function BookPage(props) {
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
      title: '书籍名称',
      dataIndex: 'bookTitle',
      align: 'center',
      width: 150
    },
    {
      title: '书籍分类',
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
        return <Select options={options} placeholder="请选择" />
      }
    },
    {
      title: '书籍简介',
      dataIndex: 'bookIntro',
      align: 'center',
      width: 200,
      search: false,
      ellipsis: { showTitle: false },
      render: (_, record) => {
        const reg = /<[^<>]*>/g
        const bookIntroStr = record.bookIntro
          .replace(reg, '')
          .replace('内容简介', '')
          .replace('内容介绍', '')
        const bookIntro =
          bookIntroStr.length > 100 ? bookIntroStr.slice(0, 100) + '...' : bookIntroStr
        return (
          <Tooltip title={bookIntro} placement="topLeft">
            {bookIntroStr}
          </Tooltip>
        )
      }
    },
    {
      title: '书籍封面',
      dataIndex: 'bookPic',
      align: 'center',
      valueType: 'image',
      search: false
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
      title: '上架日期',
      dataIndex: 'onShelfDate',
      align: 'center',
      width: 200,
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
            <Button type="link" size="small" onClick={() => editBookHandle(record)}>
              编辑
            </Button>
            <Popconfirm
              title={`正在删除书籍「${record.bookTitle}」`}
              description="删除该书籍的同时会删除所有该书籍的评论，你确定要删除吗？"
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

  async function deleteHandle(book) {
    await BookController.deleteBookById(book._id)
    message.success(`书籍「${book.bookTitle}」已删除`)
    // 手动触发表格更新
    actionRef.current.reload()
  }

  function editBookHandle(book) {
    navigate(`/book/editBook/${book._id}`, {
      state: book
    })
  }

  return (
    <div>
      <PageContainer>
        <ProTable
          headerTitle="书籍列表"
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
            const { data } = await BookController.getBookByParams(params)
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
    <BookPage {...props} />
  </App>
)
