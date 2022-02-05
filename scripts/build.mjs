import main from '~example-vue2/webpack/main.mjs'
import env from '../env.cjs'

(async function () {
  const { publicPath, exampleVue2 } = env
  const { browserOutputPath, vueSSRClientManifestPath, ssrOutputPath } = exampleVue2
  await main({
    publicPath, browserOutputPath, vueSSRClientManifestPath, ssrOutputPath
  })
})()
