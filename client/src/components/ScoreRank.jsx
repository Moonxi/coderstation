import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getUserByPointsRank } from '../api/user'
import ScoreItem from './ScoreItem'
import { Card } from 'antd'

export default function ScoreRank() {
  const [userRankInfos, setUserRankInfos] = useState([])
  const { userInfo } = useSelector(state => state.user)
  useEffect(() => {
    async function fetchUser() {
      const { data } = await getUserByPointsRank()
      setUserRankInfos(data)
    }
    fetchUser()
  }, [userInfo])

  return (
    <Card title="积分排行榜">
      {userRankInfos.map((userRankInfo, index) => (
        <ScoreItem key={userRankInfo._id} rankInfo={userRankInfo} rank={index + 1} />
      ))}
    </Card>
  )
}
