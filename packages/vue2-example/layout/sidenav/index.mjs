import * as render from './render.pug'
import './style.css'

export default {
  ...render,
  data () {
    return {
      show: false
    }
  },
  methods: {
    toggle () {
      this.show = !this.show
    },
    open () {
      this.show = true
    },
    close () {
      this.show = false
    }
  }
}
