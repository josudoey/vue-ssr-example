import './style.css'
import template from './template.pug'
import sidenav from './sidenav/index.mjs'
import * as auth from './auth/store.mjs'
import createDebug from 'debug'
const debug = createDebug('app:layout')
export default {
  template,
  provide () {
    debug('provide')
    auth.register(this.$store)
    return {
      ...auth.mapActions({
        authSignIn: 'signIn'
      }),
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
      this.$refs.sidenav.close()
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
    debug('serverPrefetch (server side only)')

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
