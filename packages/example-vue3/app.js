import { createSSRApp } from 'vue'
import PortalVue from 'portal-vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import outlet from './outlet/index.js'

export function createApp () {
  const app = createSSRApp(outlet)
  app.use(PortalVue)

  // Make BootstrapVue available throughout your project
  app.use(BootstrapVue)
  // Optionally install the BootstrapVue icon components plugin
  app.use(IconsPlugin)

  return app
}
