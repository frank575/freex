import Vue from 'vue'
import Freex from './freex@vue'
import App from './App.vue'

Vue.config.productionTip = false

const store = {
  user: {
    state: {
      name: 'frank',
    },
    mutations: {
      setName() {
        console.log(this.state)
        this.state.name = 'jeff'
      },
    },
  },
}

Vue.use(Freex, { store })

new Vue({
  render: h => h(App),
}).$mount('#app')
