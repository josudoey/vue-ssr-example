// ref https://v3.vuejs.org/guide/ssr/structure.html#entry-server-js
// see https://github.com/vitejs/vite/blob/main/packages/playground/ssr-vue/src/entry-server.js

export { createRenderer } from '~example-vue3/create-renderer.mjs'
export { createPinia } from 'pinia'
export {
  createApp, createMemoryRouter
} from '~example-vue3/index.mjs'
