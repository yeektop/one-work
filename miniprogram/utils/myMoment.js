import moment from 'moment'

/**
 * 通过时间戳计算当前距离时间戳的天数
 * @param {Number} Timestamp 时间戳
 * @returns {string} 天数
 */
export function calDays(Timestamp) {
  const day = moment(Timestamp).calendar(null, {
    sameDay: '[今天]',
    nextDay: '[明天]',
    nextWeek: '[]',
    lastDay: '[昨天]',
    lastWeek: '[]',
    sameElse: '[]'
  })
  if (!!day) {
    return day
  } else {
    const days = moment(Timestamp).diff(new Date().valueOf(), "days")
    if (days > 0) {
      return `${days + 1} 天后`
    } else {
      return `${-days + 1} 天前`
    }
  }
}

/**
 * 返回 YYYY-MM-DD 格式的日期
 * @param {Number} Timestamp 时间戳
 */
export function formatDay(Timestamp) {
  return moment(Timestamp).format('YYYY-MM-DD')
}
