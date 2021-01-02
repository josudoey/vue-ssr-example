const webpack = require('webpack')
module.exports = {
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      vuex$: 'vuex/dist/vuex.esm.js'
    }
  },
  plugins: [
    new webpack.DefinePlugin({
    })
  ],
  module: {
    rules: [{
      test: /\.(png|jpe?g|gif|svg)$/,
      loader: 'file-loader',
      options: {
        outputPath: 'img',
        publicPath: '../img',
        useRelativePath: false,
        name: '[hash].[ext]'
      }
    }, {
      test: /\.(woff2?|eot|ttf|otf)$/,
      loader: 'file-loader',
      options: {
        outputPath: 'fonts',
        publicPath: '../fonts',
        useRelativePath: false,
        name: '[hash].[ext]'
      }
    }, {
      test: /\.html$/,
      loader: 'html-loader',
      options: {
        minimize: true
      }
    }, {
      test: /render.pug$/,
      use: [{
        loader: 'pug-loader'
      }]
    }, {
      test: /template.pug$/,
      use: [{
        loader: 'html-loader',
        options: {
          minimize: {
            collapseBooleanAttributes: true
          }
        }
      }, {
        loader: 'pug-html-loader',
        options: {
          doctype: 'html'
        }
      }]
    }, {
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: [
        'cache-loader',
        'thread-loader'
      ]
    }]
  }
}
