import Vue from 'vue'
import template from './template.pug'
import './style.css'
const state = Vue.observable({
  show: false
})
export { state }

export function toggle () {
  state.show = !state.show
}
export function close () {
  state.show = false
}

export function open () {
  state.show = false
}

export default {
  template,
  data () {
    return state
  },
  methods: {
    toggle,
    close
  }
}
