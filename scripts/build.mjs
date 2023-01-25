import build from '~example-server/build.mjs'
import env from '../env.mjs'

(async function () {
  await build(env)
})()
