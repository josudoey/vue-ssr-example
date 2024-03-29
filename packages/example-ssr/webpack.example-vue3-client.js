import webpack from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import ManifestHashPlugin from './webpack/plugins/manifest-hash.js'
import { WebpackManifestPlugin } from 'webpack-manifest-plugin'

import { createRequire } from 'module'
import { exampleVue3Env } from './env.js'
import VueLoaderPlugin from '@vue-ssr-example/vue3/loader-plugin.js'

const require = createRequire(import.meta.url)

const {
  publicPath,
  clientOutputPath,
  manifestPath
} = exampleVue3Env

export default function (env) {
  return {
    devtool: 'source-map',
    target: 'web',
    mode: (process.env.NODE_ENV === 'production') ? 'production' : 'development',
    entry: require.resolve('@vue-ssr-example/example-vue3/entry/client/main.js'),
    resolve: {
      alias: {
        axios$: 'axios/dist/axios.js',
        'vue-flatpickr-component$': 'vue-flatpickr-component/src/index.js',
        vue: '@vue/compat'
      },
      // Add `.ts` and `.tsx` as a resolvable extension.
      extensions: ['.ts', '.tsx', '.js'],
      // Add support for TypeScripts fully qualified ESM imports.
      extensionAlias: {
        '.js': ['.js', '.ts'],
        '.cjs': ['.cjs', '.cts'],
        '.mjs': ['.mjs', '.mts']
      }
    },
    output: {
      clean: true,
      filename: '[contenthash].js',
      chunkFilename: '[contenthash].js',
      path: clientOutputPath,
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
        test: /\.vue$/,
        loader: require.resolve('@vue-ssr-example/vue3/vue-loader.js')
      }, {
        // ref https://vue-loader.vuejs.org/guide/pre-processors.html#pug
        test: /((?!render)(?!template)\w+)\.pug$/,
        oneOf: [
          // this applies to `<template lang="pug">` in Vue components
          {
            resourceQuery: /^\?vue/,
            use: [require.resolve('pug-plain-loader')]
          }
        ]
      }, {
        test: /\.([cm]?ts|tsx)$/,
        loader: 'ts-loader'
      }, {
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
          loader: require.resolve('@vue-ssr-example/vue3/template-loader.js'),
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
        test: /module\.css$/,
        use: [{
          loader: MiniCssExtractPlugin.loader,
          options: {}
        }, {
          loader: require.resolve('css-loader'),
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
          loader: require.resolve('css-loader'),
          options: {
            importLoaders: 0
          }
        }]
      }]
    },
    plugins: [
      new VueLoaderPlugin(),
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
