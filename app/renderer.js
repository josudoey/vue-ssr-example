const { createBundleRenderer } = require('vue-server-renderer')
const bundle = require('../dist/vue-ssr-server-bundle.json')
const clientManifest = require('../dist/static/b/vue-ssr-client-manifest.json')
module.exports = createBundleRenderer(bundle, {
  runInNewContext: false,
  clientManifest: clientManifest,
  template: `<html>
  <head>
    <title>Vue SSR Example</title>
  </head>
  <body>
    <!--vue-ssr-outlet-->
  </body>
</html>`
})
