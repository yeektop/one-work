Page({

  data: {
    type: 'success',
    title: '操作成功',
    msg: '',
    btn: '确定',
    tips: '',
    redirectUrl: false
  },

  back() {
    if (getCurrentPages().length === 1) {
      wx.reLaunch({
        url: '/pages/index/index',
      })
    } else {
      if (this.data.redirectUrl) {
        wx.redirectTo({
          url: this.data.redirectUrl,
        })
      } else {
        wx.navigateBack()
      }
    }
  },

  onLoad: function (options) {
    this.setData({ ...options })
  },
})