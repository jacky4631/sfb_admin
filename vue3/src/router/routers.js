import Layout from '@/layout/index.vue'

export const constantRouterMap = [
  {
    path: '/login',
    meta: { title: '登录', noCache: true },
    component: () => import('@/views/login.vue'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/features/404.vue'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/features/401.vue'),
    hidden: true
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/features/redirect.vue')
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/home.vue'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'index', affix: true, noCache: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'center',
        component: () => import('@/views/system/user/center.vue'),
        name: '个人中心',
        meta: { title: '个人中心' }
      }
    ]
  },
  {
    path: '/mshop/materia/index',
    name: 'images',
    meta: {
      title: '上传图片',
      noCache: true
    },
    component: () => import('@/components/editorMaterial/index.vue'),
    hidden: true
  }
]

export default constantRouterMap
