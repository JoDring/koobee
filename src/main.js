// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Router from 'vue-router';
import VueScroller from 'vue-scroller'
Vue.use(VueScroller)
import {AjaxPlugin, LoadingPlugin, ToastPlugin, ConfirmPlugin, ConfigPlugin, AlertPlugin} from 'vux';
Vue.use(ConfigPlugin, {
    $layout: 'VIEW_BOX'
});
Vue.use(Router);
Vue.use(LoadingPlugin);
Vue.use(ToastPlugin);
Vue.use(ConfirmPlugin);
Vue.use(AlertPlugin);
Vue.use(AjaxPlugin);
Vue.config.productionTip = false;
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: {App},
})