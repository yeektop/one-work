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

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const userInfo = wx.getStorageSync('userInfo')
    this.setData({ userInfo })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})