import create from './create.mjs'
export default ctx => {
  return new Promise((resolve, reject) => {
    const { ssrOutlet, store, router } = create(ctx.state)
    router.beforeEach((to, from, next) => {
      if (to.matched.some(record => record.meta.requiredAuth)) {
        if (!store.state.auth.uid) {
          const err = new Error('Redirect')
          err.code = 302
          err.to = router.resolve({
            name: 'signIn',
            query: {
              redirect: to.fullPath
            }
          })
          next(err)
          return
        }
        next()
        return
      }
      next()
    })

    router.push(ctx.url).catch(reject)
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      if (!matchedComponents.length) {
        return
      }
      ctx.meta = ssrOutlet.$meta()
      resolve(ssrOutlet)
    }, reject)
  })
}
