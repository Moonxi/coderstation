/**
 * 放置一些工具函数
 */

/**
 * 格式化时间戳
 * @param {*} timestamp
 * @returns
 */
export function formatDate(timestamp, part) {
  if (!timestamp) {
    return
  }
  let date = new Date(parseInt(timestamp))

  let year = date.getFullYear() // 年
  let month = date.getMonth() + 1 // 月
  let day = date.getDate() // 日

  let hour = date.getHours() // 时
  let minutes = date.getMinutes() // 分
  let seconds = date.getSeconds() // 秒

  let weekArr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  let week = weekArr[date.getDay()]

  // 需要给一位数前面加 0
  // 9 点 ----> 09:45:03

  if (month >= 1 && month <= 9) {
    // month += '0'; // a += b ----> a = a + b
    month = '0' + month
  }

  if (day >= 0 && day <= 9) {
    day = '0' + day
  }

  if (hour >= 0 && hour <= 9) {
    hour = '0' + hour
  }

  if (minutes >= 0 && minutes <= 9) {
    minutes = '0' + minutes
  }

  if (seconds >= 0 && seconds <= 9) {
    seconds = '0' + seconds
  }

  var str = ''

  switch (part) {
    case 'year': {
      str = `${year}-${month}-${day}`
      break
    }
    case 'time': {
      str = `${hour}:${minutes}:${seconds} `
      break
    }
    case 'year-time': {
      str = `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`
      break
    }
    case 'time-week': {
      str = `${hour}:${minutes}:${seconds} ${week}`
      break
    }
    default: {
      str = `${year}-${month}-${day} ${hour}:${minutes}:${seconds} ${week}`
    }
  }

  return str
}

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}
/**
 * 批量生成下拉列表的 option
 */
export function typeOptionCreator(Select, typeList) {
  return typeList.map(t => (
    <Select.Option key={t._id} value={t._id}>
      {t.typeName}
    </Select.Option>
  ))
}
