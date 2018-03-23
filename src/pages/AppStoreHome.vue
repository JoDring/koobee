<template>
    <div class="app-store-home">
        <div slot="header" class="header"  @click="goToSearchPage">
            <div class="search-home">
                <div class="search-home-content">
                    <x-icon type="ios-search" size="18" class="search-home-icon"></x-icon>
                    <marquee ref="hotWords">
                        <marquee-item v-for="item in hotWords" :key="item.id">{{item.searchWord}}</marquee-item>
                    </marquee>
                </div>
            </div>

        </div>
        <div class="list-home">
            <scroller
                    ref="scroller"
                    :on-refresh="refresh"
                    :on-infinite="getMore"
                    v-if="apps.length">
                <grid class="category" v-if="navBars.length">
                    <grid-item v-for="item in navBars"
                               :link="categoryMap[item.type]"
                               :key="item.id">
                        <img slot="icon" v-lazy="item.iconUrl">
                        <span class="category-title" slot="label">{{ item.title }}</span>
                    </grid-item>
                </grid>
                <div class="list-item" v-for="item in apps" :key="item.id">
                    <router-link class="list-item-c"
                                 :to="{name: 'AppDetail', params:{appId: item.id}, query: {isSub: true}}">
                        <div class="list-item-icon-c">
                            <img class="list-item-icon" v-lazy="item.iconUrl">
                        </div>
                        <div>
                            <div class="list-item-name">{{item.name}}</div>
                            <div class="list-item-brief">{{item.apkSize | formatSize(2)}}</div>
                            <div class="list-item-brief">{{item.brief}}</div>
                        </div>
                    </router-link>
                    <btn-download class="btn-download" :url="item.downloadUrl" btnText="下载"></btn-download>
                </div>
            </scroller>
        </div>
        <div slot="bottom" class="footer" v-show="showFooter">
            <img class="footer-app-icon" src="../assets/appStore/app-store-icon.png">
            <div>
                <div class="footer-title">应用市场</div>
                <div class="footer-brief">8.62M</div>
            </div>
            <btn-download class="btn-download btn-footer" url="http://appstore.szprize.cn/appstore/api/getapp" btnText="安装"
                          style="background: #ff6c3a;"></btn-download>
            <div class="icon-close-c" @click="showFooter = false">
                <x-icon class="icon-close" type="ios-close-empty" size="22"></x-icon>
            </div>
        </div>
        <loading :show="loading"></loading>
    </div>
</template>

