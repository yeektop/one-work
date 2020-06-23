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

  downloadFile(){
    // 将文件压缩
    const {finish} = this.data.work
    wx.cloud.callFunction({
      name:'downloadZip',
      data:{
        finish
      }
    }).then(res=>{
      // 获取临时路径
      console.log(res);
      let fileList = []
      fileList.push(res.result.fileID)
      wx.cloud.getTempFileURL({
        fileList:fileList,
        success: res => {
          // 将临时路径复制到剪切板
          console.log(res.fileList[0].tempFileURL)
          let path = res.fileList[0].tempFileURL
          wx.setClipboardData({
            data: path,
            success(res){
              console.log(res);
            }
          })
        }
      })
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})