import { createRouter, createWebHistory, createMemoryHistory, NavigationFailureType, isNavigationFailure } from 'vue-router'
import routes from './routes/index.js'
export { NavigationFailureType, isNavigationFailure }

// see https://next.router.vuejs.org/guide/migration/index.html#new-history-option-to-replace-mode

export function createVueRouter (history) {
  return createRouter({
    history,
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

export function createMemoryRouter () {
  return createVueRouter(createMemoryHistory())
}

export function createWebRouter () {
  return createVueRouter(createWebHistory())
}
