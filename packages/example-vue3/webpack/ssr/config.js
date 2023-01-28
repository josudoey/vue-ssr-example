import MiniCssExtractPlugin from '~webpack5/plugins/mini-css-extract.js'
import CssMinimizerPlugin from '~webpack5/plugins/css-minimizer.js'
import TerserPlugin from '~webpack5/plugins/terser.js'
import webpack from '~webpack5'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

export default function (env) {
  const { outputPath } = env
  return {
    devtool: 'source-map',
    mode: (process.env.NODE_ENV === 'production') ? 'production' : 'development',
    entry: require.resolve('./entry/main.js'),
    target: 'node',
    externals: ['debug'],
    externalsType: 'node-commonjs',
    output: {
      clean: true,
      path: outputPath,
      libraryTarget: 'commonjs2'
    },
    resolve: {
      alias: {
        // see https://webpack.js.org/configuration/resolve/#resolvealias
        axios: false, // return module.exports = {}
        'socket.io-client': false,
        'vue-flatpickr-component$': 'vue-flatpickr-component/src/index.js',
        vue$: '@vue/compat'
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
        loader: require.resolve('~webpack5/html-loader'),
        options: {
          minimize: true
        }
      }, {
        test: /render.pug$/,
        use: [{
          loader: require.resolve('~vue3-template-loader'),
          options: {}
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
        test: /\.css$/,
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
            importLoaders: 1
          }
        }]
      }]
    },
    plugins: [
      // new webpack.DefinePlugin({
      //   __VUE_OPTIONS_API__: true,
      //   __VUE_PROD_DEVTOOLS__: false
      // }),
      new MiniCssExtractPlugin({
        filename: 'css/[contenthash].css',
        chunkFilename: 'css/[contenthash].css'
      })
    ]
  }
}
