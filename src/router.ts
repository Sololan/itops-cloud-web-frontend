import Vue from 'vue'
import Router from 'vue-router'
import HttpUtil from '@/providers/utils/http-util'
import store from '@/store'
import {Mutations} from '@/providers/models/enums'
import NoticeUtil from '@/providers/utils/notice-util'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/main'
    },
    {
      path: '/login',
      component: () => import('@/views/common/login/login.vue')
    },
    {
      path: '/main',
      meta: {requiresAuth: true, innerLoading: true},
      component: () => import('@/views/common/main/main.vue'),
      children: [
        {
          path: '/',
          redirect: 'home'
        },
        {
          path: 'tenant',
          component: () => import('@/views/tenant/tenant.vue')
        },
        {
          path: 'auth',
          component: () => import('@/views/auth/auth.vue')
        },
        {
          path: 'dict',
          component: () => import('@/views/dict/dict.vue')
        },
        {
          path: 'noticerule',
          component: () => import('@/views/notice-rule/notice-rule.vue')
        },
        {
          path: 'info',
          component: () => import('@/views/info/info.vue')
        },
        {
          path: 'tenantmanager',
          component: () => import('@/views/tenant-manager/tenant-manager.vue')
        },
        {
          path: 'user',
          component: () => import('@/views/user/user.vue')
        },
        {
          path: 'warning',
          component: () => import('@/views/warning/warning.vue')
        },
        {
          path: 'worktime',
          component: () => import('@/views/worktime/worktime.vue')
        },
        {
          path: 'home',
          component: () => import('@/views/home/home.vue')
        }
      ]
    },
    {
      path: '/empty',
      component: () => import('@/views/common/error/error.vue')
    },
    {
      path: '/wechat',
      component: () => import('@/views/wechat/wechat.vue')
    },
    {
      path: '*',
      component: () => import('@/views/common/error/error.vue')
    }
  ]
})

router.beforeEach(((to, from, next) => {
  NoticeUtil.hideLoading(true)
  const innerLoading = to.matched.some((record) => record.meta.innerLoading)
  store.commit(Mutations.SetLoadingFullScreen, !innerLoading)

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    HttpUtil.checkAuth(to.fullPath).then(
        // 认证成功
        (path) => (path === to.fullPath ? next() : next({path})),
        // 认证失败
        () => next({path: '/login', query: {redirect: to.fullPath}})
    )
  } else {
    next()
  }
}))

export default router
