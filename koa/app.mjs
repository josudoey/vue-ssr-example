import Koa from 'koa'
import KoaSession from 'koa-session'
import { extendKoaStore } from './store/index.mjs'
const app = new Koa()
app.keys = ['vue-ssr-example-secret']
app.use(KoaSession({
  key: 's',
  maxAge: 60 * 60 * 1000
}, app))
extendKoaStore(app.context)
export default app
