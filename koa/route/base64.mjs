import createDebug from 'debug'
import * as actions from '~hydration/action/base64.mjs'
const debug = createDebug('app:koa:base64')

export async function encode (ctx, next) {
  debug('encode')
  const text = ctx.query.v || ''
  const result = await actions.encode(ctx, text)
  ctx.status = 200
  ctx.body = result
}
