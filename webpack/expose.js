const path = require('path')
const publicPath = '/_/'
module.exports = {
  routes: require('./vue/routes.js'),
  publicPath: publicPath,
  vueSSRClientPath: path.join(__dirname, 'dist', 'vue-ssr-client'),
  vueSSRServerPath: path.join(__dirname, 'dist', 'vue-ssr-server'),
  resolve: {
    production: {
      manifest: function () {
        return Promise.resolve(require('./dist/vue-ssr-client/manifest.json'))
      },
      bundle: function () {
        return Promise.resolve(require('./dist/vue-ssr-server/bundle.json'))
      }
    },
    development: {
      manifest: function () {
        return new Promise(function (resolve) {
          const middleware = require('./dev-middleware/vue-ssr-client')
          middleware.waitUntilValid(function () {
            resolve(middleware.manifest)
          })
        })
      },
      bundle: function () {
        return new Promise(function (resolve) {
          const middleware = require('./dev-middleware/vue-ssr-server')
          middleware.waitUntilValid(function () {
            resolve(middleware.bundle)
          })
        })
      }
    }
  }
}
