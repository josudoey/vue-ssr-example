/* global __webpack_hash__ */
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import { createWebRouter } from '../../router.js'
import { getHydratePinia } from '../../pinia/hydrate.js'
import { getHydrateStore } from '../../store/hydrate.js'
import { createApp } from '../../app.js'

;(async function () {
  const appId = `#_${__webpack_hash__}`
  const app = window.app = createApp()
  const store = getHydrateStore(window)
  app.use(store)
  const pinia = getHydratePinia(window)
  app.use(pinia)
  const router = createWebRouter(store)
  app.use(router)
  await router.isReady()
  app.mount(appId)
})()