<script>
    import {Grid, GridItem, ViewBox, XImg, Marquee, MarqueeItem, Loading} from 'vux'
    import {formatSize} from '../filters'
    import {fetchHome, fetchSearchHotWords} from '../services/appStore'
    import BtnDownload from '../components/btn-download'

    export default {
        name: "app-store-home",
        data() {
            return {
                queryData: {
                    pageIndex: 1,
                    pageSize: 10
                },
                navBars: [],
                apps: [],
                hotWords: [],
                showFooter: true,
                loading: false,
                categoryMap: {
                    need: {name: 'AppStoreApps', append: false, params: {type: 'need', title: '装机必备'}},
                    rank: {name: 'AppStoreApps', append: false, params: {type: 'rank', title: '下载榜单'}},
                    game: {name: 'AppStoreApps', append: false, params: {type: 'game', title: '热门游戏'}},
                    category: {name: 'AppStoreCategory', append: false},
                },
                title: '应用市场'
            }
        },
        created() {
            this.getHomeData().then(this.getHotWords)
        },
        beforeRouteEnter(to, from, next) {
            document.title = to.meta.title
            next()
        },
        methods: {
            refresh(done) {
                this.apps = []
                this.queryData.pageIndex = 1
                !this.loading && this.getHomeData(done)
            },
            getMore(done) {
                this.queryData.pageIndex++;
                !this.loading && this.getHomeData(done)
            },
            getHomeData(done) {
                this.loading = true;
                return fetchHome(this.queryData).then(res => {
                    this.loading = false;
                    if (typeof done === 'function') {
                        done()
                    }
                    if (res.code === '0' && res.data) {
                        if (res.data.navbars) {
                            this.navBars = res.data.navbars
                        }
                        if (res.data.apps && res.data.apps.length) {
                            this.apps = [...this.apps, ...res.data.apps]
                        } else {
                            this.$refs['scroller'].finishInfinite(true)
                        }
                    }
                }, () => {
                    this.loading = false
                    if (typeof done === 'function') {
                        done()
                    }
                    this.$vux.toast.text('获取数据失败', 'bottom')
                })
            },
            getHotWords() {
                fetchSearchHotWords().then(res => {
                    if (res.code === '0') {
                        this.hotWords = res.data.hotwords
                    }
                })
            },
            goToSearchPage() {
                const searchWord = this.hotWords[this.$refs['hotWords'].currentIndex].searchWord || ''
                this.$router.push({name: 'AppStoreSearch', append: false, params: {hotWord: searchWord}})
            }
        },
        components: {
            Grid,
            GridItem,
            ViewBox,
            XImg,
            BtnDownload,
            Marquee, MarqueeItem,
            Loading
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
    .app-store-home {
        height: 100%;
        font-size: 12px;
        color: @black;
        display: flex;
        flex-direction: column;
        .header {
            background: #fff;
            flex-shrink: 0;
        }
        .scroll-c {
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            height: 100%;
            padding-bottom: 50px;
            overflow: auto;
            -webkit-overflow-scrolling: touch;
        }
        //---
        .search-home {
            margin: 8px 13px;
            color: @gray-light;
        }
        .search-home-content {
            display: flex;
            width: 100%;
            align-items: center;
            background: @bg-gray;
            height: 30px;
            border-radius: 4px;
            .search-home-icon {
                margin: 0 8px 0 14px;
                fill: @gray-light;
            }
        }
        //---
        .category {
            height: 90px;
        }
        .category-title {
            color: #2222;
            font-size: 12px;
        }
        .weui-grid{
            padding-top: 15px;
        }
        .weui-grid__icon {
            width: 40px;
            height: 40px;
        }
        .weui-grid__icon + .weui-grid__label{
            margin-top: -3px;
        }
        //---
        .list-home {
            height: 100%;
            position: relative;
            flex: 1;
        }
        .list-item {
            position: relative;
            height: 94px;
            display: flex;
            align-items: center;
            &:active {
                background: #eee;
            }
        }
        .list-item-c {
            display: flex;
            align-items: center;
            padding: 0 13px;
            box-sizing: border-box;
        }
        .list-item-icon-c {
            width: 65px;
            height: 65px;
            border-radius: 8px;
            margin-right: 15px;
            overflow: hidden;
        }
        .list-item-icon {
            width: 100%;
        }
        .list-item-name {
            font-size: 16px;
            color: @black;
        }
        .list-item-brief {
            font-size: 11px;
            color: @gray-dark;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 200px;
        }
        //--
        .btn-download {
            width: 55px;
            height: 24px;
            font-size: 12px;
            position: absolute;
            right: 13px;
            top: 0;
            bottom: 0;
            margin: auto;
        }
        .footer {
            width: 100%;
            position: absolute;
            display: flex;
            align-items: center;
            bottom: 0;
            left: 0;
            z-index: 2;
            height: 60px;
            background: rgba(255, 255, 255, .94);
            &:before {
                .setTopLine(#e4e4e4);
            }
            .footer-app-icon {
                margin: 0 14px 0 13px;
                width: 35px;
            }
            .icon-close-c {
                width: 55px;
                height: 100%;
                position: absolute;
                top: 0;
                right: 0;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .icon-close {
                opacity: .6;
                fill: #898989;
            }
        }
        //---
        .footer-title {
            color: #222;
            font-size: 15px;
            line-height: 1.3;
        }
        .footer-brief {
            color: #6c6c6c;
            font-size: 11px;
        }
        .btn-download.btn-footer {
            right: 55px;
        }
        //--
        .weui-grids, .weui-grid {
            &:before, &:after {
                display: none;
            }
        }

    }
</style>