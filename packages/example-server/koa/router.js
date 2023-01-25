import KoaRouter from 'koa-router'
import bodyParser from 'koa-bodyparser'
import * as session from './route/session.js'
import * as auth from './route/auth.js'
import * as base64 from './route/base64.js'
import * as page from './route/page.js'
import * as note from './route/note.js'
import * as xsrfToken from './route/xsrf-token.js'

export function createRouter () {
  return new KoaRouter()
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
    .get('base64Encode', '/_/base64', auth.required, base64.encode)
    .get('noteList', '/_/note', auth.required, note.List)
    .post('noteInsert', '/_/note', auth.required, note.Insert)
    .put('noteUpdate', '/_/note/:id', auth.required, note.Update)
    .delete('noteDelete', '/_/note/:id', auth.required, note.Delete)
}
