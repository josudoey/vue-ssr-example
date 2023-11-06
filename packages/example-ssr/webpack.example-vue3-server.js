import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import webpack from 'webpack'

import { createRequire } from 'module'
import { exampleVue3Env } from './env.js'
const { serverOutputPath } = exampleVue3Env

const require = createRequire(import.meta.url)
export default function (env) {
  return {
    devtool: 'source-map',
    mode: (process.env.NODE_ENV === 'production') ? 'production' : 'development',
    entry: require.resolve('@vue-ssr-example/example-vue3/entry/server/main.js'),
    target: 'node',
    externals: ['debug'],
    externalsType: 'node-commonjs',
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
    resolve: {
      alias: {
        // see https://webpack.js.org/configuration/resolve/#resolvealias
        axios: false, // return module.exports = {}
        'socket.io-client': false,
        'vue-flatpickr-component$': 'vue-flatpickr-component/src/index.js',
        vue$: '@vue/compat'
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
    optimization: {
      minimizer: [
        new TerserPlugin({}),
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: [
              'default',
              {
                discardComments: { removeAll: true }
              }
            ]
          }
        })
      ]
    },
    module: {
      rules: [{
        test: /\.([cm]?ts|tsx)$/,
        loader: 'ts-loader'
      }, {
        test: /\.(png|jpe?g|gif|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'img/[contenthash][ext]'
        }
      }, {
        test: /\.(woff2?|eot|ttf|otf)$/,
        generator: {
          filename: 'fonts/[contenthash][ext]'
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
          loader: require.resolve('@vue-ssr-example/vue3-template-loader'),
          options: {}
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
    },
    plugins: [
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_DEVTOOLS__: false
      }),
      new MiniCssExtractPlugin({
        filename: 'css/[contenthash].css',
        chunkFilename: 'css/[contenthash].css'
      })
    ]
  }
}
