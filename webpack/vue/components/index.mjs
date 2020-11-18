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
      name: 'hello',
      now: Date.now(),
      url: 'world'
    }
  },
  beforeCreate: function () {
    console.log('beforeCreate')
  },
  created: function () {
    console.log('created')
  },
  beforeMount: function () {
    console.log('beforeMount')
  },
  mounted: function () {
    console.log('mounted')
  },
  beforeDestroy: function () {
    console.log('beforeDestroy')
  },
  destroyed: function () {
    console.log('destroyed')
  }
}
