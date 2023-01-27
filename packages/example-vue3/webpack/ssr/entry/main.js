// ref https://v3.vuejs.org/guide/ssr/structure.html#entry-server-js
// see https://github.com/vitejs/vite/blob/main/packages/playground/ssr-vue/src/entry-server.js

import { createMemoryRouter, NavigationFailureType, isNavigationFailure } from '../../../router.js'
import { createRenderer } from '../../../renderer.js'
import { createStore, createStoreOptions } from '../../../store/index.js'
import { createPinia } from 'pinia'
import { createApp } from '../../../app.js'

const memoryRouter = createMemoryRouter()
export function existsRoute (path) {
  const routeLocation = memoryRouter.resolve(path)
  if (!routeLocation.matched.length) {
    return false
  }
  return true
}

export function RedirectedError (currentRoute) {
  this.message = 'navigation redirected failure'
  this.currentRoute = currentRoute
}

export function createHtmlRenderer ({ manifest }) {
  const renderer = createRenderer(manifest)
  return {
    async render (path, { rpc }) {
      const store = createStore(createStoreOptions(rpc))
      const router = createMemoryRouter()
      const pinia = createPinia()
      const app = await createApp().use(pinia).use(store).use(router)
      const failure = await router.push(path).catch((err) => err)

      // see https://router.vuejs.org/guide/advanced/navigation-failures.html#navigation-failures-s-properties
      if (isNavigationFailure(failure, NavigationFailureType.redirected)) {
        throw new RedirectedError(router.currentRoute)
      }

      await router.isReady()

      return await renderer.renderToString(app)
    }
  }
}
