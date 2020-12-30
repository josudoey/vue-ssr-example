const nodeExternals = require('webpack-node-externals')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const baseConfig = require('./config.common')
const vueSSRServerPlugin = require('./vue-server-renderer/server-plugin')
const expose = require('./expose')
const distPath = expose.vueSSRServerPath
const outputPath = distPath
const projectPath = __dirname
class ServerMiniCssExtractPlugin extends MiniCssExtractPlugin {
  getCssChunkObject (mainChunk) {
    return {}
  }
}
module.exports = Object.assign({}, baseConfig, {
  entry: path.resolve(__dirname, './vue/ssr-outlet/server-entry.mjs'),
  output: {
    path: outputPath,
    libraryTarget: 'commonjs2'
  },
  externals: nodeExternals({
    allowlist: /\.css$/
  }),
  target: 'node',
  mode: 'production',
  devtool: false,
  module: {
    rules: baseConfig.module.rules.slice().concat([{
      test: /module\.css$/,
      use: [{
        loader: ServerMiniCssExtractPlugin.loader,
        options: {
          esModule: true,
          modules: {
            namedExport: true
          }
        }
      }, {
        loader: 'css-loader',
        options: {
          modules: {
            namedExport: true,
            localIdentName: '__[hash:base64:5]'
          },
          importLoaders: 1
        }
      }]
    }, {
      test: /\.css$/,
      exclude: /module\.css$/,
      use: [{
        loader: ServerMiniCssExtractPlugin.loader,
        options: {
          esModule: true
        }
      }, {
        loader: 'css-loader',
        options: {
          importLoaders: 1
        }
      }]
    }])
  },
  plugins: baseConfig.plugins.slice().concat([
    new ServerMiniCssExtractPlugin({
    }),
    vueSSRServerPlugin
  ])
})

if (process.env.NODE_ENV === 'production') {
  module.exports.plugins.push(new CleanWebpackPlugin({
    root: projectPath,
    cleanOnceBeforeBuildPatterns: [distPath]
  }))
}
