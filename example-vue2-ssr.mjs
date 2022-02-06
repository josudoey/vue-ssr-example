import env from './env.cjs'
const { exampleVue2 } = env
const ssrModule = await import(exampleVue2.ssrPath)
const ssrModuleDefault = ssrModule.default
export const { createRenderer, createRouter, createStore, createApp, isNavigationFailure, NavigationFailureType } = ssrModuleDefault
