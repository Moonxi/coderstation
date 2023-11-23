import TextEditor from '@/components/TextEditor'
import { ProForm, ProFormSelect, ProFormText } from '@ant-design/pro-components'
import { useDispatch, useNavigate } from '@umijs/max'
import { App, Tag } from 'antd'
import { useRef } from 'react'

import InterviewController from '@/services/interview'
import TypeController from '@/services/type'

function InterviewForm(props) {
  const { message } = App.useApp()
  const [interviewForm] = ProForm.useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const editorRef = useRef()

  const colorArr = ['#108ee9', '#2db7f5', '#f50', 'green', '#87d068', 'blue', 'red', 'purple']

  function formSubmitHandle(values) {
    const interviewInfo = {
      ...values,
      interviewContent: editorRef.current.getHTML()
    }
    if (props.type === 'add') {
      // 新增面试题
      InterviewController.addInterview(interviewInfo)
      navigate('/initerview/interviewList', {
        state: {
          message: {
            type: 'success',
            content: '新增面试题成功'
          }
        },
        replace: true
      })
    } else if (props.type === 'edit') {
      // 编辑面试题
      InterviewController.editInterviewById(props.initialValues._id, interviewInfo)
      navigate('/initerview/interviewList', {
        state: {
          message: {
            type: 'success',
            content: '面试题信息修改成功'
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
        name="interviewForm"
        form={interviewForm}
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
          name="interviewTitle"
          label="题目标题"
          placeholder="请输入题目标题"
          rules={[
            {
              required: true,
              message: '题目标题不能为空'
            }
          ]}
          validateTrigger="onBlur"
          normalize={value => value.trim()}
        />
        <ProFormSelect
          width="sm"
          name="typeId"
          label="题目分类"
          rules={[
            {
              required: true,
              message: '请选择题目分类'
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
        <ProForm.Item
          label="题目内容"
          name="interviewContent"
          rules={[
            {
              required: true,
              message: '题目内容不能为空'
            }
          ]}
          normalize={value => value.trim()}
        >
          <TextEditor editorRef={editorRef} />
        </ProForm.Item>
      </ProForm>
    </>
  )
}

export default props => (
  <App>
    <InterviewForm {...props} />
  </App>
)
