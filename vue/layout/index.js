import './style.css'
import template from './template.pug'
import sidenav from './sidenav/index.mjs'
import * as auth from '../store/auth/index.mjs'
import createDebug from 'debug'
const debug = createDebug('app:layout')
export default {
  template,
  provide () {
    debug('provide')
    auth.register(this.$store)
    return {
      auth: this.$store.state.auth,
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
  // see https://ssr.vuejs.org/guide/data.html#logic-collocation-with-components
  // Server-side only
  // This will be called by the server renderer automatically
  serverPrefetch: async function () {
    debug('layout: serverPrefetch (server side only)')
    // this.$store.registerModule('auth', auth)

    // return the Promise from the action
    // so that the component waits before rendering
  },
  mounted: function () {
    debug('mounted')
  },
  metaInfo () {
    return {
      titleTemplate: '%s'
    }
  },
  beforeCreate: function () {
    debug('beforeCreate')
  },
  created: function () {
    debug('created')
  },
  beforeMount: function () {
    debug('beforeMount')
  },
  beforeDestroy: function () {
    debug('beforeDestroy')
  },
  destroyed: function () {
    debug('destroyed')
  }
}
