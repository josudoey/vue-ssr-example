import exampleVue2WebpackMain from '~example-vue2-build/main.mjs'
import exampleVue3WebpackMain from '~example-vue3-build/main.mjs'

const exampleVue2Build = async ({ publicPath, exampleVue2 }) => {
  const { browserOutputPath, vueSSRClientManifestPath, ssrOutputPath } = exampleVue2
  return exampleVue2WebpackMain({
    publicPath, browserOutputPath, vueSSRClientManifestPath, ssrOutputPath
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
