import exampleVue3WebpackMain from '../main.mjs'
import env from '../env.cjs'

const exampleVue3Build = async () => {
  const { publicPath, exampleVue3 } = env
  const { browserOutputPath, manifestPath, ssrOutputPath } = exampleVue3
  return exampleVue3WebpackMain({
    publicPath, browserOutputPath, manifestPath, ssrOutputPath
  })
}

(async function () {
  await Promise.all([
    exampleVue3Build()
  ])
})()
