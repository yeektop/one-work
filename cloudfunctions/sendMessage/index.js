// 云函数入口文件
const cloud = require('wx-server-sdk')
const dayjs = require('dayjs')
var isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
dayjs.extend(isSameOrBefore)

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command
const subscribes = db.collection('subscribes')

// 云函数入口函数
exports.main = async (event, context) => {

  // 获取未发送的订阅消息，使用联表查询保证作业内容是最新的
  const { data } = await subscribes.where({
    errCode: _.neq(43101),
    sended: false,
  }).get()

  console.log(data);

  // 没有就直接返回 0 
  if (!data.length) {
    return 0
  }

  // 选出设定时间在这之前的订阅消息
  const sendMessageData = data.filter((item) => {
    return dayjs(item.timestamp).isSameOrBefore(+new Date())
  })

  const sendResult = { success: [], error: [] }
  // 遍历发送
  for (let i = 0; i < sendMessageData.length; i++) {
    const item = sendMessageData[i]
    const subscribeData = {
      "time2": {
        "value": dayjs(item.timestamp).format("YYYY年MM月DD日 HH:mm")
      },
      "thing4": {
        "value": item.course
      },
      "thing1": {
        "value": item.title
      },
      "thing3": {
        "value": "可点击消息前往一作业查看详细信息"
      },
    }

    // 发送订阅消息
    try {
      await cloud.openapi.subscribeMessage
        .send({
          touser: item._openid,
          page: 'pages/info/info?id=' + item.workId,
          data: subscribeData,
          templateId: item.tempid
        })
      subscribes
        .where({
          _id: item._id
        })
        .update({
          data: {
            sended: true
          },
        })
      sendResult.success.push(item._id)
    } catch (err) {
      // 异常捕捉，记录
      console.log(err.errCode);
      const { errCode, errMsg } = err
      console.log(errMsg);
      subscribes
        .where({
          _id: item._id
        })
        .update({
          data: {
            errCode,
            errMsg
          },
        }).catch(e => {
          console.log(e);
        })
      // 记录到云函数日志中
      sendResult.error.push({
        _id: item._id,
        errCode,
        errMsg
      })
    }

  }

  sendResult.successCount = sendResult.success.length
  sendResult.errorCount = sendResult.error.length

  if (sendResult.error.length > 0) {
    console.log("sendResult", sendResult);
    throw "发送失败"
  }

  return sendResult
}