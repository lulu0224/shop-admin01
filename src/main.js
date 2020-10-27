// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import http from './utils/http'
import API from "./API"
import qs from "qs"
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from "./store"
import "./assets/css/reset.css"
import MyTable from "./components/MyTable"
import MyBreadcrumb from "./components/MyBreadcrumb"

Vue.use(ElementUI);

Vue.prototype.$http = http;
Vue.prototype.$api = API;
Vue.prototype.$qs = qs;
Vue.prototype.$url = "http://localhost:3000";
Vue.config.productionTip = false
Vue.component("my-table",MyTable)
Vue.component("my-breadcrumb",MyBreadcrumb)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
