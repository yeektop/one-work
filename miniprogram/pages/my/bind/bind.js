const db = wx.cloud.database()
const userInfos = db.collection('userInfos')
import { getDBUserInfo } from "../../../utils/user";

Page({

  data: {
    studentID = '',
    studentName = '',
    email = ''
  },

  /**
   * 获取微信信息回调事件
   */
  getWXInfo(e) {
    this.setData({
      wxInfo: e.detail.userInfo,
      success: "获取成功"
    })
  },

  /**
   * 表单提交事件
   */
  async submit() {
    let {
      wxInfo = '',
      studentID = '',
      studentName = '',
      email = ''
    } = this.data

    // 使用 try catch 进行表单验证
    try {
      if (!wxInfo.avatarUrl) {
        throw "您还未授权获取信息"
      }
      if (!(studentID && studentName && email)) {
        throw "请完善学生信息"
      }
      if (!/^\d+$/.exec(studentID)) {
        throw "学号必须为数字"
      }
      if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.exec(email)) {
        throw "邮箱格式不正确"
      }
    } catch (e) {
      console.log(e);
      this.setData({
        error: e
      })
      // 结束事件
      return
    }

    wx.showLoading({
      title: '提交中',
    })

    const res = (await userInfos
      .where({
        _openid: '{openid}'
      })
      .update({
        data: {
          ...wxInfo,
          studentID,
          studentName,
          email,
          fullInfo: true
        }
      }))
    if (res.stats.updated === 1) {
      wx.hideLoading({})
      this.setData({
        success: "绑定成功"
      })
      wx.setStorage('userInfo', await getDBUserInfo())
      setTimeout(() => {
        wx.navigateBack({})
      }, 1500)
    } else {
      wx.hideLoading({})
      this.setData({
        error: "绑定失败，请稍后重试"
      })
    }
  },

  onLoad: function (options) {
    const userInfo = wx.getStorageSync('userInfo')
    // 绑定还是修改
    const { bind = false } = options
    this.setData({
      userInfo,
      bind
    })
  },
})