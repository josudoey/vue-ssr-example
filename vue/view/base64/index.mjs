import template from './template.pug'
import * as base64Store from './store.mjs'
export default {
  template: template,
  computed: {
    ...base64Store.mapState([
      'text',
      'result'
    ])
  },
  data: function () {
    const { $route } = this
    const name = $route.name
    console.log(`${name}: data`)
    return {
      input: $route.query.v
    }
  },
  metaInfo: function () {
    return {
      script: [{
        innerHTML: 'console.log("base64: meta info script");',
        type: 'text/javascript'
      }]
    }
  },
  beforeRouteEnter: function (to, from, next) {
    console.log(`${to.name}: beforeRouteEnter`)
    next(function (vm) {
      console.log(`${vm.$route.name}: beforeRouteEnter next`)
    })
  },
  beforeRouteUpdate (to, from, next) {
    console.log(`${to.name}: beforeRouteUpdate`)
    next()
  },
  beforeRouteLeave (to, from, next) {
    console.log(`${to.name}: beforeRouteLeave`)
    next()
  },
  methods: {
    ...base64Store.mapActions(['encode'])
  },
  watch: {
    $route: async function (val, old) {
      console.log(`${this.$route.name} watch.$route`)
      this.encode(this.input)
    },
    input: async function (val, old) {
      console.log(`${this.$route.name} watch.input val: ${val} old: ${old}`)
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
    console.log(`${this.$route.name}: beforeCreate`)
    base64Store.register(this.$store)
  },
  created: function () {
    console.log(`${this.$route.name}: created`)
  },
  beforeMount: function () {
    console.log(`${this.$route.name}: beforeMount`)
    if (this.text === this.input) {
      return
    }
    this.encode(this.input)
  },
  mounted: function () {
    console.log(`${this.$route.name}: mounted`)
  },
  beforeDestroy: function () {
    console.log(`${this.$route.name}: beforeDestroy`)
  },
  destroyed: function () {
    console.log(`${this.$route.name}: destroyed`)
  }
}
