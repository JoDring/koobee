<template>
    <div class="search-page">
        <div class="header">
            <x-icon class="header-icon" type="ios-arrow-left" size="25" @click.native="$router.go(-1)"></x-icon>
            <div class="search-input-c">
                <input id="search-input" type="text" class="search-input" v-model="queryData.query" :placeholder="hotWord">
                <label v-show="queryData.query" @click="queryData.query = ''" for="search-input">
                    <x-icon class="icon-close" type="ios-close" size="22"></x-icon>
                </label>
            </div>
            <x-icon class="header-icon" type="ios-search" size="22" @click.native="getResult"></x-icon>
        </div>
        <main class="main">
            <!--热门搜索-->
            <div class="hot-words" v-if="hotWords.length && showHotWords && !queryData.query && !searchResult">
                <div class="hot-word-title">热门搜索</div>
                <div class="hot-word-item" v-for="item in hotWords" @click="handleHotWordClick(item.searchWord)">{{item.searchWord}}</div>
            </div>
            <!--match列表-->
            <div class="list-match" v-if="searchMatch">
                <div v-if="searchMatch.data && searchMatch.data.app && searchMatch.data.app.id"
                     class="list-match-item">
                    <router-link :to="{name: 'AppDetail', append:false, params:{appId:searchMatch.data.app.id}, query: {isSub: true}}" class="list-match-item-c">
                        <div class="list-match-item-icon-c">
                            <img class="list-match-item-icon" :src="searchMatch.data.app.iconUrl">
                        </div>
                        <div>
                            <div class="list-match-item-name">{{searchMatch.data.app.name}}</div>
                            <div class="list-match-item-brief">{{searchMatch.data.app.apkSize | formatSize(2)}}</div>
                        </div>
                    </router-link>
                    <btn-download class="btn-download" :url="searchMatch.data.app.downloadUrl" btnText="下载"></btn-download>
                </div>
                <div v-if="historySearchWords.length && !showHotWords" class="history-search-list">
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
                <div v-if="searchMatch.data && searchMatch.data.items && searchMatch.data.items.length">
                    <div class="match-item"
                         @click="setQuery(item)"
                         v-for="(item, index) in searchMatch.data.items"
                         :key="index">
                        {{item}}
                    </div>
                </div>
                <div v-if="searchMatch.data && !searchMatch.data.app.id && !searchMatch.data.items.length">
                    <div style="color: #666; font-size: 15px; text-align: center; margin: 30px 0">{{searchMatch.msg}}</div>
                </div>
            </div>
            <!--result列表-->
            <scroller
                    class="list-result"
                    ref="scroller"
                    :on-refresh="refresh"
                    :on-infinite="getMore"
                    v-if="searchResult && searchResult.apps && searchResult.apps.length">
                <div class="list-item" v-for="item in searchResult.apps" :key="item.id">
                    <router-link  :to="{name: 'AppDetail',append:false, params:{appId: item.id}, query: {isSub: true}}" class="list-item-c">
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
            <div v-else-if="searchResult &&  !searchResult.apps.length">
                <div style="color: #666; font-size: 15px; text-align: center; margin: 30px 0">未找到匹配应用</div>
            </div>
        </main>
    </div>
</template>

