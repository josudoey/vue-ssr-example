import { createSSRApp } from 'vue'
import outlet from './outlet/index.js'

export function createApp () {
  return createSSRApp(outlet)
}
