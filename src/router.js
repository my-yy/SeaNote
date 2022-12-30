import Vue from 'vue'
import VueRouter from 'vue-router'
import Workspace from './views/Workspace.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Workspace,
    children: [
      {
        path: '',
        component: () => import(/* webpackChunkName: "about" */ './views/file/FolderView.vue')
      },
      {
        path: 'today',
        component: () => import(/* webpackChunkName: "about" */ './views/rev/Today.vue')
      },
      {
        path: 'setting',
        component: () => import(/* webpackChunkName: "about" */ './views/Setting.vue')
      },
    ]
  },
  {
    path: '/review',
    component: () => import(/* webpackChunkName: "about" */ './views/rev/Review.vue')
  },
  {
    path: '/launchpad',
    component: () => import(/* webpackChunkName: "about" */ './LaunchPad.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router
