<template>
    <div class="app-store-home">
        <div slot="header" class="header">
            <div class="search-home" @click="goToSearchPage">
                <div class="search-home-content">
                    <x-icon type="ios-search" size="15" class="search-home-icon"></x-icon>
                    <marquee ref="hotWords"><marquee-item v-for="item in hotWords" :key="item.id">{{item.searchWord}}</marquee-item></marquee>
                </div>
            </div>
            <grid class="category" v-if="homeData">
                <grid-item  v-for="item in homeData.navbars"
                            :link="categoryMap[item.type]"
                            :key="item.id">
                    <img class="category-icon" slot="icon" :src="item.iconUrl">
                    <span class="category-title" slot="label">{{ item.title }}</span>
                </grid-item>
            </grid>
        </div>
        <div class="list-home">
            <scroller
                    ref="scroller"
                    :on-refresh="refresh"
                    :on-infinite="getMore"
                    v-if="homeData">
                <div class="list-item" v-for="item in homeData.apps" :key="item.id">
                    <router-link :to="{name: 'AppDetail', params:{appId: item.id}, query: {isSub: true}}" class="list-item-icon-c">
                        <img class="list-item-icon" :src="item.iconUrl">
                    </router-link>
                    <router-link :to="{path: 'appDetail/'+ item.id, query: {isSub: true}}">
                        <div class="list-item-name">{{item.name}}</div>
                        <div class="list-item-brief">{{item.apkSize | formatSize(2)}}</div>
                        <div class="list-item-brief">{{item.brief}}</div>
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
            <btn-download class="btn-download btn-footer" url="a" btnText="安装" style="background: #ff6c3a;"></btn-download>
            <div class="icon-close-c" @click="showFooter = false">
                <x-icon class="icon-close" type="ios-close-empty" size="22"></x-icon>
            </div>
        </div>
    </div>
</template>

<script>
    import {Grid, GridItem, ViewBox, XImg, Marquee, MarqueeItem} from 'vux'
    import isEqual from 'lodash/isEqual'
    import {formatSize} from '../filters'
    import {fetchHome, fetchSearchHotWords} from '../services/appStore'
    import BtnDownload from '../components/btn-download'
    export default {
        name: "app-store-home",
        data() {
            return {
                queryData:{
                    pageIndex: 1,
                    pageSize: 10
                },
                homeData: null,
                hotWords:[],
                showFooter: true,
                loading:false,
                notEnd: true,
                categoryMap:{
                    need: {name: 'AppStoreCategory', append:false, params:{type: 'need'}},
                    rank: {name: 'AppStoreCategory', append:false, params:{type: 'rank'}},
                    game: {name: 'AppStoreCategory', append:false, params:{type: 'game'}},
                    category: {name: 'AppStoreCategory', append:false, params:{type: 'category'}},
                }
            }
        },
        computed: {
        },
        created(){
            document.title = '应用市场';
            this.getHomeData().then(
                this.getHotWords()
            )
        },
        methods: {
            refresh(done) {
                this.queryData.pageSize = 10
                this.getHomeData(done)
            },
            getMore(done) {
                this.queryData.pageSize += 10;
                if(!this.loading) {
                    this.getHomeData(done).then(res => {
                        this.notEnd = !isEqual({...this.homeData}, {...res.data})
                        !this.notEnd && this.$refs['scroller'].finishInfinite(true)
                    })
                }
            },
            getHomeData(done) {
                this.loading = true;
                return fetchHome(this.queryData).then( res => {
                    this.loading = false;
                    if(typeof done === 'function'){
                        done()
                    }
                    if(res.code === '0') {
                        this.homeData = res.data
                    }
                })
            },
            getHotWords() {
                fetchSearchHotWords().then(res => {
                    if(res.code === '0') {
                        this.hotWords = res.data.hotwords
                    }
                })
            },
            goToSearchPage() {
                const searchWord = this.hotWords[this.$refs['hotWords'].currentIndex].searchWord || ''
                this.$router.push({name:'AppStoreSearch', append:false, params:{hotWord: searchWord}})
            }
        },
        components: {
            Grid,
            GridItem,
            ViewBox,
            XImg,
            BtnDownload,
            Marquee, MarqueeItem
        },
        directives: {
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
.app-store-home{
    height: 100%;
    font-size: 12px;
    color: @black;
    display: flex;
    flex-direction: column;
    .header{
        background: #fff;
    }
    .scroll-c{
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        height: 100%;
        padding-bottom: 50px;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
    }
    //---
    .search-home{
        margin: 5px 13px 0;
        color: @gray-light;
    }
    .search-home-content{
        display: flex;
        width: 100%;
        align-items: center;
        background: @bg-gray;
        height: 30px;
        border-radius: 4px;
        .search-home-icon{
            margin:0 10px 0 13px;
            fill: @gray-light;
        }
    }
    //---
    .category-title{
        color: #2222;
    }
    //---
    .list-home{
        position: relative;
        flex: 1;
    }
    .list-item{
        position: relative;
        display: flex;
        align-items: center;
        padding: 0 13px;
        box-sizing: border-box;
        & + .list-item {
            margin-top: 27px;
        }
        &:active {
            background-color: #eee;
        }
    }
    .list-item-icon-c{
        width: 75px;
        height: 75px;
        border-radius: 12px;
        margin-right: 15px;
        overflow: hidden;
    }
    .list-item-icon{
        width: 100%;
    }
    .list-item-name{
        font-size: 16px;
        color: @black;
    }
    .list-item-brief{
        font-size: 11px;
        color: @gray-dark;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 200px;
    }
    //--
    .btn-download{
        width: 55px;
        height: 23px;
        font-size: 12px;
        position: absolute;
        right: 13px;
        top: 0;
        bottom: 0;
        margin: auto;
    }
    //---
    .footer{
        width: 100%;
        position: absolute;
        display: flex;
        align-items: center;
        bottom: 0;
        left: 0;
        z-index: 2;
        height: 60px;
        background: rgba(255,255,255, .9);
        .footer-app-icon{
            margin: 0 14px 0 13px;
            width: 35px;
        }
        .icon-close-c{
            width: 55px;
            height: 100%;
            position: absolute;
            top: 0;
            right: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .icon-close{
            fill: #6c6c6c;
        }
    }
    .footer-title{
        color: #222;
        font-size: 15px;
        line-height: 1.3;
    }
    .footer-brief{
        color: #6c6c6c;
        font-size: 11px;
    }
    .btn-download.btn-footer{
        right: 55px;
    }
    //--
    .weui-grids, .weui-grid{
        &:before, &:after {
            display: none;
        }
    }

}
</style>