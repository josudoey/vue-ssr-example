import Vuex from 'vuex'
import createDebug from 'debug'
const name = 'note'
const mapActions = Vuex.mapActions.bind(null, name)
const mapState = Vuex.mapState.bind(null, name)
const mapMutations = Vuex.mapMutations.bind(null, name)
const mapGetters = Vuex.mapGetters.bind(null, name)
const debug = createDebug('app:store:note')
debug('import')

const store = {
  namespaced: true,
  state: () => {
    return {
      q: '',
      start: 0,
      skip: 0,
      limit: 25,
      total: 0,
      items: []
    }
  }
}

const actions = store.actions = {}
actions.list = async function (ctx, payload) {
  debug('list')
  const { commit, rootGetters } = ctx
  const { q, skip, limit } = payload

  commit('setListParams', {
    q,
    skip,
    limit
  })
  const res = await rootGetters.api({
    method: 'GET',
    url: '/_/note',
    params: {
      q: q,
      skip: skip,
      limit: limit
    }
  })
  if (res.status !== 200) {
    throw new Error('request failed')
  }

  commit('setList', res.data)
  return res.data
}

actions.insert = async function (ctx, payload) {
  debug('insert')
  const { rootGetters } = ctx

  const res = await rootGetters.api({
    method: 'POST',
    url: '/_/note',
    data: payload
  })
  if (res.status !== 200) {
    throw new Error('request failed')
  }
  return res.data
}

actions.update = async function (ctx, payload) {
  debug('update')
  const { rootGetters } = ctx
  const { id } = payload
  const res = await rootGetters.api({
    method: 'PUT',
    url: `/_/note/${id}`,
    data: payload
  })
  if (res.status !== 200) {
    throw new Error('request failed')
  }
  return res.data
}

actions.delete = async function (ctx, payload) {
  debug('delete')
  const { rootGetters } = ctx
  const { id } = payload
  const res = await rootGetters.api({
    method: 'DELETE',
    url: `/_/note/${id}`
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
    return
  }
  const opts = {}
  if ($store.state[name]) {
    opts.preserveState = true
  }
  $store.registerModule(name, store, opts)
}

// see https://ssr.vuejs.org/guide/data.html#store-code-splitting
export function unregister ($store) {
  debug('unregister')
  if (!$store.hasModule(name)) {
    return
  }
  $store.unregisterModule(name)
}
