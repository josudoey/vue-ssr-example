import main from '~example-vue2/webpack/main.mjs'
import env from '../env.js'

(async function () {
  const { publicPath, browserOutputPath, vueSSRClientManifestPath, ssrOutputPath } = env
  await main({
    publicPath, browserOutputPath, vueSSRClientManifestPath, ssrOutputPath
  })
})()
