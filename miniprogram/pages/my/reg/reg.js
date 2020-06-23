const db = wx.cloud.database()
const userInfos = db.collection('userInfos')
import { getOpenId } from "../../../utils/user";

Page({

  data: {

  },

  // 获取用户信息事件
  getUserInfo(e) {
    this.setData({
      ...e.detail.userInfo
    })
  },

  // 表单提交事件
  submit() {
    let {
      _openid = '',
      avatarUrl = '',
      studentID = '',
      studentName = '',
      email = ''
    } = this.data
    // 表单验证
    try {
      if (!avatarUrl) {
        throw "您还未授权获取信息"
      }
      if (!(studentID && studentName && email)) {
        throw "请完善学生信息"
      }
      if (!/^\d+$/.exec(studentID)) {
        throw "学号必须为数字"
      }
      if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.exec(email)) {
        throw "邮箱格式不正确"
      }
    } catch (e) {
      console.log(e);
      this.setData({
        error: e
      })
    }

    // 保存信息
    if (_openid) {
      userInfos
        .where({
          _openid: '{openid}'
        })
        .update({
          data: {
            studentID,
            studentName,
            email
          }
        })
        .then(res => {
          console.log(res);
          // if(res.)
          this.setData({
            success: "修改成功"
          })
        })
    } else {
      const _openid = getOpenId()
      userInfos
        .add({
          data: {
            ...this.data,
            _openid
          }
        })
        .then(res => {
          wx.setStorageSync('userInfo', {
            userInfo: {
              _id: res._id,
              _openid,
              ...this.data
            }
          })
          this.setData({
            success: "注册成功"
          })
        })
    }
    setTimeout(() => {
      wx.reLaunch({
        url: '/pages/my/my'
      })
    }, 2000)
  },

  onLoad: function (options) {
    const userInfo = wx.getStorageSync('userInfo')
    this.setData({
      ...userInfo
    })
  },
})