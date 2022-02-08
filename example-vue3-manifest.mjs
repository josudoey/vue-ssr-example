import fs from 'fs'
import env from './env.cjs'
const { manifestPath } = env.exampleVue3
const manifest = JSON.parse(fs.readFileSync(manifestPath).toString())
export default manifest
