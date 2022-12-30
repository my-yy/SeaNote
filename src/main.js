import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store.js'

Vue.config.productionTip = false

//element
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/fontawesome/css/all.css'

Vue.use(ElementUI);


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
