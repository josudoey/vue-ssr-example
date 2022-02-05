/* eslint-env browser */
import '~example-vue2/outlet/style.css'

// see https://www.npmjs.com/package/debug
if (localStorage) {
  localStorage.debug = '*'
}
import('./main.mjs')
