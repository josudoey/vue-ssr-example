import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './style.css'
import template from './template.pug'
import sidenav from './sidenav'
import * as auth from '../store/auth/index.mjs'
export default {
  template,
  computed: {
    ...auth.mapState(['uid'])
  },
  data: function () {
    return {
    }
  },
  components: {
    sidenav: sidenav
  },
  watch: {
    $route: function () {
      this.$refs.sidenav.close()
    }
  },
  methods: {

  },
  serverPrefetch: async function () {
    console.log('layout: serverPrefetch (server side only)')
  },
  metaInfo () {
    return {
      titleTemplate: '%s'
    }
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
