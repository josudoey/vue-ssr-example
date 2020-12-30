export default {
  beforeRouteEnter: function (to, from, next) {
    console.log(`mixin ${to.name}: beforeRouteEnter`)
    next(function (vm) {
      console.log(`mixin ${to.name}: beforeRouteEnter next`)
    })
  }
}
