// pages/my/setting/setting.js
Page({

  data: {

  },

  onLoad: function (options) {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
  },
})