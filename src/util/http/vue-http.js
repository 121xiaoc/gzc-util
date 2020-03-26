import axios from 'axios'
// 接口请求去重
const requestList = []
const CancelToken = axios.CancelToken
const sources = {}

// 创建 axios 实例
const service = axios.create({
  baseURL: '', // api base_url
  timeout: 60000 // 请求超时时间
})

// 请求拦截
service.interceptors.request.use(
  config => {
    // 存取 token
    // const { projectName = 'hx_global' } = config
    // const token = loadKeyToken(projectName)
    // if (token) {
    //   config.headers.Authorization = token
    // }
    const request = config.url
    config.cancelToken = new CancelToken(cancel => {
      sources[request] = cancel
    })
    // 多次请求取消请求
    if(requestList.includes(request)) {
      sources[request]('取消重复请求')
    } else {
      requestList.puth(request)
    }
    return config
  },
  function(error) {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(response => {
  const request = response.config.url
  const spliceIndex = requestList.indexOf(request)
  spliceIndex !== -1 && requestList.splice(spliceIndex, 1)
  const code = response.data.code || response.data.Code
  const message =
    response.data.message ||
    response.data.errMsg ||
    response.data.msg ||
    response.data.Msg
  // 对返回的数据进行处理
  if (code === 20000 || code === 200) {
    return response.data || response.Data
  } else if (code === 40003) {
    // 接口鉴权失败，交由项目内处理，公共文件不做处理
    return Promise.reject(response)
  } else {
    // Dialog.alert({
    //   message: message
    // })
    return Promise.reject(response)
  }
}, error => {
  if (axios.isCancel(error)) {
    requestList.length = 0
    throw new axios.Cancel('cancel request')
  }
  const message = error.message
  if (error.code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
    // Notify({
    //   type: 'danger',
    //   message: '网络环境太差，请求超时'
    // })
  } else if (message === 'Network Error') {
    if (error.response) {
      // Notify({
      //   type: 'danger',
      //   message: `${error.response.status}:network连接失败，请求中断`
      // })
    } else {
      // Notify({
      //   type: 'danger',
      //   message: '未连接到服务器，可能网络中断或接口跨域'
      // })
    }
  } else if (message) {
    // Notify({
    //   type: 'danger',
    //   message: message
    // })
  }
  return Promise.reject(error)
})

class Http {
  get(requestHandler) {
    if (typeof requestHandler === 'string') {
      // 就将requestHandler转为 object
      requestHandler = {
        url: String(requestHandler),
        params: {}
      }
    }
    return this.request('GET', requestHandler)
  }
  request(methods, requestHandler) {
    const { url, params, headers, mask, loading, data} = requestHandler
    return service({
      url,
      method: ['GET', 'POST', 'PUT', 'DELETE'].includes(methods) ? methods : 'GET',
      params,
      data,
    })
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
}

const http = new Http()

const install = {
  install(Vue) {
    Object.defineProperties(Vue.prototype, {
      $get: {
        value: http.get
      },
      $post: {
        value: http.post
      },
      $put: {
        value: http.put
      },
      $del: {
        value: http.delete
      }
    })
  }
}

export default http
export {
  install
}
