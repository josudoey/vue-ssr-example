import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import template from './template.html'
export default {
  template: template,
  data: function () {
    return {
    }
  },
  serverPrefetch: async function () {
    console.log('layout: server side only')
  },
  metaInfo () {
    return {
      titleTemplate: '%s'
    }
  },
  asyncData: async function ({ store, route }) {

  },
  beforeCreate: function () {
    console.log('layout: beforeCreate')
  },
  created: function () {
    console.log('layout: created')
  },
  beforeMount: function () {
    console.log('layout: beforeMount')
  },
  mounted: function () {
    console.log('layout: mounted')
  },
  beforeDestroy: function () {
    console.log('layout: beforeDestroy')
  },
  destroyed: function () {
    console.log('layout: destroyed')
  }
}
