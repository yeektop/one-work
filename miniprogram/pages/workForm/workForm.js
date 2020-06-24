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
    date(timestamp) {
      console.log("2");
      return formatDay(timestamp)
    },
    end: '',
    classIndex: -1,
    look: true,
    upload: false,
    finish: []
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
  changeUploadSwitch() {
    this.setData({
      upload: !this.data.upload
    })
  },


  /**
   * 提交表单
   */
  async submit() {
    try {
      this.setData({ adding: true })
      const {
        title = '',
        course = '',
        end = '',
        content = '',
        belongClasses,
        look,
        upload,
        finish
      } = this.data
      if (title.length < 3) {
        throw "标题太短了"
      }

      // 内容审查
      await wx.cloud.callFunction({
        name: 'checkText',
        data: {
          text: JSON.stringify({
            title,
            course,
            content,
          })
        }
      }).catch(() => {
        throw "含有敏感信息"
      })
      const { createTime, _id } = this.data
      const form = {
        title,
        course,
        end,
        content,
        createTime: createTime ? createTime : (+new Date()),
        belongClasses: belongClasses || {},
        upload,
        finish
      }
      if (_id) {
        this.update(form, look, _id)
      } else {
        this.add(form, look)
      }
    } catch (e) {
      console.error(e);
      this.setData({
        error: e + '',
        adding: false
      })
    }
  },

  /**
   * 添加work操作
   */
  async add(form, look) {
    console.log(form)
    await works
      .add({ data: form })
      .then(res => {
        this.setData({ adding: false })
        if (look) {
          wx.reLaunch({
            url: '/pages/info/info?id=' + res._id,
          })
        }
      })
  },

  /**
   * 更新work操作
   */
  async update(form, look, id) {
    const { updated } = (await works.doc(id)
      .update({ data: form })).stats
    if (updated !== 1) {
      throw "更新失败"
    } else {
      if (look) {
        wx.reLaunch({
          url: '/pages/info/info?id=' + id,
        })
      }
    }

  },

  /**
   * 更新/添加完成
   */
  finis() {
    this.setData({ adding: false })
    if (look) {
      wx.reLaunch({
        url: '/pages/info/info?id=' + id,
      })
    }
  },

  clearError() {
    this.setData({ error: '', })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const userInfo = wx.getStorageSync('userInfo')
    let work = {}, head = "发布作业", date = ''

    // 更新work会携带id
    if (options.id) {
      head = "发布作业"
      work = (await works.doc(options.id).get()).data
      date = formatDay(work.end)
    }

    this.setData({
      ...work, date, userInfo, loading: false, head
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