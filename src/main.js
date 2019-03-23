// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import babelPolyfill from 'babel-polyfill';
import echarts from 'echarts'
import elementUi from './config/element-ui'
import './assets/css/icon.css';
import store from './store/index'
import axios from './config/axios'
import api from './config/api';
import preview from 'vue-photo-preview'
import {setCookie,getCookie,delCookie} from '@/config/cookie'
// import Blob from './excel/Blob'
// import Export2Excel from './excel/Export2Excel'

Vue.prototype.$cookieStore = {
  setCookie,
  getCookie,
  delCookie
}

//图片查看器
Vue.use(preview)


//Vue.prototype.Api =Api

import 'vue-photo-preview/dist/skin.css'
import '../node_modules/element-ui/lib/theme-chalk/index.css'

echarts
Vue.prototype.$echarts = echarts;

//API
Vue.prototype.$api = api;

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  axios,
  elementUi,
  babelPolyfill,
  components: { App },
  template: '<App/>'
})
