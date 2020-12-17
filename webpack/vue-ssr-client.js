const path = require('path')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const baseConfig = require('./config.common')
const projectPath = __dirname
const distPath = path.resolve(projectPath, 'dist/vue-ssr-client')
const publicPath = '/_/'
const outputPath = path.join(distPath, publicPath)

module.exports = Object.assign(baseConfig, {
  entry: path.resolve(__dirname, './vue/ssr-client-entry.mjs'),
  output: {
    path: outputPath,
    publicPath: publicPath,
    filename: '[hash].js',
    chunkFilename: '[chunkhash].js'
  },
  mode: 'production',
  devtool: false,
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js'
    }
  },
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
      exclude: /style\.css$/,
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
    new CleanWebpackPlugin({
      root: projectPath,
      cleanOnceBeforeBuildPatterns: [distPath]
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[hash].css',
      chunkFilename: 'css/[chunkhash].css'
    }),
    new VueSSRClientPlugin({
      filename: '../manifest.json'
    })
  ]
})
