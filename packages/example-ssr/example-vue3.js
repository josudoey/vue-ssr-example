import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const manifest = require('./dist/example-vue3-client/manifest.json')

export * from './dist/example-vue3-server/main.js'
export { manifest }
