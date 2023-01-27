import { createRouter } from '../../../router.js'
import { isNavigationFailure, NavigationFailureType } from '../../../errors.js'
import { createRenderer } from '../../../renderer.js'
import { createApp } from '../../../app.js'
import { createStore, createStoreOptions } from '../../../store.js'

const historyRouter = createRouter()
export function existsRoute (path) {
  const matchedComponents = historyRouter.getMatchedComponents(path)
  if (!matchedComponents.length) {
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
      const router = createRouter(store)

      const failure = await router.push(path).catch((err) => err)
      await new Promise((resolve) => {
        return router.onReady(resolve)
      })

      // see https://router.vuejs.org/guide/advanced/navigation-failures.html#navigation-failures-s-properties
      if (isNavigationFailure(failure, NavigationFailureType.redirected)) {
        throw new RedirectedError(router.currentRoute)
      }

      const app = await createApp({
        store,
        router
      })

      return await renderer.renderToString(app)
    }
  }
}
