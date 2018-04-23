import Router from 'vue-router';

const NotFound = () => import('../components/NotFound.vue');
const H5Games = () => import('../components/H5Games.vue');

const AppStoreHome = () => import(/* webpackChunkName: "appStore" */ '../pages/AppStoreHome.vue');
const AppDetail = () => import(/* webpackChunkName: "appStore" */ '../pages/AppDetail.vue');
const AppStoreSearch = () => import(/* webpackChunkName: "appStore" */ '../pages/AppStoreSearch.vue');
const AppStoreCategory = () => import(/* webpackChunkName: "appStore" */ '../pages/AppStoreCategory.vue');
const AppStoreApps = () => import(/* webpackChunkName: "appStore" */ '../pages/AppStoreApps.vue');

const InformationList = () => import(/* webpackChunkName: "information" */ '../pages/InformationList.vue');
const InformationDetail = () => import(/* webpackChunkName: "information" */ '../pages/InformationDetail.vue');

export default new Router({
    routes: [
        {
            path: '/AppStoreHome',
            name: 'AppStoreHome',
            component: AppStoreHome,
            meta:{title: '应用市场'},
            props: true
        },
        {
            path: '/AppStoreSearch/:hotWord',
            name: 'AppStoreSearch',
            meta:{title: '应用搜索'},
            component: AppStoreSearch,
            props: true
        },
        {
            path: '/AppStoreCategory',
            name: 'AppStoreCategory',
            meta:{title: '应用分类'},
            component: AppStoreCategory
        },
        {
            path: '/AppStoreApps/:type',
            name: 'AppStoreApps',
            meta:{title: '应用列表'},
            component: AppStoreApps,
            props: true
        },
        {
            path: '/AppDetail/:appId',
            name: 'AppDetail',
            component: AppDetail,
            meta:{title: '应用详情'},
            props: true
        },
        {
            path: '/InformationList',
            name: 'InformationList',
            component: InformationList,
            meta:{title: '热门资讯'},
            props: true
        },
        {
            path: '/InformationDetail/:id',
            name: 'InformationDetail',
            component: InformationDetail,
            meta:{title: '资讯详情'},
            props: true
        },
        {
            path: '/H5Games/:id',
            name: 'H5Games',
            component: H5Games,
            props: true
        },
        {
            path: '/*',
            name: 'NotFound',
            component: NotFound
        },
    ]
})
