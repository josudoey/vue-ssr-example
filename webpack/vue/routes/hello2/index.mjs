console.log('hello2')
export default {
  template: `<div>
  this hello2 page server time: {{now}}
  <br />
  <router-link :to="{name:'home'}">index</router-link>
  <router-link :to="{name:'hello3',params:{id:now}}">hello3</router-link>
</div>`,
  data: function () {
    return {
      now: Date.now()
    }
  },
  beforeCreate: function () {
    console.log('hello2: beforeCreate')
  },
  created: function () {
    console.log('hello2: created')
  },
  beforeMount: function () {
    console.log('hello2: beforeMount')
  },
  mounted: function () {
    console.log('hello2: mounted')
  },
  beforeDestroy: function () {
    console.log('hello2: beforeDestroy')
  },
  destroyed: function () {
    console.log('hello2: destroyed')
  }
}
