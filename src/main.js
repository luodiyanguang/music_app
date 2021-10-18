import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueLazyload from 'vue-lazyload'

import 'common/stylus/index.styl'
// import vueConfig from '../vue.config'


Vue.config.productionTip = false

const loadImage = require("common/image/default.png")
Vue.use(VueLazyload, {
  loading: loadImage
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
