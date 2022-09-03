import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import db from '@/plugins/db.js'

Vue.config.productionTip = false
Vue.use(db, store)
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
