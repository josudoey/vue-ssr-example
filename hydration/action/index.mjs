import * as base64 from './base64.mjs'
import createDebug from 'debug'
const debug = createDebug('app:hydration:action')
debug('import')

const hydrationProvide = {
  base64
}
const hydrationInject = [
  'base64'
]

export function override (base) {
  for (const name of hydrationInject) {
    debug(`override ${name}`)
    Object.assign(base[name], hydrationProvide[name])
  }
}
