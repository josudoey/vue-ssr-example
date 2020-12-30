import * as auth from './auth.mjs'

export async function signOut (ctx, next) {
  await auth.revoke(ctx, next)
  ctx.redirect(ctx.header.referer)
}
