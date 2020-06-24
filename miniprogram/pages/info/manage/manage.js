// miniprogram/pages/info/manage/manage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    work: {
      title: '',
      course: '',
      content: '',
      status: '',
      finish: []
    }
  },

  /**
   * 获取文件临时链接
   */
  async downloadFile() {
    // 使用云函数压缩云存储的文件
    const { finish, title } = this.data.work
    const fileID = (await wx.cloud.callFunction({
      name: 'downloadZip',
      data: {
        finish,
        fileName: title
      }
    })).result.fileID

    // 获取临时路径     
    const tempFileURL = (await wx.cloud.getTempFileURL({
      fileList: [fileID],
    })).fileList[0].tempFileURL

    // 设置粘贴板
    wx.setClipboardData({
      data: tempFileURL,
      success(res) {
        console.log(res);
      }
    })

    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo.email) {
      const { title } = this.data.work
      wx.cloud.callFunction({
        name: 'sendEmail',
        data: {
          to: userInfo.email,
          subject: title + ' 作业文件打包下载链接',
          html: `<p><b>你好：</b></p><p>这是${title}作业上传文件打包后的下载链接` +
            `<a href='${tempFileURL}'>点击下载</a></p><p>如果您没有看到链接，请打开此链接：${tempFileURL}</p>`
        }
      }).then(res => {
        wx.showToast({
          title: '已发送到邮箱',
        })
      })

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    var that = this
    const eventChannel = this.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      that.setData({
        work: data.data
      })
    })
  },

})