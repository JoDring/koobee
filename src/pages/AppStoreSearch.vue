<template>
    <div class="search-page">
        <div class="header">
            <x-icon class="header-icon" type="ios-arrow-left" size="25" @click.native="$router.go(-1)"></x-icon>
            <div class="search-input-c">
                <input v-focus
                       autocomplete="off"
                       type="search"
                       @focus="showHistorySearchWords = true"
                       @keyup.enter="refresh"
                       id="search-input"
                       class="search-input"
                       v-model.trim="queryData.query"
                       :placeholder="hotWord" ref="searchInput">
                <label v-show="queryData.query" @click="(showHistorySearchWords = true) && (queryData.query = '')"
                       for="search-input">
                    <x-icon class="icon-close" type="ios-close" size="22"></x-icon>
                </label>
            </div>
            <x-icon class="header-icon" type="ios-search" size="22" @click.native="handleSearch"></x-icon>
        </div>
        <main class="main">
            <!--热门搜索-->
            <div class="hot-words" v-if="hotWords.length && showHotWords && !searchResult">
                <div class="hot-word-title">热门搜索</div>
                <div class="hot-word-item" v-for="item in hotWords" @click="handleHotWordClick(item)">
                    {{item.searchWord}}
                </div>
            </div>
            <!--match列表-->
            <div class="list-match" v-else-if="showMatch && searchMatch && searchMatch.data">
                <!--输入匹配 app-->
                <div v-if="searchMatch.data && searchMatch.data.app && searchMatch.data.app.id"
                     class="list-match-item">
                    <router-link
                            :to="{name: 'AppDetail', append:false, params:{appId:searchMatch.data.app.id}, query: {isSub: true}}"
                            class="list-match-item-c">
                        <div class="list-match-item-icon-c">
                            <img class="list-match-item-icon" :src="searchMatch.data.app.iconUrl">
                        </div>
                        <div>
                            <div class="list-match-item-name">{{searchMatch.data.app.name}}</div>
                            <div class="list-match-item-brief">{{searchMatch.data.app.apkSize | formatSize(2)}}</div>
                        </div>
                    </router-link>
                    <btn-download class="btn-download" :url="searchMatch.data.app.downloadUrl"
                                  btnText="下载">
                    </btn-download>
                </div>
                <!--历史-->
                <div v-if="showHistorySearchWords && historySearchWords.length && !showHotWords && !searchResult"
                     class="history-search-list">
                    <div class="history-search-delete" @click="clearHistoryWords">
                        <x-icon class="search-delete-icon" size="23" type="ios-close"></x-icon>
                    </div>
                    <div class="match-item"
                         v-for="(item, index) in historySearchWords"
                         @click="setQuery(item)"
                         :key="index">
                        <x-icon type="ios-clock-outline" size="20" style="margin-right: 8px"></x-icon>
                        {{item}}
                    </div>
                </div>
                <!--输入匹配 关键字-->
                <div v-if="searchMatch.data && searchMatch.data.items && searchMatch.data.items.length">
                    <div class="match-item"
                         @click="setQuery(item)"
                         v-for="(item, index) in searchMatch.data.items"
                         :key="index">
                        {{item}}
                    </div>
                </div>
                <div v-if="searchMatch.data && !searchMatch.data.app.id && !searchMatch.data.items.length">
                    <div style="color: #666; font-size: 15px; text-align: center; margin: 30px 0">{{searchMatch.msg}}
                    </div>
                </div>
            </div>
            <!--result列表-->
            <scroller
                    class="list-result"
                    ref="scroller"
                    :on-refresh="refresh"
                    :on-infinite="getMore"
                    v-else-if="searchResult && searchResult.apps && searchResult.apps.length">
                <div class="list-item" v-for="item in searchResult.apps" :key="item.id">
                    <div @click="goToDetail(item)" class="list-item-c">
                        <div class="list-item-icon-c">
                            <img class="list-item-icon" v-lazy="item.iconUrl" v-if="onLine">
                            <img class="list-item-icon" src="static/images/palceholder-logo.png" v-else>
                        </div>
                        <div>
                            <div class="list-item-name">{{item.name}}</div>
                            <div class="list-item-brief">{{item.apkSize | formatSize(2)}}</div>
                            <div class="list-item-brief">{{item.brief}}</div>
                        </div>
                    </div>
                    <btn-download class="btn-download" :url="item.downloadUrl" btnText="安装"></btn-download>
                </div>
            </scroller>
            <scroll-to-top v-if="$refs['scroller']"
                           :scrollTop="scrollPosition.y"
                           @click.native="scrollPosition.y = 0"
                           :scroller="$refs['scroller']">
            </scroll-to-top>
            <div v-else-if="searchResult &&  !searchResult.apps.length">
                <div style="color: #666; font-size: 15px; text-align: center; margin: 30px 0">未找到匹配应用</div>
            </div>
            <transition name="vux-fade">
                <div class="my-scroller-mask"
                     style="position: absolute;
                            z-index: 9;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background: #fff;"
                     v-show="showScrollerMask"></div>
            </transition>
        </main>
        <!--loading spinner-->
        <div v-show="loading && showSpinner"
             style="width: 100%; height: 100%; position: absolute; z-index: 999; top: 0;left: 0; display: flex; justify-content: center; align-items: center">
            <spinner type="android"></spinner>
        </div>
    </div>
