import { createPinia } from 'pinia'
import InitalStateParse from '~initial-state/parse.js'

export function getHydratePinia (window) {
  const pinia = createPinia()
  if (!window.__pinia) {
    return pinia
  }
  const initalState = InitalStateParse(window.__pinia)
  delete window.__pinia

  pinia.state.value = initalState
  return pinia
}
