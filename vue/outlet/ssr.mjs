
import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from '../routes.js'
import VueMeta from 'vue-meta'
import BootstrapVue from 'bootstrap-vue'
import mixin from '../mixin/index.mjs'
import { createStore } from '../store/index.mjs'
import VueServerRenderer from 'vue-server-renderer'
import outlet from './index.mjs'

Vue.use(VueRouter)
Vue.use(VueMeta, {
  refreshOnceOnNavigation: false
})
Vue.use(BootstrapVue)
Vue.mixin(mixin)

const createSSRApp = async function (ctx) {
  const store = createStore(ctx.state)
  const router = new VueRouter({
    mode: 'history',
    routes
  })

  const vm = new Vue({
    store,
    router,
    ...outlet
  })

  return vm
}

export default function (manifest) {
  const render = VueServerRenderer.createRenderer({
    inject: true,
    shouldPreload: (file, type) => {
      // ref https://ssr.vuejs.org/api/#shouldpreload
      return true
    },
    shouldPrefetch: (file, type) => {
      return false
    },
    template: `<!DOCTYPE html><html><head>
{{{ meta.inject().meta.text({}) }}}{{{ meta.inject().title.text() }}}
<link rel="stylesheet" href="{{{manifest['main.css']}}}">
</head><body>
<!--vue-ssr-outlet-->
<script src="{{{manifest['main.js']}}}" defer></script>
</body></html>`
  })

  return {
    render,
    createSSRApp: async function (ctx) {
      const vm = await createSSRApp({
        url: ctx.url,
        state: ctx.state
      })

      const router = vm.$router
      const store = vm.$store

      router.beforeEach((to, from, next) => {
        if (to.matched.some(record => record.meta.requiredAuth)) {
          if (!store.state.auth.uid) {
            next({
              name: 'signIn',
              query: {
                redirect: to.fullPath
              }
            })
            return
          }
          next()
          return
        }
        next()
      })
      return vm
    }
  }
}
