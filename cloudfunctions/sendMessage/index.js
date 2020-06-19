// 云函数入口文件
const cloud = require('wx-server-sdk')
const Moment = require('moment')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const subscribes = db.collection('subscribes')

// 云函数入口函数
exports.main = async (event, context) => {

  const now = Moment()
  const { data } = await subscribes.where({
    sended: false,
  }).get()
  // 获取需要发送订阅的消息

  if (!data.length) {
    return
  }

  const sendMessageData = data.filter((item) => {
    return Moment(item.timestamp).isSameOrBefore(now)
  })

  sendMessageData.forEach(async item => {

    const subscribeData = {
      "time2": {
        "value": Moment(item.timestamp).format("yyyy年MM月DD日 HH:mm")
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

    await cloud.openapi.subscribeMessage.send({
      touser: item._openid,
      page: 'pages/info/info?id=' + item.workId,
      data: subscribeData,
      templateId: item.tempid
    })

    await subscribes
      .where({
        _id: item._id
      })
      .update({
        data: {
          sended: true
        },
      })

  })

}