import * as VueRouter from 'vue-router'
import routes from './routes/index.mjs'
// see https://next.router.vuejs.org/guide/migration/index.html#new-history-option-to-replace-mode

export function createMemoryRouter () {
  return VueRouter.createRouter({
    history: VueRouter.createMemoryHistory(),
    base: '/',
    linkActiveClass: 'active',
    scrollBehavior (to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      }
      return { x: 0, y: 0 }
    },
    routes
  })
}

export function createWebRouter () {
  return VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    base: '/',
    linkActiveClass: 'active',
    scrollBehavior (to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      }
      return { x: 0, y: 0 }
    },
    routes
  })
}
