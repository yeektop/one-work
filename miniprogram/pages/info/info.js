const db = wx.cloud.database()
const works = db.collection('works')
import { formatDay } from "../../utils/myMoment";

Page({

  data: {
    loading: true,
    show: false,
    actions: [
      { name: '修改', color: '#07c160' },
      { name: '删除', color: '#fa5151' },
      { name: '分享' },
      { name: '订阅' }
    ],
    work: {
      title: '',
      course: '',
      content: '',
      status: ''
    }
  },

  /**
   * 显示/关闭 更多菜单
   */
  show() {
    this.setData({ show: !this.data.show })
  },

  /**
   * 分配 更多菜单 事件
   */
  onSelect(event) {
    const { name } = event.detail
    switch (name) {
      case '修改':
        this.update()
        break;
      case '删除':
        this.delect()
        break;
      case '分享':
        console.log("分享")
        break;
      case '订阅':
        console.log("订阅")
        break;
      default:
        break;
    }
  },

  /**
   * 处理删除
   */
  async delect() {
    wx.showModal({
      title: '删除',
      confirmColor: '#ee0a24',
      content: '确定删除此条作业？',
    }).then(res => {
      if (res.confirm) {
        works.doc(this.data.work._id).remove().then(() => {
          wx.showToast({
            title: '删除成功',
            success: () => {
              setTimeout(() => {
                wx.reLaunch({
                  url: '/pages/index/index',
                })
              }, 1000)
            }
          })
        }
        )
      }
    })
  },

  update(id) {
    wx.navigateTo({
      url: '/pages/workForm/workForm?id=' + this.data.work._id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const work = (await works.doc(options.id).get()).data
    work.date = formatDay(work.end)
    this.setData({ work, loading: false })
  },


  onShareAppMessage() {
  }
})