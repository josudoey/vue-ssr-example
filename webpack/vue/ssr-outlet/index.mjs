import template from './template.pug'
import layout from '../layout/index.js'
export default {
  template: template,
  components: {
    layout: layout
  },
  data: function () {
    return {
    }
  },
  metaInfo () {
    return Object.assign({
      title: '預設標題',
      titleTemplate: '%s'
    }, this.$route.meta)
  },
  beforeCreate: function () {

  },
  mounted: function () {

  }
}
