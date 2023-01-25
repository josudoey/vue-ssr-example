import webpack from '~webpack5'
import browserConfig from './browser/config.js'
import ssrConfig from './ssr/config.js'
export default async function (
  { publicPath, browserOutputPath, vueSSRClientManifestPath, manifestPath, ssrOutputPath }
) {
  process.on('uncaughtException', function (err) {
    console.trace(err)
  })

  process.on('unhandledRejection', function (err) {
    console.trace(err)
  })

  await new Promise(function (resolve, reject) {
    const compiler = webpack([
      browserConfig({
        outputPath: browserOutputPath,
        vueSSRClientManifestPath,
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
