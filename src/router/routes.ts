import Layout from '/@/layout/index.vue'
import routerView from '/@/layout/routerView.vue'
import { RouteRecordRaw } from 'vue-router'


export const notFound = {
  path: '/:pathMatch(.*)*',
  name: 'NotFound',
  redirect: '/error/404',
  component: () => import(/* webpackChunkName: "404" */ '/@/views/error/404.vue')
}

export const errorRoutes = {
  path: '/:pathMatch(.*)*',
  name: 'error',
  redirect: '/error/404',
  component: routerView,
  meta: {
      title: '错误页',
      icon: 'EditOutlined',
      hidden: true
  },
  children: [
      {
          path: '404',
          name: `error-404`,
          meta: {
              title: '404',
              icon: 'UserOutlined'
          },
          component: () => import('/@/views/error/404.vue')
      }
  ]
}

export const common = [
  {
    path: '/dashboard',
    name: 'dashboard',
    redirect: '/dashboard/welcome',
    component: routerView,
    meta: {
      title: '系统看板',
      icon: 'icon-yibiaopan'
    },
    children: [
      {
        path: 'welcome',
        name: `dashboard-welcome`,
        meta: {
            title: '首页',
            icon: 'icon-shouye',
        },
        component: () => import('/@/views/Home.vue'),
      },
    ]
  },
  {
    path: '/table',
    name: 'table',
    meta: {title: '表格', icon: 'icon-zhexiantu' },
    component: routerView,
    redirect: "/table-base",
    children: [
      {
        path: 'table-base',
        name: 'table-base',
        meta: { title: '基础表格', icon: '' },
        component: () => import('/@/views/table/base.vue')
      }
    ]
  },
  {
      path: '/chart',
      name: 'chart',
      meta: { title: '数据图表', icon: 'icon-zhexiantu'},
      component: routerView,
      // redirect: "/upload",
      children: [
        {
          path: 'lineChart',
          name: 'lineChart',
          meta: { title: '折线图', icon: '' },
          component: () => import('/@/views/chart/lineChart.vue'),
        },
        {
          path: 'columnChart',
          name: 'columnChart',
          meta: { title: '柱状图', icon: '' },
          component: () => import('/@/views/chart/columnChart.vue'),
        }
      ]
    }
]

