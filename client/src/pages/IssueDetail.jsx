import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { getIssueById, editIssueById } from '../api/issue'
import { getUserById } from '../api/user'
import { Avatar, message } from 'antd'
import PageHeader from '../components/PageHeader'
import Recommend from '../components/Recommend'
import ScoreRank from '../components/ScoreRank'
import Discuss from '../components/Discuss'

import { formatDate } from '../utils/tools'

import styles from '../css/IssueDetail.module.css'

export default function IssueDetail() {
  const [issueInfo, setIssueInfo] = useState({}) // 问答详情
  const [issueUser, setIssueUser] = useState({}) // 问答用户
  const location = useLocation()
  const navigate = useNavigate()

  const { id } = useParams()

  useEffect(() => {
    async function fetchData() {
      const { data } = await getIssueById(id)
      if (!data) {
        // 问答被删除或者不存在
        navigate('/issues')
        message.warning('该问答受到神秘力量影响，无法访问~~')
        return
      }
      setIssueInfo(data)
      // 问答浏览数 +1
      await editIssueById(id, { scanNumber: data.scanNumber + 1 })
      const res = await getUserById(data.userId)
      setIssueUser(res.data)
    }
    fetchData()
  }, [id, location])
  return (
    <div className={styles.container}>
      <PageHeader title="问答详情" />
      <div className={styles.detailContainer}>
        <div className={styles.leftSide}>
          {/* 问答详情 */}
          <div className={styles.question}>
            <h1>{issueInfo.issueTitle}</h1>
            <div className={styles.questioner}>
              <Avatar src={issueUser.avatar} size="small" />
              <span className={styles.user}>{issueUser.nickname}</span>
              <span>发布于：{formatDate(issueInfo.issueDate)}</span>
            </div>
            <div className={styles.content}>
              <div dangerouslySetInnerHTML={{ __html: issueInfo.issueContent }}></div>
            </div>
          </div>
          {/* 评论 */}
          <Discuss commentType={1} targetId={issueInfo._id} typeId={issueInfo.typeId} />
        </div>
        <div className={styles.rightSide}>
          <div style={{ marginBottom: 30 }}>
            <Recommend />
          </div>
          <ScoreRank />
        </div>
      </div>
    </div>
  )
}
