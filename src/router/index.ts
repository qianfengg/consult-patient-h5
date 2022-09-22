import { useUserStore } from './../stores/user'
import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({
  showSpinner: false
})

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/Login/index.vue'), meta: { title: '登录' } },
    {
      path: '/',
      component: () => import('@/views/Layout/index.vue'),
      redirect: '/home',
      children: [
        {
          path: '/home',
          component: () => import('@/views/Home/index.vue'),
          meta: {
            title: '首页'
          }
        },
        {
          path: '/article',
          component: () => import('@/views/Article/index.vue'),
          meta: {
            title: '健康百科'
          }
        },
        {
          path: '/notify',
          component: () => import('@/views/Notify/index.vue'),
          meta: {
            title: '消息通知'
          }
        },
        {
          path: '/user',
          component: () => import('@/views/User/index.vue'),
          meta: {
            title: '用户中心'
          }
        }
      ]
    },
    {
      path: '/user/patient',
      component: () => import('@/views/User/PatientPage.vue'),
      meta: { title: '家庭档案' }
    },
    {
      path: '/consult/fast',
      component: () => import('@/views/Consult/ConsultFast.vue'),
      meta: { title: '极速问诊' }
    },
    {
      path: '/playground',
      component: () => import('@/views/Playground/index.vue')
    }
  ]
})

// 控制权限
router.beforeEach((to) => {
  NProgress.start()
  const store = useUserStore()
  const token = store.user?.token
  const whiteList = ['/login']
  if (!token && !whiteList.includes(to.path)) {
    return '/login'
  }
})

router.afterEach((to) => {
  NProgress.done()
  document.title = `优医问诊-${to.meta.title || '欢迎使用'}`
})

export default router
