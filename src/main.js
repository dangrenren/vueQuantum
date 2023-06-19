import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/global.css'
import request from "@/utils/request";
import store from './store'
import NutUI from "@nutui/nutui"
import '@nutui/nutui/dist/nutui.css';

//@就等价于/src 目录的相对路径.@作为 v-on指令的缩写，为了简化程序的写法，尤其适用于大中型项目，能减少不少重复劳动
//：其实是 v-bind 指令 的缩写，二者是等价关系，：缩写可以减少重复写 v-bind 的麻烦
//1.v-bind是单向绑定，用来绑定数据和属性以及表达式，数据只能从data流向页面。
// 2、v-model是双向绑定，数据能从data流向页面，也能从页面流向data。
Vue.config.productionTip = false
Vue.use(ElementUI, {size: "mini"})//vue使用element ui
Vue.use(NutUI)//引入京东UI
//全局挂载(按程序员青戈的，把import axios from 'axios'写入request.js里，全局挂载request)
//Vue.prototype.$axios=axios
Vue.prototype.request = request

new Vue({
    store,//vuex
    router,//vue-router
    render: h => h(App)
}).$mount('#app')
