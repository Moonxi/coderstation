import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getIssueByPage } from '../api/issue'
import { Pagination, List, Empty } from 'antd'
import styles from '../css/Issue.module.css'

import PageHeader from '../components/PageHeader'
import AddIssueBtn from '../components/AddIssueBtn'
import IssueItem from '../components/IssueItem'
import Recommend from '../components/Recommend'
import ScoreRank from '../components/ScoreRank'
import TypeSelect from '../components/TypeSelect'

export default function Issues() {
  const { curType } = useSelector(state => state.type)
  const [issueInfos, setIssueInfos] = useState([]) // 问答列表
  const [pageInfo, setPageInfo] = useState({
    current: 1,
    pageSize: 15,
    total: 0
  }) // 分页信息

  let isCurTypeChange = false // 是否切换了分类
  useEffect(() => {
    isCurTypeChange = true
  }, [curType])
  useEffect(() => {
    async function fetchData() {
      const searchParams = {
        // 如果切换分类，则从第 1 页查询
        current: isCurTypeChange ? 1 : pageInfo.current,
        pageSize: pageInfo.pageSize,
        issueStatus: true
      }
      if (curType !== 'all') {
        searchParams.typeId = curType
      }
      const { data } = await getIssueByPage(searchParams)
      setIssueInfos(data.data)
      setPageInfo({
        current: data.currentPage,
        pageSize: data.eachPage,
        total: data.count
      })
    }
    fetchData()
    return () => {
      isCurTypeChange = false
    }
  }, [pageInfo.current, pageInfo.pageSize, curType])

  function handlePageChange(page, pageSize) {
    setPageInfo({
      current: page,
      pageSize: pageSize,
      total: pageInfo.total
    })
  }

  return (
    <div className={styles.container}>
      <PageHeader title="问答列表">
        <TypeSelect />
      </PageHeader>
      <div className={styles.issueContainer}>
        {/* 左侧区域 */}
        <div className={styles.leftSide}>
          <List
            locale={{
              emptyText: (
                <Empty
                  description="有问题，就来coder station!"
                  imageStyle={{ height: 40 }}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )
            }}
            dataSource={issueInfos}
            renderItem={issueInfo => <IssueItem key={issueInfo._id} issueInfo={issueInfo} />}
          />
          <div className="paginationContainer">
            <Pagination
              hideOnSinglePage={issueInfos.length === 0}
              showSizeChanger
              showQuickJumper
              pageSizeOptions={['5', '10', '15']}
              defaultCurrent={1}
              {...pageInfo}
              onChange={handlePageChange}
            />
          </div>
        </div>
        {/* 右侧区域 */}
        <div className={styles.rightSide}>
          <AddIssueBtn />
          <div style={{ marginBottom: 30 }}>
            <Recommend />
          </div>
          <ScoreRank />
        </div>
      </div>
    </div>
  )
}
