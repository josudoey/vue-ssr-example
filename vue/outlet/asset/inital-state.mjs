import createDebug from 'debug'
import { strFromU8, decompressSync } from 'fflate'
const debug = createDebug('app:outlet:asset:inital-state')

function decode (encoded) {
  const decoded = window.atob(encoded)
  const chars = decoded.split('').map(x => x.charCodeAt(0))
  const data = new Uint8Array(chars)
  return strFromU8(decompressSync(data))
}

const initalState = window.__INITIAL_STATE__
delete window.__INITIAL_STATE__
debug('initalState', initalState)
const state = JSON.parse(
  decode(initalState)
)
debug('state', state)
export default state
