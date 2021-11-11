import KoaRouter from 'koa-router'
import bodyParser from 'koa-bodyparser'
import * as session from './route/session.mjs'
import * as auth from './route/auth.mjs'
import * as base64 from './route/base64.mjs'
import * as page from './route/page.mjs'
import * as note from './route/note.mjs'
import * as xsrfToken from './route/xsrf-token.mjs'
export const addRoute = function (router) {
  router
    .use(bodyParser({
      jsonLimit: '1mb',
      formLimit: '56kb'
    }))
    .use(xsrfToken.verify)
    .get('sessionState', '/_/session', session.state)
    .get('authGet', '/_/auth/state', auth.getState)
    .post('authBasic', '/_/auth', auth.basic)
    .get('authRevoke', '/_/auth/revoke', auth.revoke)
    .get('signOut', '/sign-out', page.signOut)
    .get('base64', '/_/base64', auth.required, base64.encode)
    .get('noteList', '/_/note', auth.required, note.List)
    .post('noteInsert', '/_/note', auth.required, note.Insert)
    .put('noteUpdate', '/_/note/:id', auth.required, note.Update)
    .delete('noteDelete', '/_/note/:id', auth.required, note.Delete)
  return router
}

export const createVueSSRRouter = function (vueRoutes, koaSSROutlet) {
  const router = new KoaRouter()
  addRoute(router)
  for (const route of vueRoutes) {
    router.use(xsrfToken.create)
    router.get(route.name, route.path, koaSSROutlet)
  }
  return router
}

export default addRoute(new KoaRouter())
