/* eslint-env browser */
import '~vue2-example/outlet/style.css'

// see https://www.npmjs.com/package/debug
if (localStorage) {
  localStorage.debug = '*'
}
import('./main.mjs')
