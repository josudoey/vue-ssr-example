import Vuex from 'vuex'
import createDebug from 'debug'
const name = 'auth'
const mapActions = Vuex.mapActions.bind(null, name)
const mapState = Vuex.mapState.bind(null, name)
const mapMutations = Vuex.mapMutations.bind(null, name)
const mapGetters = Vuex.mapGetters.bind(null, name)
export { name, mapActions, mapState, mapMutations, mapGetters }
const debug = createDebug('app:outlet:auth')

export const state = () => ({
  uid: '',
  expire: 0
})

const store = {
  namespaced: true,
  state
}

export const actions = store.actions = {}
actions.getState = async function ({ commit, rootGetters }) {
  const res = await rootGetters.api({
    method: 'GET',
    url: '/_/auth/state'
  })
  if (!/^2/.exec(res.status)) {
    return
  }
  commit('setAuth', res.data || state())
  return res.data
}

actions.signIn = async function ({ commit, rootGetters }, { user, password }) {
  const res = await rootGetters.api({
    method: 'POST',
    url: '/_/auth',
    auth: {
      username: user,
      password: password
    }
  })
  if (!/^2/.exec(res.status)) {
    return
  }
  commit('setAuth', res.data || state())
  return res.data
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
  debug('register already:', $store.hasModule(name))
  if ($store.hasModule(name)) {
    return true
  }

  const preserveState = !!$store.state[name]
  $store.registerModule(name, store, {
    preserveState
  })
  return preserveState
}

// see https://ssr.vuejs.org/guide/data.html#store-code-splitting
export function unregister ($store) {
  debug('unregister')
  if (!$store.hasModule(name)) {
    return
  }
  $store.unregisterModule(name)
}
