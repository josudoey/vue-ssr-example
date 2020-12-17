import * as style from './style.css'
import template from './template.pug'
console.log('home')
export default {
  template: template,
  data: function () {
    console.log('red', style.red)
    return {
      style: style,
      now: Date.now()
    }
  },
  metaInfo () {
    return {
      title: 'home'
    }
  },
  methods: {
    makeToast (append = false) {
      this.toastCount++
      this.$bvToast.toast(`This is toast number ${this.toastCount}`, {
        title: 'BootstrapVue Toast',
        autoHideDelay: 5000,
        appendToast: append
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
