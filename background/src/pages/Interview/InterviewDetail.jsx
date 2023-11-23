import { PageContainer } from '@ant-design/pro-components'
import { useDispatch, useLocation, useNavigate, useParams, useSelector } from '@umijs/max'
import { Card, Tag,FloatButton } from 'antd'
import { useEffect, useState } from 'react'

import InterviewController from '@/services/interview'

function InterviewDetail() {
  const [interviewDetail, setInterviewDetail] = useState({}) // 面试题详情
  const [currentType, setCurrentType] = useState({}) // 当前分类
  const { typeList } = useSelector(state => state.type)
  const location = useLocation()
  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const colorArr = ['#108ee9', '#2db7f5', '#f50', 'green', '#87d068', 'blue', 'red', 'purple']
  // 刷新类型列表
  useEffect(() => {
    dispatch({
      type: 'type/_initTypeList'
    })
  }, [])
  // 获取面试题详情
  useEffect(() => {
    InterviewController.getInterviewById(params.id).then(res => {
      if (!res.data) {
        navigate('/interview/interviewList', {
          state: {
            message: {
              type: 'warning',
              content: '面试题不存在'
            }
          },
          replace: true
        })
        return
      }
      setInterviewDetail(res.data)
    })
  }, [params])
  // 获取当前分类
  useEffect(() => {
    setCurrentType(typeList.find(t => t._id === interviewDetail.typeId) || {})
  }, [typeList, interviewDetail])

  return (
    <div>
      <PageContainer>
        <Card
          title={interviewDetail.interviewTitle}
          extra={
            <Tag
              color={colorArr[typeList.findIndex(t => t._id === currentType._id) % colorArr.length]}
            >
              {currentType.typeName}
            </Tag>
          }
        >
          <div dangerouslySetInnerHTML={{ __html: interviewDetail.interviewContent }}></div>
        </Card>
      </PageContainer>
      <FloatButton.BackTop/>
    </div>
  )
}

export default InterviewDetail
