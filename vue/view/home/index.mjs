import * as css from './module.css'
import './style.css'
import template from './template.pug'
import createDebug from 'debug'
const debug = createDebug('app:view:home')
debug('home module loaded')
export default {
  template: template,
  data: function () {
    const now = Date.now()
    debug(`now ${now}`)
    return {
      text: 'server time',
      css: css,
      now: now
    }
  },
  beforeRouteEnter: function (to, from, next) {
    debug(`${to.name} beforeRouteEnter`)
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
    debug('home: beforeCreate')
  },
  created: function () {
    debug('home: created')
  },
  beforeMount: function () {
    debug('home: beforeMount')
    this.text = 'browser time'
  },
  mounted: function () {
    debug('home: mounted')
  },
  beforeDestroy: function () {
    debug('home: beforeDestroy')
  },
  destroyed: function () {
    debug('home: destroyed')
  }
}
