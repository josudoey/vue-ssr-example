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
  metaInfo: function () {
    return {
      script: [{
        innerHTML: 'console.log("base64: metaInfo script innerHTML");',
        type: 'text/javascript'
      }]
    }
  },
  beforeRouteEnter: function (to, from, next) {
    debug(`${to.name}: beforeRouteEnter`)
    next(function (vm) {
      debug(`${vm.$route.name}: beforeRouteEnter next`)
    })
  },
  beforeRouteUpdate (to, from, next) {
    debug(`${to.name}: beforeRouteUpdate`)
    next()
  },
  beforeRouteLeave (to, from, next) {
    debug(`${to.name}: beforeRouteLeave`)
    next()
  },
  methods: {
    ...base64Store.mapActions(['encode'])
  },
  watch: {
    $route: async function (val, old) {
      debug(`${this.$route.name} watch.$route`)
      this.encode(this.input)
    },
    input: async function (val, old) {
      debug(`${this.$route.name} watch.input val: ${val} old: ${old}`)
      const $route = this.$route
      if ($route.query.v === this.input) {
        return
      }
      await this.$router.push({
        query: {
          v: val
        }
      })
    }
  },
  beforeCreate: function () {
    debug(`${this.$route.name}: beforeCreate`)
    base64Store.register(this.$store)
  },
  created: function () {
    debug(`${this.$route.name}: created`)
  },
  beforeMount: function () {
    debug(`${this.$route.name}: beforeMount`)
    if (this.text === this.input) {
      return
    }
    this.encode(this.input)
  },
  mounted: function () {
    debug(`${this.$route.name}: mounted`)
  },
  beforeDestroy: function () {
    debug(`${this.$route.name}: beforeDestroy`)
  },
  destroyed: function () {
    debug(`${this.$route.name}: destroyed`)
  }
}
