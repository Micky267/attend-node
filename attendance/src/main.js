import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/icon/font-awesome.min.css'
import './assets/css/normalize.css'
// import './mock/mock.js' // 导入这个 就已经开启拦截了
import axios from 'axios';
import VueAxios from 'vue-axios';
import globalValue from './global/global'

Vue.use(VueAxios,axios);
// axios.defaults.baseURL = 'http://mockjs.com/api' // 设置默认请求的url
// Vue.prototype.$http = axios
Vue.prototype.GLOVAL = globalValue

Vue.config.productionTip = false
Vue.use(ElementUI);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
