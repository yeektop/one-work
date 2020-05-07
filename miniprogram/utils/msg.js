import qs from 'query-string'

/**
 * 消息页模板
 * @typedef {Object} MsgOption
 * @property {string} type - 类型，默认成功，可选 warn、info
 * @property {string} title - 标题
 * @property {string} msg - 信息
 * @property {string} tips - 按钮下的提示
 * @property {string} btn - 按钮文本
 * @property {string} relauncUrl - 确认后重定向的地址
 * @property {boolean} navigate - 导航到 Msg 页
 */

/**
 * 示例代码
 *```js
 wx.showToast({
   type: 'warn'
   title: '操作失败',
   msg: '添加作业',
   tips: '请稍后重试'
   btn: '确定',
   relauncUrl: '/pages/class/class',
   navigate: true,
 })
  ```
 * @param {MsgOption} param
 */
export function toMsg(param) {
  const stringify = qs.stringify(param, { encode: false })
  if (param.navigate) {
    wx.navigateTo({
      url: '/pages/msg/msg?' + stringify,
    })
  } else {
    wx.redirectTo({
      url: '/pages/msg/msg?' + stringify,
    })
  }

}