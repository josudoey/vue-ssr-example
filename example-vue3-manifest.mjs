import { createRequire } from 'module'
import env from './env.cjs'
const { manifestPath } = env.exampleVue3
const manifest = createRequire(import.meta.url)(manifestPath)
export default manifest
