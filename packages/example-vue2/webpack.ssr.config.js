import path from 'path'
import MiniCssExtractPlugin from '~webpack5/plugins/mini-css-extract.js'
import webpack from '~webpack5'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
const require = createRequire(import.meta.url)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default function (env) {
  const distPath = path.join(__dirname, 'dist')
  const outputPath = path.join(distPath, 'example-vue2-ssr')
  return {
    entry: require.resolve('./webpack/ssr/entry/main.js'),
    output: {
      clean: true,
      path: outputPath,
      filename: 'main.cjs',
      libraryTarget: 'commonjs2'
    },
    devtool: 'source-map',
    mode: (process.env.NODE_ENV === 'production') ? 'production' : 'development',
    target: 'node',
    externalsType: 'node-commonjs',
    externals: ['debug'],
    resolve: {
      alias: { // see https://webpack.js.org/configuration/resolve/#resolvealias
        axios: false, // return module.exports = {}
        'socket.io-client': false,
        'vue-flatpickr-component$': 'vue-flatpickr-component/src/index.js',
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
        loader: require.resolve('~webpack5/html-loader'),
        options: {
          minimize: true
        }
      }, {
        test: /render.pug$/,
        use: [{
          loader: require.resolve('~vue2-template-loader'),
          options: {
            minimize: {
              collapseBooleanAttributes: true
            }
          }
        }, {
          loader: require.resolve('~webpack5/pug-plain-loader')
        }]
      }, {
        test: /template.pug$/,
        use: [{
          loader: require.resolve('~webpack5/html-loader'),
          options: {
            minimize: {
              collapseBooleanAttributes: true
            }
          }
        }, {
          loader: require.resolve('~webpack5/pug-plain-loader')
        }]
      }, {
        test: /module\.css$/,
        use: [{
          loader: MiniCssExtractPlugin.loader,
          options: {
            emit: false
          }
        }, {
          loader: require.resolve('~webpack5/css-loader'),
          options: {
            modules: {
              namedExport: true,
              localIdentName: '__[hash:base64:5]'
            },
            importLoaders: 0
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
          loader: require.resolve('~webpack5/css-loader'),
          options: {
            importLoaders: 0
          }
        }]
      }]
    }
  }
}
