/* global __webpack_hash__ */
// see https://getbootstrap.com/docs/5.1/getting-started/webpack/#importing-compiled-css
import 'bootstrap/dist/css/bootstrap.css'
import { createApp, createWebRouter, getHydratePinia } from '~example-vue3/index.mjs'

;(async function () {
  const appId = `#_${__webpack_hash__}`
  const app = createApp()
  const pinia = getHydratePinia(window)
  app.use(pinia)
  const router = createWebRouter()
  app.use(router)
  await router.isReady()
  app.mount(appId)
})()
