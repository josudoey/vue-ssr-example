const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')

const env = require('./env.js')
const { ssrOutputPath } = env

module.exports = function (env) {
  return {
    target: 'node',
    externalsType: 'node-commonjs',
    externals: [
      'axios',
      'vue-router',
      'vue-server-renderer'
    ],
    entry: path.resolve(__dirname, './vue/outlet/ssr/entry.mjs'),
    output: {
      clean: true,
      path: ssrOutputPath,
      libraryTarget: 'commonjs2'
    },
    mode: 'production',
    devtool: false,
    resolve: {
      alias: {
        vue$: 'vue/dist/vue.esm.js',
        vuex$: 'vuex/dist/vuex.esm.js'
      }
    },
    plugins: [
      new webpack.DefinePlugin({}),
      new MiniCssExtractPlugin({})
    ],
    module: {
      rules: [{
        test: /\.(png|jpe?g|gif|svg)$/,
        // see https://webpack.js.org/guides/asset-modules/
        type: 'asset/resource',
        generator: {
          // see https://webpack.js.org/configuration/module/#rulegeneratoremit
          emit: false
        }
      }, {
        test: /\.(woff2?|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          emit: false
        }
      }, {
        test: /\.html$/,
        loader: require.resolve('html-loader'),
        options: {
          minimize: true
        }
      }, {
        test: /render.pug$/,
        use: [{
          loader: require.resolve('pug-loader')
        }]
      }, {
        test: /template.pug$/,
        use: [{
          loader: 'html-loader',
          options: {
            minimize: {
              collapseBooleanAttributes: true
            }
          }
        }, {
          loader: require.resolve('pug-html-loader'),
          options: {
            doctype: 'html'
          }
        }]
      }, {
        test: /module\.css$/,
        use: [{
          loader: MiniCssExtractPlugin.loader,
          options: {
            emit: false
          }
        }, {
          loader: require.resolve('css-loader'),
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
          loader: MiniCssExtractPlugin.loader,
          options: {
            emit: false
          }
        }, {
          loader: require.resolve('css-loader'),
          options: {
            importLoaders: 1
          }
        }]
      }]
    }
  }
}
