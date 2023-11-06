import webpack from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

import { createRequire } from 'module'
import { exampleVue2Env } from './env.js'
const require = createRequire(import.meta.url)

export default function (env) {
  const { serverOutputPath } = exampleVue2Env

  return {
    entry: require.resolve('@vue-ssr-example/example-vue2/entry/server/main.js'),
    experiments: {
      outputModule: true
    },
    output: {
      clean: true,
      path: serverOutputPath,
      filename: 'main.js',
      chunkFormat: 'module',
      library: {
        type: 'module'
      }
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
      },
      // Add `.ts` and `.tsx` as a resolvable extension.
      extensions: ['.ts', '.tsx', '.js'],
      // Add support for TypeScripts fully qualified ESM imports.
      extensionAlias: {
        '.js': ['.js', '.ts'],
        '.cjs': ['.cjs', '.cts'],
        '.mjs': ['.mjs', '.mts']
      }
    },
    plugins: [
      new webpack.DefinePlugin({}),
      new MiniCssExtractPlugin({})
    ],
    module: {
      rules: [{
        test: /\.([cm]?ts|tsx)$/,
        loader: 'ts-loader'
      }, {
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
          loader: require.resolve('@vue-ssr-example/vue2-template-loader'),
          options: {
            minimize: {
              collapseBooleanAttributes: true
            }
          }
        }, {
          loader: require.resolve('pug-plain-loader')
        }]
      }, {
        test: /template.pug$/,
        use: [{
          loader: require.resolve('html-loader'),
          options: {
            minimize: {
              collapseBooleanAttributes: true
            }
          }
        }, {
          loader: require.resolve('pug-plain-loader')
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
          loader: require.resolve('css-loader'),
          options: {
            importLoaders: 0
          }
        }]
      }]
    }
  }
}
