import 'flatpickr/dist/flatpickr.css'
import flatPickr from 'vue-flatpickr-component'
import { cloneDeep } from 'lodash'

import {
  register, unregister,
  insert, update
} from '../store.js'
import * as render from './render.pug'
import createDebug from 'debug'
import { MandarinTraditional as zhTW } from 'flatpickr/dist/l10n/zh-tw.js'
const debug = createDebug('app:view:note:modal-create')

const options = {
  ...render,
  components: {
    flatPickr
  },
  data () {
    return {
      config: {
        wrap: true, // set wrap to true only when using 'input-group'
        // altFormat: 'M j, Y',
        // altInput: true,
        dateFormat: 'Y-m-d',
        locale: zhTW // locale for this instance only
      },
      date: '',
      id: '',
      text: ''
    }
  },
  computed: {
    actionName () {
      return this.id ? '更新' : '新增'
    }
  },
  beforeCreate () { },
  created () {
    debug('created')
  },
  mounted () {
    const { $store } = this
    register($store)
    this.$on('hook:destroyed', function () {
      unregister($store)
    })
  },
  beforeDestroy: function () {
    debug('beforeDestroy')
  },
  destroyed () {
    debug('destroyed')
  },
  methods: {
    insert,
    update,
    async save () {
      if (!this.id) {
        return this.insert({
          date: this.date,
          text: this.text
        })
      }

      return this.update({
        id: this.id,
        date: this.date,
        text: this.text
      })
    },
    async ok (bvModalEvt) {
      bvModalEvt.preventDefault()

      try {
        const newData = await this.save()

        this.$parent.$bvToast.toast(`已${this.actionName} [${newData.id}]`, {
          title: `${this.actionName}成功`,
          autoHideDelay: 3000,
          appendToast: true
        })
      } catch (err) {
        this.$parent.$bvToast.toast(err.message, {
          title: `${this.actionName}失敗`,
          autoHideDelay: 3000,
          appendToast: true
        })
      }
      this.$refs.modal.hide()
      this.$emit('ok', bvModalEvt, this)
    },
    onShown () {

    },
    onHidden () {
      this.$destroy()
    }
  }
}

export function show ($parent, $data) {
  // ref see https://github.com/bootstrap-vue/bootstrap-vue/blob/1d59417df6869e2b04c651f6caeed9474cf14a84/src/components/toast/helpers/bv-toast.js#L112-L140
  const Vue = $parent.$root.constructor
  const Modal = Vue.extend(options)
  const vm = new Modal({
    parent: $parent
  })

  Object.assign(vm, cloneDeep($data))
  const div = document.createElement('div')
  document.body.appendChild(div)
  vm.$mount(div)
  vm.$on('hook:destroyed', function () {
    vm.$el.remove()
  })
  vm.$refs.modal.show()
  return vm
}

export default options
