import KoaRouter from 'koa-router'
import bodyParser from 'koa-bodyparser'
import * as auth from './route/auth.mjs'
import * as base64 from './route/base64.mjs'
import * as page from './route/page.mjs'
import * as xsrfToken from './route/xsrf-token.mjs'

const router = new KoaRouter()
router
  .use(bodyParser({
    jsonLimit: '1mb',
    formLimit: '56kb'
  }))
  .use(auth.state)
  .use(xsrfToken.verify)
  .get('authGet', '/_/auth/state', auth.get)
  .post('authBasic', '/_/auth', auth.basic)
  .get('authRevoke', '/_/auth/revoke', auth.revoke)
  .get('signOut', '/sign-out', page.signOut)
  .get('base64', '/_/base64', base64.encode)

export default router
