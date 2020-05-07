import { toMsg } from "../../utils/msg";

const db = wx.cloud.database()
const userInfos = db.collection('userInfos')
const _ = db.command

Page({

  data: {
    loading: true,
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
    const { classId, classname } = this.data
    try {
      await userInfos
        .where({
          _openid: '{openid}'
        })
        .update({
          data: {
            classes: _.pull({ classId, classname })
          }
        })
        .then(res => {
          if (res.stats.updated !== 1) {
            throw "退出失败"
          }
        })
      // 跳转到成功页
      toMsg({
        title: `退出班级“${classname}”成功`,
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
    this.setData({ ...options })
  },
})