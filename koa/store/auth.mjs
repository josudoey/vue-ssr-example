import Vuex from 'vuex'
import basicAuth from 'basic-auth'

import createDebug from 'debug'
const name = 'auth'
const mapActions = Vuex.mapActions.bind(null, name)
const mapState = Vuex.mapState.bind(null, name)
const mapMutations = Vuex.mapMutations.bind(null, name)
const mapGetters = Vuex.mapGetters.bind(null, name)
export { name, mapActions, mapState, mapMutations, mapGetters }
const debug = createDebug('app:koa:store:auth')

export const state = () => ({
  uid: '',
  expire: 0
})

export const store = {
  namespaced: true,
  state
}

export const actions = store.actions = {}
actions.signIn = async function ({ commit, rootGetters }) {
  const ctx = rootGetters.context
  const credentials = basicAuth(ctx.req)
  if (!credentials) {
    return
  }
  const auth = ctx.session.auth = {
    uid: credentials.name,
    expire: ctx.session._expire
  }
  return auth
}

actions.revoke = async function ({ commit, rootGetters }) {
  const ctx = rootGetters.context
  // see https://github.com/koajs/session#destroying-a-session
  ctx.session = null
}
const mutations = store.mutations = {}
mutations.setAuth = function (state, payload) {
  debug('setAuth', payload)
  Object.assign(state, payload)
}

store.getters = {

}

export default store
// see https://ssr.vuejs.org/guide/data.html#store-code-splitting
export function register ($store) {
  debug('register')
  if ($store.hasModule(name)) {
    return
  }
  const opts = {
    preserveState: true
  }
  if (!$store.state[name]) {
    $store.state[name] = store.state()
  }
  $store.registerModule(name, store, opts)
  debug('register done')
}

// see https://ssr.vuejs.org/guide/data.html#store-code-splitting
export function unregister ($store) {
  debug('unregister')
  if (!$store.hasModule(name)) {
    return
  }
  $store.unregisterModule(name)
}
