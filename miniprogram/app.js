import { getDBUserInfo, firstSignIn } from './utils/user'

App({
  async onLaunch() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'xly-4sbzr',
        traceUser: true,
      })
    }

    // 从数据库中获取用户信息
    const userInfo = await getDBUserInfo()
    if (userInfo) {
      wx.setStorageSync('userInfo', userInfo)
      // 信息不完善去完善信息
      if (!userInfo.fullInfo) {
        const res = await wx.showModal({
          title: '您未完善学生信息',
          content: '点击“确定”去完善信息',
          showCancel: false,
        })
        if (res.confirm) {
          this.navigateToBind()
        }
      }
    } else {
      // 没有用户信息则进行注册
      wx.showLoading({
        title: '注册中...',
        mask: true
      })
      try {
        await firstSignIn()
        this.navigateToBind()
      } catch (err) {
        console.log(err);
        wx.showToast({
          title: '注册失败',
          icon: 'none'
        })
      }
    }
    
    this.globalData = {}
  },

  /**
   * 跳转到绑定页面
   */
  navigateToBind() {
    wx.navigateTo({
      url: '/pages/my/bind/bind?bind=true',
    })
  }
})
