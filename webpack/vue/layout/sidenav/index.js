import './style.css'
export default {
  template: require('./template.pug'),
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
