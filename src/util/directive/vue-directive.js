/**
 * 长按指令 v-longpress = {
 *    time: 500,
 *    func: func
 * }
 */

const longpress = {
  bind: function(el, binding) {
    let pressTimer = null
    let value = binding.value
    if(typeof value != 'object' || value == null) {
      value = {}
    }
    const {time, func} = value
    let start = (e) => {
      if (pressTimer === null) {
        pressTimer = setTimeout(() => {
          // 执行函数
          handler(e)
        }, time || 500)
      }
    }
    let cancel = (e) => {
      // 检查计时器是否有值
      if (pressTimer !== null) {
        clearTimeout(pressTimer)
        pressTimer = null
      }
    }
    const handler = (e) => {
      if(typeof func != 'function') {
        console.warn('指令未绑定方法')
      } else {
        func(e)
      }
    }
    // 添加事件监听器
    el.addEventListener('mousedown', start)
    el.addEventListener('touchstart', start)
    // 取消事件监听器
    el.addEventListener('click', cancel)
    el.addEventListener('mouseout', cancel)
    el.addEventListener('touchend', cancel)
    el.addEventListener('touchcancel', cancel)
  }
}

export {
  longpress
}