const nodeExternals = require('webpack-node-externals')
const baseConfig = require('./config.common')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
class ServerMiniCssExtractPlugin extends MiniCssExtractPlugin {
  getCssChunkObject (mainChunk) {
    return {}
  }
}
module.exports = Object.assign(baseConfig, {
  entry: path.resolve(__dirname, './vue/ssr-server-entry.mjs'),
  output: {
    libraryTarget: 'commonjs2'
  },
  externals: nodeExternals({
    allowlist: /\.css$/
  }),
  target: 'node',
  mode: 'production',
  devtool: false,
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js'
    }
  },
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
      test: /style\.css$/,
      use: [{
        loader: ServerMiniCssExtractPlugin.loader,
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
      exclude: /style\.css$/,
      use: [{
        loader: ServerMiniCssExtractPlugin.loader,
        options: {
          esModule: true
        }
      }, {
        loader: 'css-loader',
        options: {
          importLoaders: 1
        }
      }]
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
        'thread-loader',
        {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              '@babel/plugin-syntax-dynamic-import',
              '@babel/plugin-transform-runtime'
            ]
          }
        }]
    }]
  },
  plugins: [
    new ServerMiniCssExtractPlugin({
    }),
    new VueSSRServerPlugin({
      filename: 'vue-ssr-server-bundle.json'
    })
  ]
})
