import MiniCssExtractPlugin from '~webpack5/plugins/mini-css-extract.js'
import CssMinimizerPlugin from '~webpack5/plugins/css-minimizer.js'
import TerserPlugin from '~webpack5/plugins/terser.js'
import ManifestHashPlugin from '~webpack5/plugins/manifest-hash.js'
import webpack from '~webpack5'
import { WebpackManifestPlugin } from '~webpack5/plugins/manifest.js'
import { createRequire } from 'module'
import { browserOutputPath, publicPath, manifestPath } from './webpack.env.js'
const require = createRequire(import.meta.url)

export default function (env) {
  return {
    devtool: 'source-map',
    target: 'web',
    mode: (process.env.NODE_ENV === 'production') ? 'production' : 'development',
    entry: require.resolve('./webpack/browser/entry/main.js'),
    resolve: {
      alias: {
        axios$: 'axios/dist/axios.js',
        'vue-flatpickr-component$': 'vue-flatpickr-component/src/index.js',
        vue: '@vue/compat'
      }
    },
    output: {
      clean: true,
      filename: '[contenthash].js',
      chunkFilename: '[contenthash].js',
      path: browserOutputPath,
      publicPath
    },
    optimization: {
      splitChunks: {
        chunks: 'all'
      },
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
          loader: require.resolve('~webpack5/pug-plain-loader.js')
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
          options: {}
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
          }
        }, {
          loader: require.resolve('~webpack5/css-loader'),
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
      new WebpackManifestPlugin({
        fileName: manifestPath
      }),
      new ManifestHashPlugin(),
      new MiniCssExtractPlugin({
        filename: 'css/[contenthash].css',
        chunkFilename: 'css/[contenthash].css'
      })
    ]
  }
}
