const nodeExternals = require('webpack-node-externals')
const baseConfig = require('./config.common')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const path = require('path')
const projectPath = path.resolve(__dirname, '../')
const distPath = path.resolve(projectPath, 'dist')
const publicPath = '/b/'
const outputPath = distPath
module.exports = Object.assign(baseConfig, {
  entry: path.resolve(__dirname, './vue/renderer.mjs'),
  target: 'node',
  mode: 'development',
  devtool: 'source-map',
  output: {
    libraryTarget: 'commonjs2',
    path: outputPath,
    publicPath: publicPath,
    filename: '[name].js?[hash:4]',
    chunkFilename: '[name].js?[hash:4]'
  },
  externals: nodeExternals({
    allowlist: /\.css$/
  }),
  plugins: [
    new VueSSRServerPlugin()
  ]
})
