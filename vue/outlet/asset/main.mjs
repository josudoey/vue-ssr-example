// see https://getbootstrap.com/docs/4.6/getting-started/webpack/#importing-compiled-css
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import createApp from '../create-app.mjs'
import VuexRouterSync from 'vuex-router-sync'

import createDebug from 'debug'
const debug = createDebug('app:outlet:asset')

const main = function (state) {
  const vm = createApp(state)
  VuexRouterSync.sync(vm.$store, vm.$router)

  // https://ssr.vuejs.org/zh/guide/data.html#%E5%AE%A2%E6%88%B7%E7%AB%AF%E6%95%B0%E6%8D%AE%E9%A2%84%E5%8F%96-client-data-fetching
  vm.$router.onReady(() => {
    debug('vue-router onReady')
    vm.$mount('[data-server-rendered]', true)
  })

  return vm
}

;(async function () {
  main(window.__INITIAL_STATE__)
  delete window.__INITIAL_STATE__
})()
