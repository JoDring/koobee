<template>
    <div class="search-page">
        <div class="header">
            <x-icon class="header-icon" type="ios-arrow-left" size="22" @click.native="$router.go(-1)"></x-icon>
            <div class="search-input-c">
                <input id="search-input" type="text" class="search-input" v-model="queryData.query" :placeholder="hotWord">
                <label v-show="queryData.query" @click="queryData.query = ''" for="search-input">
                    <x-icon class="icon-close" type="ios-close" size="22"></x-icon>
                </label>
            </div>
            <x-icon class="header-icon" type="ios-search-strong" size="22" @click.native="getResult"></x-icon>
        </div>
        <main class="main">
            <!--热门搜索-->
            <div class="hot-words" v-if="hotWords.length && showHotWords && !queryData.query">
                <div class="hot-word-title">热门搜索</div>
                <div class="hot-word-item" v-for="item in hotWords" @click="handleHotWordClick(item.searchWord)">{{item.searchWord}}</div>
            </div>
            <!--match列表-->
            <div class="list-match" v-if="searchMatch">
                <div v-if="searchMatch.data && searchMatch.data.app && searchMatch.data.app.id" class="list-item">
                    <router-link :to="{name: 'AppDetail', append:false, params:{appId:searchMatch.data.app.id}, query: {isSub: true}}" class="list-item-icon-c">
                        <img class="list-item-icon" :src="searchMatch.data.app.iconUrl">
                    </router-link>
                    <router-link :to="{name: 'AppDetail', append:false, params:{appId:searchMatch.data.app.id}, query: {isSub: true}}">
                        <div class="list-item-name">{{searchMatch.data.app.name}}</div>
                        <div class="list-item-brief">{{searchMatch.data.app.apkSize | formatSize(2)}}</div>
                    </router-link>
                    <btn-download class="btn-download" :url="searchMatch.data.app.downloadUrl" btnText="下载"></btn-download>
                </div>
                <div v-if="searchMatch.data && searchMatch.data.items && searchMatch.data.items.length">
                    <div class="match-item"
                         @click="queryData.query = item"
                         v-for="(item, index) in searchMatch.data.items"
                         :key="index">{{item}}
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
                    v-if="searchResult">
                <div class="list-item" v-for="item in searchResult.apps" :key="item.id">
                    <router-link :to="{name: 'AppDetail',append:false, params:{appId: item.id}, query: {isSub: true}}" class="list-item-icon-c">
                        <img class="list-item-icon" :src="item.iconUrl">
                    </router-link>
                    <router-link :to="{name: 'AppDetail',append:false, params:{appId: item.id}, query: {isSub: true}}">
                        <div class="list-item-name">{{item.name}}</div>
                        <div class="list-item-brief">{{item.apkSize | formatSize(2)}}</div>
                        <div class="list-item-brief">{{item.brief}}</div>
                    </router-link>
                    <btn-download class="btn-download" :url="item.downloadUrl" btnText="下载"></btn-download>
                </div>
            </scroller>
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
                loading: false
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
            document.title = '应用市场';
            this.getHotWords()
        },
        methods: {
            getHotWords() {
                this.$vux.loading.show();
                fetchSearchHotWords().then( res => {
                    this.$vux.loading.hide();
                    if(res.code === '0') {
                        this.hotWords = res.data.hotwords
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
            refresh(done) {
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
            height: 34px;
            background: #fff;
            display: flex;
            align-items: center;
            flex-shrink: 0;
            &:after {
                content: '';
                position: absolute;
                left: 0;
                bottom: 0;
                height: 1px;
                width: 100%;
                color: #d7d7d7;
                transform-origin: 0 0;
                transform: scaleY(.5);
            }
        }
        .header-icon{
            width: 50px;
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
        }
        //---
        .hot-words{
            text-align: center;
            font-size: 16px;
            color: #009def;
            background-color: #fff;
            overflow: auto;
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
            height: 100%;
            overflow: auto;
            .list-item{
                height: 60px;
                position: relative;
                display: flex;
                align-items: center;
                box-sizing: border-box;
                background: #fff;
                padding: 0 20px;
                &:active {
                    background-color: #eee;
                }
            }
            .list-item-icon-c{
                width: 40px;
                height: 40px;
                border-radius: 4px;
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
        //---
        .list-result{
            .list-item{
                height: 80px;
                position: relative;
                display: flex;
                align-items: center;
                box-sizing: border-box;
                background: #fff;
                padding: 0 20px;
                &:active {
                    background-color: #eee;
                }
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