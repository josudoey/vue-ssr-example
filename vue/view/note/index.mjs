import * as storeModule from './store.mjs'
import { render, staticRenderFns } from './render.pug'
import createDebug from 'debug'
import { show as modalEditorShow } from './modal-editor/index.mjs'

const debug = createDebug('app:view:note')
export default {
  render,
  staticRenderFns,
  watch: {},
  data () {
    return {
      keyword: '',
      currentPage: 1
    }
  },
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
  provide () {
    debug('provide')
    storeModule.register(this.$store)
    return {
      note: this.$store.note
    }
  },
  destroyed: function () {
    debug(`${this.$route.name}: destroyed`)
    storeModule.unregister(this.$store)
  },
  async created () {
    debug('created')
    const { q, skip, limit } = this.$route.query
    this.keyword = q
    this.setListParams({
      q: q || '',
      skip: parseInt(skip) || 0,
      limit: parseInt(limit) || 5
    })
  },
  mounted () {
    debug('mounted')
    this.fetch()
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
      this.fetch()

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

  }
}
