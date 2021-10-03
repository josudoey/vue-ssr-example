import * as base64 from './base64.mjs'
import { actions as auth } from '../../koa/store/auth.mjs'
import createDebug from 'debug'
const debug = createDebug('app:hydration:action')
debug('import')

const hydrationProvide = {
  base64,
  auth
}
const hydrationInject = [
  'base64',
  'auth'
]

export function override (base) {
  for (const name of hydrationInject) {
    debug(`override ${name}`)
    Object.assign(base[name], hydrationProvide[name])
  }
}
