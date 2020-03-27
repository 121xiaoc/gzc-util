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

  request() {
    const { url, params, headers } = requestHandler
  }
}

