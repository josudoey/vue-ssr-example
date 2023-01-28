import Vue, { createSSRApp } from 'vue'
import VueMeta from 'vue-meta'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import { Portal, PortalTarget } from 'portal-vue'

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import outlet from './outlet/index.js'

Vue.use(VueMeta, { refreshOnceOnNavigation: false })

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

Vue.component('Portal', Portal)
Vue.component('PortalTarget', PortalTarget)

export function createApp () {
  const app = createSSRApp(outlet)
  return app
}
