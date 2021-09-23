// see https://getbootstrap.com/docs/5.1/getting-started/webpack/#importing-compiled-css
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import VuexRouterSync from 'vuex-router-sync'
import Vue from 'vue'
import Router from 'vue-router'
import routes from '../routes.js'
import VueMeta from 'vue-meta'
import BootstrapVue from 'bootstrap-vue'
import mixin from '../mixin/index.mjs'
import { createStore } from '../store/index.mjs'
import outlet from './index.mjs'
Vue.use(Router)
Vue.use(VueMeta, {
  refreshOnceOnNavigation: true
})
Vue.use(BootstrapVue)
Vue.mixin(mixin)

const createApp = function (state) {
  const router = new Router({
    mode: 'history',
    base: '/',
    linkActiveClass: 'active',
    scrollBehavior (to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      }
      return { x: 0, y: 0 }
    },
    routes: routes
  })

  const store = createStore(state)
  VuexRouterSync.sync(store, router)

  const vm = new Vue({
    ...outlet,
    router: router,
    store: store
  })

  router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiredAuth)) {
      if (!store.state.auth.uid) {
        next({
          name: 'signIn',
          query: {
            redirect: to.fullPath
          }
        })
        return
      }
      next()
      return
    }
    next()
  })

  // https://ssr.vuejs.org/zh/guide/data.html#%E5%AE%A2%E6%88%B7%E7%AB%AF%E6%95%B0%E6%8D%AE%E9%A2%84%E5%8F%96-client-data-fetching
  router.onReady(() => {
    console.log('vue-router onReady')
    vm.$mount('[data-server-rendered]', true)
  })

  return vm
}

;(async function () {
  createApp(window.__INITIAL_STATE__)
  delete window.__INITIAL_STATE__
})()
