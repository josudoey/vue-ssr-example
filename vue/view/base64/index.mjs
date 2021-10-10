import createDebug from 'debug'
import { render, staticRenderFns } from './render.pug'
import * as base64Store from './store.mjs'
const debug = createDebug('app:view:base64')
export default {
  render,
  staticRenderFns,
  computed: {
    ...base64Store.mapState([
      'text',
      'result'
    ])
  },
  data: function () {
    const { $route } = this
    const name = $route.name
    debug(`${name}: data`)
    return {
      input: $route.query.v
    }
  },
  watch: {
    $route: async function (val, old) {
      debug(`${this.$route.name} watch.$route`)
    },
    input: async function (val, old) {
      debug(`${this.$route.name} watch.input val: ${val} old: ${old}`)
      const $route = this.$route
      if ($route.query.v === val) {
        return
      }
      await this.$router.push({
        query: {
          v: val
        }
      })
    }
  },
  methods: {
    ...base64Store.mapActions(['encode'])
  },
  beforeRouteEnter (to, from, next) {
    debug(`beforeRouteEnter ${to.name}: `)
    next(function (vm) {
      debug(`beforeRouteEnter next ${vm.$route.name}`)
    })
  },
  provide () {
    debug('provide')
    base64Store.register(this.$store)
  },
  metaInfo: function () {
    debug('metaInfo')
    return {
      script: [{
        innerHTML: 'console.log("base64: metaInfo script innerHTML");',
        type: 'text/javascript'
      }]
    }
  },
  // see https://ssr.vuejs.org/guide/data.html#logic-collocation-with-components
  // Server-side only
  // This will be called by the server renderer automatically
  async serverPrefetch (vm) {
    debug('serverPrefetch')

    // return the Promise from the action
    // so that the component waits before rendering
    return this.encode(this.input)
  },
  beforeCreate: function () {
    debug(`beforeCreate ${this.$route.name}`)
  },
  created: function () {
    debug(`created ${this.$route.name}`)
  },
  beforeMount () {
    debug(`beforeMount ${this.$route.name}`)
    this.encode(this.input)
  },
  mounted: function () {
    debug(`${this.$route.name}: mounted`)
  },
  beforeRouteUpdate (to, from, next) {
    debug(`${to.name} beforeRouteUpdate`)
    this.encode(this.input)
    next()
  },
  beforeRouteLeave (to, from, next) {
    debug(`beforeRouteLeave ${to.name}`)
    next()
  },
  beforeDestroy: function () {
    debug(`beforeDestroy ${this.$route.name}`)
  },
  destroyed: function () {
    debug(`destroyed ${this.$route.name}`)
    base64Store.unregister(this.$store)
  }
}
