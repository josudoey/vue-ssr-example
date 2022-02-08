import env from './env.cjs'
const ssrModule = await import(env.exampleVue3.ssrPath)
export const { createRenderer, createApp, createMemoryRouter, createPinia } = ssrModule
