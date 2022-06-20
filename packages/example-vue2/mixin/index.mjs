import createDebug from 'debug'
const debug = createDebug('app:mixin')
export default {
  metaInfo (vm) {
    // debug(`metaInfo ${vm.$options.name} ${vm._uid}`)
    return {
      titleTemplate: '%s'
    }
  },
  beforeRouteEnter: function (to, from, next) {
    debug(`beforeRouteEnter ${from.name} -> ${to.name}`)
    next(function (vm) {
      debug(`beforeRouteEnter next ${to.name} ${vm.$options.name} ${vm._uid}`)
    })
  }
}
