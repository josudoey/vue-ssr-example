import exampleVue2WebpackBuild from '~example-vue2/webpack/build.js'
import exampleVue3WebpackBuild from '~example-vue3/webpack/build.js'

export async function exampleVue2Build ({ publicPath, exampleVue2 }) {
  const { browserOutputPath, vueSSRClientManifestPath, manifestPath, ssrOutputPath } = exampleVue2
  return exampleVue2WebpackBuild({
    publicPath, browserOutputPath, vueSSRClientManifestPath, manifestPath, ssrOutputPath
  })
}

export async function exampleVue3Build ({ publicPath, exampleVue3 }) {
  const { browserOutputPath, manifestPath, ssrOutputPath } = exampleVue3
  return exampleVue3WebpackBuild({
    publicPath, browserOutputPath, manifestPath, ssrOutputPath
  })
}
