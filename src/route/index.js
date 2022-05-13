import VueRouter from 'vue-router'
import Vue from 'vue'

Vue.use(VueRouter)

import MainView from '@/view/main/MainView'

const routes = [
  {
    path: '/login',
    component: () => import('@/view/login/Login'),
  },
  {
    path: '/admin',
    component: MainView,
    meta: {
      name: '系统管理',
    },
    children: [
      {
        path: 'user',
        component: () => import('@/view/admin/ManageUser'),
        meta: {
          name: '用户管理',
        },
      },
      {
        path: 'demo',
        meta: {
          name: '其他',
        },
      },
    ],
  },
]

// 处理路由地址重读报错的问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({ routes, mode: 'history' })

export default router
