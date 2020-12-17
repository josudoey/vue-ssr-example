console.log('hello3')
export default {
  template: `<div>
  this hello3 page server time: {{now}}
  <br />
  <router-link :to="{name:'home'}">index</router-link>
  <router-link :to="{name:'hello2',params:{id:now}}">hello2</router-link>
</div>`,
  data: function () {
    return {
      now: Date.now()
    }
  },
  beforeCreate: function () {
    console.log('hello3: beforeCreate')
  },
  created: function () {
    console.log('hello3: created')
  },
  beforeMount: function () {
    console.log('hello3: beforeMount')
  },
  mounted: function () {
    console.log('hello3: mounted')
  },
  beforeDestroy: function () {
    console.log('hello3: beforeDestroy')
  },
  destroyed: function () {
    console.log('hello3: destroyed')
  }
}
