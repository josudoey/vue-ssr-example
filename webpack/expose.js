const { createBundleRenderer } = require('vue-server-renderer')
const path = require('path')
const bundle = require('./dist/vue-ssr-server-bundle.json')
const clientManifest = require('./dist/vue-ssr-client/manifest.json')
const routes = require('./vue/routes/index.js')
const publicPath = clientManifest.publicPath
module.exports = {
  routes: routes,
  contentBase: path.join(__dirname, 'dist', 'vue-ssr-client', publicPath),
  bundleRenderer: createBundleRenderer(bundle, {
    runInNewContext: false,
    clientManifest: clientManifest,
    shouldPreload: (file, type) => {
      return true
      // if (type === 'script' || type === 'style') {
      //   return false
      // }
      // return true
    },
    shouldPrefetch: (file, type) => {
      return false
    },
    template: '<!doctype html><html><head>{{{ meta.inject().title.text() }}}{{{ meta.inject().meta.text() }}}</head><body><!--vue-ssr-outlet--></body></html>'
  })
}
