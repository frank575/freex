<template>
  <div id="app">
    <img
      alt="Vue logo"
      src="./assets/logo.png"
    >
    <HelloWorld msg="Welcome to Your Vue.js App" />
    {{aaa}}
    <button @click="set">123</button>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import { get } from './freex@vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
  },
  created() {
    // console.clear()
    console.log(get())
    // console.log(this.$fx.state.user.name)
  },
  computed: {
    aaa() {
      return this.$fx.state.user.name + 123
    },},
  methods: {
    set() {
      this.$fx.set('user/name', 'hello')
      // $$fx.set('user/name', 'hello')
      console.log(this.$fx.state.user)
    },
  },
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #ddd;
  margin-top: 60px;
}
body {
  background: #1b1b1b;
}
</style>
