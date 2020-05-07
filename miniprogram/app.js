import { getDBUserInfo } from './utils/user'

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
    
    // 更新用户信息
    const userInfo = await getDBUserInfo()    
    wx.setStorageSync('userInfo', userInfo)

    this.globalData = {}
  }
})
