// import * as auth from '../store/auth.mjs'
import basicAuth from 'basic-auth'
import createDebug from 'debug'
const debug = createDebug('app:koa:store')

export async function required (ctx, next) {
  if (!ctx.session.auth) {
    ctx.status = 401
    return
  }
  await next()
}

export async function getState (ctx, next) {
  debug('getState', ctx.session.auth)
  ctx.status = 200
  ctx.body = ctx.session.auth
}

export async function basic (ctx, next) {
  const credentials = basicAuth(ctx.req)
  if (!credentials) {
    return
  }
  const auth = ctx.session.auth = {
    uid: credentials.name,
    expire: ctx.session._expire
  }

  ctx.status = 200
  ctx.body = auth
}

export async function revoke (ctx, next) {
  ctx.status = 200
  ctx.session = null
  ctx.body = {}
}
