const baseConfig = require('./config.common')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

const path = require('path')
const projectPath = path.resolve(__dirname, '../')
const distPath = path.resolve(projectPath, 'dist/static')
const publicPath = '/b/'
const outputPath = path.join(distPath, publicPath)

module.exports = Object.assign(baseConfig, {
  entry: path.resolve(__dirname, './vue/entry.mjs'),
  output: {
    path: outputPath,
    publicPath: publicPath,
    filename: '[name].js?[hash:4]',
    chunkFilename: '[name].js?[hash:4]'
  },
  mode: 'development',
  devtool: 'source-map',
  plugins: [
    new VueSSRClientPlugin()
  ],
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js'
    }
  },
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 20000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      automaticNameDelimiter: '~',
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
})
