module.exports.setStoreState = function (name, action) {
  return async function (ctx, next) {
    await action(ctx, function () {})
    ctx.state[name] = ctx.body
    await next()
  }
}

module.exports.after = function (action) {
  return async function (ctx, next) {
    await next()
    if (ctx.type === 'text/html') {
      await action(ctx, function () {})
    }
  }
}
