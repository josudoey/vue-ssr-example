const common = require('./config.common.js')

const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = Object.assign(common, {
  mode: 'production',
  devtool: false,
  optimization: {
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
  }
})
