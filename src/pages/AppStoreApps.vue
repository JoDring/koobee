<template>
    <div class="app-store-apps">
        <x-header :left-options="{backText:''}">
            {{title}}
            <router-link :to="{name: 'AppStoreSearch', append: false, params: {hotWord: hotword}}" slot="right">
                <x-icon type="ios-search" size="23"></x-icon>
            </router-link>
        </x-header>
        <main class="main">
            <scroller
                    class="list-detail"
                    ref="scroller"
                    :on-refresh="refresh"
                    :on-infinite="getMore">
                <template v-if="apps.length">
                    <div class="list-item" v-for="item in apps" :key="item.id">
                        <router-link :to="{name: 'AppDetail',append:false, params:{appId: item.id}, query: {isSub: true}}" class="list-item-c">
                            <div class="list-item-icon-c">
                                <img default-src="static/images/placeholder-appbg.png" class="list-item-icon" :src="item.iconUrl">
                            </div>
                            <div>
                                <div class="list-item-name">{{item.name}}</div>
                                <div class="list-item-brief">{{item.apkSize | formatSize(2)}}</div>
                                <div class="list-item-brief">{{item.brief}}</div>
                            </div>
                        </router-link>
                        <btn-download class="btn-download" :url="item.downloadUrl" btnText="下载"></btn-download>
                    </div>
                </template>
            </scroller>
        </main>
    </div>
</template>

<script>
    import {XHeader, Grid, GridItem} from 'vux'
    import BtnDownload from '../components/btn-download'
    import {formatSize} from '../filters'
    import sample from 'lodash/sample'
    import {fetchSearchHotWords, fetchCategoryList, fetchGame, fetchNeed, fetchRank} from '../services/appStore'

    export default {
        name: "app-store-apps",
        data() {
            return {
                apps: [],
                hotWords: null,
                loading: false,
                queryData: {
                    catId: '',
                    pageIndex: 0,
                    pageSize: 10
                }
            }
        },
        props: {
            type: {
                type: String
            },
            title: {
                type: String,
                default: '应用列表'
            }
        },
        computed: {
            hotword() {
                if (this.hotWords) {
                    const sampleItem = sample(this.hotWords)
                    return sampleItem.searchWord
                } else {
                    return '游戏'
                }
            }
        },
        created() {
            this.getHotWords()
            document.title = '应用分类:' + this.title
        },
        methods: {
            getApps(done) {
                switch (this.type) {
                    case 'categoryList':
                        this.getCategoryList(done)
                        break;
                    case 'need':
                        this.getNeed(done)
                        break;
                    case 'rank':
                        this.getRank(done)
                        break;
                    case 'game':
                        this.getGame(done)
                        break;
                    default:
                        return;
                }
            },
            getHotWords() {
                fetchSearchHotWords().then(res => {
                    if (res.code === '0') {
                        this.hotWords = res.data.hotwords
                    }
                })
            },
            //根据详情分类id获取详情
            getCategoryList(done) {
                this.loading = true;
                this.queryData.catId = this.$route.query.catId
                return fetchCategoryList(this.queryData).then(res => {
                    this.successCb(res, done)
                }, () => {
                    this.failCb(done)
                })
            },
            getRank(done) {
                this.loading = true;
                delete this.queryData.catId
                return fetchRank(this.queryData).then(res => {
                    this.successCb(res, done)
                }, () => {
                    this.failCb(done)
                })
            },
            getNeed(done) {
                this.loading = true;
                delete this.queryData.catId
                return fetchNeed(this.queryData).then(res => {
                    this.successCb(res, done)
                }, () => {
                    this.failCb(done)
                })
            },
            getGame(done) {
                this.loading = true;
                delete this.queryData.catId
                return fetchGame(this.queryData).then(res => {
                    this.successCb(res, done)
                }, () => {
                    this.failCb(done)
                })
            },
            successCb(res, done) {
                if(typeof done === 'function') {
                    done()
                }
                this.loading = false
                if (res.data && res.data.apps && res.data.apps.length) {
                    this.apps = [...this.apps, ...res.data.apps]
                } else {
                    this.$refs['scroller'].finishInfinite(true)
                }
            },
            failCb(done) {
                this.loading = false
                if(typeof done === 'function') {
                    done()
                }
                this.$vux.toast.text('获取数据失败', 'bottom')
            },
            refresh(done) {
                this.queryData.pageIndex = 1
                !this.loading && this.getApps(done)
            },
            getMore(done) {
                this.queryData.pageIndex++
                !this.loading && this.getApps(done)
            }

        },
        components: {
            XHeader,
            Grid, GridItem,
            BtnDownload,
        },
        filters: {
            formatSize
        }
    }
</script>

<style lang="less">
    @import "~vux/src/styles/weui/base/fn.less";

    @black: #000;
    @gray-dark: #5d5d5d;
    @gray-light: #919191;
    @bg-gray: #e5e5e5;
    .app-store-apps {
        height: 100%;
        font-size: 13px;
        color: #222;
        display: flex;
        flex-direction: column;
        .vux-header {
            height: 45px;
            flex-shrink: 0;
            position: relative;
            z-index: 2;
            &:after {
                .setBottomLine(#c2c2c3)
            }
        }
        .main {
            flex: 1;
            overflow: auto;
            position: relative;
        }
        //-- 详情列表
        .list-detail {
            .list-item {
                position: relative;
                &:active {
                    background-color: #eee;
                }
            }
            .list-item-c {
                height: 80px;
                display: flex;
                align-items: center;
                box-sizing: border-box;
                background: #fff;
                padding: 0 20px;
            }
            .list-item-icon-c {
                width: 65px;
                height: 65px;
                border-radius: 8px;
                margin-right: 10px;
                overflow: hidden;
            }
            .list-item-icon {
                width: 100%;
            }
            .list-item-name {
                font-size: 16px;
                color: @black;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 200px;
            }
            .list-item-brief {
                font-size: 11px;
                color: @gray-dark;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 200px;
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