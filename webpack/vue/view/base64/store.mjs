import axios from 'axios'
import Vuex from 'vuex'
const name = 'base64'
const mapActions = Vuex.mapActions.bind(null, name)
const mapState = Vuex.mapState.bind(null, name)
const mapMutations = Vuex.mapMutations.bind(null, name)
const mapGetters = Vuex.mapGetters.bind(null, name)
export { name, mapActions, mapState, mapMutations, mapGetters }

const store = {
  namespaced: true,
  state: () => ({
    cache: {},
    text: '',
    result: ''
  })
}

const actions = store.actions = {}
actions.encode = async function ({ state, commit, rootState }, text) {
  let encoded = state.cache[text]
  if (encoded) {
    commit('setResult', encoded)
    return
  }

  const res = await axios({
    method: 'GET',
    url: '/api/base64',
    params: {
      v: text
    }
  })
  if (res.status !== 200) {
    return
  }

  encoded = {
    text: text,
    result: res.data.result
  }
  commit('setCache', encoded)
  if (text === state.text) {
    return
  }
  commit('setResult', encoded)
  return res.data
}
const mutations = store.mutations = {}
mutations.setCache = function (state, { text, result }) {
  state.cache[text] = {
    text: text,
    result: result
  }
}

mutations.setResult = function (state, { text, result }) {
  state.text = text
  state.result = result
}

store.getters = {

}

export default store
export function register ($store) {
  if ($store.hasModule(name)) {
    return
  }
  const serverState = Object.assign({}, store.state(), $store.state[name])
  delete $store.state[name]
  $store.registerModule(name, store)
  $store._modules.get([name]).context.commit('setResult', serverState)
}
