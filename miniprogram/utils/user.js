wx.cloud.init({
  traceUser: true,
})
const db = wx.cloud.database()
const userInfos = db.collection('userInfos')


/**
 * 数据库用户信息
 * @typedef {Object} DBUserInfo
 * @property {string} _id - 数据库唯一标识符
 * @property {string} _openid - 唯一标识符
 * @property {string} avatarUrl - 头像地址
 * @property {classInfo[]} classes - 班级
 * @property {string} nickNmae - 昵称
 * @property {string} role - (角色)权限
 * @property {string} fullInfo - 学生信息完整
 * @property {string} studentID - 学号
 * @property {string} studentName - 姓名
 * @property {string} email - 邮箱
 */

/**
 * 班级数组
 * @typedef {Object} classInfo
 * @property {string} classname 班级名
 * @property {string} classId 班级标识符
 */


/**
 * 获取用户的 _openid
 * @returns {Promise<string>} 当前用户的 openid
 */
export function getOpenId() {
  return new Promise((resolve, reject) => {
    wx.cloud
      .callFunction({ name: 'getOpenId' })
      .then(res => resolve(res.result.openId))
      .catch(error => reject(error))
  })
}

/**
 * 查询当前用户在数据库中的信息
 * @returns {Promise<DBUserInfo>} - 数据库用户信息
 */
export function getDBUserInfo() {
  return new Promise((resolve, reject) => {
    userInfos.where({
      _openid: '{openid}'
    }).get()
      .then(res => resolve(res.data[0]))
      .catch(error => reject(error))
  })
}

/**
 * 打开小程序即执行首次注册
 * @returns {Promise<string>} - _openid
 */
export function firstSignIn() {
  return new Promise(async (resolve, reject) => {
    try {
      const _openid = await getOpenId()
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

/**
 * 登录或注册
 * @param {WechatMiniprogram.UserInfo} signInInfo open-type中获取的用户信息
 * @returns {Promise<DBUserInfo>} - 数据库用户信息
 */
export function signInOrUp(signInInfo) {
  return new Promise(async (resolve, reject) => {
    try {
      let userInfo = await getDBUserInfo()
      if (!userInfo) {
        let _openid = await getOpenId()
        userInfo = signInInfo
        userInfo.createTime = +new Date()
        userInfo.role = 'student'
        // 开发人员白名单
        const whitelist = [
          // Moreant
          'o0e774u-c4KHBu5mrOBooB2gx40U',
          // catalpa
          'o0e774ueWTGgDp0dt0cPij4sfHyc',
          // merrycodes
          'o0e774qXJq2voCXNuKPeZSay16uU'
        ]
        if (whitelist.some(item => item === _openid)) {
          userInfo.role = 'admin'
        }
        console.log(userInfo.role);
        userInfo.classes = []
        userInfo._id = await userInfos
          .add({ data: userInfo })
          .then(res => { return res._id })
        userInfo._openid = _openid
      }
      wx.setStorageSync('userInfo', userInfo)
      resolve(userInfo)
    } catch (error) { reject(error) }
  })
}