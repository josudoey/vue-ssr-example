import createDebug from 'debug'
const debug = createDebug('app:koa:store:auth')

export const state = () => ({
  uid: '',
  expire: 0
})

export const store = {
  namespaced: true,
  state
}

export default store
