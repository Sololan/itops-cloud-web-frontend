import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/providers/filters/filters.ts'
import 'normalize.css'
import './plugins/element.js'
import '@/assets/fonts/main/iconfont.css'
import '@/assets/styles/common.scss'
import HttpUtil from '@/providers/utils/http-util'
import {CATCH_ERROR} from '@/providers/models/consts'

Vue.config.productionTip = false
HttpUtil.initBaseConfig().then(() => {
  new Vue({
    router,
    store,
    render: (h) => h(App)
  }).$mount('#app')
}).catch(CATCH_ERROR)
