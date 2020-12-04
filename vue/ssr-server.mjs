import createApp from './create.mjs'

export default ctx => {
  return new Promise((resolve, reject) => {
    const { app, store, router } = createApp()
    router.push(ctx.url)
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      if (!matchedComponents.length) {
        return reject({ code: 404 })
      }

      Promise.all(matchedComponents.map(Component => {
        if (Component.asyncData) {
          return Component.asyncData({
            store,
            route: router.currentRoute
          })
        }
      })).then(() => {
        ctx.state = store.state
        resolve(app)
      }).catch(reject)
    }, reject)
  })
}
