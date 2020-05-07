// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  // await cloud.openapi.security.msgSecCheck({ content: event.text })
  return await cloud.openapi.security.msgSecCheck({ content: event.text })

}