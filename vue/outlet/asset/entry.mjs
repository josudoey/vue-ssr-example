/* eslint-env browser */
import '../style.css'

// see https://www.npmjs.com/package/debug
if (localStorage) {
  localStorage.debug = '*'
}
import('./main.mjs')
