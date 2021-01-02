const webpack = require('webpack')
const middleware = require('webpack-dev-middleware')
const vueSSRServerPlugin = require('../vue-server-renderer/server-plugin')
const config = require('../vue-ssr-server.js')
const compiler = webpack(Object.assign({}, config, {
  mode: 'development',
  devtool: 'eval'
}))
module.exports = middleware(compiler, {
  serverSideRender: true
})
compiler.hooks.done.tapAsync({
  name: 'vue-ssr-server-dev-middleware'
}, function (statsData) {
  const { compilation } = statsData
  const filename = vueSSRServerPlugin.options.filename
  const source = compilation.assets[filename].source
  const bundle = source()
  module.exports.bundle = JSON.parse(bundle)
})
