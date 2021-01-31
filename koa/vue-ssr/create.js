module.exports = function (bundleRenderer) {
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
      if (err.code === 302) {
        ctx.redirect(err.to.href)
        return
      }
      if (err.code === 404) {
        return ctx.throw(404)
      }
      console.log(err)
      return ctx.throw(500, 'Internal Server Error')
    }
  }
}
