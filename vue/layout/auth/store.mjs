import Vuex from 'vuex'
import createDebug from 'debug'
const name = 'auth'
const mapActions = Vuex.mapActions.bind(null, name)
const mapState = Vuex.mapState.bind(null, name)
const mapMutations = Vuex.mapMutations.bind(null, name)
const mapGetters = Vuex.mapGetters.bind(null, name)
export { name, mapActions, mapState, mapMutations, mapGetters }
const debug = createDebug('app:store:auth')

export const state = () => ({
  uid: '',
  expire: 0
})

const store = {
  namespaced: true,
  state
}

export const actions = store.actions = {}
actions.signIn = async function ({ commit, rootGetters }, { user, password }) {
  const res = await rootGetters.api({
    method: 'POST',
    url: '/_/auth',
    auth: {
      username: user,
      password: password
    }
  })
  if (res.status !== 200) {
    return
  }
  commit('setAuth', res.data)
  return res.data
}
const mutations = store.mutations = {}
mutations.setAuth = function (state, payload) {
  Object.assign(state, payload)
}

store.getters = {

}

export default store
// see https://ssr.vuejs.org/guide/data.html#store-code-splitting
export function register ($store) {
  debug('register', $store.hasModule(name))
  if (!$store.state[name]) {
    $store.state[name] = store.state()
  }

  if ($store.hasModule(name)) {
    return
  }

  $store.registerModule(name, store, {
    preserveState: true
  })
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
