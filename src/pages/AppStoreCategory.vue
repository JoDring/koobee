<template>
    <div class="app-store-category">
        <x-header :left-options="{backText:''}">
            应用分类
            <router-link :to="{name: 'AppStoreSearch', append: false, params: {hotWord: hotword}}" slot="right">
                <x-icon type="ios-search" style="fill: #666" size="23"></x-icon>
            </router-link>
        </x-header>
        <main class="main">
            <template v-if="list">
                <div class="list-title">游戏分类</div>
                <grid :cols="2">
                    <grid-item
                            :link="{name: 'AppStoreApps', append: false, params: {type: '-' + item.id, title: item.typeName}}"
                            class="list-item" v-for="item in list.game_cat"
                            :key="item.id">
                        <div class="list-item-img-c"><img class="list-item-img" :src="item.icon"></div>
                        <span class="list-item-name">{{item.typeName}}</span>
                    </grid-item>
                </grid>
                <div class="list-title">应用分类</div>
                <grid :cols="2">
                    <grid-item
                            :link="{name: 'AppStoreApps', append: false, params: {type: '-' + item.id, title: item.typeName}}"
                            class="list-item" v-for="item in list.app_cat"
                            :key="item.id">
                        <div class="list-item-img-c">
                            <img class="list-item-img" v-lazy="item.icon" v-if="onLine">
                            <img class="list-item-img" src="static/images/palceholder-logo.png">
                        </div>
                        <span class="list-item-name">{{item.typeName}}</span>
                    </grid-item>
                </grid>
            </template>
            <refresh-tip v-if="!loading && failLoaded && !list" @click.native="getCategory"></refresh-tip>
        </main>
        <!--loading spinner-->
        <div v-if="loading"
             style="width: 100%; height: 100%; position: absolute; z-index: 999; top: 0;left: 0; display: flex; justify-content: center; align-items: center">
            <spinner type="android"></spinner>
        </div>
    </div>
</template>

<script>
    import {XHeader, Grid, GridItem, Spinner} from 'vux'
    import sample from 'lodash/sample'
    import {fetchCategory, fetchSearchHotWords} from '../services/appStore'
    import RefreshTip from '../components/RefreshTip'
    export default {
        name: "app-store-category",
        data() {
            return {
                list: null,
                hotWords: null,
                onLine: window.navigator.onLine,
                loading: false,
                failLoaded: false
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
            this.getCategory().then(
                fetchSearchHotWords().then(res => {
                    if (res.code === '0') {
                        this.hotWords = res.data.hotwords
                    }
                })
            )
            this.$vux.bus.$on('off-line', () => {
                this.onLine = false
            })
            this.$vux.bus.$on('on-line', () => {
                this.onLine = true
            })
        },
        beforeRouteEnter(to, from, next) {
            document.title = '应用分类'
            next()
        },
        methods: {
            getCategory() {
                this.loading = true
                return fetchCategory().then(res => {
                    this.loading = false
                    if (res.code === '0') {
                        this.list = res.data
                    }
                }, () => {
                    this.loading = false
                    this.failLoaded = true
                    this.$vux.toast.text('获取数据失败', 'bottom')
                })
            }

        },
        components: {
            XHeader,
            Grid, GridItem,
            RefreshTip,
            Spinner
        }
    }
</script>

<style lang="less">
    @import "~vux/src/styles/weui/base/fn.less";

    @black: #000;
    @gray-dark: #5d5d5d;
    @gray-light: #919191;
    @bg-gray: #e5e5e5;
    .app-store-category {
        height: 100%;
        font-size: 13px;
        color: #222;
        display: flex;
        flex-direction: column;
        .vux-header {
            flex-shrink: 0;
            background: #fff;
            position: relative;
            z-index: 2;
        }
        .main {
            height: 100%;
            flex: 1;
            overflow: auto;
            transform: translate3d(0,0,0);
            -webkit-overflow-scrolling: touch;
        }
        //--
        .weui-grids {
            display: flex;
            flex-wrap: wrap;
        }
        .weui-grid{
            float: none;
        }
        //--
        .list-title {
            padding: 16px 16px 7px 16px;
            font-size: 16px;
        }
        .list-item {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 65px;
        }
        .list-item-name {
            font-size: 14px;
            color: #222;
            margin-left: 20px;
        }
        .list-item-img-c {
            width: 31px;
            height: 31px;
            border-radius: 2px;
            overflow: hidden;
        }
        .list-item-img {
            width: 100%;
            height: 100%;
        }
        //--
        .weui-grids, .weui-grid {
            &:before, &:after {
            }
        }

    }
</style>