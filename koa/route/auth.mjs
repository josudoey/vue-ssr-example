import * as auth from '../store/auth.mjs'
export async function state (ctx, next) {
  ctx.state.auth = ctx.session.auth
  auth.register(ctx.$store)
  await next()
}

export async function get (ctx, next) {
  ctx.status = 200
  ctx.body = ctx.state.auth
}

export async function basic (ctx, next) {
  const auth = await ctx.$store.dispatch('auth/signIn')
  if (!auth) {
    ctx.status = 401
    return
  }

  ctx.status = 200
  ctx.body = auth
}

export async function revoke (ctx, next) {
  ctx.status = 200
  ctx.body = await ctx.$store.dispatch('auth/revoke')
}
