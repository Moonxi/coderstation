import { Bar, Column, Line, Pie, measureTextWidth } from '@ant-design/charts'
import { PageContainer } from '@ant-design/pro-components'
import { useDispatch, useLocation, useNavigate, useSelector } from '@umijs/max'
import { App } from 'antd'
import { useEffect, useState } from 'react'

import BookController from '@/services/book'
import CommentController from '@/services/comment'
import InterviewController from '@/services/interview'
import IssueController from '@/services/issue'
import UserController from '@/services/user'
import styles from './index.module.css'

const HomePage = props => {
  const [columnData, setColumnData] = useState([])
  const [lineData, setLineData] = useState([])
  const [issuePieData, setIssuePieData] = useState([])
  const [bookPieData, setBookPieData] = useState([])
  const [interviewPieData, setInterviewPieData] = useState([])
  const [pointsRankBarData, setPointsRankBarData] = useState([])
  const [userPieData, setUserPieData] = useState([])

  const { typeList } = useSelector(state => state.type)
  const { message } = App.useApp()
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const colorArr = ['#108ee9', '#2db7f5', '#f50', 'green', '#87d068', 'blue', 'red', 'purple']

  const columnConfig = {
    data: columnData,
    isGroup: true,
    xField: 'type',
    yField: 'count',
    seriesField: 'name',

    /** 设置颜色 */
    color: ['orange', '#87d068', '#108ee9'],

    /** 设置间距 */
    // marginRatio: 0.1,
    label: {
      // 可手动配置 label 数据标签位置
      position: 'middle',
      // 'top', 'middle', 'bottom'
      // 可配置附加的布局方法
      layout: [
        // 柱形图数据标签位置自动调整
        {
          type: 'interval-adjust-position'
        }, // 数据标签防遮挡
        {
          type: 'interval-hide-overlap'
        }, // 数据标签文颜色自动调整
        {
          type: 'adjust-color'
        }
      ]
    }
  }
  const lineConfig = {
    data: lineData,
    xField: 'type',
    yField: 'value',
    seriesField: 'name',
    label: {},
    meta: {
      type: {
        alias: '类型'
      },
      value: {
        alias: '评论数'
      }
    },
    point: {
      size: 5,
      shape: 'diamond',
      style: {
        fill: 'white',
        stroke: '#5B8FF9',
        lineWidth: 2
      }
    },
    tooltip: {
      showMarkers: false
    },
    state: {
      active: {
        style: {
          shadowBlur: 4,
          stroke: '#000',
          fill: 'red'
        }
      }
    },
    interactions: [
      {
        type: 'marker-active'
      }
    ]
  }
  const pieConfig = {
    appendPadding: 10,
    data: [],
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0.64,
    meta: {
      value: {
        formatter: v => `${v}`
      }
    },
    label: {
      type: 'inner',
      offset: '-50%',
      style: {
        textAlign: 'center'
      },
      autoRotate: false,
      content: '{value}'
    },
    statistic: {
      title: {
        offsetY: -4,
        customHtml: (container, view, datum) => {
          const { width, height } = container.getBoundingClientRect()
          const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2))
          const text = datum ? `${datum.type} ` : '所有'
          return renderStatistic(d, text, {
            fontSize: 28
          })
        }
      },
      content: {
        offsetY: 4,
        style: {
          fontSize: '32px'
        },
        customHtml: (container, view, datum, data) => {
          const { width } = container.getBoundingClientRect()
          const text = datum ? `${datum.value}` : `${data.reduce((r, d) => r + d.value, 0)}`
          return renderStatistic(width, text, {
            fontSize: 32
          })
        }
      }
    },
    // 添加 中心统计文本 交互
    interactions: [
      {
        type: 'element-selected'
      },
      {
        type: 'element-active'
      },
      {
        type: 'pie-statistic-active'
      }
    ]
  }
  const issuePieConfig = {
    ...pieConfig,
    data: issuePieData,
    statistic: {
      title: {
        offsetY: -4,
        style: {
          fontSize: '14px'
        },
        customHtml: (container, view, datum) => {
          const { width, height } = container.getBoundingClientRect()
          const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2))
          const text = datum ? `${datum.type} 问答` : '所有问答'
          return renderStatistic(d, text, {
            fontSize: 28
          })
        }
      },
      content: {
        offsetY: 4,
        style: {
          fontSize: '32px'
        },
        customHtml: (container, view, datum, data) => {
          const { width } = container.getBoundingClientRect()
          const text = datum ? `${datum.value}` : `${data.reduce((r, d) => r + d.value, 0)}`
          return renderStatistic(width, text, {
            fontSize: 32
          })
        }
      }
    }
  }
  const bookPieConfig = {
    ...pieConfig,
    data: bookPieData,
    statistic: {
      title: {
        offsetY: -4,
        style: {
          fontSize: '14px'
        },
        customHtml: (container, view, datum) => {
          const { width, height } = container.getBoundingClientRect()
          const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2))
          const text = datum ? `${datum.type} 书籍` : '所有书籍'
          return renderStatistic(d, text, {
            fontSize: 28
          })
        }
      },
      content: {
        offsetY: 4,
        style: {
          fontSize: '32px'
        },
        customHtml: (container, view, datum, data) => {
          const { width } = container.getBoundingClientRect()
          const text = datum ? `${datum.value}` : `${data.reduce((r, d) => r + d.value, 0)}`
          return renderStatistic(width, text, {
            fontSize: 32
          })
        }
      }
    }
  }
  const interviewPieConfig = {
    ...pieConfig,
    data: interviewPieData,
    statistic: {
      title: {
        offsetY: -4,
        style: {
          fontSize: '14px'
        },
        customHtml: (container, view, datum) => {
          const { width, height } = container.getBoundingClientRect()
          const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2))
          const text = datum ? `${datum.type} 面试题` : '所有面试题'
          return renderStatistic(d, text, {
            fontSize: 28
          })
        }
      },
      content: {
        offsetY: 4,
        style: {
          fontSize: '32px'
        },
        customHtml: (container, view, datum, data) => {
          const { width } = container.getBoundingClientRect()
          const text = datum ? `${datum.value}` : `${data.reduce((r, d) => r + d.value, 0)}`
          return renderStatistic(width, text, {
            fontSize: 32
          })
        }
      }
    }
  }
  const barConfig = {
    data: pointsRankBarData,
    xField: 'value',
    yField: 'nickname',
    // seriesField: 'nickname',
    legend: {
      position: 'top-left'
    },
    color: 'gold',
    meta: {
      nickname: {
        alias: '昵称'
      },
      value: {
        alias: '积分'
      }
    }
  }

  const userPieConfig = {
    appendPadding: 10,
    data: userPieData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.9,
    color: ({ type }) => {
      if (type === '正常状态用户') {
        return '#87d068'
      } else if (type === '禁用状态用户') {
        return 'gray'
      }
    },
    label: {
      type: 'spider',
      content: ({ value }) => `${value} 人`
    },
    interactions: [
      {
        type: 'element-selected'
      },
      {
        type: 'element-active'
      }
    ]
  }
  // 刷新类型列表
  useEffect(() => {
    dispatch({
      type: 'type/_initTypeList'
    })
  }, [])

  // 获取数据
  useEffect(() => {
    fetchData()
  }, [typeList])

  // 解决跳转后 message 不显示的问题
  useEffect(() => {
    if (location.state?.message) {
      message[location.state.message.type](location.state.message.content)
      // 重置 location.state 避免刷新重复提示
      navigate(location.pathname, { replace: true })
    }
  }, [location])

  // 获取数据
  async function fetchData() {
    // 柱状图数据
    const columnData = []
    // 两个板块评论折线图数据
    const lineData = []
    // 问答饼图数据
    const issuePieData = []
    // 书籍饼图数据
    const bookPieData = []
    // 面试题饼图数据
    const interviewPieData = []
    // 积分排行榜数据
    const pointsRankBarData = []
    // 获取积分排行榜数据
    const { data: pointsRankList } = await UserController.getTopTenUser()
    // 用户饼图数据
    const userPieData = []
    // 获取用户饼图数据
    const {
      data: { count: enabledUsersCount }
    } = await UserController.getUserByParams({
      enabled: true,
      pageSize: 5,
      current: 1
    })
    userPieData.push({
      type: '正常状态用户',
      value: enabledUsersCount
    })
    const {
      data: { count: disabledUsersCount }
    } = await UserController.getUserByParams({
      enabled: false,
      pageSize: 5,
      current: 1
    })
    userPieData.push({
      type: '禁用状态用户',
      value: disabledUsersCount
    })
    for (const t of typeList) {
      const params = {
        typeId: t._id,
        pageSize: 5,
        current: 1
      }
      const {
        data: { count: issueCount }
      } = await IssueController.getIssueByParams(params)
      const {
        data: { count: bookCount }
      } = await BookController.getBookByParams(params)
      const {
        data: { count: interviewCount }
      } = await InterviewController.getInterviewByParams(params)
      const {
        data: { count: issueCommentCount }
      } = await CommentController.getCommentByCommentType(1, params)
      const {
        data: { count: bookCommentCount }
      } = await CommentController.getCommentByCommentType(2, params)
      columnData.push({
        name: '问答',
        type: t.typeName,
        count: issueCount
      })
      columnData.push({
        name: '书籍',
        type: t.typeName,
        count: bookCount
      })
      columnData.push({
        name: '面试题',
        type: t.typeName,
        count: interviewCount
      })
      issuePieData.push({
        type: t.typeName,
        value: issueCount
      })
      bookPieData.push({
        type: t.typeName,
        value: bookCount
      })
      interviewPieData.push({
        type: t.typeName,
        value: interviewCount
      })
      lineData.push({
        name: '问答评论数',
        type: t.typeName,
        value: issueCommentCount
      })
      lineData.push({
        name: '书籍评论数',
        type: t.typeName,
        value: bookCommentCount
      })
    }
    for (const u of pointsRankList) {
      pointsRankBarData.push({
        value: +u.points,
        nickname: u.nickname
      })
    }
    setColumnData(columnData)
    setLineData(lineData)
    setIssuePieData(issuePieData)
    setBookPieData(bookPieData)
    setInterviewPieData(interviewPieData)
    setPointsRankBarData(pointsRankBarData)
    setUserPieData(userPieData)
    return {
      columnData,
      lineData,
      issuePieData,
      bookPieData,
      interviewPieData,
      pointsRankBarData,
      userPieData
    }
  }

  function renderStatistic(containerWidth, text, style) {
    const { width: textWidth, height: textHeight } = measureTextWidth(text, style)
    const R = containerWidth / 2 // r^2 = (w / 2)^2 + (h - offsetY)^2

    let scale = 1

    if (containerWidth < textWidth) {
      scale = Math.min(
        Math.sqrt(
          Math.abs(Math.pow(R, 2) / (Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2)))
        ),
        1
      )
    }

    const textStyleStr = `width:${containerWidth}px;`
    return `<div style="${textStyleStr};font-size:${scale}em;line-height:${
      scale < 1 ? 1 : 'inherit'
    };">${text}</div>`
  }

  return (
    <PageContainer ghost>
      <div className={styles.container}>
        {/* 第一行 */}
        <div className={styles.wrapper}>
          <div className={styles.left}>
            <Pie {...issuePieConfig} />
          </div>
          <div className={styles.middle}>
            <Pie {...bookPieConfig} />
          </div>
          <div className={styles.right}>
            <Pie {...interviewPieConfig} />
          </div>
        </div>
        {/* 第二行 */}
        <div className={styles.wrapper}>
          <Column {...columnConfig} />
        </div>
        {/* 第三行 */}
        <div className={styles.wrapper}>
          <Line {...lineConfig} />
        </div>
        {/* 第四行 */}
        <div className={styles.wrapper}>
          <div className={styles.left}>
            <Bar {...barConfig} />
          </div>
          <div className={styles.right}>
            <Pie {...userPieConfig} />
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

export default props => (
  <App>
    <HomePage {...props} />
  </App>
)
