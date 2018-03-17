import Router from 'vue-router';
const NotFound = () => import('../components/NotFound.vue');
const H5Games = () => import('../components/H5Games.vue');
const AppDetail = () => import('../components/AppDetail.vue');
const AppStoreHome = () => import('../pages/AppStoreHome.vue');
const AppStoreSearch = () => import('../pages/AppStoreSearch.vue');
const AppStoreCategory  = () => import('../pages/AppStoreCategory.vue');
import Lottery from '../components/Lottery.vue'
const LotteryYuandan2017 = () => import('../components/Lottery-yuandan2017.vue');
const LotteryChunjie2018 = () => import('../components/Lottery-chunjie2018.vue');

export default new Router({
  routes: [
    {
      path: '/AppStoreHome',
      name: 'AppStoreHome',
      component: AppStoreHome,
      props:true
    },
    {
      path: '/AppStoreSearch/:hotWord',
      name: 'AppStoreSearch',
      component: AppStoreSearch,
      props: true
    },
    {
      path: '/AppStoreCategory/:type',
      name: 'AppStoreCategory',
      component: AppStoreCategory,
      props: true
    },
    {
      path: '/AppDetail/:appId',
      name: 'AppDetail',
      component: AppDetail,
      props:true
    },
    {
      path: '/H5Games/:id',
      name: 'H5Games',
      component: H5Games,
      props:true
    },
    {
      path: '/Lottery/:id',
      component: Lottery,
      props:true,
      children: [
        {
          path: '',
          name: 'lotteryDefault',
          component: LotteryYuandan2017,
          props:true
        },
        {
          path: 'yuandan2017',
          name: 'LotteryYuandan2017',
          component: LotteryYuandan2017,
          props:true
        },
        {
          path: 'chunjie2018',
          name: 'LotteryChunjie2018',
          component: LotteryChunjie2018,
          props:true
        }
      ]
    },
    {
      path: '/*',
      component: NotFound
    },
  ]
})
