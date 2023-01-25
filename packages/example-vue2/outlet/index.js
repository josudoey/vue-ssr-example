import * as render from './render.pug'
import layout from '../layout/index.js'
import createDebug from 'debug'
const debug = createDebug('app:outlet')
export default {
  ...render,
  components: {
    layout
  },
  metaInfo () {
    debug('metaInfo')
    return {
      __dangerouslyDisableSanitizersByTagID: {
        outletMetaInfo: ['innerHTML']
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, user-scalable=no' }
      ],
      script: [{
        vmid: 'outletMetaInfo',
        innerHTML: 'console.log("outlet metaInfo script innerHTML");',
        type: 'text/javascript'
      }],
      title: '預設標題',
      afterNavigation (metaInfo) {
        debug('metaInfo afterNavigation', metaInfo)
      }
    }
  },
  beforeCreate () {
    debug('beforeCreate')
  },
  data () {
    return {}
  },
  provide () {
    debug('provide')
    return { }
  },
  beforeMount () {
    debug('beforeMount')
  },
  mounted () {
    debug('mounted')
  }
}
