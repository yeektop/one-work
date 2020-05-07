const db = wx.cloud.database()
const works = db.collection('works')
import { formatDay } from '../../utils/myMoment'
Page({
  /**
   * 获取作业清单 
   * 以后需要存储在本地，下拉刷新
   */
  async getWorks() {
    const workList = (await works
      // .where({
      //   _openid: '{openid}'
      // })
      .get()).data
    workList.forEach(item => {
      item.date = formatDay(item.end)
    })
    this.setData({ workList,loading: false })
  },

  toInfo(event) {
    wx.navigateTo({
      url: '/pages/info/info?id=' + event.currentTarget.dataset.id,
    })
  },

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    addShow: false,
    workList: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getWorks().then(() => {
      this.setData({ loading: false })
    })
  },



  async onPullDownRefresh() {
    await this.getWorks()
    wx.stopPullDownRefresh()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})