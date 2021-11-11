import { URL } from 'url'
import * as auth from './auth.mjs'

export async function signOut (ctx, next) {
  await auth.revoke(ctx, next)
  const { referer } = ctx.header
  const alt = '/'
  if (!referer) {
    return ctx.redirect('back', alt)
  }

  const { origin } = ctx
  if (referer.indexOf(origin) !== 0) {
    return ctx.redirect('back', alt)
  }

  const refererURL = new URL(referer)
  const refererPath = refererURL.pathname + refererURL.search
  const redirectURL = new URL(origin)
  redirectURL.pathname = ctx.router.url('signIn')
  redirectURL.searchParams.set('redirect', refererPath)
  ctx.redirect(redirectURL.toString())
}
