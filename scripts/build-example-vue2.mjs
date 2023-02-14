import env from '../env.mjs'
import exampleVue2WebpackBuild from '~example-vue2/webpack/build.js'

export async function exampleVue2Build ({ publicPath, exampleVue2 }) {
  const { browserOutputPath, vueSSRClientManifestPath, manifestPath, ssrOutputPath } = exampleVue2
  return exampleVue2WebpackBuild({
    publicPath, browserOutputPath, vueSSRClientManifestPath, manifestPath, ssrOutputPath
  })
}

(async function () {
  await exampleVue2Build(env)
})()
