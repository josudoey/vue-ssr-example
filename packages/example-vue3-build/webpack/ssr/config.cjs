const MiniCssExtractPlugin = require('~webpack5/plugins/mini-css-extract')
const CssMinimizerPlugin = require('~webpack5/plugins/css-minimizer')
const TerserPlugin = require('~webpack5/plugins/terser')
const webpack = require('~webpack5')
module.exports = function (env) {
  const { outputPath } = env
  return {
    devtool: 'source-map',
    mode: (process.env.NODE_ENV === 'production') ? 'production' : 'development',
    target: 'node',
    externals: [],
    entry: {
      main: {
        import: require.resolve('~example-vue3/webpack/ssr/entry.mjs'),
        filename: 'main.mjs',
        library: {
          type: 'module'
        }
      }
    },
    node: {
      __dirname: false,
      __filename: false
    },
    experiments: {
      outputModule: true
    },
    externalsType: 'node-commonjs',
    output: {
      clean: true,
      path: outputPath,
      chunkFormat: 'module'
    },
    resolve: {
      alias: {}
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
