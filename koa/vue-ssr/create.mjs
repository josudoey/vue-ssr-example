export default function (bundleRenderer) {
  return async (ctx, next) => {
    try {
      const html = await new Promise(function (resolve, reject) {
        bundleRenderer.renderToString(ctx, (err, html) => {
          if (err) {
            return reject(err)
          }
          resolve(html)
        })
      })
      ctx.status = 200
      ctx.type = 'text/html'
      ctx.body = html
    } catch (err) {
      console.log(err)
      if (err.code === 404) {
        ctx.status = 404
        return
      }
      ctx.status = 500
    }
  }
}
