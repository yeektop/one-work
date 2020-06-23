const db = wx.cloud.database()
const works = db.collection('works')
const subscribes = db.collection('subscribes')

import {
  getTimestamp,
  formatDay,
  formatTime,
  calDays
} from "../../utils/myMoment";

Page({

  data: {
    loading: true,
    view: {
      menu: false,
      sub: false,
      cal: false,
      time: false
    },
    menu: [{
        name: '修改',
        color: '#07c160'
      },
      {
        name: '删除',
        color: '#fa5151'
      },
      {
        name: '告诉同学',
        openType: 'share'
      },
      {
        name: '设置提醒'
      },
      {
        name: "文件管理"
      }
    ],
    sub: {
      date: formatDay(+new Date()),
      time: formatTime(+new Date()),
      calDays: ''
    },
    work: {
      title: '',
      course: '',
      content: '',
      status: '',
      finish: []
    },
    confirm: "作业上传"
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
    this.setData({
      ['view.' + key]: !this.data.view[key]
    })
  },

  /**
   * 分配 更多菜单 事件
   */
  onSelect(event) {
    const {
      name
    } = event.detail
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
              date: formatDay(+new Date()),
              time: formatTime(+new Date())
            }
          })
        }
        this.showView('', 'sub')
        break;
      case menus[4]:
        this.jumoToManage()
        break
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
    const {
      work: {
        _id,
        title,
        content,
        course,
        end
      },
      sub: {
        date,
        time
      }
    } = this.data
    const tempid = 'EEZQ-kY_zzs4gSbuz9PD60SQwCnYsCVMzvc-mgEl40I'
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
      this.setData({
        'sub.calDays': calDays(date + ' ' + time)
      })

      // 提交订阅消息
      const subInfo = {
        tempid,
        course,
        workId: _id,
        timestamp: getTimestamp(date + ' ' + time),
        sended: false,
        title,
        content,
        end,
      }

      // 添加订阅消息到数据库
      await subscribes.add({
        data: subInfo
      })
    }
  },

  // 作业上传
  onConfirm() {
    switch (this.data.confirm) {
      case '完成作业':
        console.log('完成');
        break
      case '作业上传':
        console.log(this.data.work);

        // 开始上传
        let that = this
        let {
          userInfo
        } = this.data
        let {
          work
        } = this.data
        wx.chooseMessageFile({
          count: 1,
          type: 'all',
          success(res) {
            const name = res.tempFiles[0].name
            const filePath = res.tempFiles[0].path
            const cloudPath = `${work.title}/${name}`
            const size = res.tempFiles[0].size
            const nickName = userInfo.nickName
            wx.cloud.uploadFile({
              cloudPath,
              filePath, // 文件路径
              success: res => {
                // get resource ID
                console.log(res)
                // 将文件信息推送到finish 添加上交时间
                var finished = {
                  fileID: res.fileID,
                  size: size,
                  name: name,
                  nickName: nickName,
                  id: userInfo._openid,
                  date: formatDay(new Date()) + " " + formatTime(new Date())
                }

                // 更新上交时间或者添加上传者
                let {
                  finish
                } = that.data.work
                if (finish.length == 0) {
                  finish.push(finished)
                } else {
                  for (let i = 0; i < finish.length; i++) {
                    if (finish[i].id === finished.id) {
                      finish[i] = finished
                      break
                    }
                    if (i === finish.length - 1) {
                      finish.push(finished)
                    }
                  }
                }
                that.setData({
                  'work.finish': finish
                })
                // 更新上传数据
                that.updateFinish()
                
                console.log(that.data.work);

                // 提示成功
                wx.showToast({
                  title: "上传成功"
                })
              }
            })
          }
        })
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
        })
      }
    })
  },

  update(id) {
    wx.navigateTo({
      url: '/pages/workForm/workForm?id=' + this.data.work._id,
    })
  },

  // 跳转到管理页面
  jumoToManage() {
    let work = this.data.work
    console.log(work);

    wx.navigateTo({
      url: '/pages/info/manage/manage',
      success: function (res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          data: work
        })
      }
    })
  },

  // 更新上交情况
  async updateFinish() {
    let {
      work
    } = this.data
    let {
      updated
    } = (await works.doc(work._id)
      .update({
        data: {
          finish: work.finish
        }
      }))
    .stats

    if (updated !== 1) {
      throw "更新失败"
    } else {
      return
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const work = (await works.doc(options.id).get()).data
    work.date = formatDay(work.end)
    const subInfo = (await subscribes.where({
      _openid: '{openid}',
      title: work.title,
      sended: false,
    }).get()).data[0]
    const data = subInfo ? calDays(subInfo.timestamp) : ''
    this.setData({
      work,
      loading: false,
      'sub.calDays': data
    })

    // 判断是否需要上交作业
    if (!this.data.work.upload) {
      this.setData({
        confirm: "完成作业"
      })
    }

    // 获取用户信息
    const userInfo = wx.getStorageSync('userInfo')
    this.setData({
      userInfo
    })

    console.log();

  },
  onShareAppMessage() {}
})