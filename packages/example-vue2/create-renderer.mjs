import VueServerRenderer from '~vue2-server-renderer'
import LRU from 'lru-cache'
import { pack } from 'msgpackr/pack'

const createRenderer = function (clientManifest) {
  const renderer = VueServerRenderer.createRenderer({
    cache: new LRU({
      max: 10000
    }),
    template: '<!DOCTYPE html><html><head></head><body><!--vue-ssr-outlet--></body></html>',
    clientManifest,
    inject: true,
    shouldPreload: (file, type) => {
      // ref https://ssr.vuejs.org/api/#shouldpreload
      return true
    },
    shouldPrefetch: (file, type) => {
      return false
    }
  })

  const renderToString = function (vm) {
    return renderer.renderToString(vm, {
      rendered (ctx) {
        // see https://ssr.vuejs.org/guide/data.html#final-state-injection
        // see https://github.com/vuejs/vue/blob/0603ff695d2f41286239298210113cbe2b209e28/src/server/create-renderer.js#L89

        // const meta = vm.$route.meta
        if(!vm.$store){
          return
        }
        const initalState = pack(vm.$store.state).toString('base64')
        ctx.state = initalState
      }
    })
  }

  return { renderToString }
}

export { createRenderer }
