import build from '~example-server/build.mjs'
import env from '../env.cjs'

(async function () {
  await build(env)
})()
