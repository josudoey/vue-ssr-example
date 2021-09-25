import { render, staticRenderFns } from './render.pug'
import layout from '../layout/index.js'
import createDebug from 'debug'
const debug = createDebug('app:outlet')
export default {
  render,
  staticRenderFns,
  components: {
    layout: layout
  },
  data: function () {
    return {
    }
  },
  metaInfo () {
    debug('outlet metaInfo')
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

  },
  mounted () {
  }
}
