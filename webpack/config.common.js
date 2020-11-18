const webpack = require('webpack')

module.exports = {
  resolve: {
    alias: {}
  },
  plugins: [
    new webpack.DefinePlugin({})
  ],
  module: {
    rules: [{
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: [
        'cache-loader',
        'thread-loader',
        {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-syntax-dynamic-import']
          }
        }]
    }]
  }
}
