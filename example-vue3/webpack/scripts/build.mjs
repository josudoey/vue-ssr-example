// import exampleVue2WebpackMain from '~example-vue2/webpack/main.mjs'
import exampleVue3WebpackMain from '../main.mjs'
import env from '../env.cjs'

// const exampleVue2Build = async () => {
//   const { publicPath, exampleVue2 } = env
//   const { browserOutputPath, vueSSRClientManifestPath, ssrOutputPath } = exampleVue2
//   return exampleVue2WebpackMain({
//     publicPath, browserOutputPath, vueSSRClientManifestPath, ssrOutputPath
//   })
// }

const exampleVue3Build = async () => {
  const { publicPath, exampleVue3 } = env
  const { browserOutputPath, manifestPath, ssrOutputPath } = exampleVue3
  return exampleVue3WebpackMain({
    publicPath, browserOutputPath, manifestPath, ssrOutputPath
  })
}

(async function () {
  await Promise.all([
    // exampleVue2Build(),
    exampleVue3Build()
  ])
})()
