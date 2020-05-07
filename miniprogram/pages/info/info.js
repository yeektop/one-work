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
    console.log(event);
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