import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMeta from 'vue-meta'
import BootstrapVue from 'bootstrap-vue'
import { Portal, PortalTarget } from 'portal-vue'
import Vuex from 'vuex'
import mixin from './mixin/index.mjs'
import outlet from './outlet/index.mjs'
Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(VueMeta, { refreshOnceOnNavigation: false })
Vue.use(BootstrapVue)
Vue.mixin(mixin)
Vue.component('Portal', Portal)
Vue.component('PortalTarget', PortalTarget)

export function createApp ({ store, router }) {
  const vm = new Vue({
    store,
    router,
    ...outlet
  })
  return vm
}
