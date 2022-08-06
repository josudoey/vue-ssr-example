import Vuex from 'vuex'
import createDebug from 'debug'
const name = 'note'
const mapActions = Vuex.mapActions.bind(null, name)
const mapState = Vuex.mapState.bind(null, name)
const mapMutations = Vuex.mapMutations.bind(null, name)
const mapGetters = Vuex.mapGetters.bind(null, name)
const debug = createDebug('app:store:note')
debug('import')

export const state = () => ({
  q: '',
  start: 0,
  skip: 0,
  limit: 25,
  total: 0,
  items: []
})

export const store = {
  namespaced: true,
  state
}

const actions = store.actions = {}
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

  const res = await rootGetters.fetcher.createNote({
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

actions.delete = async function ({ rootGetters }, payload) {
  debug('delete')
  const { id } = payload
  const res = await rootGetters.rpc('deleteNote', {
    params: { id }
  })
  if (!/^2/.exec(res.status)) {
    throw new Error('request failed')
  }
  return res.data
}

const mutations = store.mutations = {}

mutations.setList = function (state, { start, limit, total, items }) {
  debug('setList')
  Object.assign(state, {
    start, limit, total, items
  })
}

mutations.setListParams = function (state, { q, skip, limit }) {
  debug('setListParams')
  Object.assign(state, {
    q, skip, limit
  })
}

export default store
export { name, mapActions, mapState, mapMutations, mapGetters }
export { actions }
export function register ($store) {
  debug('register')
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
