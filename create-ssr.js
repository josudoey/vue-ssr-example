const env = require('./env.js')
const manifest = require('./manifest.js')
const ssr = require(env.ssrPath)
const createSSR = ssr.default
module.exports = createSSR(manifest)
