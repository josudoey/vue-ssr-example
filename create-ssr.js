const env = require('./env.js')
const ssr = require(env.ssrPath)
const createSSR = ssr.default
module.exports = createSSR
