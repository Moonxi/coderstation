import { useDispatch, useLocation, useNavigate, useSelector } from '@umijs/max'
import { useEffect, useState } from 'react'

import { PageContainer, ProForm, ProFormText, ProTable } from '@ant-design/pro-components'
import { App, Button, Modal, Popconfirm, Tag } from 'antd'

import BookController from '@/services/book'
import IssueController from '@/services/issue'
import InterviewController from '@/services/interview'

function TypePage(props) {
  const [editingType, setEditingType] = useState({}) // 正在编辑的分类
  const [isModalOpen, setIsModalOpen] = useState(false) // 模态框是否打开
  const { typeList } = useSelector(state => state.type)
  const [addTypeForm] = ProForm.useForm()
  const [editTypeForm] = ProForm.useForm()
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const { message } = App.useApp()
  const colorArr = ['#108ee9', '#2db7f5', '#f50', 'green', '#87d068', 'blue', 'red', 'purple']

  const columns = [
    {
      title: '分类名称',
      dataIndex: 'typeName',
      align: 'center',
      render: (_, record, index) => {
        const color = colorArr[index % colorArr.length]
        return (
          <Tag
            color={color}
            style={{
              fontSize: 16,
              height: 30,
              lineHeight: '27px'
            }}
          >
            {record.typeName}
          </Tag>
        )
      }
    },
    {
      title: '操作',
      align: 'center',
      render: (_, record) => {
        return (
          <div>
            <Button type="link" size="small" onClick={() => editTypeHandle(record)}>
              编辑
            </Button>
            <Popconfirm
              title="你确定要删除该类型吗"
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
      type: 'type/_initTypeList'
    })
  }, [])

  async function deleteHandle(type) {
    const params = {
      current: 1,
      pageSize: 5,
      typeId: type._id
    }
    // 检查该分类下是否有问答
    const { data: issueData } = await IssueController.getIssueByParams(params)
    const hasIssue = issueData.data.length > 0
    // 检查该分类下是否有书籍
    const { data: bookData } = await BookController.getBookByParams(params)
    const hasBook = bookData.data.length > 0
    // 检查该分类下是否有面试题
    const {data: interviewData} = await InterviewController.getInterviewByParams(params)
    const hasInterview = interviewData.data.length > 0
    if (hasIssue || hasBook || hasInterview) {
      message.error('删除失败，请先删除该分类下的问答、书籍和面试题！')
      return
    }
    dispatch({
      type: 'type/_deleteType',
      payload: {
        id: type._id
      }
    })
    message.success(`分类「${type.typeName}」已删除`)
  }

  function editTypeHandle(type) {
    setEditingType(type)
    setIsModalOpen(true)
  }

  function addTypeFormSubmitHandle(values) {
    dispatch({
      type: 'type/_addType',
      payload: {
        typeName: values.typeName
      }
    })
    addTypeForm.resetFields()
    message.success(`分类「${values.typeName}」已添加`)
  }

  function editTypeFormSubmitHandle(values) {
    dispatch({
      type: 'type/_editType',
      payload: {
        id: editingType._id,
        data: {
          ...values
        }
      }
    })
    message.success(`分类「${editingType.typeName}」已修改为「${values.typeName}」`)
    setIsModalOpen(false)
  }

  return (
    <div>
      <PageContainer>
        <ProForm
          name="addTypeForm"
          form={addTypeForm}
          style={{ width: 400, height: 60 }}
          layout="inline"
          onFinish={addTypeFormSubmitHandle}
          submitter={{
            searchConfig: {
              resetText: false,
              submitText: '新增类型'
            },
            render(_, dom) {
              return dom[1]
            }
          }}
        >
          <ProFormText
            name="typeName"
            placeholder="请输入类型名称"
            rules={[
              {
                required: true,
                validator: async (_, value) => {
                  if (!value) {
                    return Promise.reject('类型名称不能为空')
                  }
                  const isTypeExist = typeList.some(t => t.typeName === value)
                  if (isTypeExist) {
                    return Promise.reject('该类型已存在')
                  }
                  return Promise.resolve()
                }
              }
            ]}
            validateTrigger="onSubmit"
            normalize={value => value.trim()}
          />
        </ProForm>
        <ProTable
          headerTitle="分类列表"
          dataSource={typeList}
          rowKey="_id"
          columns={columns}
          search={false}
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
            <span>修改分类信息</span>
          </div>
        }
        destroyOnClose
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
      >
        <ProForm
          name="editTypeForm"
          form={editTypeForm}
          preserve={false}
          style={{ width: 400 }}
          layout="horizontal"
          onFinish={editTypeFormSubmitHandle}
          submitter={{
            searchConfig: {
              resetText: '重置',
              submitText: '修改'
            }
          }}
        >
          <ProFormText
            name="typeName"
            placeholder="请输入类型名称"
            label="类型名称"
            preserve={false}
            initialValue={editingType.typeName}
            rules={[
              {
                required: true,
                validator: async (_, value) => {
                  if (!value) {
                    return Promise.reject('类型名称不能为空')
                  }
                  if (value === editingType.typeName) {
                    return Promise.reject('修改名称不能与原名称相同')
                  }
                  const isTypeExist = typeList.some(t => t.typeName === value)
                  if (isTypeExist) {
                    return Promise.reject('该类型已存在')
                  }
                  return Promise.resolve()
                }
              }
            ]}
            validateTrigger="onBlur"
            normalize={value => value.trim()}
          />
        </ProForm>
      </Modal>
    </div>
  )
}

export default props => (
  <App>
    <TypePage {...props} />
  </App>
)
