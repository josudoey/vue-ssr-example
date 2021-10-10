import Vuex from 'vuex'
import createDebug from 'debug'
const name = 'base64'
const mapActions = Vuex.mapActions.bind(null, name)
const mapState = Vuex.mapState.bind(null, name)
const mapMutations = Vuex.mapMutations.bind(null, name)
const mapGetters = Vuex.mapGetters.bind(null, name)
const debug = createDebug('app:store:base64')
debug('import')

const store = {
  namespaced: true,
  state: () => {
    return {
      text: '',
      result: ''
    }
  }
}

const actions = store.actions = {}
actions.encode = async function ({ state, commit, rootGetters }, text) {
  debug('encode')
  let result = rootGetters.cache.get(text)
  if (result) {
    debug('cache', result)
    commit('setResult', result)
    return
  }

  const res = await rootGetters.api({
    method: 'GET',
    url: '/_/base64',
    params: {
      v: text
    }
  })
  if (res.status !== 200) {
    return
  }

  result = {
    text: text,
    result: res.data.result
  }

  rootGetters.cache.set(text, result)
  debug('result', result)
  if (text === state.text) {
    return
  }
  commit('setResult', result)
  return res.data
}

const mutations = store.mutations = {}

mutations.setResult = function (state, { text, result }) {
  debug('setResult')
  state.text = text
  state.result = result
}

export default store
export { name, mapActions, mapState, mapMutations, mapGetters }
export { actions }
export function register ($store) {
  debug('register')
  if ($store.hasModule(name)) {
    return
  }
  $store.registerModule(name, store, {
    preserveState: !!$store.state[name]
  })
}

// see https://ssr.vuejs.org/guide/data.html#store-code-splitting
export function unregister ($store) {
  debug('unregister')
  if (!$store.hasModule(name)) {
    return
  }
  $store.unregisterModule(name)
}
