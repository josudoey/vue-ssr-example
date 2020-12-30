import csrf from 'csrf'
const tokens = csrf()

export async function verify (ctx, next) {
  if (['GET', 'HEAD', 'OPTIONS'].indexOf(ctx.method) !== -1) {
    return next()
  }

  const token = ctx.get('x-xsrf-token')

  if (!token) {
    return ctx.throw(403, 'Invalid CSRF token')
  }

  if (!tokens.verify(ctx.session.secret, token)) {
    return ctx.throw(403, 'Invalid CSRF token')
  }
  return next()
}
export async function create (ctx, next) {
  if (!ctx.session.secret) {
    ctx.session.secret = tokens.secretSync()
  }

  ctx.cookies.set('XSRF-TOKEN',
    tokens.create(ctx.session.secret), {
      signed: false,
      sameSite: 'strict',
      httpOnly: false,
      overwrite: false
    }
  )
  return next()
}
