import template from './template.html'
import createDebug from 'debug'
const debug = createDebug('app:sign-in')

export default {
  template,
  inject: ['auth', 'authSignIn'],
  data: function () {
    return {
      user: '',
      password: '',
      disableSignIn: false
    }
  },
  created: function () {
    debug(`${this.$route.name}: created`)
    this.redirect()
  },
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
