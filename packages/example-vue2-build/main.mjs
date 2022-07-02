import webpack from '~webpack5'
import browserConfig from '~example-vue2-build-browser/webpack.config.cjs'
import ssrConfig from '~example-vue2-build-ssr/webpack.config.cjs'
export default async function (
  { publicPath, browserOutputPath, vueSSRClientManifestPath, ssrOutputPath }
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
