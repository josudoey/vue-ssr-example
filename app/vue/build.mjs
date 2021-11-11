import webpack from 'webpack'
import ssrConfig from './webpack.config.ssr.js'
import browserConfig from './webpack.config.browser.js'

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
        ...browserConfig(),
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

})()
