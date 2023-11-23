import React from 'react'
import { Card } from 'antd'
import { useNavigate } from 'react-router-dom'

import styles from '../css/BookItem.module.css'

export default function BookItem(props) {
  const navigate = useNavigate()
  function cardClickHandle() {
    navigate(`/books/${props.bookInfo._id}`)
  }
  return (
    <Card
      hoverable
      style={{ width: 200, margin: 10 }}
      cover={
        <img
          alt={props.bookInfo.bookTitle}
          src={props.bookInfo.bookPic}
          style={{ width: '100%', height: 250 }}
        />
      }
      onClick={cardClickHandle}
    >
      <Card.Meta
        title={props.bookInfo.bookTitle}
        description={
          <div className={styles.description}>
            <span>浏览数：{props.bookInfo.scanNumber}</span>
            <span>评论数：{props.bookInfo.commentNumber}</span>
          </div>
        }
      />
    </Card>
  )
}
