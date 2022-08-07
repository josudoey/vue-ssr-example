import Vuex from 'vuex'
import createDebug from 'debug'
const name = 'note'
const debug = createDebug('app:store:note')
debug('import')

export const { start, skip, total, limit, items, currentPage } = Vuex.mapState(name, [
  'currentPage',
  'start',
  'skip',
  'total',
  'limit',
  'items'
])

export const { prefetch, insert, update, list, remove } = Vuex.mapActions(name, [
  'prefetch',
  'insert',
  'update',
  'list',
  'remove'
])

export const { setListParams } = Vuex.mapMutations(name, [
  'setListParams'
])

export const state = () => ({
  prefetched: false,
  q: '',
  currentPage: 1,
  start: 0,
  skip: 0,
  limit: 5,
  total: 0,
  items: []
})

export const module = {
  namespaced: true,
  state
}

const actions = module.actions = {}
actions.prefetch = async function ({ state, dispatch, commit, rootGetters }, payload) {
  if (state.prefetched) {
    return
  }
  dispatch('list', payload)
  state.prefetched = true
}
actions.list = async function ({ commit, rootGetters }, payload) {
  debug('list')
  const { q, skip, limit } = payload

  commit('setListParams', {
    q,
    skip,
    limit
  })
  const res = await rootGetters.rpc('listNote', {
    query: {
      q,
      skip,
      limit
    }
  })
  if (res.status !== 200) {
    throw new Error('request failed')
  }

  commit('setList', res.data)
  return res.data
}

actions.insert = async function ({ rootGetters }, payload) {
  debug('insert')

  const res = await rootGetters.rpc('createNote', {
    data: payload
  })
  if (res.status !== 200) {
    throw new Error('request failed')
  }
  return res.data
}

actions.update = async function ({ rootGetters }, payload) {
  debug('update')
  const { id } = payload
  const res = await rootGetters.rpc('updateNote', {
    params: {
      id
    },
    data: payload
  })
  if (res.status !== 200) {
    throw new Error('request failed')
  }
  return res.data
}

actions.remove = async function ({ rootGetters }, payload) {
  debug('remove')
  const { id } = payload
  const res = await rootGetters.rpc('deleteNote', {
    params: { id }
  })
  if (!/^2/.exec(res.status)) {
    throw new Error('request failed')
  }
  return res.data
}

const mutations = module.mutations = {}

mutations.setList = function (state, { start, limit, total, items }) {
  debug('setList')
  const currentPage = (start / limit) + 1
  Object.assign(state, {
    start, limit, total, items, currentPage
  })
}

mutations.setListParams = function (state, { q, skip, limit }) {
  debug('setListParams')
  Object.assign(state, {
    q, skip, limit
  })
}

const STORE_REGISTER_COUNT = Symbol('store#registerCount#' + name)

// see https://ssr.vuejs.org/guide/data.html#store-code-splitting
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
