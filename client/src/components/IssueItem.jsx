import { useState, useEffect } from 'react'
import styles from '../css/IssueItem.module.css'
import { formatDate } from '../utils/tools'
import { useSelector, useDispatch } from 'react-redux'
import { getTypeList } from '../redux/typeSlice'
import { Tag } from 'antd'
import { getUserById } from '../api/user'
import { useNavigate } from 'react-router-dom'

export default function IssueItem(props) {
  const [userInfo, setUserInfo] = useState({}) // 用户信息
  const { typeList } = useSelector(state => state.type)
  const dispatch = useDispatch()
  const colorArr = ['#108ee9', '#2db7f5', '#f50', 'green', '#87d068', 'blue', 'red', 'purple']
  const type = typeList.find(t => t._id === props.issueInfo.typeId)
  const navigate = useNavigate()

  useEffect(() => {
    // 获取分类填充至仓库
    if (!typeList.length) {
      dispatch(getTypeList())
    }
    // 获取用户信息
    async function fetchUserData() {
      const { data } = await getUserById(props.issueInfo.userId)
      setUserInfo(data)
    }
    if (props.issueInfo.userId) {
      fetchUserData()
    }
  }, [props.issueInfo.userId])

  return (
    <div className={styles.container}>
      {/* 回答数 */}
      <div className={styles.issueNum}>
        <div>{props.issueInfo.commentNumber}</div>
        <div>回答</div>
      </div>
      {/* 浏览数 */}
      <div className={styles.issueNum}>
        <div>{props.issueInfo.scanNumber}</div>
        <div>浏览</div>
      </div>
      {/* 问题内容 */}
      <div className={styles.issueContainer}>
        <div
          className={styles.top}
          onClick={() => {
            navigate(`/issues/${props.issueInfo._id}`)
          }}
        >
          {props.issueInfo.issueTitle}
        </div>
        <div className={styles.bottom}>
          <div className={styles.left}>
            <Tag color={colorArr[typeList.indexOf(type) % colorArr.length]}>{type?.typeName}</Tag>
          </div>
          <div className={styles.right}>
            <Tag color="volcano">{userInfo.nickname}</Tag>
            <span>{formatDate(props.issueInfo.issueDate, 'year')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
