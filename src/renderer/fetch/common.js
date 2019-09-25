import { fetchPost, fetchTokenGet } from './api'

// 登錄接口
export const login = (params) => {
  return fetchPost('/Home/AssistIndex/login', params)
}

// 判斷賬號信息
export const isUserInfo = () => {
  return fetchTokenGet('/Home/AssistIndex/isEndUser')
}

// 獲取交易歷史
export const getDealLog = (params) => {
  return fetchTokenGet('/Home/AssistIndex/getdeallog', params)
}

// 獲取用戶信息
export const getUserInfo = () => {
  return fetchTokenGet('/Home/AssistIndex/getUserInfo')
}
