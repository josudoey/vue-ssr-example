import csrf from 'csrf'
import createDebug from 'debug'
const debug = createDebug('app:xsrf-token')
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
  const token = ctx.cookies.get('XSRF-TOKEN')
  const secret = ctx.session.secret
  if (secret && token) {
    return next()
  }
  if (!ctx.session.secret) {
    ctx.session.secret = tokens.secretSync()
    debug('xsrf secret create', ctx.session.secret)
  }

  debug('cookies set XSRF-TOKEN', ctx.session.secret)
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
