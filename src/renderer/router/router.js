// 路由数据
const routerData = [
  {
    path: '/',
    name: 'login',
    component: require('@/pages/login').default,
    meta: {
      keepAlive: true,
      requiresAuth: false
    }
  },
  {
    path: '/index',
    name: 'index',
    component: require('@/pages/index').default,
    meta: {
      keepAlive: true,
      requiresAuth: false
    }
  },
  {
    path: '/appointment',
    name: 'appointment',
    component: require('@/components/bets/appointment').default,
    meta: {
      keepAlive: true,
      requiresAuth: false,
      isStart: true
    }
  },
  {
    path: '/early',
    name: 'early',
    component: require('@/components/bets/early').default,
    meta: {
      keepAlive: true,
      requiresAuth: false,
      isStart: true
    }
  },
  {
    path: '/base',
    name: 'base',
    component: require('@/components/bets/base').default,
    meta: {
      keepAlive: true,
      requiresAuth: false,
      isStart: true
    }
  }
]

export default routerData
