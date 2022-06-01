import Vue from 'vue'
import App from './App.vue'
import router from '@/route'
import store from '@/store'

import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import MavenEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

import VueCookie from 'vue-cookie'

Vue.use(ElementUi, { size: 'medium' })
Vue.use(VueCookie)
Vue.use(MavenEditor)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')
