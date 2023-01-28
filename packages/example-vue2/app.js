import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMeta from 'vue-meta'
import BootstrapVue from 'bootstrap-vue'
import { Portal, PortalTarget } from 'portal-vue'
import Vuex from 'vuex'
import mixin from './mixin/index.js'
import outlet from './outlet/index.js'
import createDebug from 'debug'
const debug = createDebug('app:create-app')

Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(VueMeta, { refreshOnceOnNavigation: false })
Vue.use(BootstrapVue)
Vue.mixin(mixin)
Vue.component('Portal', Portal)
Vue.component('PortalTarget', PortalTarget)

export function createApp ({ store, router }) {
  debug('createApp')
  const app = new Vue({
    store,
    router,
    ...outlet
  })
  return app
}
