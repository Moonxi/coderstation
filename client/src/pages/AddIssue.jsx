import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Select, Button, message } from 'antd'
import { useSelector } from 'react-redux'
import { typeOptionCreator } from '../utils/tools'

import TextEditor from '../components/TextEditor'

import styles from '../css/AddIssue.module.css'

import { addIssue } from '../api/issue'

export default function AddIssue() {
  const [issueInfo, setIssueInfo] = useState({
    issueTitle: '',
    issueContent: '',
    userId: '',
    typeId: ''
  })
  const formRef = useRef()

  const navigate = useNavigate()
  const { typeList } = useSelector(state => state.type)
  const { userInfo } = useSelector(state => state.user)

  useEffect(() => {
    updateInfo(userInfo._id, 'userId')
  }, [userInfo._id])

  function addHandle() {
    // 提交问答
    addIssue(issueInfo).then(res => {
      navigate('/')
      message.success('您的问题已经提交成功，请等待审核...')
    })
  }

  function updateInfo(value, key) {
    setIssueInfo({
      ...issueInfo,
      [key]: typeof value === 'string' ? value.trim() : value
    })
  }

  function handleChange(value) {
    updateInfo(value, 'typeId')
  }

  function editorChangeHandle(htmlcontent) {
    updateInfo(htmlcontent, 'issueContent')
  }

  return (
    <div className={styles.container}>
      <Form
        name="basic"
        initialValues={issueInfo}
        autoComplete="off"
        ref={formRef}
        onFinish={addHandle}
      >
        {/* 问答标题 */}
        <Form.Item
          label="标题"
          name="issueTitle"
          rules={[{ required: true, message: '请输入标题' }]}
        >
          <Input
            placeholder="请输入标题"
            size="large"
            value={issueInfo.issueTitle}
            onChange={e => updateInfo(e.target.value, 'issueTitle')}
          />
        </Form.Item>

        {/* 问题类型 */}
        <Form.Item
          label="问题分类"
          name="typeId"
          rules={[{ required: true, message: '请选择问题所属分类' }]}
        >
          <Select style={{ width: 200 }} onChange={handleChange}>
            {typeOptionCreator(Select, typeList)}
          </Select>
        </Form.Item>

        {/* 问答内容 */}
        <Form.Item
          label="问题描述"
          name="issueContent"
          rules={[{ required: true, message: '请输入问题描述' }]}
        >
          <TextEditor onChange={editorChangeHandle} />
        </Form.Item>

        {/* 确认按钮 */}
        <Form.Item wrapperCol={{ offset: 3, span: 16 }}>
          <Button type="primary" htmlType="submit">
            确认新增
          </Button>

          <Button type="link" htmlType="submit" className="resetBtn">
            重置
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
