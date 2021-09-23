const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { WebpackManifestPlugin, getCompilerHooks } = require('webpack-manifest-plugin')
const { assetOutputPath, manifestPath, publicPath } = require('./env')

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
  const config = {
    target: 'web',
    mode: 'production',
    entry: path.join(__dirname, './vue/outlet/asset.mjs'),
    resolve: {
      alias: {
        vue$: 'vue/dist/vue.esm.js',
        vuex$: 'vuex/dist/vuex.esm.js'
      }
    },
    output: {
      clean: true,
      assetModuleFilename: '_/[contenthash].[ext]',
      filename: '[contenthash].js',
      chunkFilename: '[contenthash].js',
      path: assetOutputPath,
      publicPath: publicPath
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
          loader: require.resolve('html-loader'),
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

  return config
}
