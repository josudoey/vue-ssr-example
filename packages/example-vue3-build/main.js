import webpack from '~webpack5'
import browserConfig from './webpack/browser/config.js'
import ssrConfig from './webpack/ssr/config.js'

export default async function (env) {
  process.on('uncaughtException', function (err) {
    console.trace(err)
  })

  process.on('unhandledRejection', function (err) {
    console.trace(err)
  })

  await new Promise(function (resolve, reject) {
    const { publicPath, browserOutputPath, manifestPath, ssrOutputPath } = env
    const compiler = webpack([
      browserConfig({
        outputPath: browserOutputPath,
        manifestPath,
        publicPath
      }),
      ssrConfig({
        outputPath: ssrOutputPath
      })
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
}
