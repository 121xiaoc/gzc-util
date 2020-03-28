import Taro from '@tarojs/taro';

// 区分接口环境
const env = process.env.NODE_ENV;

const baseUrlList = {
	development: '',
	production: ''
}

class Http {
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

  request(method = 'GET') {
    const { 
      url,
      data,
      header = { 'content-type': 'application/json' }
    } = requestHandler
    method = method.toUpperCase();
    // 通过环境设置请求的参数
    // const baseUrl = baseUrlList[env] || baseUrlList.development;
    // url = /^http/g.test(url) ? url : baseUrl + url;
    return new Promise((resolve, reject) => {
      const requestTask = Taro.request({ url, method, header, data });
      requestTask.then(res => {
        const { data, statusCode } = res
        if(/^2/g.test(statusCode)) {
          // resolve(data)
          return Promise.resolve(res)
        }
        function httpErrorMsgAction(){
          if (/^3/g.test(statusCodeStr)) return '重定向错误';
          if (/^4/g.test(statusCodeStr)) return '客户端错误';
          if (/^5/g.test(statusCodeStr)) return '服务器错误';
          return '未知错误'
        }
        return Promise.reject(httpErrorMsgAction())
      }).then(res => {
        const { code } = res;
        const errMsg = res.errMsg || res.msg
        if (code === 20000 || code === 200) {
          resolve(data)
        } else if (code === 40003) {
          // 登录
        } else {
          Promise.reject(errMsg)
        }
      }, httpErrMsg => {
        // 只捕获 http 错误状态
        Taro.showModal({
          title: '错误提示',
          content: JSON.stringify(httpErrMsg)
        }).then(res => {
          if (res.confirm) {
            Http(httpPrams);
          }
          reject()
        });
      })
    })
  }
}


