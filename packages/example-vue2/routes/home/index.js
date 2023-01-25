import * as css from './module.css'
import './style.css'
import * as render from './render.pug'
import createDebug from 'debug'
import { io as SocketIo } from 'socket.io-client'

const debug = createDebug('app:view:home')
debug('home module loaded')
export default {
  ...render,
  // see https://vuejs.org/v2/api/#provide-inject
  inject: ['auth', 'toggleSidenav'],
  data: function () {
    const now = Date.now()
    debug(`now ${now}`)
    return {
      socket: null,
      text: 'server time',
      css,
      now
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
    debug('beforeCreate')
  },
  created: function () {
    debug('created')
  },
  beforeMount: function () {
    debug('home: beforeMount')
    this.text = 'browser time'
  },
  mounted: function () {
    debug('mounted')
    const namespace = '/'
    const socket = this.socket = new SocketIo(namespace, {})

    const self = this
    socket.on('connect', () => {
      socket.on('now', function (now) {
        self.now = now
      })
    })

    // see https://socket.io/docs/v4/client-socket-instance/#events
    socket.on('connect_error', (err) => {
      console.log(err) // err
    })

    socket.on('disconnect', () => {
      console.log('socket disconnect')
    })
  },
  beforeDestroy: function () {
    debug('beforeDestroy')
  },
  destroyed: function () {
    this.socket.disconnect()
    debug('destroyed')
  }
}
