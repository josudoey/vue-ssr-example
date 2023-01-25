import * as render from './render.pug'
import createDebug from 'debug'
import { show as modalEditorShow } from './modal-editor/index.js'
import {
  register, unregister,
  prefetch, start, skip, total, limit, items, currentPage,
  list, remove, setListParams
} from './store.js'
const debug = createDebug('app:view:note')
export default {
  ...render,
  data () {
    return {
      keyword: this.$route.query.q || ''
    }
  },
  provide () {
    debug('provide')
  },
  watch: {},
  computed: {
    currentPage,
    start,
    skip,
    total,
    limit,
    items,
    count () {
      return this.items.length
    }
  },
  methods: {
    prefetch,
    list,
    remove,
    setListParams,
    async fetch () {
      debug('fetch')
      const { keyword, skip, limit } = this
      await this.list({
        q: keyword,
        skip: parseInt(skip),
        limit: parseInt(limit)
      })
    },
    async showCreateModal () {
      debug('showCreateModal')
      const self = this
      const modal = modalEditorShow(this, {})
      modal.$on('ok', function () {
        self.fetch()
      })
    },
    async showUpdateModal (item) {
      debug('showUpdateModal')
      const self = this
      const modal = modalEditorShow(this, item)
      modal.$on('ok', function () {
        self.fetch()
      })
    },
    async handleRemove (item) {
      try {
        await this.remove({ id: item.id })
        this.$bvToast.toast(`已刪除 [${item.id}]`, {
          title: '刪除成功',
          autoHideDelay: 5000,
          appendToast: true
        })
      } catch (err) {
        this.$bvToast.toast(err.message, {
          title: '刪除失敗',
          autoHideDelay: 5000,
          appendToast: true
        })
      }

      this.fetch()
    },
    changeRoute: function () {
      const {
        $route, $router,
        keyword, skip, limit
      } = this
      const { name, params, query } = $route
      const to = {
        name,
        params,
        query: {
          ...query,
          q: keyword,
          skip,
          limit
        }
      }

      if ($router.resolve(to).href === $router.resolve($route).href) {
        return
      }
      this.$router.push(to)
    },
    changePage: function (page) {
      const { keyword, limit } = this
      const skip = limit * (page - 1)
      this.setListParams({
        q: keyword,
        skip,
        limit
      })
      this.changeRoute()
    }
  },
  async beforeRouteEnter (to, from, next) {
    debug('beforeRouteEnter')
    next(async function (vm) {
      debug('beforeRouteEnter done')
    })
  },
  beforeCreate () {
    debug('beforeCreate')
    register(this.$store)
  },
  async created () {
    debug('created')
  },
  async serverPrefetch (vm) {
    debug('serverPrefetch')
    const { keyword, skip, limit } = this
    await this.prefetch({
      q: keyword,
      skip,
      limit
    })
  },
  async beforeMount () {
    debug('beforeMount')
    const { keyword, skip, limit } = this
    await this.prefetch({
      q: keyword,
      skip,
      limit
    })
  },
  mounted () {
    debug('mounted')
  },
  async beforeRouteUpdate (to, from, next) {
    debug('beforeRouteUpdate')
    await this.fetch()
    next(async function (vm) {
      debug('beforeRouteUpdate done')
    })
  },
  beforeDestroy () {
    debug(`${this.$route.name}: destroyed`)
    unregister(this.$store)
  }
}
