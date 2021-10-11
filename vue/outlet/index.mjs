import { render, staticRenderFns } from './render.pug'
import layout from '../layout/index.js'
import * as auth from '../outlet/auth/store.mjs'
import createDebug from 'debug'
const debug = createDebug('app:outlet')
export default {
  render,
  staticRenderFns,
  components: {
    layout: layout
  },
  metaInfo () {
    debug('metaInfo')
    return {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, user-scalable=no' }
      ],
      script: [{
        innerHTML: 'console.log("outlet metaInfo script innerHTML");',
        type: 'text/javascript'
      }],
      title: '預設標題',
      titleTemplate: '%s',
      afterNavigation (metaInfo) {
        debug('metaInfo afterNavigation', metaInfo)
      },
      ...this.$route.meta
    }
  },
  beforeCreate () {
    debug('beforeCreate')
  },
  data: function () {
    return {}
  },
  provide () {
    debug('provide')
    return {
      ...auth.mapActions({
        authSignIn: 'signIn'
      }),
      auth: this.auth
    }
  },
  beforeMount () {
    debug('beforeMount')
  },
  mounted () {
    debug('mounted')
  }
}
