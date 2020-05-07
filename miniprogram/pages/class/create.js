import { toMsg } from "../../utils/msg";

const db = wx.cloud.database()
const classInfos = db.collection('classInfos')
const userInfos = db.collection('userInfos')
const _ = db.command

Page({

  data: {
    joining: false,
    error: '',
    classId: '',
    classname: ''
  },

  /**
   * 确定退出班级
   */
  async confirm() {
    this.setData({ joining: true })
    const { classname } = this.data
    try {
      const classId = await classInfos.add({
        data: {
          classname
        }
      }).then(res => res._id)
      await userInfos
        .where({
          _openid: '{openid}'
        })
        .update({
          data: {
            classes: _.push({ classId, classname })
          }
        })
        .then(res => {
          if (res.stats.updated !== 1) {
            throw "加入失败"
          }
        })
      // 跳转到成功页
      toMsg({
        title: `创建班级“${classname}”成功`,
        redirectUrl: '/pages/class/class'
      })
    } catch (e) {
      this.setData({
        error: e + '',
        joining: false
      })
      console.error(e)
      throw e
    }
  },

  back() {
    wx.navigateBack()
  },

  clearError() {
    this.setData({ error: '' })
  },

  async onLoad(options) {
    if (options.classname == '') {
      wx.navigateBack({})
    }
    this.setData({ ...options })
  },
})