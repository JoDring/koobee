<template>
    <div class="app-store-home">
        <div style="display: none">
            <img class="logo" src="../assets/appStore/logo.webp">
        </div>
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
            <transition name="vux-fade">
                <div class="my-scroller-mask"
                     style="position: absolute;
                            z-index: 9;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background: #fff;"
                     v-show="showScrollerMask" @click="this.showScrollerMask = false"></div>
            </transition>
            <scroller
                    ref="scroller"
                    :on-refresh="refresh"
                    :on-infinite="getMore"
                    v-if="apps.length">
                <grid class="category" v-if="navBars.length">
                    <grid-item v-for="item in navBars" :key="item.id">
                        <router-link :to="categoryMap[item.type]" slot="icon"><img v-lazy="item.iconUrl"></router-link>
                        <router-link tag="span" :to="categoryMap[item.type]" class="category-title" slot="label">{{ item.title }}</router-link>
                    </grid-item>
                </grid>
                <div class="list-item" v-for="item in apps" :key="item.id">
                    <div class="list-item-c" @click="goToDetail(item)">
                        <div class="list-item-icon-c">
                            <img class="list-item-icon" v-lazy="item.iconUrl" v-if="onLine">
                            <img class="list-item-icon" src="http://360.cooseatech.cn/appstore/H5/storehome/static/appStore/palceholder-logo.webp" v-else>
                        </div>
                        <div>
                            <div class="list-item-name">{{item.name}}</div>
                            <div class="list-item-brief">{{item.apkSize | formatSize(2)}}</div>
                            <div class="list-item-brief">{{item.brief}}</div>
                        </div>
                    </div>
                    <btn-download class="btn-download" :url="item.downloadUrl" :app="item" btnText="安装"></btn-download>
                </div>
            </scroller>
            <scroll-to-top v-if="$refs['scroller']"
                           :scrollTop="scrollPosition.y"
                           @click.native="scrollPosition.y = 0"
                           :scroller="$refs['scroller']">
            </scroll-to-top>
        </div>
        <div slot="bottom" class="footer" v-show="showFooter">
            <img class="footer-app-icon" src="../assets/appStore/app-store-icon.webp">
            <div>
                <div class="footer-title">应用市场</div>
                <div class="footer-brief">8.62M</div>
            </div>
            <btn-download class="btn-download btn-footer"
                          url="http://appstore.szprize.cn/appstore/api/getapp" btnText="安装"
                          style="background: #ff6c3a;">
            </btn-download>
            <div class="icon-close-c" @click="showFooter = false">
                <x-icon class="icon-close" type="ios-close-empty" size="22"></x-icon>
            </div>
        </div>
        <refresh-tip v-if="!loading && failLoaded && apps.length === 0" @click.native="getHomeData"></refresh-tip>
        <!--loading spinner-->
        <div v-if="loading && showSpinner"
             style="width: 100%; height: 100%; position: absolute; z-index: 999; top: 0;left: 0; display: flex; justify-content: center; align-items: center">
            <spinner type="android"></spinner>
        </div>
    </div>
</template>

<script>
    import {Grid, GridItem, Marquee, MarqueeItem, Spinner} from 'vux'
    import {formatSize} from '../filters'
    import {fetchHome, fetchSearchHotWords} from '../services/appStore'
    import BtnDownload from '../components/btn-download'
    import RefreshTip from '../components/RefreshTip'
    import ScrollToTop from '../components/ScrollToTop'
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
                showSpinner: true,
                categoryMap: {
                    need: {name: 'AppStoreApps', append: false, params: {type: 'need', title: '装机必备'}},
                    rank: {name: 'AppStoreApps', append: false, params: {type: 'rank', title: '下载榜单'}},
                    game: {name: 'AppStoreApps', append: false, params: {type: 'game', title: '热门游戏'}},
                    category: {name: 'AppStoreCategory', append: false},
                },
                title: '应用市场',
                failLoaded: false,
                onLine: window.navigator.onLine,
                scrollPosition: {x: 0, y: 0, animate: false},
                showScrollerMask: false
            }
        },
        created() {
            this.getHomeData().then(() => {
                this.getHotWords()
                /*this.$vux.confirm.show({
                    content: '是否需要打开 应用市场app',
                    maskTransition:'none',
                    onConfirm: function () {
                        const ifr = document.createElement('iframe');
                        ifr.src = 'weixin://';
                        ifr.style.display = 'none';
                        document.body.appendChild(ifr)
                    }
                })*/
            })
            this.$vux.bus.$on('off-line', () => {
                this.onLine = false
            })
            this.$vux.bus.$on('on-line', () => {
                this.onLine = true
            })
        },
        beforeRouteEnter(to, from, next) {
            document.title = '应用市场'
            next(vm => {
                setTimeout(function () {
                    vm.$refs['scroller'] && vm.$refs['scroller'].scrollTo(0, vm.scrollPosition.y, true)
                }, 250)
                setTimeout(function () {
                    vm.showScrollerMask = false
                }, 450)
            })
        },
        beforeRouteLeave(to, from, next) {
            if(this.onLine) {
                const position = this.$refs['scroller'] && this.$refs['scroller'].getPosition();
                if (position) {
                    this.scrollPosition = {x: 0, y: position.top, animate: false}
                }
                this.showScrollerMask = true
                next()
            } else {
                this.$vux.toast.text('网络异常')
            }
        },
        methods: {
            refresh(done) {
                this.showSpinner = false
                if(!this.onLine) {
                    this.$vux.toast.text('网络断开了')
                    if(typeof done === 'function') {
                        done(true)
                    }
                    return
                }
                this.queryData.pageIndex = 1
                !this.loading && this.getHomeData(done, true)
            },
            getMore(done) {
                this.showSpinner = false
                if(!this.onLine) {
                    this.$vux.toast.text('网络断开了')
                    if(typeof done === 'function') {
                        done(true)
                    }
                    return
                }
                this.queryData.pageIndex++;
                !this.loading && this.getHomeData(done)
            },
            getHomeData(done, refresh) {
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
                        if(refresh) {
                            this.apps = []
                        }
                        if (res.data.apps && res.data.apps.length) {
                            this.apps = [...this.apps, ...res.data.apps]
                            const position = this.$refs['scroller'] && this.$refs['scroller'].getPosition();
                            if (position) {
                                this.scrollPosition = {x: 0, y: position.top, animate: false}
                            }
                        } else {
                            if (typeof done === 'function') {
                                done(true)
                            }
                        }
                    }
                }, () => {
                    this.loading = false
                    this.failLoaded = true
                    if (typeof done === 'function') {
                        done(true)
                    }
                    if(this.queryData.pageIndex > 1) {
                        this.queryData.pageIndex--
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
                let searchWord;
                if(this.hotWords.length) {
                    searchWord = this.hotWords[this.$refs['hotWords'].currentIndex].searchWord
                }
                this.$router.push({name: 'AppStoreSearch', append: false, params: {hotWord: searchWord || '游戏'}})
            },
            goToDetail(app) {
                this.$router.push({name: 'AppDetail', append: false, params: {appId: app.id, appName: app.name}, query: {isSub: true}})
            }
        },
        components: {
            Grid,
            GridItem,
            BtnDownload,
            Marquee, MarqueeItem,
            RefreshTip,
            Spinner,
            ScrollToTop
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
        -webkit-touch-callout: none;
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
            transform: translate3d(0,0,0);
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
            color: rgba(34,34,34,1);
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

        }
        .list-item-c {
            width: 100%;
            min-height: 94px;
            padding: 0 13px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            &:active {
                background: #eee;
            }
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