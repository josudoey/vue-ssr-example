const path = require('path')
const vueSSRClientPlugin = require('./vue-server-renderer/client-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const baseConfig = require('./config.common')
const projectPath = __dirname
const expose = require('./expose')
const publicPath = expose.publicPath
const distPath = expose.vueSSRClientPath
const outputPath = path.join(distPath, publicPath)

module.exports = Object.assign({}, baseConfig, {
  entry: path.resolve(__dirname, './vue/ssr-outlet/client-entry.mjs'),
  output: {
    path: outputPath,
    publicPath: publicPath,
    filename: '[hash].js',
    chunkFilename: '[chunkhash].js'
  },
  mode: 'production',
  devtool: false,
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    minimizer: [
      new TerserPlugin({}),
      new OptimizeCSSAssetsPlugin({
        assetNameRegExp: /\.css(\?.+)?$/g,
        cssProcessor: require('cssnano'),
        cssProcessorOptions: {
          presets: ['default', { discardComments: { removeAll: true } }],
          autoprefixer: { disable: true },
          canPrint: true
        }
      })
    ]
  },
  module: {
    rules: baseConfig.module.rules.slice().concat([{
      test: /module\.css$/,
      use: [{
        loader: MiniCssExtractPlugin.loader,
        options: {
          esModule: true,
          modules: {
            namedExport: true
          }
        }
      }, {
        loader: 'css-loader',
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
          esModule: true
        }
      }, {
        loader: 'css-loader',
        options: {
          importLoaders: 1
        }
      }]
    }])
  },
  plugins: baseConfig.plugins.slice().concat([
    new MiniCssExtractPlugin({
      filename: 'css/[hash].css',
      chunkFilename: 'css/[chunkhash].css'
    }),
    vueSSRClientPlugin
  ])
})

if (process.env.NODE_ENV === 'production') {
  module.exports.plugins.push(new CleanWebpackPlugin({
    root: projectPath,
    cleanOnceBeforeBuildPatterns: [distPath]
  }))
}
