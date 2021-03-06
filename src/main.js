// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Router from 'vue-router';
import VueScroller from 'vue-scroller-jodring'

Vue.use(VueScroller)
import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: 'http://360.cooseatech.cn/appstore/H5/storehome/static/appStore/palceholder-logo.webp',
    loading: 'http://360.cooseatech.cn/appstore/H5/storehome/static/appStore/palceholder-logo.webp',
    attempt: 1
})
import {LoadingPlugin, ToastPlugin, ConfirmPlugin, ConfigPlugin, AlertPlugin, BusPlugin} from 'vux';

Vue.use(ConfigPlugin, {
    $layout: 'VIEW_BOX'
});
Vue.use(Router);
Vue.use(LoadingPlugin);
Vue.use(ToastPlugin);
Vue.use(ConfirmPlugin);
Vue.use(AlertPlugin);
Vue.use(BusPlugin);
/*const FastClick = require('fastclick')
FastClick.attach(document.body)*/
Vue.config.productionTip = false;
router.beforeEach((to, from, next) => {
    /*if (_czc[from.path]) {
        _czc.push(["_trackEvent", '停留时长(s)', '页面:', from.path, (new Date().getTime() - _czc[from.path].timeStamp)/1000] + 's')
    }
    _czc[to.path] = {
        timeStamp: new Date().getTime()
    }*/
    _czc.push(["_trackPageview", from.path, 'http://appstore.szprize.cn/appstore/H5/storehome/#' + from.path])
    next()
})
//隐藏服务器恶意广告
var adDiv1 = document.querySelector('[id^="chunasqwd"]')
if (adDiv1) {
    adDiv1.style.display = 'none'
}
var adDiv2 = document.querySelector('[id^="_embed"]')
if (adDiv2) {
    adDiv2.style.display = 'none'
}
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: {App},
})


