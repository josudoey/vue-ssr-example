import Vuex, { type Store, type Module, type ActionTree, type MutationTree } from 'vuex'
import createDebug from 'debug'
const name = 'auth'
const debug = createDebug('app:outlet:auth')

interface State {
  uid: string
  expire: number
}

export const state = (): State => ({
  uid: '',
  expire: 0
})

const module: Module<State, any> = {
  namespaced: true,
  state
}

export const { uid } = Vuex.mapState(name, ['uid'])
export const { getState, signIn } = Vuex.mapActions(name, ['signIn', 'getState'])

export const actions: ActionTree<State, any> = module.actions = {}
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

const mutations: MutationTree<State> = module.mutations = {}
mutations.setAuth = function (state, payload) {
  debug('setAuth', payload)
  Object.assign(state, payload)
}

module.getters = {}

export default module

// see https://ssr.vuejs.org/guide/data.html#store-code-splitting
const STORE_REGISTER_COUNT = Symbol('store#module#' + name)

// TODO: use Store<State>
export function register ($store: any): any {
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

// TODO: use Store<State>
export function unregister ($store: any): any {
  if (!$store.hasModule(name)) {
    return
  }
  $store[STORE_REGISTER_COUNT]--
  if ($store[STORE_REGISTER_COUNT] > 0) {
    return
  }
  return $store.unregisterModule(name, module)
}
