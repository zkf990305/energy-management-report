import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


/* Layout */
import Layout from '@/layout'


/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */



/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export let constantRoutes = [{
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: {
        title: '工作台',
        icon: 'dashboard'
      }
    }]
  },
  // {
  //   path: '/device',
  //   component: Layout,
  //   // redirect:'/device',
  //   name: 'Device',
  //   meta: {
  //     title: '设备节点',
  //     icon: 'dashboard'
  //   },
  //   // redirect: '/dashboard',
  //   children: [{
  //     path: 'water',
  //     name: 'water',
  //     component: {
  //       render(c) {
  //         return c('router-view')
  //       }
  //     }, // 假设路由数据中包含组件名
  //     // redirect: '/dashboard',
  //     meta: {
  //       title: '水',
  //       icon: 'dashboard'
  //     },
  //     children: [
  //       {
  //         path: 'water-total',
  //         name: 'water-total',
  //         component: () => import('@/mallManager/report/device/water/water'),
  //         meta: {
  //           title: '总',
  //           icon: 'dashboard'
  //           }
  //       },
  //       {
  //         path: 'product',
  //         name: 'product',
  //         component: {
  //           render(c) {
  //             return c('router-view')
  //           }
  //         }, // 假设路由数据中包含组件名
  //         // redirect:'/product',
  //         meta: {
  //           title: '生产用水',
  //           icon: 'dashboard'
  //           },
  //           children: [
  //             {
  //               path: 'Building12-3',
  //               name: 'Building12-3',
  //               component: () => import('@/mallManager/report/device/water/dong/dong'),
  //               // component: () => import('@/mallManager/report/device/water/dong/dong'),
  //               meta: {
  //                 title: 'Building - 12栋 水表3',
  //                 icon: 'dashboard'
  //               },
  //               
  //             }
  //           ]
  //         },
  //       {
  //         path: 'air',
  //         name: 'Air',
  //         component: {
  //           render(c) {
  //             return c('router-view')
  //           }
  //         }, // 假设路由数据中包含组件名
  //         // redirect:'/air',
  //         meta: {
  //           title: '空调用水',
  //           icon: 'dashboard'
  //           },
  //         children: [
  //           {
  //             path: 'air12-3',
  //             name: 'air12-3',
  //             component: () => import('@/mallManager/report/device/water/dong/dong'),
  //             meta: {
  //               title: 'air12-3',
  //               icon: 'dashboard'
  //             },
  //             children: []
  //           }
  //          ]
  //       }
  //     ]
  //   }]
  // },
  // {
  //   path: '/water',
  //   component: Layout,
  //   // redirect: '/dashboard',
  //   name: "water",
  //   children: [{
  //     path: 'waterDemo',
  //     name: 'waterDemo',
  //     component: () => import('@/mallManager/demo/water'),
  //     meta: {
  //       title: '水监测',
  //       icon: 'dashboard'
  //     }
  //   },
  //   ]
  // },
  // {
  //   path: '/electricity',
  //   component: Layout,
  //   // redirect: '/dashboard',
  //   name: "electricity",
  //   children: [{
  //     path: 'electricityDemo',
  //     name: 'electricityDemo',
  //     component: () => import('@/mallManager/demo/electricity'),
  //     meta: {
  //       title: '电监测',
  //       icon: 'dashboard'
  //     }
  //   },
  //   ]
  // },

]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
