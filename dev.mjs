import webpack from 'webpack'
import ssrConfig from './vue/webpack.config.ssr.js'
import assetConfig from './vue/webpack.config.asset.js'

process.on('uncaughtException', function (err) {
  console.trace(err)
})

process.on('unhandledRejection', function (err) {
  console.trace(err)
});

(async function main () {
  await new Promise(function (resolve, reject) {
    const override = {
      mode: (process.env.NODE_ENV === 'production') ? 'production' : 'development',
      devtool: 'source-map'
    }

    const compiler = webpack([
      {
        ...assetConfig(),
        ...override
      },
      {
        ...ssrConfig(),
        ...override
      }
    ])

    compiler.run(function (err, mulitStats) {
      if (err) {
        throw reject(err)
      }
      for (const stat of mulitStats.stats) {
        console.log(stat.toString({
          colors: true
        }))
      }
      resolve()
    })
  })

  import('./main.mjs')
})()
