// 路由数据
const routerData = [
  {
    path: '/',
    name: 'login',
    component: require('@/pages/login').default,
    meta: {
      keepAlive: true,
      requiresAuth: false,
      top: false
    }
  },
  {
    path: '/index',
    name: 'index',
    component: require('@/pages/index').default,
    meta: {
      keepAlive: true,
      requiresAuth: true,
      top: true
    }
  },
  {
    path: '/appointment',
    name: 'appointment',
    component: require('@/components/bets/appointment').default,
    meta: {
      keepAlive: true,
      requiresAuth: false,
      isStart: true,
      top: true
    }
  },
  {
    path: '/early',
    name: 'early',
    component: require('@/components/bets/early').default,
    meta: {
      keepAlive: true,
      requiresAuth: false,
      isStart: true,
      top: true
    }
  },
  {
    path: '/base',
    name: 'base',
    component: require('@/components/bets/base').default,
    meta: {
      keepAlive: true,
      requiresAuth: false,
      isStart: true,
      top: true
    }
  }
]

export default routerData
