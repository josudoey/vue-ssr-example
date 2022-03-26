import { createRequire } from 'module'
import env from './env.cjs'
const { vueSSRClientManifestPath } = env.exampleVue2
const vueSSRClientManifest = createRequire(import.meta.url)(vueSSRClientManifestPath)
export default vueSSRClientManifest
