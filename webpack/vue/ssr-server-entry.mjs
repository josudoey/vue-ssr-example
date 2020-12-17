import createApp from './create.mjs'

export default ctx => {
  return new Promise((resolve, reject) => {
    const { app, store, router } = createApp()
    router.push(ctx.url)
    ctx.meta = app.$meta()

    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      if (!matchedComponents.length) {
        const err = new Error('Not Found')
        err.code = 404
        return reject(err)
      }

      Promise.all(matchedComponents.map(Component => {
        // if (Component.asyncData) {
        //   return Component.asyncData({
        //     store
        //     // route: router.currentRoute
        //   })
        // }
      })).then(() => {
        ctx.state = store.state
        resolve(app)
      }).catch(reject)
    }, reject)
  })
}
