import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Pagination, List, Empty } from 'antd'

import PageHeader from '../components/PageHeader'
import TypeSelect from '../components/TypeSelect'
import BookItem from '../components/BookItem'

import { getBookByPage } from '../api/book'

import styles from '../css/Books.module.css'
export default function Books() {
  const { curType } = useSelector(state => state.type)
  const [bookInfos, setBookInfos] = useState([]) // 书籍列表
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
      const { data } = await getBookByPage(searchParams)
      setBookInfos(data.data)
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
      {/* 头部区域 */}
      <PageHeader title="最新资源">
        <TypeSelect />
      </PageHeader>
      {/* 书籍列表 */}
      <div className={styles.bookContainer}>
        <List
          grid={{ gutter: 50, column: 5 }}
          locale={{
            emptyText: (
              <Empty
                description="暂无书籍"
                imageStyle={{ height: 40 }}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )
          }}
          dataSource={bookInfos}
          renderItem={bookInfo => <BookItem key={bookInfo._id} bookInfo={bookInfo} />}
        />
      </div>
      {/* 分页 */}
      <div className="paginationContainer">
        <Pagination
          hideOnSinglePage={bookInfos.length === 0}
          showSizeChanger
          showQuickJumper
          pageSizeOptions={['5', '10', '15']}
          defaultCurrent={1}
          {...pageInfo}
          onChange={handlePageChange}
        />
      </div>
    </div>
  )
}
