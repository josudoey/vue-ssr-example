import Koa from 'koa'
import KoaSession from 'koa-session'
import router from './router.mjs'
const app = new Koa()
app.keys = ['vue-ssr-example-secret']
app.use(KoaSession({
  key: 's',
  maxAge: 60 * 60 * 1000
}, app))
app.use(router.routes())
export default app
