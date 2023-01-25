/* eslint-env browser */
import '../../../outlet/style.css'

// see https://www.npmjs.com/package/debug
if (localStorage) {
  localStorage.debug = '*'
}
import('./script.js')
