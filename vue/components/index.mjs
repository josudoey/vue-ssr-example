import './debug.mjs'
export default {
  template: `<div>
  this index page server time: {{now}}
  <br />
  <router-link :to="{name:'hello2',params:{id:now}}">hello2</router-link>
  <router-link :to="{name:'hello3',params:{id:now}}">hello3</router-link>
</div>`,
  data: function () {
    return {
      now: Date.now()
    }
  },
  beforeCreate: function () {
    console.log('index: beforeCreate')
  },
  created: function () {
    console.log('index: created')
  },
  beforeMount: function () {
    console.log('index: eforeMount')
  },
  mounted: function () {
    console.log('index: mounted')
  },
  beforeDestroy: function () {
    console.log('index: beforeDestroy')
  },
  destroyed: function () {
    console.log('index: destroyed')
  }
}
