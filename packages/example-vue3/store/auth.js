import Vuex from 'vuex'
import createDebug from 'debug'
const name = 'auth'
const debug = createDebug('app:store:auth')

export const state = () => ({
  uid: '',
  expire: 0
})

const module = {
  namespaced: true,
  state
}

export const { uid } = Vuex.mapState(name, ['uid'])
export const { getState, signIn } = Vuex.mapActions(name, ['signIn', 'getState'])

export const actions = module.actions = {}
actions.getState = async function ({ commit, rootGetters }) {
  const res = await rootGetters.rpc('getAuthState')
  if (!/^2/.exec(res.status)) {
    return
  }
  const auth = res.data || state()
  commit('setAuth', auth)
  return auth
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

export function register ($store) {
  if ($store.hasModule(name)) {
    $store[STORE_REGISTER_COUNT]++
    return true
  }
  $store[STORE_REGISTER_COUNT] = 1
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
