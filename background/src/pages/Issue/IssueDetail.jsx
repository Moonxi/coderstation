import { Comment } from '@ant-design/compatible'
import { PageContainer } from '@ant-design/pro-components'
import { useDispatch, useLocation, useNavigate, useParams, useSelector } from '@umijs/max'
import { Avatar, Card, Empty, FloatButton, List, Tag, Tooltip } from 'antd'
import { useEffect, useRef, useState } from 'react'

import CommentController from '@/services/comment'
import IssueController from '@/services/issue'
import UserController from '@/services/user'

import { formatDate, formatTime } from '@/utils/tools'

import styles from './IssueDetail.module.css'

function IssueDetail() {
  const [issueDetail, setIssueDetail] = useState({}) // 问答详情
  const [currentType, setCurrentType] = useState({}) // 当前分类
  const [user, setUser] = useState({}) // 提问者信息
  const [commentList, setCommentList] = useState([]) // 评论列表
  const [pagenation, setPagenation] = useState({
    current: 1,
    pageSize: 5
  }) // 分页信息
  const [total, setTotal] = useState(0) // 总条数

  const { typeList } = useSelector(state => state.type)
  const location = useLocation()
  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const actionRef = useRef()

  const colorArr = ['#108ee9', '#2db7f5', '#f50', 'green', '#87d068', 'blue', 'red', 'purple']

  // 刷新类型列表
  useEffect(() => {
    dispatch({
      type: 'type/_initTypeList'
    })
  }, [])
  // 获取问答详情
  useEffect(() => {
    async function init() {
      const res = await IssueController.getIssueById(params.id)
      if (!res.data) {
        navigate('/interview/interviewList', {
          state: {
            message: {
              type: 'warning',
              content: '问答不存在'
            }
          },
          replace: true
        })
        return
      }
      setIssueDetail(res.data)
      // 获取问答对应的提问者信息
      const { data: user } = await UserController.getUserById(res.data.userId)
      setUser(user)
      // 获取问答对应的评论列表
      const { data } = await CommentController.getCommentByIssueId(res.data._id, pagenation)
      const commentList = data.data
      // 为每个评论添加用户信息
      for (const c of commentList) {
        const { data: user } = await UserController.getUserById(c.userId)
        c.userInfo = user
      }
      setCommentList(commentList)
      setTotal(data.count)
    }
    init()
  }, [params, pagenation])
  // 获取当前分类
  useEffect(() => {
    setCurrentType(typeList.find(t => t._id === issueDetail.typeId) || {})
  }, [typeList, issueDetail])
  return (
    <div>
      <PageContainer>
        <Card
          title={issueDetail.issueTitle}
          extra={
            <Tag
              color={colorArr[typeList.findIndex(t => t._id === currentType._id) % colorArr.length]}
            >
              {currentType.typeName}
            </Tag>
          }
        >
          <div className={styles.question}>
            <div className={styles.questioner}>
              <Avatar src={user.avatar} size="small" />
              <span className={styles.user}>{<Tag color="volcano">{user.nickname}</Tag>}</span>
              <span>
                发布于：{formatTime(issueDetail.issueDate, '{y}-{m}-{d} {h}:{i}:{s} 星期{a}')}
              </span>
              <span
                style={{
                  marginLeft: '20px'
                }}
              >
                浏览数：{issueDetail.scanNumber}
              </span>
              <span
                style={{
                  marginLeft: '20px'
                }}
              >
                评论数：{issueDetail.commentNumber}
              </span>
            </div>
            <div className={styles.content}>
              <div dangerouslySetInnerHTML={{ __html: issueDetail.issueContent }}></div>
            </div>
          </div>
          {/* 评论列表 */}
          <List
            header="问答评论"
            locale={{ emptyText: <Empty description="暂无评论" imageStyle={{ height: 60 }} /> }}
            dataSource={commentList}
            pagination={{
              ...pagenation,
              total,
              align: 'left',
              showQuickJumper: true,
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '20'],
              onChange: (current, pageSize) => {
                setPagenation({
                  ...pagenation,
                  current,
                  pageSize
                })
              }
            }}
            renderItem={c => (
              <Comment
                avatar={<Avatar src={c.userInfo.avatar} />}
                content={<div dangerouslySetInnerHTML={{ __html: c.commentContent }}></div>}
                author={c.userInfo.nickname}
                datetime={
                  <Tooltip title={formatDate(c.commentDate)}>
                    <span>{formatTime(c.commentDate, '{y}-{m}-{d}')}</span>
                  </Tooltip>
                }
              />
            )}
          />
        </Card>
      </PageContainer>
      <FloatButton.BackTop />
    </div>
  )
}

export default IssueDetail
