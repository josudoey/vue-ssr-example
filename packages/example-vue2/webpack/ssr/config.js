import MiniCssExtractPlugin from '~webpack5/plugins/mini-css-extract.js'
import webpack from '~webpack5'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

export default function (env) {
  const { outputPath } = env

  return {
    entry: require.resolve('./entry/main.js'),
    output: {
      clean: true,
      path: outputPath,
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
