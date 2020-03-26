// copy https://github.com/MiGongOrg/wepy-utils/blob/master/src/http.js
class WxHttp {
  /**
   * [HTTP GET 请求]
   * @param [第1种使用方法是URL不带参数。第2种使用方法是在请求URL后带参数，如：?id=1&name=ming]
   * 1. HTTP.get(url).then((data) => {}).catch((error) => {})
   * 2. HTTP.get({url: url, params: [JSON Object] }).then((data) => {}).catch((error) => {})
   */
  get(requestHandler) {
    // 如果请求的不是 object 而是 string  
    if (typeof requestHandler === 'string') {
      // 就将requestHandler转为 object
      requestHandler = {
        url: String(requestHandler),
        params: {}
      }
    }
    return this.request('GET', requestHandler)
  }

  post(requestHandler) {
    return this.request('POST', requestHandler)
  }

  put (requestHandler) {
    return this.request('PUT', requestHandler)
  }

  delete (requestHandler) {
    return this.request('DELETE', requestHandler)
  }

  request(methods, requestHandler) {
    const { url, params, headers, mask, loading } = requestHandler
    // 默认是有loading的 没有蒙层
    if (loading === undefined || loading) {
      wx.showLoading && wx.showLoading({title: 'Loading...', mask: mask ? mask : false})
    }
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        data: params,
        // method 不是这四个类型就是 GET
        method: ['GET', 'POST', 'PUT', 'DELETE'].includes(methods) ? methods : 'GET',
        header: Object.assign({
          'Content-Type': 'application/json'
          /*
          这里可以自定义全局的头信息，这是一个栗子
          'Authorization': 'Bearer ' + wx.getStorageSync('token'),
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/x-www-form-urlencoded'
          */
        }, headers),
        success: function (res) {
          const { data, statusCode } = res
          // 处理数据
          statusCode === 200 ? resolve(data) : reject(data, statusCode)

        },
        fail: function () {
          reject('Network request failed')
        },
        complete: function () {
          wx.hideLoading && wx.hideLoading()
        }
      })
    })
  }

}

export default new WxHttp()