<template>
    <div class="information-list">
        <!--<x-header :left-options="{backText:''}">
            {{pageTitle}}
        </x-header>-->
        <div class="information-regions" v-show="regions && regions.length">
            <div class="regions-item" v-for="item in regions">
                <img class="regions-item-img" v-lazy="item.imageUrl">
                <div>{{item.title}}</div>
                <router-link :to="{name: 'InformationList', query: {packageName: item.packageName}}"
                             class="regions-item-btn">
                    进入
                </router-link>
            </div>
        </div>
        <div class="list">
            <scroller
                    class="list-detail"
                    v-if="list.length"
                    ref="scroller"
                    :on-refresh="refresh"
                    :on-infinite="getMore">
                    <div class="list-item" v-for="item in list" :key="item.id">
                        <div class="list-item-c" @click="goToDetail(item)">
                            <div class="list-item-icon-c" v-lazy:background-image="item.imageUrl"></div>
                            <div class="list-item-txt">
                                <div class="list-item-name">{{item.title}}</div>
                                <div class="list-item-brief">
                                    <span><<{{item.appName}}>></span>
                                    <span>{{item.timeStr}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
            </scroller>
        </div>
        <app-ad v-if="app" :app="app"></app-ad>
    </div>
</template>

<script>
    import {XHeader} from 'vux'
    import BtnDownload from '../components/btn-download'
    import AppAd from '../components/AppAd'
    import {fetchInformationList} from '../services/appStore'

    export default {
        name: "information-list",
        data() {
            return {
                list: [],
                regions: [],
                app: null,
                loading: false,
                queryData: {
                    packageName: this.$route.query.packageName ? this.$route.query.packageName : '',
                    pageIndex: 1,
                    pageSize: 10
                }
            }
        },
        props: {
            title: {
                type: String,
                default: '热门资讯'
            }
        },
        computed: {
            pageTitle() {
                return this.app ? this.app.name : this.title
            }
        },
        created() {
            // 第三方来源需要添加的头
            const metaNode = document.createElement('meta')
            metaNode.name = 'referrer'
            metaNode.content = 'never'
            document.head.appendChild(metaNode)
            document.title = this.title
            this.getInformationList()
        },
        beforeRouteUpdate(to, from, next) {
            if (to.query.packageName) {
                this.queryData.packageName = to.query.packageName
            } else {
                this.queryData.packageName = ''
            }
            this.refresh()
            next()
        },
        methods: {
            //根据详情分类id获取详情
            getInformationList(done) {
                this.loading = true;
                return fetchInformationList(this.queryData).then(res => {
                    this.successCb(res, done)
                }, () => {
                    this.failCb(done)
                })
            },
            successCb(res, done) {
                if (typeof done === 'function') {
                    done()
                }
                this.loading = false
                if (res.data) {
                    if(this.queryData.pageIndex === 1) {
                        if (res.data.regions) {
                            this.regions = res.data.regions
                        } else {
                            this.regions = []
                        }
                    }
                    if (res.data.app) {
                        this.app = res.data.app
                    }
                    if (res.data.list && res.data.list.length) {
                        this.list = [...this.list, ...res.data.list]
                    } else {
                        this.$refs['scroller'].finishInfinite(true)
                    }
                }
            },
            failCb(done) {
                this.loading = false
                if (typeof done === 'function') {
                    done()
                }
                this.$vux.toast.text('加载超时', 'bottom')
            },
            refresh(done) {
                this.list = []
                this.queryData.pageIndex = 1
                !this.loading && this.getInformationList(done)
            },
            getMore(done) {
                this.queryData.pageIndex++
                !this.loading && this.getInformationList(done)
            },
            goToDetail(item) {
                const filterList = this.list.filter(v => {
                    return v.id !== item.id
                })
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
    .information-list {
        height: 100%;
        font-size: 13px;
        color: #222;
        display: flex;
        flex-direction: column;
        .vux-header {
            flex-shrink: 0;
        }
        //--
        .information-regions {
            background: #f8f8f8;
            color: #222;
            font-size: 17px;
            .regions-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 100%;
                padding: 13px;
            }
            .regions-item-img {
                display: block;
                width: 60px;
                height: 45px;
                overflow: hidden;
                margin-left: 7px;
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
            }
            .regions-item-btn {
                display: block;
                background: #ff6b3b;
                color: #fff;
                text-align: center;
                line-height: 25px;
                font-size: 12px;
                border-radius: 25px;
                width: 55px;
                height: 25px;
            }
        }
        //-- 详情列表
        .list {
            flex: 1;
            overflow: auto;
            position: relative;
        }
        .list-detail {
            .list-item-c {
                height: 100px;
                display: flex;
                align-items: center;
                box-sizing: border-box;
                background: #fff;
                padding: 0 13px;
                position: relative;
                &:active {
                    background-color: #eee;
                }
            }
            .list-item-icon-c {
                width: 98px;
                height: 65px;
                margin-right: 10px;
                flex-shrink: 0;
                background-repeat: no-repeat;
                background-size: cover;
                background-position: center;

            }
            .list-item-txt {
                flex: 1;
                height: 65px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }
            .list-item-name {
                font-size: 15px;
                line-height: 1.4;
                color: @black;
                .ellipsisLn(2)
            }
            .list-item-brief {
                font-size: 11px;
                color: @gray-light;
                display: flex;
                justify-content: space-between;
            }
            .btn-download {
                width: 60px;
                height: 25px;
                font-size: 12px;
                position: absolute;
                right: 13px;
                top: 0;
                bottom: 0;
                margin: auto;
            }
        }

    }
</style>