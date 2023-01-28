import env from '../env.mjs'

import exampleVue3WebpackBuild from '~example-vue3/webpack/build.js'
const exampleVue3Build = async ({ publicPath, exampleVue3 }) => {
  const { browserOutputPath, manifestPath, ssrOutputPath } = exampleVue3
  return exampleVue3WebpackBuild({
    publicPath, browserOutputPath, manifestPath, ssrOutputPath
  })
}

(async function () {
  await exampleVue3Build(env)
})()
