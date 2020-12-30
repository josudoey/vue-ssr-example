const webpack = require('webpack')
const middleware = require('webpack-dev-middleware')
const vueSSRClientPlugin = require('../vue-server-renderer/client-plugin')
const config = require('../vue-ssr-client.js')
const compiler = webpack(Object.assign({}, config, {
  mode: 'development',
  devtool: 'eval'
}))
module.exports = middleware(compiler, {})
compiler.hooks.done.tapAsync({
  name: 'vue-ssr-client-dev-middleware'
}, function (statsData) {
  const { compilation } = statsData
  const filename = vueSSRClientPlugin.options.filename
  const source = compilation.assets[filename].source
  const manifest = source()
  module.exports.manifest = JSON.parse(manifest)
})
