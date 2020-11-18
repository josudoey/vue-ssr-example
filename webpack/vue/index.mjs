import { createStore } from './store.mjs'
import { sync } from 'vuex-router-sync'
import Vue from 'vue'
import createRouter from './vue-router.js'

export default function () {
  const router = createRouter()
  const store = createStore()
  sync(store, router)

  const App = {
    template: `<!DOCTYPE html>
  <html>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <head><title>Hello</title></head>
  <body>
    <router-view></router-view>
  </body>
  </html>`,
    data: function () {
      return {}
    },
    beforeCreate: function () {
      console.log('beforeCreate')
    },
    created: function () {
      console.log('created')
    },
    beforeMount: function () {
      console.log('beforeMount')
    },
    mounted: function () {
      console.log('mounted')
    },
    beforeDestroy: function () {
      console.log('beforeDestroy')
    },
    destroyed: function () {
      console.log('destroyed')
    }
  }

  const app = new Vue({
    store: store,
    router: router,
    render: h => h(App)
  })
  return { app, store, router }
}
