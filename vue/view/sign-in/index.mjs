import template from './template.html'
import * as auth from '../../store/auth/index.mjs'
import createDebug from 'debug'
const debug = createDebug('app:sign-in')

export default {
  template,
  data: function () {
    return {
      user: '',
      password: '',
      disableSignIn: false
    }
  },
  computed: {
    ...auth.mapState([
      'uid'
    ])
  },
  created: function () {
    debug(`${this.$route.name}: created`)
    this.redirect()
  },
  methods: {
    ...auth.mapActions({
      authSignIn: 'signIn'
    }),
    redirect: function () {
      if (!this.uid) {
        return
      }

      if (this.$route.query.redirect) {
        this.$router.push({
          path: this.$route.query.redirect
        })
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
