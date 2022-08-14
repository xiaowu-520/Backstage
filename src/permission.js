import router from '@/router'
import store from '@/store'

// 路由(全局)前置守卫
// to：去哪里的路由信息
// from：来自于哪个路由
// next：是否进入

// 定义白名单
const whiteList = ['/login', '/404']
router.beforeEach(async (to, from, next) => {
  const token = store.state.user.token
  // 是否登录状态
  if (token) {
    if (!store.state.user.userInfo.userId) {
      await store.dispatch('user/getUserInfo')
    }
    // 是否进入登录页
    if (to.path === '/login') {
      // 进入首页
      next('/')
    } else {
      // 直接进入
      next()
    }
  } else {
    // 未登录状态
    // 是否在白名单
    const isIncludes = whiteList.includes(to.path)
    if (isIncludes) {
      next()
    } else {
      next('/login')
    }
  }
})
