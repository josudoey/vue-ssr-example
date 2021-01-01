import axios from 'axios'
import Vuex from 'vuex'
const name = 'auth'
const mapActions = Vuex.mapActions.bind(null, name)
const mapState = Vuex.mapState.bind(null, name)
const mapMutations = Vuex.mapMutations.bind(null, name)
const mapGetters = Vuex.mapGetters.bind(null, name)
export { name, mapActions, mapState, mapMutations, mapGetters }

const store = {
  namespaced: true,
  state: () => ({
    uid: '',
    expire: 0
  })
}

const actions = store.actions = {}
actions.signIn = async function ({ commit }, { user, password }) {
  const res = await axios.post('/_/auth', {}, {
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
export function register ($store) {
  if ($store.hasModule(name)) {
    return
  }
  console.log('auth: registerModule')
  $store.state[name] = Object.assign({}, store.state(), $store.state[name])
  $store.registerModule(name, store, {
    preserveState: true
  })
  console.log($store.state.auth)
}
