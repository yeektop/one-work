import { getDBUserInfo } from "../../utils/user";

const db = wx.cloud.database()
const classInfos = db.collection('classInfos')
const _ = db.command


Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    tipsError: '',
    joinShow: false,
    input: "",
    dialog: {
      type: false,
      title: '',
      msg: ''
    },
    userInfo: {
      classes: []
    },
    classInfo: {
      classId: '',
      classname: ''
    },
    inputError: ''
  },

  /**
   * 打开的侧滑
   */
  swipeOpen(e) {
    const index = e.detail.name
    this.data.classInfo = this.data.userInfo.classes[index]
  },

  /**
   * 显示对话框
   */
  dialogShow(e) {
    const { type, title } = e.currentTarget.dataset
    this.setData({
      dialog: {
        type,
        title
      },
      inputError: ''
    })
  },

  /**
   * 关闭对话框
   */
  dialogClose() {
    this.setData({
      'dialog.type': ''
    })
  },

  /**
   * 对话框确认
   */
  dialogConfirm() {
    const { input, dialog: { type } } = this.data
    if (input.length < 2) {
      this.setData({ inputError: '输入内容太短' })
    } else {
      let options = 'classId'
      if (type === 'create') {
        options = 'classname'
      }
      wx.navigateTo({
        url: `${type}?${options}=${input}`
      })
    }
  },

  /**
   * 对话框输入的内容
   */
  onInput(event) {
    this.data.input = event.detail
  },

  /**
   * 创建班级
   */
  async createClass() {
    const { userInfo } = this.data
    const classname = this.data.input
    const total = await classInfos
      .where({ classname })
      .count()
      .then(res => { return res.total })
    if (!total) {
      // 添加班名、暗号
      const id = await classInfos.add({
        data: {
          classname,
          createId: userInfo._id,
          createName: userInfo.nickName
        }
      }).then(res => { return res._id })
      return await this.joinClass(id, classname)
    } else {
      throw '班级名称重复'
    }
  },

  /**
   * 去确认退出班级
   */
  quit() {
    const { classId, classname } = this.data.classInfo
    wx.navigateTo({
      url: `quit?classId=${classId}&classname=${classname}`
    })
  },

  onLoad(options) {
  },

  async onShow() {
    this.setData({
      loading: true,
      'dialog.type': ''
    })
    const userInfo = await getDBUserInfo()
    wx.setStorage({
      data: userInfo,
      key: 'userInfo',
    })
    this.setData({
      userInfo,
      loading: false
    })
  },

  onShareAppMessage: function () {
    const { userInfo, classInfo: { classId, classname } } = this.data
    return {
      path: `/pages/class/join?share=true&classId=${classId}`,
      title: `${userInfo.nickName}邀请您加入班级“${classname}”`,
      imageUrl: "/images/invite_class.png"
    }
  }
})