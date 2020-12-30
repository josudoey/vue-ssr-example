import basicAuth from 'basic-auth'

export async function state (ctx, next) {
  const auth = ctx.state.auth = ctx.session.auth || {
    uid: ''
  }
  if (auth) {
    Object.assign(auth, {
      expire: ctx.session._expire
    })
  }
  await next()
}

export async function get (ctx, next) {
  ctx.status = 200
  ctx.body = ctx.state.auth
}

export async function basic (ctx, next) {
  const credentials = basicAuth(ctx.req)
  if (!credentials) {
    ctx.status = 401
    return
  }

  ctx.status = 200
  ctx.body = ctx.state.auth = ctx.session.auth = {
    uid: credentials.name
  }
}

export async function revoke (ctx, next) {
  ctx.status = 200
  delete ctx.session.auth
  delete ctx.state.auth
}
