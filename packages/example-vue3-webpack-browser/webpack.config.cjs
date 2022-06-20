const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { WebpackManifestPlugin, getCompilerHooks } = require('webpack-manifest-plugin')
const webpack = require('webpack')

class ManifestHashPlugin {
  apply (compiler) {
    const self = this
    compiler.hooks.thisCompilation.tap(self.constructor.name, (compilation) => {
      compilation.hooks.afterHash.tap(self.constructor.name, () => {
        const stats = compilation.getStats()
        self.hash = stats.hash
      })
    })

    const { beforeEmit } = getCompilerHooks(compiler)
    beforeEmit.tap(this.constructor.name, (manifest) => {
      return {
        ...manifest,
        hash: self.hash
      }
    })
  }
}

module.exports = function (env) {
  const { outputPath, publicPath, manifestPath } = env
  return {
    devtool: 'source-map',
    target: 'web',
    mode: (process.env.NODE_ENV === 'production') ? 'production' : 'development',
    entry: require.resolve('~example-vue3/webpack/browser/entry.mjs'),
    resolve: {
      alias: {
        vue$: 'vue/dist/vue.esm-bundler.js'
      }
    },
    output: {
      clean: true,
      filename: '[contenthash].js',
      chunkFilename: '[contenthash].js',
      path: outputPath,
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
        loader: require.resolve('file-loader'),
        options: {
          outputPath: 'img',
          publicPath: '../img',
          useRelativePath: false,
          name: '[contenthash].[ext]'
        }
      }, {
        test: /\.(woff2?|eot|ttf|otf)$/,
        loader: require.resolve('file-loader'),
        options: {
          outputPath: 'fonts',
          publicPath: '../fonts',
          useRelativePath: false,
          name: '[contenthash].[ext]'
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
          loader: require.resolve('~vue3-template-loader'),
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
        test: /\.css$/,
        exclude: /node_modules/,
        use: [{
          loader: MiniCssExtractPlugin.loader,
          options: {
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
        include: /node_modules/,
        use: [{
          loader: MiniCssExtractPlugin.loader,
          options: {
            esModule: true
          }
        }, {
          loader: require.resolve('css-loader'),
          options: {
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
