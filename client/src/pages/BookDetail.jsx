import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Image, Modal, message } from 'antd'
import { getBookById, editBookById } from '../api/book'

import { editUser } from '../redux/userSlice'

import PageHeader from '../components/PageHeader'
import Discuss from '../components/Discuss'

import styles from '../css/BookDetail.module.css'

export default function BookDetail() {
  const [bookInfo, setBookInfo] = useState({}) // 书籍详情
  const [isModalOpen, setIsModalOpen] = useState(false) // 是否打开模态框
  const { userInfo, isLogin } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchData() {
      const { data } = await getBookById(id)
      if (!data) {
        // 书籍被删除或者不存在
        navigate('/books')
        message.warning('这本书不见了哟~~')
        return
      }
      setBookInfo(data)
      // 书籍浏览数 +1
      editBookById(id, { scanNumber: data.scanNumber + 1 })
    }
    fetchData()
  }, [id, location])

  function showModal() {
    setIsModalOpen(true)
  }
  function handleOk() {
    if (userInfo.points < bookInfo.requirePoints) {
      message.warning('积分不足，无法下载')
    } else {
      // 积分足够，扣除积分
      dispatch(
        editUser({ id: userInfo._id, data: { points: userInfo.points - bookInfo.requirePoints } })
      )
      message.success(`下载成功，积分 -${bookInfo.requirePoints}`)
      window.open(bookInfo.downloadLink)
    }
    setIsModalOpen(false)
  }
  function handleCancel() {
    setIsModalOpen(false)
  }
  return (
    <div>
      <PageHeader title="书籍详情" />
      <div className={styles.bookInfoContainer}>
        <div className={styles.leftSide}>
          <div className={styles.img}>
            <Image height={350} src={bookInfo?.bookPic} />
          </div>
          <div className={styles.link}>
            <span>
              下载所需积分: <span className={styles.requirePoints}>{bookInfo?.requirePoints}</span>{' '}
              分
            </span>
            {isLogin ? (
              <div className={styles.downloadLink} onClick={showModal}>
                百度云下载地址
              </div>
            ) : null}
          </div>
        </div>
        <div className={styles.rightSide}>
          <h1 className={styles.title}>{bookInfo?.bookTitle}</h1>
          <div dangerouslySetInnerHTML={{ __html: bookInfo?.bookIntro }}></div>
        </div>
      </div>
      <div className={styles.comment}>
        <Discuss commentType={2} targetId={bookInfo._id} typeId={bookInfo.typeId} />
      </div>
      <Modal title="重要提示" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>
          是否使用 <span className={styles.requirePoints}>{bookInfo?.requirePoints}</span>{' '}
          积分下载此书籍？
        </p>
      </Modal>
    </div>
  )
}
