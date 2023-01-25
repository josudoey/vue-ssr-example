import exampleVue2WebpackBuild from '~example-vue2/webpack/build.js'
import exampleVue3WebpackBuild from '~example-vue3/webpack/build.js'

const exampleVue2Build = async ({ publicPath, exampleVue2 }) => {
  const { browserOutputPath, vueSSRClientManifestPath, manifestPath, ssrOutputPath } = exampleVue2
  return exampleVue2WebpackBuild({
    publicPath, browserOutputPath, vueSSRClientManifestPath, manifestPath, ssrOutputPath
  })
}

const exampleVue3Build = async ({ publicPath, exampleVue3 }) => {
  const { browserOutputPath, manifestPath, ssrOutputPath } = exampleVue3
  return exampleVue3WebpackBuild({
    publicPath, browserOutputPath, manifestPath, ssrOutputPath
  })
}

export default function (env) {
  return Promise.all([
    exampleVue2Build(env),
    exampleVue3Build(env)
  ])
}
