import { createSSRApp } from 'vue'
import outlet from './outlet/index.mjs'

export function createApp () {
  return createSSRApp(outlet)
}
