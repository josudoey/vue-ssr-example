import exampleVue2WebpackMain from '~example-vue2-build/main.js'
import exampleVue3WebpackMain from '~example-vue3-build/main.js'

const exampleVue2Build = async ({ publicPath, exampleVue2 }) => {
  const { browserOutputPath, vueSSRClientManifestPath, manifestPath, ssrOutputPath } = exampleVue2
  return exampleVue2WebpackMain({
    publicPath, browserOutputPath, vueSSRClientManifestPath, manifestPath, ssrOutputPath
  })
}

const exampleVue3Build = async ({ publicPath, exampleVue3 }) => {
  const { browserOutputPath, manifestPath, ssrOutputPath } = exampleVue3
  return exampleVue3WebpackMain({
    publicPath, browserOutputPath, manifestPath, ssrOutputPath
  })
}

export default function (env) {
  return Promise.all([
    exampleVue2Build(env),
    exampleVue3Build(env)
  ])
}
