// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const _openid = wxContext.OPENID
  export function firstSignIn() {
    return new Promise(async (resolve, reject) => {
      try {
        const createTime = +new Date()
        const fullInfo = false
        let role = 'student'
        const whitelist = [
          // Moreant
          'o0e774u-c4KHBu5mrOBooB2gx40U',
          // catalpa
          'o0e774ueWTGgDp0dt0cPij4sfHyc',
          // merrycodes
          'o0e774qXJq2voCXNuKPeZSay16uU'
        ]
        if (whitelist.some(item => item === _openid)) {
          role = 'admin'
        }
        const baseInfo = {
          createTime,
          role,
          fullInfo
        }
        const _id = (await userInfos.add({
          data: {
            ...baseInfo
          }
        }))._id
        wx.setStorageSync('userInfo', {
          _id,
          _openid,
          ...baseInfo
        })
        resolve(_openid)
      } catch (err) {
        reject(err)
      }
    })
  }

  return {

  }
}