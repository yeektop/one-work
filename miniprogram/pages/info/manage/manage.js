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
    const { finish } = this.data.work
    const fileID = (await wx.cloud.callFunction({
      name: 'downloadZip',
      data: {
        finish
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