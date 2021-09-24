const path = require('path')
const publicPath = '/_/'
const distPath = process.env.NODE_ENV === 'production' ? path.join(__dirname, 'dist') : path.join(__dirname, 'dist.dev')
const assetOutputPath = path.join(distPath, 'asset', publicPath)
const manifestPath = path.join(distPath, 'asset', 'manifest.json')
const vueSSRClientManifestPath = path.join(distPath, 'asset', 'vue-ssr-client-manifest.json')
const vueSSRServerBundlePath = path.join(distPath, 'ssr', 'vue-ssr-server-bundle.json')
const ssrOutputPath = path.join(distPath, 'ssr')
const ssrPath = path.join(distPath, 'ssr', 'main.js')
const env = {
  distPath,
  publicPath,
  assetOutputPath,
  manifestPath,
  ssrOutputPath,
  ssrPath,
  vueSSRClientManifestPath,
  vueSSRServerBundlePath
}

module.exports = env
