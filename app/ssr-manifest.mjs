import fs from 'fs'
import env from '../env.js'
const vueSSRClientManifest = JSON.parse(fs.readFileSync(env.vueSSRClientManifestPath).toString())
export default vueSSRClientManifest
