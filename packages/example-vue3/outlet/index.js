import * as render from './render.pug'
const outlet = {
  ...render,
  inject: ['store'],
  methods: {
    getStore () {
      return this.store
    }
  }
}

export default outlet
