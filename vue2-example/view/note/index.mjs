import * as storeModule from './store.mjs'
import * as render from './render.pug'
import createDebug from 'debug'
import { show as modalEditorShow } from './modal-editor/index.mjs'

const debug = createDebug('app:view:note')
export default {
  ...render,
  watch: {},
  computed: {
    ...storeModule.mapState([
      'start',
      'skip',
      'total',
      'limit',
      'items'
    ]),
    count () {
      return this.items.length
    }
  },
  methods: {
    ...storeModule.mapActions({
      list: 'list',
      delete: 'delete'
    }),
    ...storeModule.mapMutations({
      setListParams: 'setListParams'
    }),
    async fetch () {
      debug('fetch')
      const { keyword, skip, limit } = this
      await this.list({
        q: keyword,
        skip: skip,
        limit: limit
      })
      this.currentPage = parseInt(this.start / this.limit) + 1
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
    async remove (item) {
      try {
        await this.delete({ id: item.id })
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
          ...{
            q: keyword,
            skip,
            limit
          }
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
        skip: skip,
        limit: limit
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
  data () {
    return {
      keyword: '' || this.$route.query.q,
      currentPage: 1
    }
  },
  provide () {
    debug('provide')
  },
  async serverPrefetch (vm) {
    debug('serverPrefetch')
    storeModule.register(vm.$store)
    const { q, skip, limit } = vm.$route.query
    await vm.list({
      q: q || '',
      skip: parseInt(skip) || 0,
      limit: parseInt(limit) || 5
    })
    this.currentPage = parseInt(this.start / this.limit) + 1
  },
  async created () {
    debug('created')
  },
  beforeMount () {
    debug('beforeMount')
    const preserveState = storeModule.register(this.$store)
    if (preserveState) {
      return
    }
    this.fetch()
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
  destroyed: function () {
    debug(`${this.$route.name}: destroyed`)
    storeModule.unregister(this.$store)
  }
}
