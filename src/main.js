import Vue from 'vue'
import 'xe-utils'
import App from './App.vue'
// import HelloWorld from './components/HelloWorld.vue'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

Vue.config.productionTip = false
Vue.use(VXETable)

new Vue({
  render: h => h(App),
}).$mount('#app')
