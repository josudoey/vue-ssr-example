export default {
  template: '<div id="app"><transition><router-view></router-view></transition></div>',
  data: function () {
    return {}
  },
  beforeCreate: function () {
    console.log('layout: beforeCreate')
  },
  created: function () {
    console.log('layout: created')
  },
  beforeMount: function () {
    console.log('layout: beforeMount')
  },
  mounted: function () {
    console.log('layout: mounted')
  },
  beforeDestroy: function () {
    console.log('layout: beforeDestroy')
  },
  destroyed: function () {
    console.log('layout: destroyed')
  }
}
