import env from '../env.mjs'
import { exampleVue2Build } from './build-example-vue2.mjs'
import { exampleVue3Build } from './build-example-vue3.mjs'

(async function () {
  await Promise.all([
    exampleVue2Build(env),
    exampleVue3Build(env)
  ])
})()
