const { createBundleRenderer } = require('vue-server-renderer')
module.exports = {
  createBundleRenderer: function (bundle, options) {
    return createBundleRenderer(bundle, Object.assign({
      runInNewContext: false,
      shouldPreload: (file, type) => {
        // ref https://ssr.vuejs.org/api/#shouldpreload
        return true
      },
      shouldPrefetch: (file, type) => {
        return false
      },
      template: '<!DOCTYPE html><html><head>{{{ meta.inject().meta.text({}) }}}{{{ meta.inject().title.text() }}}</head><body><!--vue-ssr-outlet--></body></html>'
    }, options))
  }
}
