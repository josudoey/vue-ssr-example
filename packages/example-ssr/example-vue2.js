import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const manifest = require('./dist/example-vue2-client/manifest.json')

export * from './dist/example-vue2-server/main.js'
export { manifest }
