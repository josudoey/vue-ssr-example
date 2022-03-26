import { createRequire } from 'module'
import env from './env.cjs'
const { exampleVue2 } = env
const ssrModuleDefault = createRequire(import.meta.url)(exampleVue2.ssrPath)
export const { createRenderer, createRouter, createStore, createApp, isNavigationFailure, NavigationFailureType } = ssrModuleDefault
