import Moment from 'moment'

/**
 * 计算当前距离时间戳的天数
 * @param {*} moment 时刻
 * @returns 
 */
export function calDays(moment) {
  let diff = Moment().diff(Moment(moment), 'days')
  if (Moment(moment).isBefore() && diff >= 1) {
    return diff + " 天前"
  }
  return Moment(moment).calendar(null, {
    sameDay: '[今天] HH:mm',
    nextDay: '[明天] HH:mm',
    nextWeek: 'M[月]D[日]ddd',
    lastDay: '[]',
    lastWeek: '[]',
    sameElse: 'M[月]D[日]ddd'
  });
}

/**
 * 将任意符合条件的时刻转化为 unix 毫秒时间戳
 * @param {*} any 需要转换的时刻
 */
export function getTimestamp(any) {
  return +Moment(any)
}

/**
 * 返回 YYYY-MM-DD 格式的日期
 * @param {*} moment 时刻
 */
export function formatDay(moment) {
  return Moment(moment).format('YYYY-MM-DD')
}

/**
 * 返回 HH:mm 格式的时间，如 09:04
 * @param {*} moment 时刻
 */
export function formatTime(moment) {
  return Moment(moment).format('HH:mm')
}

// 小程序使用 locale 设置语言有问题，因此手动设置
Moment.defineLocale('zh-cn', {
  months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split(
    '_'
  ),
  monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split(
    '_'
  ),
  weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
  weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
  weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'YYYY/MM/DD',
    LL: 'YYYY年M月D日',
    LLL: 'YYYY年M月D日Ah点mm分',
    LLLL: 'YYYY年M月D日ddddAh点mm分',
    l: 'YYYY/M/D',
    ll: 'YYYY年M月D日',
    lll: 'YYYY年M月D日 HH:mm',
    llll: 'YYYY年M月D日dddd HH:mm',
  },
  meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
  meridiemHour: function (hour, meridiem) {
    if (hour === 12) {
      hour = 0;
    }
    if (meridiem === '凌晨' || meridiem === '早上' || meridiem === '上午') {
      return hour;
    } else if (meridiem === '下午' || meridiem === '晚上') {
      return hour + 12;
    } else {
      // '中午'
      return hour >= 11 ? hour : hour + 12;
    }
  },
  meridiem: function (hour, minute, isLower) {
    var hm = hour * 100 + minute;
    if (hm < 600) {
      return '凌晨';
    } else if (hm < 900) {
      return '早上';
    } else if (hm < 1130) {
      return '上午';
    } else if (hm < 1230) {
      return '中午';
    } else if (hm < 1800) {
      return '下午';
    } else {
      return '晚上';
    }
  },
  calendar: {
    sameDay: '[今天]LT',
    nextDay: '[明天]LT',
    nextWeek: function (now) {
      if (now.week() !== this.week()) {
        return '[下]dddLT';
      } else {
        return '[本]dddLT';
      }
    },
    lastDay: '[昨天]LT',
    lastWeek: function (now) {
      if (this.week() !== now.week()) {
        return '[上]dddLT';
      } else {
        return '[本]dddLT';
      }
    },
    sameElse: 'L',
  },
  dayOfMonthOrdinalParse: /\d{1,2}(日|月|周)/,
  ordinal: function (number, period) {
    switch (period) {
      case 'd':
      case 'D':
      case 'DDD':
        return number + '日';
      case 'M':
        return number + '月';
      case 'w':
      case 'W':
        return number + '周';
      default:
        return number;
    }
  },
  relativeTime: {
    future: '%s后',
    past: '%s前',
    s: '几秒',
    ss: '%d 秒',
    m: '1 分钟',
    mm: '%d 分钟',
    h: '1 小时',
    hh: '%d 小时',
    d: '1 天',
    dd: '%d 天',
    M: '1 个月',
    MM: '%d 个月',
    y: '1 年',
    yy: '%d 年',
  },
  week: {
    // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
    dow: 1, // Monday is the first day of the week.
    doy: 4, // The week that contains Jan 4th is the first week of the year.
  },
});