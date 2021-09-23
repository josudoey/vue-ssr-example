const path = require('path')
const publicPath = '/_/'
const distPath = process.env.NODE_ENV === 'production' ? path.join(__dirname, 'dist') : path.join(__dirname, 'dist.dev')
const assetOutputPath = path.join(distPath, 'asset', publicPath)
const manifestPath = path.join(distPath, 'asset', 'manifest.json')
const ssrOutputPath = path.join(distPath, 'ssr')
const ssrPath = path.join(distPath, 'ssr', 'main.js')
const env = {
  distPath,
  publicPath,
  assetOutputPath,
  manifestPath,
  ssrOutputPath,
  ssrPath
}

module.exports = env
