import axios from 'axios'
import qs from 'qs'
import { Message } from 'element-ui'

// 全局變量
const host = 'https://gdb699.com'

// axios 配置
axios.defaults.timeout = 10000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

// 拦截配置 - 請求配置
axios.interceptors.request.use((config) => {
  if (config.method === 'post' && config.data.constructor !== FormData) {
    config.data = qs.stringify(config.data)
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// 拦截配置 - 響應配置
axios.interceptors.response.use((res) => {
  if (res.data.code === 1000) {
    Message.warning('登錄狀態不存在，請重新登錄')
    return false
  }

  return res
}, (error) => {
  console.log('网络异常')
  return Promise.reject(error)
})

// post请求
export const fetchPost = (url, params) => {
  return new Promise((resolve, reject) => {
    axios.post(host + url, params)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// get请求
export const fetchGet = (url, params) => {
  return new Promise((resolve, reject) => {
    axios.get(host + url, params)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

// 带token Post请求
export const fetchTokenPost = (url, params) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: host + url,
      headers: { 'token': localStorage.getItem('__TOKEN__') },
      data: params
    }).then(response => {
      resolve(response.data)
    }).catch((err) => {
      reject(err)
    })
  })
}

// 带token Get请求
export const fetchTokenGet = (url, params) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: host + url,
      headers: { 'token': localStorage.getItem('__TOKEN__') },
      params: params
    }).then(response => {
      resolve(response.data)
    }).catch((err) => {
      reject(err)
    })
  })
}
