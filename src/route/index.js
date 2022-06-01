import VueRouter from 'vue-router'
import Vue from 'vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/view/login/Login'),
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/view/main/MainView'),
    meta: {
      name: '系统管理',
    },
    children: [
      {
        path: 'user',
        name: 'user',
        component: () => import('@/view/admin/ManageUser'),
        meta: {
          name: '用户管理',
        },
      },
      {
        path: 'demo',
        name: 'demo',
        meta: {
          name: '其他',
        },
      },
    ],
  },
  {
    path: '/article',
    name: 'article',
    component: () => import('@/view/main/MainView'),
    meta: {
      name: '文章管理',
    },
    children: [
      {
        path: 'manage',
        name: 'manage',
        component: () => import('@/view/article/ManageArticle'),
        meta: {
          name: '文章管理',
        },
      },
      {
        path: 'edit',
        component: () => import('@/view/article/ArticleEdit'),
      },
      {
        path: 'edit/:id',
        name: 'edit',
        component: () => import('@/view/article/ArticleEdit'),
        meta: {
          name: '文章编辑',
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

router.beforeEach((to, from, next) => {
  next()
})

export default router
