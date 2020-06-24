// 云函数入口文件
const cloud = require('wx-server-sdk')
const fs = require('fs')
const jszip = require('jszip')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const zip = new jszip()
  const { finish, fileName } = event

  for (let i = 0; i < finish.length; i++) {
    const res = await cloud.downloadFile({
      fileID: finish[i].fileID,
    })
    zip.file(finish[i].name, res.fileContent)
  }

  await new Promise(resolve => {
    zip.generateNodeStream({ streamFiles: true })
      .pipe(fs.createWriteStream(`/tmp/${fileName}.zip`))
      .on('finish', function () {
        resolve()
      });
  })

  const fileStream = fs.createReadStream(`/tmp/${fileName}.zip`)
  return await cloud.uploadFile({
    cloudPath: `out.zip`,
    fileContent: fileStream,
  })
}