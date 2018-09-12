import Router from 'vue-router';

import NotFound from  '../pages/NotFound.vue';
import Lottery from '../pages/Lottery.vue';
const LotteryYuandan2017 = () => import('../pages/Lottery-yuandan2017.vue');
const LotteryChunjie2018 = () => import('../pages/Lottery-chunjie2018.vue');
const Wuyi2018 = () => import('../pages/Lottery-wuyi2018.vue');

export default new Router({
    routes: [
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
                },
                {
                    path: 'wuyi2018',
                    name: 'Wuyi2018',
                    component: Wuyi2018,
                    props: true
                },
                {
                    path: 'zhongqiu2018',
                    name: 'zhongqiu2018',
                    component: () => import('../pages/Lottery-zhongqiu2018.vue'),
                    props: true
                },
            ]
        },
        {
            path: '/*',
            name: 'NotFound',
            component: NotFound
        }
    ]
})
