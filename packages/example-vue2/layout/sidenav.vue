<template lang="pug">
span
  .sidenav-overlay(v-if="show" @click="toggle")
  transition(name="sidenav")
    nav.sidenav.bg-light(v-if="show")
      slot
</template>

<script>
export default {
  data () {
    return {
      show: false
    }
  },
  methods: {
    toggle () {
      this.show = !this.show
    },
    open () {
      this.show = true
    },
    close () {
      this.show = false
    }
  }
}
</script>
<style>
/* ref https://bootstrapious.com/p/bootstrap-sidebar */
.sidenav-overlay {
  display: block;
  position: fixed;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1100;
}

.sidenav {
  width: 250px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1101;
  overflow-y: scroll;
}

.sidenav-enter-active, .sidenav-leave-active {
  transition: all .5s;
}
.sidenav-enter, .sidenav-leave-to {
  transform: translateX(-250px);
  opacity: 0;
}
</style>