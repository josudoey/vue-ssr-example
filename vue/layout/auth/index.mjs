import Vuex from 'vuex'
const name = 'auth'
const mapActions = Vuex.mapActions.bind(null, name)
const mapState = Vuex.mapState.bind(null, name)
const mapMutations = Vuex.mapMutations.bind(null, name)
const mapGetters = Vuex.mapGetters.bind(null, name)
export { name, mapActions, mapState, mapMutations, mapGetters }
export { unregister } from './store.mjs'
