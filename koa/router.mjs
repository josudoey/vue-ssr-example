import KoaRouter from 'koa-router'
import KoaSession from 'koa-session'
import bodyParser from 'koa-bodyparser'
import * as auth from './route/auth.mjs'
import * as base64 from './route/base64.mjs'
import * as page from './route/page.mjs'
import * as vueSSR from './vue-ssr/index.mjs'
import * as xsrfToken from './route/xsrf-token.mjs'

const router = new KoaRouter()
router
  .use(bodyParser({
    jsonLimit: '1mb',
    formLimit: '56kb'
  }))
  .use(auth.state)
  .use(xsrfToken.verify)
  .use(vueSSR.after(xsrfToken.create))
  .get('/auth/state', auth.get)
  .post('/auth', auth.basic)
  .get('/auth/revoke', auth.revoke)
  .get('/sign-out', page.signOut)
  .get('/api/base64', base64.encode)
  .get('/base64', vueSSR.setStoreState('base64', base64.encode))

export default router
