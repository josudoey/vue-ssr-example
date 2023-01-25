import createDebug from 'debug'
import { unpack } from 'msgpackr/unpack'

const debug = createDebug('app:vue:outlet:browser:inital-state')

function decode (encoded) {
  const decoded = window.atob(encoded)
  const chars = decoded.split('').map(x => x.charCodeAt(0))
  const data = new Uint8Array(chars)
  return unpack(data)
}

const initalState = window.__INITIAL_STATE__
delete window.__INITIAL_STATE__
debug('initalState', initalState)
const state = decode(initalState)

debug('state', state)
export default state
