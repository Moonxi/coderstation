import TextEditor from '@/components/TextEditor'
import UploadAvatar from '@/components/UploadAvatar'
import { ProForm, ProFormSelect, ProFormText } from '@ant-design/pro-components'
import { useDispatch, useNavigate } from '@umijs/max'
import { App, Image, Tag } from 'antd'
import { useRef } from 'react'

import BookController from '@/services/book'
import TypeController from '@/services/type'

function BookForm(props) {
  const { message } = App.useApp()
  const [bookForm] = ProForm.useForm()
  const currentBookPic = ProForm.useWatch('bookPic', bookForm)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const editorRef = useRef()

  const colorArr = ['#108ee9', '#2db7f5', '#f50', 'green', '#87d068', 'blue', 'red', 'purple']

  function formSubmitHandle(values) {
    const bookInfo = {
      ...values,
      bookIntro: editorRef.current.getHTML()
    }
    if (props.type === 'add') {
      // 新增书籍
      BookController.addBook(bookInfo)
      navigate('/book/bookList', {
        state: {
          message: {
            type: 'success',
            content: '新增书籍成功'
          }
        },
        replace: true
      })
    } else if (props.type === 'edit') {
      // 编辑书籍
      BookController.editBookById(props.initialValues._id, bookInfo)
      navigate('/book/bookList', {
        state: {
          message: {
            type: 'success',
            content: '书籍信息修改成功'
          }
        },
        replace: true
      })
    }
  }

  return (
    <>
      <ProForm
        style={{ width: 1000 }}
        name="bookForm"
        form={bookForm}
        initialValues={props.type === 'edit' ? props.initialValues : {}}
        preserve={false}
        layout="horizontal"
        labelAlign="right"
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 22 }}
        onFinish={formSubmitHandle}
        submitter={{
          searchConfig: {
            resetText: '重置',
            submitText: props.type === 'edit' ? '修改' : '确认添加'
          },
          render(_, dom) {
            return (
              <div
                style={{
                  marginLeft: 125,
                  display: 'flex',
                  gap: 40
                }}
              >
                {dom[1]}
                {dom[0]}
              </div>
            )
          }
        }}
      >
        <ProFormText
          name="bookTitle"
          label="书籍标题"
          placeholder="请输入书籍标题"
          rules={[
            {
              required: true,
              message: '书籍标题不能为空'
            }
          ]}
          validateTrigger="onBlur"
          normalize={value => value.trim()}
        />
        <ProForm.Item
          label="书籍介绍"
          name="bookIntro"
          rules={[
            {
              required: true,
              message: '书籍介绍不能为空'
            }
          ]}
          normalize={value => value.trim()}
        >
          <TextEditor editorRef={editorRef} />
        </ProForm.Item>
        <ProFormText
          name="downloadLink"
          label="下载链接"
          placeholder="请输入下载链接"
          rules={[
            {
              required: true,
              message: '下载链接不能为空'
            }
          ]}
          validateTrigger="onBlur"
          normalize={value => value.trim()}
        />
        <ProFormText
          width="sm"
          name="requirePoints"
          label="所需积分"
          placeholder="请输入下载所需积分"
          rules={[
            {
              required: true,
              message: '所需积分不能为空'
            }
          ]}
          normalize={value => {
            const reg = /\D*/g
            const result = value.replace(reg, '').trim()
            if (result === '') {
              return result
            } else {
              return +result
            }
          }}
        />
        <ProFormSelect
          width="sm"
          name="typeId"
          label="书籍分类"
          rules={[
            {
              required: true,
              message: '请选择书籍分类'
            }
          ]}
          request={async () => {
            const { data } = await TypeController.getTypeList()
            return data.map((t, index) => ({
              label: <Tag color={colorArr[index % colorArr.length]}>{t.typeName}</Tag>,
              value: t._id
            }))
          }}
        />
        {/* 当前封面 */}
        {props.type === 'edit' ? (
          <ProForm.Item label="当前封面">
            {currentBookPic ? (
              <Image alt="当前封面" src={currentBookPic} width={100} placeholder />
            ) : null}
          </ProForm.Item>
        ) : null}
        <ProForm.Item
          name="bookPic"
          label="书籍封面"
          rules={[
            {
              required: true,
              message: '书籍封面不能为空'
            }
          ]}
        >
          <UploadAvatar title="上传封面" />
        </ProForm.Item>
      </ProForm>
    </>
  )
}

export default props => (
  <App>
    <BookForm {...props} />
  </App>
)
