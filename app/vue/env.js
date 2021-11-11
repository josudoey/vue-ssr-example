const path = require('path')
const publicPath = '/_/'
const distPath = process.env.NODE_ENV === 'production' ? path.join(__dirname, 'dist') : path.join(__dirname, 'dist.dev')
const browserOutputPath = path.join(distPath, 'browser', publicPath)
const vueSSRClientManifestPath = path.join(distPath, 'browser', 'vue-ssr-client-manifest.json')
const ssrOutputPath = path.join(distPath, 'ssr')
const ssrPath = path.join(distPath, 'ssr', 'main.js')
const env = {
  distPath,
  publicPath,
  browserOutputPath,
  ssrOutputPath,
  ssrPath,
  vueSSRClientManifestPath
}

module.exports = env
