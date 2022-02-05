import env from './env.js'
const ssrModule = await import(env.ssrPath)
const createSSRAppModule = ssrModule.default
const { routes, createRenderer, createRouter, createStore, createSSRApp, isNavigationFailure, NavigationFailureType } = createSSRAppModule
export { routes, createRenderer, createSSRApp, createRouter, createStore, isNavigationFailure, NavigationFailureType }
