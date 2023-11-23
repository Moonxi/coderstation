import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getInterviewTitleList, updateInterviewCache } from '../redux/interviewSlice'
import { getTypeList } from '../redux/typeSlice'
import { Tree, BackTop } from 'antd'
import PageHeader from '../components/PageHeader'
import { getInterviewById } from '../api/interview'

import styles from '../css/Interview.module.css'

export default function Interviews() {
  const [treeData, setTreeData] = useState([])
  const [interviewInfo, setInterviewInfo] = useState(null) // 当前选中的面试题信息
  const [interviewRightSide, setInterviewRightSide] = useState(null) // 面试题右侧内容
  const { interviewTitleList, interviewCache } = useSelector(state => state.interview)
  const { typeList } = useSelector(state => state.type)
  const dispatch = useDispatch()

  useEffect(() => {
    if (interviewInfo) {
      setInterviewRightSide(
        <div className={styles.content}>
          <h1 className={styles.interviewRightTitle}>{interviewInfo.interviewTitle}</h1>
          <div className={styles.contentContainer}>
            <div dangerouslySetInnerHTML={{ __html: interviewInfo.interviewContent }}></div>
          </div>
        </div>
      )
    } else {
      setInterviewRightSide(
        <div
          style={{
            textAlign: 'center',
            fontSize: '40px',
            fontWeight: '100',
            marginTop: '150px'
          }}
        >
          请在左侧选择面试题
        </div>
      )
    }
  }, [interviewInfo])
  useEffect(() => {
    if (!interviewTitleList.length) {
      dispatch(getInterviewTitleList())
    }
    if (!typeList.length) {
      dispatch(getTypeList())
    }
    // 当二者都拿到值后，组装树形结构数据
    if (interviewTitleList.length && typeList.length) {
      async function clickHandle(id) {
        // console.log(interviewCache, 'interviewCache')
        // 先从缓存中找，找不到再去请求
        if (interviewCache[id]) {
          // console.log('从缓存中获取')
          setInterviewInfo(interviewCache[id])
          return
        }
        const { data } = await getInterviewById(id)
        // 将请求到的数据存入缓存
        dispatch(updateInterviewCache(data))
        setInterviewInfo(data)
      }
      const treeData = typeList.map((t, index) => ({
        title: <h3 style={{ fontWeight: '200' }}>{t.typeName}</h3>,
        key: t._id,
        children: interviewTitleList[index].map(i => ({
          title: (
            <h4 style={{ fontWeight: '200' }} onClick={() => clickHandle(i._id)}>
              {i.interviewTitle}
            </h4>
          ),
          key: i._id
        }))
      }))
      setTreeData(treeData)
    }
  }, [interviewTitleList, typeList, interviewCache])

  return (
    <div className={styles.container}>
      <PageHeader title="面试题大全" />

      <div className={styles.interviewContainer}>
        <div className={styles.leftSide}>
          <Tree treeData={treeData} />
        </div>
        <div className={styles.rightSide}>{interviewRightSide}</div>
      </div>
      <BackTop />
    </div>
  )
}
