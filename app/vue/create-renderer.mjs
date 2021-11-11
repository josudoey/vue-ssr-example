import VueServerRenderer from 'vue-server-renderer'
import LRU from 'lru-cache'

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
  return renderer
}

export default createRenderer
