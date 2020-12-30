export function setStoreState (name, action) {
  return async function (ctx, next) {
    await action(ctx, function () {})
    ctx.state[name] = ctx.body
    await next()
  }
}

export function after (action) {
  return async function (ctx, next) {
    await next()
    if (ctx.type === 'text/html') {
      await action(ctx, function () {})
    }
  }
}
