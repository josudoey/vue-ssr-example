import env from './env.js'
const ssrModule = await import(env.ssrPath)
const createSSRAppModule = ssrModule.default
const createSSRApp = createSSRAppModule.default
export default createSSRApp
