export async function state (ctx, next) {
  ctx.status = 200
  ctx.body = ctx.session
}
