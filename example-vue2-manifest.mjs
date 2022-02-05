import fs from 'fs'
import env from './env.cjs'
const { vueSSRClientManifestPath } = env.exampleVue2
const vueSSRClientManifest = JSON.parse(fs.readFileSync(vueSSRClientManifestPath).toString())
export default vueSSRClientManifest
