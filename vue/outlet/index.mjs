import template from './template.pug'
import layout from '../layout/index.js'
export default {
  template,
  components: {
    layout: layout
  },
  data: function () {
    return {
    }
  },
  metaInfo () {
    return {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, user-scalable=no' }
      ],
      script: [{
        innerHTML: 'console.log("meta info script");',
        type: 'text/javascript'
      }],
      title: '預設標題',
      titleTemplate: '%s',
      afterNavigation (metaInfo) {
        console.log(metaInfo)
        console.log('ssr-outlet: metaInfo afterNavigation')
      },
      ...this.$route.meta
    }
  },
  beforeCreate () {

  },
  mounted () {

  }
}
