import Vuex from 'vuex'
import createDebug from 'debug'
import LRU from 'lru-cache'
const name = 'base64'
const debug = createDebug('app:store:base64')
debug('import')

const module = {
  namespaced: true,
  state () {
    return {
      prefetched: false,
      text: '',
      result: ''
    }
  }
}

const cache = new LRU({
  max: 10
})

const getters = module.getters = {}
getters.cache = function () {
  return cache
}

const actions = module.actions = {}
actions.prefetch = async function ({ state, dispatch, commit, getters, rootGetters }, text) {
  if (state.prefetched) {
    return
  }
  await dispatch('encode', text)
  commit('setPrefetched', true)
}

actions.encode = async function ({ state, commit, getters, rootGetters }, text) {
  debug('encode')
  const cache = getters.cache
  let result = cache.get(text)
  if (result) {
    debug('cache', result)
    commit('setResult', result)
    return
  }

  const res = await rootGetters.rpc('encodeBase64', {
    query: {
      v: text
    }
  })
  if (res.status !== 200) {
    return
  }

  result = {
    text,
    result: res.data.result
  }

  cache.set(text, result)
  debug('result', result)
  if (text === state.text) {
    return
  }
  commit('setResult', result)
  return res.data
}

const mutations = module.mutations = {}

mutations.setPrefetched = function (state, {}) {
  debug('setPrefetched')
  state.prefetched = true
}

mutations.setResult = function (state, { text, result }) {
  debug('setResult')
  state.text = text
  state.result = result
}

export default module

export const { encode, prefetch } = Vuex.mapActions(name, ['encode', 'prefetch'])
export const { text, result } = Vuex.mapState(name, [
  'text',
  'result'
])

const STORE_REGISTER_COUNT = Symbol('store#registerCount#' + name)

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
