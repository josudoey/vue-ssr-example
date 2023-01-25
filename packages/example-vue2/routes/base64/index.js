import createDebug from 'debug'
import * as render from './render.pug'
import { text, result, prefetch, encode, register, unregister } from './store.js'
import { mixin } from './mixin.js'
const debug = createDebug('app:view:base64')

export default {
  ...render,
  watch: {
    async $route (val, old) {
      debug(`${this.$route.name} watch.$route`)
    },
    async input  (val, old) {
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
  computed: {
    text,
    result
  },
  methods: {
    encode, prefetch
  },
  mixins: [mixin],
  async beforeRouteResolve (to, from, next) {
    const { $store } = this
    debug(`beforeRouteResolve ${to.name}`)
    register($store)
    await prefetch.call(this, to.query.v)
    if (to.query.v === 'home') {
      next({ name: 'home' })
      unregister($store)
    }
  },
  async beforeRouteEnter (to, from, next) {
    debug(`beforeRouteEnter ${to.name}`)
    next(function (vm) {
      debug(`beforeRouteEnter next ${vm.$route.name}`)
    })
  },
  beforeCreate () {
    debug(`beforeCreate ${this.$route.name}`)
    const { $store } = this
    register($store)
    this.$on('hook:destroyed', function () {
      unregister($store)
    })
  },
  // see https://ssr.vuejs.org/guide/data.html#logic-collocation-with-components
  // Server-side only
  // This will be called by the server renderer automatically
  async serverPrefetch (vm) {
    debug('serverPrefetch')

    // return the Promise from the action
    // so that the component waits before rendering
  },
  data () {
    const { $route } = this
    const name = $route.name
    debug(`data ${name}`)

    return {
      input: $route.query.v
    }
  },
  provide () {
    debug(`provide ${this.$route.name}`)
  },
  async created () {
    debug(`created ${this.$route.name}`)
  },
  metaInfo () {
    debug(`metaInfo ${this.$route.name}`)
    return {
      __dangerouslyDisableSanitizersByTagID: {
        base64MetaInfo: ['innerHTML']
      },
      title: 'Base64 編碼',
      script: [{
        vmid: 'base64MetaInfo',
        innerHTML: `console.log("base64 metaInfo script innerHTML ${this.$route.name}");`,
        type: 'text/javascript'
      }]
    }
  },
  beforeMount () {
    debug(`beforeMount ${this.$route.name}`)
  },
  mounted () {
    debug(`mounted ${this.$route.name}`)
  },
  async beforeRouteUpdate (to, from, next) {
    debug(`beforeRouteUpdate ${to.name} `)
    const { query } = to
    const { v } = query
    Object.assign(this, { input: v })
    await this.encode(v)
    next()
  },
  beforeRouteLeave (to, from, next) {
    debug(`beforeRouteLeave ${to.name}`)
    unregister(this.$store)
    next()
  },
  beforeDestroy () {
    debug(`beforeDestroy ${this.$route.name}`)
  },
  destroyed () {
    debug(`destroyed ${this.$route.name}`)
  }
}
