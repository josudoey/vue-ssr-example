import env from '../env.mjs'
import { exampleVue2Build, exampleVue3Build } from './build.mjs'

(async function () {
  await Promise.all([
    exampleVue2Build(env),
    exampleVue3Build(env)
  ])
})()
