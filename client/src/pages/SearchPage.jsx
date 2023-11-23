import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Pagination, List, Empty } from 'antd'

import { getIssueByPage } from '../api/issue'
import { getBookByPage } from '../api/book'

import PageHeader from '../components/PageHeader'
import AddIssueBtn from '../components/AddIssueBtn'
import Recommend from '../components/Recommend'
import ScoreRank from '../components/ScoreRank'
import SearchResultItem from '../components/SearchResultItem'

import styles from '../css/SearchPage.module.css'

export default function SearchPage() {
  const location = useLocation()
  const [searchInfos, setSearchInfos] = useState([]) // 搜索列表
  const [pageInfo, setPageInfo] = useState({
    current: 1,
    pageSize: 15,
    total: 0
  }) // 分页信息

  useEffect(() => {
    async function fetchData() {
      const searchParams = {
        current: pageInfo.current,
        pageSize: pageInfo.pageSize,
        issueStatus: true
      }
      let data = null
      if (location.state.option === 'issue') {
        searchParams.issueTitle = location.state.search
        const res = await getIssueByPage(searchParams)
        data = res.data
      } else if (location.state.option === 'book') {
        searchParams.bookTitle = location.state.search
        const res = await getBookByPage(searchParams)
        data = res.data
      }
      setSearchInfos(data.data.map(d => ({ ...d, option: location.state.option })))
      setPageInfo({
        current: data.currentPage,
        pageSize: data.eachPage,
        total: data.count
      })
    }
    if (location.state) {
      fetchData()
    }
  }, [location.state, pageInfo.current, pageInfo.pageSize])

  function handlePageChange(page, pageSize) {
    setPageInfo({
      current: page,
      pageSize: pageSize,
      total: pageInfo.total
    })
  }
  return (
    <div className="container">
      <PageHeader title="搜索结果" />
      <div className={styles.searchPageContainer}>
        {/* 左侧区域 */}
        <div className={styles.leftSide}>
          <List
            locale={{
              emptyText: (
                <Empty
                  description="暂无搜索结果"
                  imageStyle={{ height: 40 }}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )
            }}
            dataSource={searchInfos}
            renderItem={searchInfo => (
              <SearchResultItem key={searchInfo._id} info={searchInfo} option={searchInfo.option} />
            )}
          />
          <div className="paginationContainer">
            <Pagination
              hideOnSinglePage={searchInfos.length === 0}
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
