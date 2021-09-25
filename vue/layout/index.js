import './style.css'
import template from './template.pug'
import sidenav from './sidenav/index.mjs'
import * as auth from '../store/auth/index.mjs'
import createDebug from 'debug'
const debug = createDebug('app:layout')
export default {
  template,
  provide () {
    return {
      toggleSidenav: this.toggleSidenav
    }
  },
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
    }
  },
  methods: {
    toggleSidenav () {
      this.$refs.sidenav.toggle()
    }
  },
  serverPrefetch: async function () {
    debug('layout: serverPrefetch (server side only)')
  },
  metaInfo () {
    return {
      titleTemplate: '%s'
    }
  },
  beforeCreate: function () {
    debug('layout: beforeCreate')
  },
  created: function () {
    debug('layout: created')
  },
  beforeMount: function () {
    debug('layout: beforeMount')
  },
  mounted: function () {
    debug('layout: mounted')
  },
  beforeDestroy: function () {
    debug('layout: beforeDestroy')
  },
  destroyed: function () {
    debug('layout: destroyed')
  }
}
