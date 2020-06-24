// pages/my/my.js
const db = wx.cloud.database()

import { signInOrUp } from '../../utils/user'

Page({
  async signInOrUp(event) {
    wx.showLoading({ title: '登录中' })
    const userInfo = await signInOrUp(event.detail.userInfo)
      .then(res => { return res })
    this.setData({ userInfo })
    wx.hideLoading()
  },

  data: {
  },

  onLoad: async function (options) {
    const userInfo = wx.getStorageSync('userInfo')
    this.setData({ userInfo })   
  },


  onShareAppMessage: function () {

  }
})