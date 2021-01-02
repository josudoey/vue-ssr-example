import create from './create.mjs'
export default ctx => {
  return new Promise((resolve, reject) => {
    const { ssrOutlet, router } = create(ctx.state)
    router.push(ctx.url).catch(function (err) {
      err.code = 400
      reject(err)
    })
    console.log('vue-router pushed')
    router.onReady(() => {
      console.log('vue-router onReady')
      const matchedComponents = router.getMatchedComponents()
      if (!matchedComponents.length) {
        const err = new Error('Not Found')
        err.code = 404
        reject(err)
        return
      }
      ctx.meta = ssrOutlet.$meta()
      resolve(ssrOutlet)
    }, reject)
  })
}
