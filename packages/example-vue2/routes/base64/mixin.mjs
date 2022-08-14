import createDebug from 'debug'
const debug = createDebug('app:view:base64:mixin')

export const mixin = {
  async beforeRouteEnter (to, from, next) {
    debug(`beforeRouteEnter ${to.name}`)
    next(function (vm) {
      debug(`beforeRouteEnter next ${vm.$route.name}`)
    })
  },
  beforeCreate () {
    debug(`beforeCreate ${this.$route.name}`)
  },
  async serverPrefetch (vm) {
    debug('serverPrefetch')
  },
  async beforeRouteLeave (to, from, next) {
    debug(`beforeRouteLeave ${to.name}`)
    next()
  }
}
