import VueServerRenderer from 'vue-server-renderer'
export default function (clientManifest) {
  const renderer = VueServerRenderer.createRenderer({
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
