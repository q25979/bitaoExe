import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

// 路由数据
import routers from './router'
import { Message } from 'element-ui'

// api
import { isUserInfo } from '@/fetch/common'

Vue.use(Router)

// 导出路由 在 main.js 里使用
const router = new Router({
  routes: routers
})

// 拦截器
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    let token = localStorage.getItem('__TOKEN__')
    if (token === 'undefined' || token === undefined || token === null) {
      Message.warning('登錄狀態不存在，請重新登錄')
      next('/')
      return false
    }

    isUserInfo()
      .then(res => {
        if (res.code === 200) {
          next()
        } else {
          Message({ type: 'warning', message: res.msg, showClose: true })
        }
      })
      .catch(err => {
        console.log('路由攔截err:', err)
        Message.error('請求超時，請檢查您網絡狀態')
      })
  } else {
    if (to.matched.some(record => record.meta.isStart)) {
      // 攔截是否在啟動外掛中
      if (store.state.status.isStart) {
        Message.warning({ message: '外掛正在運行中，請先停止外掛', showClose: true })
      } else {
        next()
      }
    } else {
      next()
    }
  }
})

export default router
