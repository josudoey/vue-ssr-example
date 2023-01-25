import * as render from './render.pug'
import createDebug from 'debug'
import { io as SocketIo } from 'socket.io-client'
const debug = createDebug('app:sign-in')

export default {
  ...render,
  inject: ['auth', 'authSignIn'],
  data: function () {
    return {
      socket: null,
      user: '',
      password: '',
      disableSignIn: false
    }
  },
  beforeMount () {
    debug('beforeMount')
    this.redirect()
  },
  mounted () {
    const namespace = '/'
    const socket = this.socket = new SocketIo(namespace, {
      query: {}
    })

    socket.on('connect', () => {
      console.log(socket.id) // x8WIv7-mJelg7on_ALbx
    })

    // see https://socket.io/docs/v4/client-socket-instance/#events
    socket.on('connect_error', (err) => {
      console.log(err) // err
    })

    socket.on('disconnect', () => {
      console.log('socket disconnect') // disconnect
    })

    this.$on('hook:destroyed', function () {
      socket.disconnect()
    })
  },
  destroyed: function () {},
  methods: {
    redirect: function () {
      if (!this.auth.uid) {
        return
      }

      if (this.$route.query.redirect) {
        this.$router.push(this.$route.query.redirect)
        return
      }

      this.$router.push({ name: 'home' })
    },
    signIn: async function () {
      this.disableSignIn = true
      await this.authSignIn({
        user: this.user,
        password: this.password
      })
      this.disableSignIn = false
      this.redirect()
    }
  }
}
