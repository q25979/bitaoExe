import { fetchPost, fetchTokenGet, fetchTokenPost } from './api'

// 登錄接口
export const login = (params) => {
  return fetchPost('/Home/AssistIndex/login', params)
}

// 登錄接口
export const logout = () => {
  return fetchTokenGet('/Home/AssistIndex/logout')
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

// 下注
export const betOrder = (params) => {
  return fetchTokenPost('/Home/AssistIndex/betOrder', params)
}

// 获取上五期记录
export const getFiveLog = () => {
  return fetchTokenGet('/Home/AssistIndex/fiveInfo')
}

// 獲取開獎記錄
export const getOpenLog = (params) => {
  return fetchTokenGet('/Home/AssistIndex/getOpenLog', params)
}

// 獲取提示
export const getTips = () => {
  return fetchTokenGet('/Home/AssistIndex/getTips')
}

// 獲取最低金額
export const getMinMoney = () => {
  return fetchTokenGet('/Home/AssistIndex/getMinMoney')
}

// 獲取最低金額
export const getTime = () => {
  return fetchTokenGet('/Home/AssistIndex/getTime')
}
