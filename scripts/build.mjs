import build from '~example-server/build.js'
import env from '../env.mjs'

(async function () {
  await build(env)
})()
