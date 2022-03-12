import * as render from './render.pug'
import * as css from './style.css'
import { useHomeStore } from './store.mjs'
import { storeToRefs, mapActions } from 'pinia'

export default {
  ...render,
  setup () { },
  data () {
    const homeStore = useHomeStore()
    const { time } = storeToRefs(homeStore)

    return {
      homeStore,
      time,
      css: css,
      msg: ''
    }
  },
  mounted () {
  },
  methods: {
    ...mapActions(useHomeStore, { refreshTime: 'refresh' }),
    async refresh () {
      await this.refreshTime()
      const { time } = this
      this.msg = `time: ${time}`
    }
  }
}
