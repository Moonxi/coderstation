import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { Comment, Avatar, Form, Button, List, Tooltip, message, Pagination, Empty } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import TextEditor from './TextEditor'

import { getIssueCommentById, getBookCommentById, addComment } from '../api/comment'
import { getUserById } from '../api/user'
import { editIssueById } from '../api/issue'
import { editBookById } from '../api/book'
import { editUser } from '../redux/userSlice'

import { formatDate, formatTime } from '../utils/tools'

export default function (props) {
  const { userInfo, isLogin } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const [commentList, setCommentList] = useState([]) // 评论列表
  const [pageInfo, setPageInfo] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  }) // 分页信息
  const [commentContent, setCommentContent] = useState('') // 评论内容
  const [textEditorInstance, setTextEditorInstance] = useState(null) // 编辑器实例

  useEffect(() => {
    if (props.targetId) {
      fetchCommentList()
    }
  }, [props.targetId, pageInfo.current, pageInfo.pageSize])

  function editorChangeHandle(htmlContent) {
    setCommentContent(htmlContent)
  }
  function getTextEditorInstance(instance) {
    setTextEditorInstance(instance)
  }
  function handlePageChange(page, pageSize) {
    setPageInfo({
      current: page,
      pageSize: pageSize,
      total: pageInfo.total
    })
  }
  async function fetchCommentList() {
    let data = {}
    if (props.commentType === 1) {
      // 获取问答评论
      const res = await getIssueCommentById(props.targetId, {
        current: pageInfo.current,
        pageSize: pageInfo.pageSize
      })
      data = res.data
    } else if (props.commentType === 2) {
      // 获取书籍评论
      const res = await getBookCommentById(props.targetId, {
        current: pageInfo.current,
        pageSize: pageInfo.pageSize
      })
      data = res.data
    }
    // 将用户信息添加到评论对象上
    for (let i = 0; i < data.data.length; i++) {
      const res = await getUserById(data.data[i].userId)
      data.data[i].userInfo = res.data
    }
    // 更新评论列表
    setCommentList(data.data)
    // 更新分页信息
    setPageInfo({
      current: data.currentPage,
      pageSize: data.eachPage,
      total: data.count
    })
  }
  async function addCommentHandle() {
    if (!commentContent || commentContent === '<p><br></p>') {
      message.warn('请填写评论内容')
      return
    }
    const commentInfo = {
      userId: userInfo._id,
      typeId: props.typeId,
      commentContent,
      commentType: props.commentType,
      bookId: props.commentType === 2 ? props.targetId : null,
      issueId: props.commentType === 1 ? props.targetId : null
    }
    const res = await addComment(commentInfo)
    if (!res.data) {
      // 清空编辑器内容
      textEditorInstance.setHTML('')
      navigate(location.pathname, { replace: true })
      return
    }
    message.success('评论成功，积分+4')
    // 更新评论数
    if (props.commentType === 1) {
      // 更新问答评论数
      editIssueById(props.targetId, {
        commentNumber: pageInfo.total + 1
      })
    } else if (props.commentType === 2) {
      // 更新书籍评论数
      editIssueById(props.targetId, {
        commentNumber: pageInfo.total
      })
    }
    // 更新用户积分
    dispatch(
      editUser({
        id: userInfo._id,
        data: {
          points: userInfo.points + 4
        }
      })
    )
    // 更新评论列表
    fetchCommentList()
    // 清空编辑器内容
    textEditorInstance.setHTML('')
  }
  // 根据登录状态进行头像处理
  let avatar = null
  if (isLogin) {
    avatar = <Avatar src={userInfo.avatar} />
  } else {
    avatar = <Avatar icon={<UserOutlined />} />
  }

  return (
    <div>
      {/* 评论框 */}
      <Comment
        avatar={avatar}
        content={
          <>
            <Form.Item>
              <TextEditor
                height="270px"
                onChange={editorChangeHandle}
                getInstance={getTextEditorInstance}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" disabled={!isLogin} onClick={addCommentHandle}>
                添加评论
              </Button>
            </Form.Item>
          </>
        }
      />
      {/* 评论列表 */}
      <List
        header="当前评论"
        locale={{ emptyText: <Empty description="暂无评论" imageStyle={{ height: 60 }} /> }}
        dataSource={commentList}
        renderItem={c => (
          <Comment
            avatar={<Avatar src={c.userInfo.avatar} />}
            content={<div dangerouslySetInnerHTML={{ __html: c.commentContent }} style={{overflow:'hidden'}}></div>}
            author={c.userInfo.nickname}
            datetime={
              <Tooltip title={formatDate(c.commentDate)}>
                <span>{formatTime(c.commentDate, '{y}-{m}-{d}')}</span>
              </Tooltip>
            }
          />
        )}
      />
      {/* 分页 */}
      {commentList.length > 0 ? (
        <div className="paginationContainer">
          <Pagination
            showSizeChanger
            showQuickJumper
            pageSizeOptions={['5', '10', '15']}
            defaultCurrent={1}
            {...pageInfo}
            onChange={handlePageChange}
          />
        </div>
      ) : null}
    </div>
  )
}
