// pages/add/add.js
import { formatDay } from '../../utils/myMoment'

const db = wx.cloud.database()
const works = db.collection('works')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    calendarShow: false,
    adding: false,
    result: [],
    title: '',
    course: '',
    date: '',
    remar: '',
    classes: '',
    end: '',
    classIndex: -1,
    look: true
  },

  /**
   * 显示日期选择器
   */
  calendarShow() {
    this.setData({
      calendarShow: !this.data.calendarShow
    })
  },

  /**
   * 清除选择的日期
   */
  clearDate() {
    this.setData({
      date: ''
    })
  },

  /**
   * 确认选择的日期
   */
  calendarConfirm(e) {
    const date = formatDay(e.detail)
    this.setData({
      calendarShow: false,
      end: +e.detail, date
    });
  },

  selectCourse(e) {
    this.setData({
      result: e.detail
    });
  },

  classClick(e) {
    const { name } = e.currentTarget.dataset
    const belongClasses = this.data.userInfo.classes[name]
    this.setData({
      classIndex: name,
      belongClasses,
    })
  },

  look(e) {
    this.setData({
      look: !this.data.look
    })
  },


  /**
   * 提交表单
   */
  async submit(e) {
    try {


      this.setData({ adding: true })
      const {
        title = '',
        course = '',
        end = '',
        content = '',
        belongClasses,
        look
      } = this.data
      if (title.length < 3) {
        throw "标题太短了"
      }
      await wx.cloud.callFunction({
        name: 'checkText',
        data: {
          text: JSON.stringify({
            title,
            course,
            content,
          })
        }
      }).catch(e => {
        throw "含有敏感信息"
      })
      await works
        .add({
          data: {
            title,
            course,
            end,
            content,
            createTime: (+new Date()),
            belongClasses
          }
        })
        .then(res => {
          this.setData({ adding: false })
          if (look) {
            wx.reLaunch({
              url: '/pages/info/info?id=' + res._id,
            })
          }
        })
    } catch (e) {
      console.error(e);
      this.setData({
        error: e + '',
        adding: false
      })
    }
  },

  clearError() {
    this.setData({ error: '', })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userInfo = wx.getStorageSync('userInfo')
    this.setData({
      userInfo, loading: false
    })

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