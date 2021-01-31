import create from './create.mjs'
const { ssrOutlet, store, router } = create(window.__INITIAL_STATE__)
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

// https://ssr.vuejs.org/zh/guide/data.html#%E5%AE%A2%E6%88%B7%E7%AB%AF%E6%95%B0%E6%8D%AE%E9%A2%84%E5%8F%96-client-data-fetching
router.onReady(() => {
  console.log('vue-router onReady')
  ssrOutlet.$mount('[data-server-rendered]', true)
})
