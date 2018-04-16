// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Router from 'vue-router';
import VueScroller from 'vue-scroller'
Vue.use(VueScroller)
import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: 'static/images/palceholder-logo.png',
    loading: 'static/images/palceholder-logo.png',
    attempt: 1
})
import {AjaxPlugin, LoadingPlugin, ToastPlugin, ConfirmPlugin, ConfigPlugin, AlertPlugin, BusPlugin} from 'vux';
Vue.use(ConfigPlugin, {
    $layout: 'VIEW_BOX'
});
Vue.use(Router);
Vue.use(LoadingPlugin);
Vue.use(ToastPlugin);
Vue.use(ConfirmPlugin);
Vue.use(AlertPlugin);
Vue.use(BusPlugin);
Vue.use(AjaxPlugin);
/*const FastClick = require('fastclick')
FastClick.attach(document.body)*/
Vue.config.productionTip = false;
/*router.beforeEach((to, from, next) => {
    //document.title = '努力加载中...'
    next()
})*/
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: {App},
})
