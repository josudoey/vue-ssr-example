import createDebug from 'debug'
const debug = createDebug('app:mixin')
export default {
  beforeRouteEnter: function (to, from, next) {
    debug(`${to.name}: beforeRouteEnter`)
    next(function (vm) {
      debug(`mixin ${to.name}: beforeRouteEnter next`)
    })
  }
}