</template>

<script>
    import debounce from 'lodash/debounce'
    import {Spinner} from 'vux'
    import {formatSize} from '../filters'
    import BtnDownload from '../components/btn-download'
    import {fetchSearchHotWords, fetchSearchMatch, fetchSearchResult} from '../services/appStore'
    import ScrollToTop from '../components/ScrollToTop'
    export default {
        name: "app-store-search",
        data() {
            return {
                queryData: {
                    query: '',
                    pageIndex: 1,
                    pageSize: 10
                },
                hotWords: [],
                showHotWords: true,
                showMatch: true,
                searchMatch: {data: null},
                searchResult: null,
                loading: false,
                showSpinner: true,
                title: '应用搜索',
                historySearchWords: this.getCacheHistory() ? this.getCacheHistory() : [],
                showHistorySearchWords: true,
                onLine: window.navigator.onLine,
                scrollPosition: {x: 0, y: 0, animate: false},
                showScrollerMask: false
            }
        },
        props: {
            hotWord: {
                type: String,
                default: '游戏'
            }
        },
        watch: {
            'queryData.query': function (newValue) {
                if (!this.fetchingResult) {
                    if (this.hotWords.length && !newValue) {
                        this.showHotWords = true
                        this.searchMatch.data = null
                        this.searchResult = null
                    } else if (typeof this.queryData.query === 'string') {
                        const isWord = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/.test(this.queryData.query.trim().replace(/\s/g, ''))
                        if (isWord) {
                            this.getMatch()
                        }
                    }
                }
            }
        },
        computed: {
            results() {
                if (this.hotWords.length) {
                    return this.hotWords.map(v => {
                        v.title = v.searchWord;
                        return v
                    })
                }
            }
        },
        created() {
            if (this.$route.query.query) {
                this.queryData.query = this.$route.query.query
                this.refresh()
            }
            this.getHotWords();
            this.$vux.bus.$on('off-line', () => {
                this.onLine = false
            })
            this.$vux.bus.$on('on-line', () => {
                this.onLine = true
            })
        },
        beforeRouteEnter(to, from, next) {
            document.title = '应用搜索'
            next(vm => {
                setTimeout(function () {
                    if (!vm.queryData.query) {
                        vm.$refs['searchInput'] && vm.$refs['searchInput'].focus()
                    }
                    vm.$refs['scroller'] && vm.$refs['scroller'].scrollTo(0, vm.scrollPosition.y, true)
                }, 250)
                setTimeout(function () {
                    vm.showScrollerMask = false
                }, 450)
            })
        },
        beforeRouteLeave(to, from, next) {
            if (this.onLine) {
                const position = this.$refs['scroller'] && this.$refs['scroller'].getPosition();
                if (position) {
                    this.scrollPosition = {x: 0, y: position.top, animate: false}
                }
                this.showScrollerMask = true
                if (to.name !== 'AppDetail') {
                    setTimeout(() => {
                        this.queryData.query = ''
                    }, 500)
                }
                next()
            } else {
                this.$vux.toast.text('网络异常')
            }
        },
        methods: {
            getHotWords() {
                fetchSearchHotWords().then(res => {
                    if (res.code === '0') {
                        this.hotWords = res.data.hotwords
                        this.hotWords.length = 8
                    }
                })
            },
            getMatch: debounce(function () {
                this.loading = true
                this.showMatch = true
                this.showSpinner = false
                !this.searchMatch.data && (this.showSpinner = true)
                fetchSearchMatch(this.queryData).then(res => {
                    this.loading = false
                    if (res.code === '0') {
                        this.searchMatch = res
                        this.showHotWords = false
                        this.searchResult = null
                    }
                    document.querySelector('.main') && (document.querySelector('.main').scrollTop = 0)
                }, () => {
                    this.loading = false
                })
            }, 500),
            getResult(done, refresh) {
                if (this.inputEl) {
                    this.inputEl.blur()
                }
                this.loading = true
                this.searchMatch.data = null
                this.showHistorySearchWords = false
                this.showHotWords = false
                this.fetchingResult = true
                this.queryData.query = this.queryData.query ? this.queryData.query : this.hotWord;
                fetchSearchResult(this.queryData).then(res => {
                    if (typeof done === 'function') {
                        done()
                    }
                    this.loading = false
                    this.fetchingResult = false
                    if (refresh) {
                        this.searchResult = null
                    }
                    if (res.code === '0') {
                        this.searchResult = res.data
                        // 保存搜索历史
                        if(res.data && res.data.apps.length) {
                            this.setCacheHistory(this.queryData.query);
                        }
                    }
                }, () => {
                    this.loading = false
                    this.fetchingResult = false
                    if (typeof done === 'function') {
                        done(true)
                    }
                    this.$vux.toast.text('加载超时', 'bottom')
                })
            },
            handleHotWordClick(data) {
                if (data.ikey === 'app') {
                    this.$router.push({
                        name: 'AppDetail',
                        append: false,
                        params: {appId: data.ivalue},
                        query: {isSub: true}
                    })
                } else {
                    this.queryData.query = data.searchWord;
                    this.showHotWords = false
                    this.showHistorySearchWords = false
                }
            },
            setCacheHistory(word) {
                if (word && word.trim()) {
                    const exist = this.historySearchWords.some(v => {
                        return v === word
                    })
                    if (exist) {
                        return
                    }
                    this.historySearchWords.unshift(word)
                    if (this.historySearchWords.length > 8) {
                        this.historySearchWords.length = 8
                    }
                    const words = JSON.stringify(this.historySearchWords)
                    window.localStorage.setItem('historySearchWordsFromAppStore', words)
                }
            },
            setQuery(data) {
                this.queryData.query = data
            },
            getCacheHistory() {
                return JSON.parse(window.localStorage.getItem('historySearchWordsFromAppStore'))
            },
            clearHistoryWords() {
                this.historySearchWords = []
                window.localStorage.removeItem('historySearchWordsFromAppStore')
            },
            refresh(done, showSpinner = false) {
                if (!this.onLine) {
                    this.$vux.toast.text('网络断开了')
                    if (typeof done === 'function') {
                        done(true)
                    }
                    return
                }
                this.showSpinner = showSpinner
                this.queryData.pageIndex = 1
                this.getResult(done, true)
            },
            getMore(done) {
                if (!this.onLine) {
                    this.$vux.toast.text('网络断开了')
                    if (typeof done === 'function') {
                        done(true)
                    }
                    return
                }
                this.queryData.pageIndex++
                this.loading = true;
                this.showSpinner = false;
                fetchSearchResult(this.queryData).then(res => {
                    if (typeof done === 'function') {
                        done()
                    }
                    this.loading = false
                    this.showSpinner = true;
                    if (res.code === '0') {
                        if (res.data.apps && res.data.apps.length) {
                            this.searchResult.apps = [...this.searchResult.apps, ...res.data.apps]
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
                    if (typeof done === 'function') {
                        done(true)
                    }
                    //this.$refs['scroller'] && this.$refs['scroller'].finishInfinite(true)
                    this.queryData.pageIndex--
                    this.loading = false
                    this.showSpinner = true;
                    this.$vux.toast.text('获取数据失败')
                })

            },
            goToDetail(app) {
                this.$router.push({
                    name: 'AppDetail',
                    append: false,
                    params: {appId: app.id, appName: app.name},
                    query: {isSub: true}
                })
            },
            handleSearch() {
                this.showMatch = false
                this.$router.replace({
                    name: 'AppStoreSearch',
                    append: false,
                    params: {hotWord: this.hotWord},
                    query: {query: this.queryData.query}
                })
                this.refresh(null, true)
            }
        },
        components: {
            BtnDownload,
            Spinner,
            ScrollToTop
        },
        filters: {
            formatSize
        },
        directives: {
            focus: {
                inserted: function (el) {
                    el.focus()
                }
            }
        }
    }
</script>

<style lang="less">
    @import "~vux/src/styles/weui/base/fn.less";

    @black: #000;
    @gray-dark: #5d5d5d;
    @gray-light: #919191;

    @bg-gray: #e5e5e5;
    .search-page {
        height: 100%;
        display: flex;
        flex-direction: column;
        .header {
            width: 100%;
            height: 45px;
            display: flex;
            align-items: center;
            flex-shrink: 0;
            z-index: 999;
            position: relative;
            &:after {
                .setBottomLine(#d7d7d7)
            }
        }
        .header-icon {
            width: 50px;
            fill: #666;
        }
        .search-input-c {
            display: block;
            height: 100%;
            flex: 1;
            margin-right: 15px;
            position: relative;
        }
        .icon-close {
            position: absolute;
            z-index: 2;
            right: -10px;
            top: 0;
            bottom: 0;
            margin: auto;
            fill: #d7d7d7;
        }
        .search-input {
            display: block;
            height: 100%;
            width: 85%;
            font-size: 15px;
            border: none;
            box-sizing: border-box;
            padding-left: 15px;
            -webkit-appearance: none;
            &:focus {
                outline: none;
            }
        }
        //---
        .main {
            flex: 1;
            position: relative;
            overflow: auto;
            transform: translate3d(0, 0, 0);
            -webkit-overflow-scrolling: touch;
        }
        //---
        .hot-words {
            text-align: center;
            font-size: 16px;
            color: #009def;
            background-color: #fff;
        }
        .hot-word-title {
            font-size: 21px;
            color: #222;
            margin: 28px 0 24px 0;
        }
        .hot-word-item {
            margin-bottom: 14px;
            &:active {
                background-color: #ddd;
            }
        }
        //---
        .list-match {
            .list-match-item {
                position: relative;
            }
            .list-match-item-c {
                height: 60px;
                display: flex;
                align-items: center;
                box-sizing: border-box;
                background: #fff;
                padding: 0 20px;
                &:active {
                    background-color: #eee;
                }
            }
            .list-match-item-icon-c {
                width: 40px;
                height: 40px;
                border-radius: 4px;
                margin-right: 10px;
                overflow: hidden;
            }
            .list-match-item-icon {
                width: 100%;
            }
            .list-match-item-name {
                font-size: 16px;
                color: @black;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 200px;
            }
            .list-match-item-brief {
                font-size: 11px;
                color: @gray-dark;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 200px;
            }
            .btn-download {
                width: 50px;
                height: 21px;
                font-size: 12px;
                position: absolute;
                right: 13px;
                top: 0;
                bottom: 0;
                margin: auto;
            }
        }
        //---
        .match-item {
            height: 45px;
            padding: 0 13px;
            line-height: 45px;
            color: #222;
            font-size: 15px;
            &:active {
                background-color: #eee;
            }
        }
        .history-search-list {
            background: #efefef;
            position: relative;
            .history-search-delete {
                position: absolute;
                z-index: 2;
                width: 40px;
                height: 40px;
                top: 0;
                right: 0;
                padding: 8px;
            }
            .search-delete-icon {
                fill: #bbb;
                float: right;
            }
            .match-item {
                display: flex;
                align-items: center;
                &:active {
                    background-color: #fff;
                }
            }
        }
        //---
        .list-result {
            .list-item {
                position: relative;
                &:active {
                    background-color: #eee;
                }
            }
            .list-item-c {
                height: 94px;
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
                width: 55px;
                height: 24px;
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