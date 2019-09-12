import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: require('@/pages/login').default,
      meta: { keepAlive: true }
    },
    {
      path: '/index',
      name: 'index',
      component: require('@/pages/index').default,
      meta: { keepAlive: true }
    }
  ]
})
