import * as yup from 'yup'
import createDebug from 'debug'
const debug = createDebug('app:koa:base64')

const encodeQuerySchema = yup.object().shape({
  v: yup.string().default('')
})

const delay = function (ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms)
  })
}
export async function encode (ctx, next) {
  debug('encode', ctx.query.v)
  const query = await encodeQuerySchema.validate(ctx.query)
  const text = query.v
  const result = Buffer.from(text).toString('base64')
  await delay(1000)
  ctx.status = 200
  ctx.body = {
    text,
    result
  }
}
