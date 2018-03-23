import Router from 'vue-router';

const NotFound = () => import('../components/NotFound.vue');
const H5Games = () => import('../components/H5Games.vue');
const AppDetail = () => import('../components/AppDetail.vue');
const AppStoreHome = () => import('../pages/AppStoreHome.vue');
const AppStoreSearch = () => import('../pages/AppStoreSearch.vue');
const AppStoreCategory = () => import('../pages/AppStoreCategory.vue');
const AppStoreApps = () => import('../pages/AppStoreApps.vue');
const InformationList = () => import('../pages/InformationList.vue');
const InformationDetail = () => import('../pages/InformationDetail.vue');
import Lottery from '../components/Lottery.vue'

const LotteryYuandan2017 = () => import('../components/Lottery-yuandan2017.vue');
const LotteryChunjie2018 = () => import('../components/Lottery-chunjie2018.vue');

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
            path: '/Lottery/:id',
            component: Lottery,
            props: true,
            children: [
                {
                    path: '',
                    name: 'lotteryDefault',
                    component: LotteryYuandan2017,
                    props: true
                },
                {
                    path: 'yuandan2017',
                    name: 'LotteryYuandan2017',
                    component: LotteryYuandan2017,
                    props: true
                },
                {
                    path: 'chunjie2018',
                    name: 'LotteryChunjie2018',
                    component: LotteryChunjie2018,
                    props: true
                }
            ]
        },
        {
            path: '/*',
            component: NotFound
        },
    ]
})
