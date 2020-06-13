const db = wx.cloud.database()
const works = db.collection('works')

import { getTimestamp, formatDay, formatTime, calDays } from "../../utils/myMoment";

Page({

  data: {
    loading: true,
    view: {
      menu: false,
      sub: false,
      cal: false,
      time: false
    },
    menu: [
      { name: '修改', color: '#07c160' },
      { name: '删除', color: '#fa5151' },
      { name: '告诉同学', openType: 'share' },
      { name: '设置提醒' }
    ],
    sub: {
      date: formatDay(+ new Date()),
      time: formatTime(+ new Date()),
      calDays: ''
    },
    work: {
      title: '',
      course: '',
      content: '',
      status: ''
    }
  },

  /**
   * 显示/关闭组件
   * @param {Object} e 来自 wxml 的事件
   * @param {String} k 来自 js 的 key
   */
  showView(e, k) {
    let key
    if (k) {
      key = k
    } else {
      key = e.currentTarget.dataset.view
    }
    this.setData({ ['view.' + key]: !this.data.view[key] })
  },

  /**
   * 分配 更多菜单 事件
   */
  onSelect(event) {
    const { name } = event.detail
    const menus = this.data.menu.map(item => item.name)
    switch (name) {
      // 更新
      case menus[0]:
        this.update()
        break;
      // 删除
      case menus[1]:
        this.delect()
        break;
      // 分享
      case menus[2]:
        console.log("分享")
        break;
      // 订阅
      case menus[3]:
        if (this.data.sub.calDays) {
          this.setData({
            sub: {
              date: formatDay(+ new Date()),
              time: formatTime(+ new Date())
            }
          })
        }
        this.showView('', 'sub')
        break;
      default:
        break;
    }
  },

  /**
   * 设置日期
   */
  setSubDate(e) {
    console.log(e);
    this.showView('', 'cal')
    this.setData({
      'sub.date': formatDay((e.detail))
    })
  },

  /**
   * 设置时间
   */
  setSubTime(e) {
    console.log(e);
    this.setData({
      'sub.time': e.detail.value
    })
  },

  /**
   * 提交订阅
   */
  async confirmSub() {
    const { work: { title, content, end }, sub: { date, time } } = this.data
    const tempid = 'nLLL7b1sTw4JPR1Znjp281dmd-D6e4l1s-06zXFmRmM'
    const res = await wx.requestSubscribeMessage({
      tmplIds: [tempid],
    })
    if (res[tempid] != "accept") {
      // wx.showModal({
      //   showCancel: false,
      //   title: '您没有允许设置提醒'
      // })
      this.setData({
        error: '您没有允许设置提醒'
      })
    } else {
      this.showView('', 'sub')
      console.log(date + ' ' + time);
      this.setData({
        'sub.calDays': calDays(date + ' ' + time)
      })

      // 提交订阅消息
      const subInfo = {
        tmplIds,
        timestamp: getTimestamp(date + ' ' + time),
        sended: false,
        title,
        content,
        end,
      }

      // TODO: 完成 获得订阅权限，添加订阅消息到数据库
      console.log(subInfo);
    }
  },

  /**
   * 处理删除
   */
  async delect() {
    wx.showModal({
      title: '删除',
      confirmColor: '#ee0a24',
      content: '确定删除此条作业？',
    }).then(res => {
      if (res.confirm) {
        works.doc(this.data.work._id).remove().then(() => {
          wx.showToast({
            title: '删除成功',
            success: () => {
              setTimeout(() => {
                wx.reLaunch({
                  url: '/pages/index/index',
                })
              }, 1000)
            }
          })
        }
        )
      }
    })
  },

  update(id) {
    wx.navigateTo({
      url: '/pages/workForm/workForm?id=' + this.data.work._id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const work = (await works.doc(options.id).get()).data
    work.date = formatDay(work.end)
    this.setData({ work, loading: false })
  },


  onShareAppMessage() {
  }
})