<script>
    import debounce from 'lodash/debounce'
    import {formatSize} from '../filters'
    import BtnDownload from '../components/btn-download'
    import {fetchSearchHotWords, fetchSearchMatch, fetchSearchResult} from '../services/appStore'
    export default {
        name: "app-store-search",
        data() {
            return {
                queryData: {
                    query:'',
                    pageIndex: 1,
                    pageSize: 10
                },
                hotWords:[],
                showHotWords: true,
                searchMatch: {data: null},
                searchResult: null,
                loading: false,
                title: '应用搜索',
                historySearchWords: this.getCacheHistory() ? this.getCacheHistory() : []
            }
        },
        props: {
            hotWord: {
                type: String,
                default: '游戏'
            }
        },
        watch:{
            'queryData.query': function (newValue) {
                if(this.hotWords.length && !newValue) {
                    this.showHotWords = true
                    this.searchMatch = null
                    this.searchResult = null
                } else{
                    this.searchResult = null
                    !this.loading && this.getMatch()
                }
            }
        },
        computed: {
            results(){
                if(this.hotWords.length) {
                    return this.hotWords.map(v => {
                        v.title = v.searchWord;
                        return v
                    })
                }
            }
        },
        created(){
            this.getHotWords()
        },
        beforeRouteEnter (to, from, next) {
            document.title = to.meta.title
            next()
        },
        methods: {
            getHotWords() {
                this.$vux.loading.show();
                fetchSearchHotWords().then( res => {
                    this.$vux.loading.hide();
                    if(res.code === '0') {
                        this.hotWords = res.data.hotwords
                        this.hotWords.length = 8
                    }
                }, () => {
                    this.$vux.loading.hide();
                })
            },
            getMatch: debounce(function () {
                this.$vux.loading.show();
                fetchSearchMatch(this.queryData).then( res => {
                    this.$vux.loading.hide();
                    if(res.code === '0') {
                        this.searchMatch = res
                    }
                }, () => {
                    this.$vux.loading.hide();
                })
            }, 500),
            getResult(done) {
                this.$vux.loading.show();
                this.loading = true;
                this.searchMatch = null
                this.queryData.query = this.queryData.query ? this.queryData.query : this.hotWord;
                fetchSearchResult(this.queryData).then( res => {
                    if(typeof done === 'function'){
                        done()
                    }
                    this.$vux.loading.hide();
                    this.loading = false
                    if(res.code === '0') {
                        this.searchResult = res.data
                    }
                     // 保存搜索历史
                    this.setCacheHistory(this.queryData.query);
                }, () => {
                    if(typeof done === 'function'){
                        done()
                    }
                    this.$vux.loading.hide();
                    this.loading = false
                })
            },
            handleHotWordClick(data) {
                this.queryData.query = data;
                this.showHotWords = false
            },
            setCacheHistory(word) {
                if(word && word.trim()) {
                    const exist = this.historySearchWords.some(v => {
                        return v === word
                    })
                    if(exist) {
                        return
                    }
                    this.historySearchWords.push(word)
                    const words = JSON.stringify(this.historySearchWords)
                    window.localStorage.setItem('historySearchWordsFromAppStore', words)
                }
            },
            setQuery(data) {
              this.queryData.query = data
                document.querySelector('.main').scrollTop = 0
            },
            getCacheHistory() {
                return JSON.parse(window.localStorage.getItem('historySearchWordsFromAppStore'))
            },
            clearHistoryWords() {
                this.historySearchWords = []
                window.localStorage.removeItem('historySearchWordsFromAppStore')
            },
            refresh(done) {
                this.searchResult = null
                this.queryData.pageIndex = 1
                this.getResult(done)
            },
            getMore(done) {
                this.queryData.pageIndex ++
                this.loading = true;
                fetchSearchResult(this.queryData).then( res => {
                    if(typeof done === 'function'){
                        done()
                    }
                    this.loading = false
                    if(res.code === '0') {
                        if(res.data.apps && res.data.apps.length) {
                            this.searchResult.apps = [...this.searchResult.apps, ...res.data.apps]
                        } else {
                            console.log('finishInfinite')
                            this.$refs['scroller'].finishInfinite(true)
                        }
                    }
                }, () => {
                    if(typeof done === 'function'){
                        done()
                    }
                    this.loading = false
                })

            }
        },
        components: {
            BtnDownload
        },
        filters: {
            formatSize
        }
    }
</script>

<style lang="less">
    @import "~vux/src/styles/weui/base/fn.less";
    @black : #000;
    @gray-dark : #5d5d5d;
    @gray-light : #919191;

    @bg-gray: #e5e5e5;
    .search-page{
        height: 100%;
        display: flex;
        flex-direction: column;
        .header{
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
        .header-icon{
            width: 50px;
            fill: #666;
        }
        .search-input-c{
            display: block;
            height: 100%;
            flex: 1;
            margin-right: 15px;
            position: relative;
        }
        .icon-close{
            position: absolute;
            z-index: 2;
            right: -10px;
            top: 0;
            bottom: 0;
            margin: auto;
            fill: #d7d7d7;
        }
        .search-input{
            display: block;
            height: 100%;
            width: 100%;
            font-size: 15px;
            border: none;
            box-sizing: border-box;
            padding-left:15px;
            &:focus {
                outline: none;
            }
        }
        //---
        .main{
            flex: 1;
            position: relative;
            overflow: auto;
            -webkit-overflow-scrolling: touch;
        }
        //---
        .hot-words{
            text-align: center;
            font-size: 16px;
            color: #009def;
            background-color: #fff;
        }
        .hot-word-title{
            font-size: 21px;
            color:#222;
            margin: 28px 0 24px 0;
        }
        .hot-word-item{
            margin-bottom: 14px;
            &:active{
                background-color: #ddd;
            }
        }
        //---
        .list-match{
            .list-match-item{
                position: relative;
            }
            .list-match-item-c{
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
            .list-match-item-icon-c{
                width: 40px;
                height: 40px;
                border-radius: 4px;
                margin-right: 10px;
                overflow: hidden;
            }
            .list-match-item-icon{
                width: 100%;
            }
            .list-match-item-name{
                font-size: 16px;
                color: @black;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 200px;
            }
            .list-match-item-brief{
                font-size: 11px;
                color: @gray-dark;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 200px;
            }
            .btn-download{
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
        .match-item{
            height: 45px;
            padding: 0 13px;
            line-height: 45px;
            color: #222;
            font-size: 15px;
            &:active {
                background-color: #eee;
            }
        }
        .history-search-list{
            background: #efefef;
            position: relative;
            .history-search-delete{
                position: absolute;
                z-index: 2;
                width: 40px;
                height: 40px;
                top: 0;
                right: 0;
                padding: 8px;
            }
            .search-delete-icon{
                fill: #bbb;
                float: right;
            }
            .match-item{
                display: flex;
                align-items: center;
            }
        }
        //---
        .list-result{
            .list-item{
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
            .list-item-icon-c{
                width: 65px;
                height: 65px;
                border-radius: 8px;
                margin-right: 10px;
                overflow: hidden;
            }
            .list-item-icon{
                width: 100%;
            }
            .list-item-name{
                font-size: 16px;
                color: @black;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 200px;
            }
            .list-item-brief{
                font-size: 11px;
                color: @gray-dark;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 200px;
            }
            .btn-download{
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