/* esline env commonjs */
const env = require('./env.js')
const ssr = require(env.ssrPath)
const createSSRApp = ssr.default
module.exports = createSSRApp
