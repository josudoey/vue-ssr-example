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

const module = {
  namespaced: true,
  state
}

export const actions = module.actions = {}
actions.getState = async function ({ commit, rootGetters }) {
  const res = await rootGetters.rpc('getAuthState')
  if (!/^2/.exec(res.status)) {
    return
  }
  commit('setAuth', res.data || state())
  return res.data
}

actions.signIn = async function ({ commit, rootGetters }, { user, password }) {
  const res = await rootGetters.rpc('signIn').config({
    auth: {
      username: user,
      password
    }
  })
  if (!/^2/.exec(res.status)) {
    return
  }
  commit('setAuth', res.data || state())
  return res.data
}

const mutations = module.mutations = {}
mutations.setAuth = function (state, payload) {
  debug('setAuth', payload)
  Object.assign(state, payload)
}

module.getters = {}

export default module
// see https://ssr.vuejs.org/guide/data.html#store-code-splitting
const STORE_REGISTER_COUNT = Symbol('store#module#' + name)

// see https://ssr.vuejs.org/guide/data.html#store-code-splitting
export function register ($store) {
  if ($store.hasModule(name)) {
    $store[STORE_REGISTER_COUNT]++
    return true
  }
  $store[STORE_REGISTER_COUNT] = 0
  const preserveState = !!$store.state[name]
  $store.registerModule(name, module, {
    preserveState
  })
  return preserveState
}

export function unregister ($store) {
  if (!$store.hasModule(name)) {
    return
  }
  $store[STORE_REGISTER_COUNT]--
  if ($store[STORE_REGISTER_COUNT] > 0) {
    return
  }
  return $store.unregisterModule(name, module)
}
