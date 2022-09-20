import { useUserStore } from './../stores/user'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/Login/index.vue') },
    {
      path: '/',
      component: () => import('@/views/Layout/index.vue'),
      redirect: '/home',
      children: [
        {
          path: '/home',
          component: () => import('@/views/Home/index.vue')
        },
        {
          path: '/article',
          component: () => import('@/views/Article/index.vue')
        },
        {
          path: '/notify',
          component: () => import('@/views/Notify/index.vue')
        },
        {
          path: '/user',
          component: () => import('@/views/User/index.vue')
        }
      ]
    },
    {
      path: '/playground',
      component: () => import('@/views/Playground/index.vue')
    }
  ]
})

// 控制权限
router.beforeEach((to) => {
  const store = useUserStore()
  const token = store.user?.token
  const whiteList = ['/login']
  if (!token && !whiteList.includes(to.path)) {
    return '/login'
  }
})

export default router
