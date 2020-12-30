export async function encode (ctx, next) {
  const text = ctx.query.v || ''
  const result = Buffer.from(text).toString('base64')
  ctx.status = 200
  ctx.body = {
    text: text,
    result: result
  }
}
