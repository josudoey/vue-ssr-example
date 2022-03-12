import { defineStore } from 'pinia'

const delay = function (ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export const useHomeStore = defineStore('home', {
  state: () => ({
    time: Date.now()
  }),
  actions: {
    async refresh () {
      await delay(100)
      this.time = Date.now()
    }
  }
})