export const asyncRouterMap = {
  '/system': routerView, // 系统管理
  '/system/access': () => import(/* webpackChunkName: "system-access" */ '/@/views/system/access/index.vue'), // 资源管理
  '/system/account': () => import(/* webpackChunkName: "system-account" */ '/@/views/system/account/index.vue'), // 账号管理
  '/system/dict': () => import(/* webpackChunkName: "system-dict" */ '/@/views/system/dict/index.vue'), // 字典管理
  '/system/role': () => import(/* webpackChunkName: "system-role" */ '/@/views/system/role/index.vue'), // 角色管理
}

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Layout',
    redirect: '/dashboard',
    component: Layout,
    meta: { title: '首页'},
    children: [
      ...common
        // ...asyncRouterMap
    ]
  },
  // errorRoutes,
  { path: '/login', name: 'login', component: () => import('/@/views/login/index.vue') },
  // {
  //   path: '/',
  //   name: 'home',
  //   meta: { title: '首页', icon: 'HomeOutlined' },
  //   component: Layout,
  //   redirect: "dashboard",
  //   children: [
  //     {
  //       path: 'dashboard',
  //       name: 'dashboard',
  //       meta: { title: '控制面板', icon: 'DashboardOutlined' },
  //       component: () => import('/@/views/Home.vue'),
  //     }
  //   ]
  // },
  // {
  //   path: '/table',
  //   name: 'table',
  //   meta: {title: '表格', icon: 'UnorderedListOutlined' },
  //   component: Layout,
  //   redirect: "/table-base",
  //   children: [
  //     {
  //       path: 'table-base',
  //       name: 'table-base',
  //       meta: { title: '基础表格', icon: 'DatabaseOutlined' },
  //       component: () => import('/@/views/table/base.vue')
  //     },{
  //       path: 'new-users',
  //       name: 'new-users',
  //       meta: { title: '新增用户数据', icon: 'DatabaseOutlined' },
  //       component: () => import('/@/views/new-users/index.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/monitor',
  //   name: 'monitor',
  //   meta: { title: '异常监控', icon: 'UnorderedListOutlined', isGroup:true },
  //   component: Layout,
  //   redirect: "/performance1",
  //   children: [
  //     {
  //       path: 'performance',
  //       name: 'performance',
  //       meta: { title: '页面性能', icon: 'DatabaseOutlined' },
  //       component: routerView,
  //       // redirect: "/performance1",
  //       children: [
  //         {
  //           path: 'performance1',
  //           name: 'performance1',
  //           meta: { title: '页面性能1', icon: 'DatabaseOutlined' },
  //           component: () => import('/@/views/performance/index1.vue'),
  //         },
  //         {
  //           path: 'performance2',
  //           name: 'performance2',
  //           meta: { title: '页面性能2', icon: 'DatabaseOutlined' },
  //           component: () => import('/@/views/performance/index2.vue'),
  //         }
  //       ]
  //     },{
  //       path: 'error-dashboard',
  //       name: 'error-dashboard',
  //       meta: { title: '错误看板', icon: 'DatabaseOutlined' },
  //       component: () => import('/@/views/error-dashboard/index.vue'),
  //     }
  //   ]
  // },
  // {
  //   path: '/upload',
  //   name: 'upload',
  //   meta: { title: '上传', icon: 'UnorderedListOutlined'},
  //   component: Layout,
  //   // redirect: "/upload",
  //   children: [
  //     {
  //       path: 'upload',
  //       name: 'upload',
  //       meta: { title: 'uploadto', icon: 'DatabaseOutlined' },
  //       component: () => import('/@/views/upload/index.vue'),
  //     }
  //   ]
  // },
  // {
  //   path: '/chart',
  //   name: 'chart',
  //   meta: { title: '数据图表', icon: 'UnorderedListOutlined'},
  //   component: Layout,
  //   // redirect: "/upload",
  //   children: [
  //     {
  //       path: 'lineChart',
  //       name: 'lineChart',
  //       meta: { title: '折线图', icon: 'LineChartOutlined' },
  //       component: () => import('/@/views/chart/lineChart.vue'),
  //     },
  //     {
  //       path: 'columnChart',
  //       name: 'columnChart',
  //       meta: { title: '柱状图', icon: 'BarChartOutlined' },
  //       component: () => import('/@/views/chart/columnChart.vue'),
  //     }
  //   ]
  // },
  // {
  //   path: '/result',
  //   name: 'result-menu',
  //   meta: { key: '3', title: '结果页面', icon: 'UnorderedListOutlined' },
  //   component: Layout,
  //   redirect: "/success",
  //   children: [
  //     {
  //       path: 'success',
  //       name: 'result-success',
  //       meta: { key: '3', title: '成功', icon: 'DatabaseOutlined' },
  //       component: () => import('/@/views/result/success.vue'),
  //     },{
  //       path: 'failure',
  //       name: 'result-failure',
  //       meta: { key: '3', title: '失败', icon: 'DatabaseOutlined' },
  //       component: () => import('/@/views/result/failure.vue'),
  //     }
  //   ]
  // },
  // {
  //   path: '/error',
  //   name: 'error',
  //   meta: { title: '错误页面', icon: 'UnorderedListOutlined' },
  //   component: Layout,
  //   redirect: "/403",
  //   children: [
  //     {
  //       path: '403',
  //       name: '403',
  //       meta: { title: '403', icon: 'DatabaseOutlined' },
  //       component: () => import('/@/views/error/403.vue'),
  //     },{
  //       path: '404',
  //       name: '404',
  //       meta: { title: '404', icon: 'DatabaseOutlined' },
  //       component: () => import('/@/views/error/404.vue'),
  //     },{
  //       path: '500',
  //       name: '500',
  //       meta: { title: '500', icon: 'DatabaseOutlined' },
  //       component: () => import('/@/views/error/500.vue'),
  //     }
  //   ]
  // },
  
  // {
  //   path: '/:catchAll(.*)',
  //   redirect: '/',
  // }
]
