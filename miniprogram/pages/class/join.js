import { getDBUserInfo, signInOrUp } from '../../utils/user'
import { toMsg } from "../../utils/msg";

const db = wx.cloud.database()
const classInfos = db.collection('classInfos')
const userInfos = db.collection('userInfos')
const _ = db.command

Page({

  data: {
    loading: true,
    joining: false,
    error: '',
    classInfo: {
      _id: '',
      classname: ''
    }
  },

  /**
   * 确定加入班级
   */
  async confirm(e) {
    // 有用户信息
    if (e.detail.userInfo) {
      this.setData({ joining: true })
      try {
        // 获取数据库中的用户信息
        const userInfo = await signInOrUp(e.detail.userInfo)
        // 取出班级信息
        const { classname, _id } = this.data.classInfo
        const classInfo = { classname, classId: _id }
        if (userInfo.classes) {
          const index = userInfo.classes.findIndex(res => res.classId === _id)
          if (index !== -1) {
            throw "您已在该班级"
          }
        }
        // 更新数据库中的用户信息
        await userInfos
          .where({
            _openid: '{openid}'
          })
          .update({
            data: {
              classes: _.push(classInfo)
            }
          }).then(res => {
            if (res.stats.updated === 0) {
              throw "失败，请向反馈客服"
            }
          })
        // 跳转到成功页
        toMsg({
          title: `加入班级“${classname}”成功`
        })
      } catch (e) {
        this.setData({
          error: e + '',
          joining: false
        })
        console.error(e)
        throw e
      }
    } else {
      this.setData({ error: '您未授权' })
    }
  },

  back() {
    if (this.data.joining) {
      return
    }
    if (getCurrentPages().length === 1) {
      wx.reLaunch({
        url: '/pages/index/index',
      })
    } else {
      wx.navigateBack()
    }
  },

  clearError() {
    this.setData({ error: '' })
  },


  async onLoad(options) {
    const { classId, share = false } = options

    try {
      const classInfo = (await classInfos.doc(classId).get()).data
      this.data.share = share
      this.setData({ classInfo, loading: false })

    } catch (e) {
      console.log(e);
      if (e.errCode === -1) {
        toMsg({
          title: '无效的班级ID',
          msg: '您输入的ID：<br>' + classId,
          tips: '如有问题，请向客服反馈',
          type: 'warn',
        })
      }
    }
  },

  async onShow() {
    // 如果是从分享链接来的，并且班级相同就直接飞主页。
    // 放 onShow 是防止重复打开
    if (this.data.share) {
      const userInfo = await getDBUserInfo()
      if (userInfo.classes) {
        const index = userInfo.classes.findIndex(res => res.classId === classInfo._id)
        if (index !== -1) {
          wx.reLaunch({
            url: '/pages/index/index',
          })
        }
      }
    }
  }
})