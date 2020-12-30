import * as style from './module.css'
import template from './template.pug'
console.log('home')
export default {
  template: template,
  data: function () {
    return {
      style: style,
      text: 'server time',
      now: Date.now()
    }
  },
  beforeRouteEnter: function (to, from, next) {
    console.log(`${to.name} beforeRouteEnter`)
    next()
  },
  methods: {
    makeToast () {
      this.$bvToast.toast('make toast', {
        title: 'BootstrapVue Toast',
        autoHideDelay: 5000,
        appendToast: true
      })
    }
  },
  beforeCreate: function () {
    console.log('home: beforeCreate')
  },
  created: function () {
    console.log('home: created')
  },
  beforeMount: function () {
    console.log('home: beforeMount')
    this.text = 'client time'
  },
  mounted: function () {
    console.log('home: mounted')
  },
  beforeDestroy: function () {
    console.log('home: beforeDestroy')
  },
  destroyed: function () {
    console.log('home: destroyed')
  }
}
