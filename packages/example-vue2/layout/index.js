import './style.css'
import * as render from './render.pug'
import sidenav from './sidenav/index.js'
import { uid, signIn } from '../outlet/auth/store.js'
import createDebug from 'debug'
const debug = createDebug('app:layout')
export default {
  ...render,
  computed: {
    uid
  },
  components: {
    sidenav
  },
  watch: {
    $route: function () {
      this.$refs.sidenav.close()
    }
  },
  methods: {
    signIn,
    toggleSidenav () {
      this.$refs.sidenav.toggle()
    }
  },
  beforeCreate: function () {
    debug('beforeCreate')
  },
  data: function () {
    debug('data')
    return {
      auth: this.$store.state.auth
    }
  },
  provide () {
    debug('provide')
    return {
      authSignIn: this.signIn,
      auth: this.auth,
      toggleSidenav: this.toggleSidenav
    }
  },
  created: function () {
    debug('created')
  },
  metaInfo (vm) {
    debug('metaInfo')
    return {
      titleTemplate: '%s'
    }
  },
  // see https://ssr.vuejs.org/guide/data.html#logic-collocation-with-components
  // Server-side only
  // This will be called by the server renderer automatically
  async serverPrefetch () {
    debug('serverPrefetch (server side only)')

    // return the Promise from the action
    // so that the component waits before rendering
  },
  beforeMount: function () {
    debug('beforeMount')
  },
  mounted: function () {
    debug('mounted')
  },
  beforeDestroy: function () {
    debug('beforeDestroy')
  },
  destroyed: function () {
    debug('destroyed')
  }
}
