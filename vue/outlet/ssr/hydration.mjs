import { actions as base64 } from '../../view/base64/store.mjs'
import { actions as auth } from '../../layout/auth/store.mjs'
import { override } from '~hydration/action/index.mjs'
import createDebug from 'debug'
const debug = createDebug('app:ssr:hydration')
debug('import')
override({
  base64,
  auth
})
debug('actions override done')
