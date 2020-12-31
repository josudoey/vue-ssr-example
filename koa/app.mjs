import Koa from 'koa'
import KoaSession from 'koa-session'
const app = new Koa()
app.keys = ['vue-ssr-example-secret']
app.use(KoaSession({
  key: 's',
  maxAge: 60 * 60 * 1000
}, app))
export default app
