import template from './template.pug'
import './style.css'
export default {
  template,
  data: function () {
    return {
      show: false
    }
  },
  methods: {
    toggle: function () {
      this.show = !this.show
    },
    close: function () {
      this.show = false
    }
  }
}
