import React from 'react'
import styles from '../css/ScoreItem.module.css'
import { Avatar } from 'antd'

import classNames from 'classnames'

export default function ScoreItem(props) {
  const iconfontClass = {
    iconfont: true,
    'icon-jiangbei': true
  }
  const top3 = ['#ffda23', '#c5c5c5', '#cd9a62'].map(c => (
    <div
      style={{
        color: c,
        fontSize: '22px'
      }}
      className={classNames(iconfontClass)}
    ></div>
  ))
  return (
    <div className={styles.container}>
      {/* 名次，头像和昵称 */}
      <div className={styles.left}>
        {props.rank <= 3 ? top3[props.rank - 1] : <div className={styles.rank}>{props.rank}</div>}
        <div className={styles.avatar}>
          <Avatar size="small" src={props.rankInfo.avatar} />
        </div>
        <div className={styles.nickname}>{props.rankInfo.nickname}</div>
      </div>
      {/* 积分 */}
      <div className={styles.right}>{props.rankInfo.points}</div>
    </div>
  )
}
