<template>
    <div class="information-detail">
        <!--<x-header :left-options="{backText:''}">
            {{title}}
        </x-header>-->
        <main class="main">
            <div class="information-detail-content" v-if="detail" v-html="detail.body"></div>
            <div v-else style="text-align: center; margin: 40px 0; font-size: 16px">无数据...</div>
            <div class="detail-information-list" v-if="sampleList && sampleList.length > 0">
                <div class="list-item" v-for="item in sampleList" @click="goToDetail(item)">
                    <img v-lazy="item.imageUrl" class="list-item-img">
                    <div class="list-item-txt">
                        <div class="item-title">
                            {{item.title}}
                        </div>
                        <div class="item-time">
                            <span><<{{item.appName}}>></span>
                            <span>{{item.timeStr}}</span>
                        </div>
                    </div>
                </div>
                <router-link :to="{name:'InformationList'}" class="list-bottom-btn">查看更多</router-link>
            </div>
        </main>
        <app-ad v-if="app" :app="app"></app-ad>
    </div>
</template>

<script>
    import {XHeader} from 'vux'
    import sampleSize from 'lodash/sampleSize'
    import BtnDownload from '../components/btn-download'
    import AppAd from '../components/AppAd'
    import {fetchInformationList, fetchInformationDetail} from '../services/appStore'

    export default {
        name: "information-detail",
        data() {
            return {
                detail: null,
                loading: false,
                list: [],
                app: null
            }
        },
        props: {
            title: {
                type: String,
                default: '资讯详情'
            },
            id: {
                require: true
            },
            informationList: Array
        },
        computed: {
            sampleList() {
                if (this.list && this.list.length > 0) {
                    return sampleSize(this.list, 2)
                } else {
                    return sampleSize(this.informationList, 2)
                }
            }
        },
        created() {
            // 第三方来源需要添加的头
            const metaNode = document.createElement('meta')
            metaNode.name = 'referrer'
            metaNode.content = 'never'
            document.head.appendChild(metaNode)
            document.title = this.title
            this.getInformationDetail()
        },
        beforeRouteUpdate(to, from, next) {
            this.getInformationDetail(to.params.id)
            next()
            const scrollElm = document.querySelector('.main')
            scrollElm.scrollTop = 0
        },
        methods: {
            //根据详情分类id获取详情
            getInformationDetail(id) {
                const appId = id ? id : this.id
                this.loading = true;
                return fetchInformationDetail({id: appId}).then(res => {
                    this.loading = false;
                    if (res.code === '0') {
                        this.detail = res.data.detail
                        this.app = res.data.detail.app
                    }
                    if (!this.informationList || this.informationList.length === 0) {
                        fetchInformationList({pageIndex: 1, pageSize: 100}).then(res => {
                            if (res.code === '0') {
                                this.list = res.data.list
                            }
                        })
                    }
                }, () => {
                    this.loading = false;
                    this.$vux.toast.text('加载超时', 'bottom')
                })
            },
            goToDetail(item) {
                const list = this.list ? this.list : this.informationList
                const filterList = list.filter(v => {
                    return v.id !== item.id
                })
                this.list = filterList;
                this.$router.push({
                        name: 'InformationDetail',
                        append: false,
                        params: {
                            id: item.id,
                            informationList: filterList
                        }
                    }
                );
            }

        },
        components: {
            XHeader,
            BtnDownload,
            AppAd
        }
    }
</script>

<style lang="less">
    @import "~vux/src/styles/weui/base/fn.less";

    @black: #000;
    @gray-dark: #5d5d5d;
    @gray-light: #a1a1a1;
    @bg-gray: #e5e5e5;

    .information-detail {
        height: 100%;
        font-size: 14px;
        color: #222;
        display: flex;
        flex-direction: column;
        .vux-header {
            flex-shrink: 0;
        }
        .main {
            flex: 1;
            overflow: auto;
            -webkit-overflow-scrolling: touch;
            position: relative;
        }
        //-- 详情
        .information-detail-content {
            padding: 17px 12px;
            background: #f5f5f5;
            color: #313736;
            line-height: 1.8;
            text-align: justify;
            p {
                font-size: 14px;
                color: #313736;
                & + p{
                    margin-top: 20px;
                }
            }
            h1 {
                font-size: 17px;
                line-height: 1.3;
                color: #2b2b2b;
            }
            img {
                display: block;
                margin: 15px 0 25px 0;
                max-width: 100%;
            }
            iframe{
                max-width: 100% !important;
                height: auto !important;
                margin-top: 10px;
            }
            .Mid2L_title {
                text-align: center;
                h1{
                    display: inline-block;
                    text-align: left;
                }
                .detail {
                    display: inline-block;
                    text-align: left;
                    margin-top: 10px;
                    font-size: 10px;
                    color: #a1a1a1;
                }
            }
            .Mid2L_con {
                padding-top: 15px;
            }
        }
        //--list
        .detail-information-list {
            line-height: 1.4;
            background: #f7f7f7;
            padding-bottom: 75px;
            .list-item {
                display: flex;
                align-items: center;
                height: 100px;
                padding: 0 12px;
                box-sizing: border-box;
                position: relative;
                &:before {
                    .setTopLine(#e4e4e4)
                }
                &:active {
                    background-color: #eee;
                }
            }
            .list-item-img {
                height: 65px;
                margin-right: 10px;
                flex-shrink: 0;
            }
            .list-item-txt {
                height: 65px;
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }
            .item-title {
                font-size: 15px;
                color: #222;
                .ellipsisLn(2)
            }
            .item-time {
                display: flex;
                justify-content: space-between;
                font-size: 11px;
                color: #a1a1a1;
            }
            .list-bottom-btn {
                width: 90px;
                height: 35px;
                background: #ff6b3b;
                font-size: 15px;
                color: #fff;
                text-align: center;
                line-height: 35px;
                border-radius: 35px;
                display: block;
                margin: 10px auto;
            }
        }
    }
</style>