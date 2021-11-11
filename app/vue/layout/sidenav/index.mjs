import template from './template.pug'
import './style.css'

export default {
  template,
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
