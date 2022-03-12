import { inflate } from 'pako'
import { createPinia } from 'pinia'

function decode (encoded) {
  const decoded = window.atob(encoded)
  const chars = decoded.split('').map(x => x.charCodeAt(0))
  const data = new Uint8Array(chars)
  return inflate(data, { to: 'string' })
}

export function getHydratePinia (window) {
  const pinia = createPinia()
  if (!window.__pinia) {
    return pinia
  }
  const initalState = window.__pinia
  delete window.__pinia
  const state = JSON.parse(
    decode(initalState)
  )
  pinia.state.value = state
  return pinia
}
