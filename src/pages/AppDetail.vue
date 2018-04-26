<template>
    <div class="view-container">
        <template v-if="appList.length > 0">
            <div class="vux-header view-header" v-if="$route.query.isSub" @click="$router ? $router.back() : window.history.back()">
                <div class="vux-header-left" >
                    <a class="vux-header-back"></a>
                    <div class="left-arrow"></div>
                </div>
                <h1 class="vux-header-title">
                    {{appList.length && appList[0].name}}
                </h1>
            </div>
            <div class="view-body">
                <section class="section-brief">
                    <div class="blur-img-c">
                        <x-img container=".view-body" class="blur-img"
                               default-src="http://360.cooseatech.cn/appstore/H5/storehome/static/appStore/palceholder-logo.webp"
                               :src="appList[0].largeIcon? appList[0].largeIcon:appList[0].iconUrl" width="180"
                               height="180">
                        </x-img>
                        <div class="mask-color"></div>
                        <img class="mask-img" src="../assets/appStore/bg-mask.webp" width="720" height="122">
                    </div>
                    <div class="logo-c">
                        <x-img container=".view-body" class="logo-big"
                               default-src="http://360.cooseatech.cn/appstore/H5/storehome/static/appStore/palceholder-logo.webp"
                               :src="appList[0].largeIcon? appList[0].largeIcon:appList[0].iconUrl" width="180"
                               height="180">
                        </x-img>
                        <div class="inverted-logo-c">
                            <x-img container=".view-body" class="logo-big inverted"
                                   default-src="http://360.cooseatech.cn/appstore/H5/storehome/static/appStore/palceholder-logo.webp"
                                   :src="appList[0].largeIcon? appList[0].largeIcon:appList[0].iconUrl"
                                   width="180"
                                   height="180">
                            </x-img>
                        </div>
                        <div class="inverted-mask"></div>
                    </div>
                    <div class="app-desc">
                        <h1 class="app-desc-title">{{appList[0].name}}</h1>
                        <p class="app-desc-detail">
                            <span>{{appList[0].rating}}分</span><span>{{appList[0].downloadTimes | timesFormat}}人使用</span><span>{{appList[0].apkSizeFormat}}</span>
                        </p>
                    </div>
                    <div class="app-down-btn">
                        <btn-download :url="appList[0].downloadUrl" :app="appList[0]">
                        </btn-download>
                    </div>

                </section>
                <section class="app-images">
                    <x-img v-for="item in imgList"
                           class="app-images-item"
                           default-src="http://360.cooseatech.cn/appstore/H5/storehome/static/appStore/placeholder-appbg.webp"
                           container=".app-images"
                           :src="item"
                           :key="item"
                           v-if="onLine">
                    </x-img>
                    <img class="app-images-item" src="http://360.cooseatech.cn/appstore/H5/storehome/static/appStore/placeholder-appbg.webp" v-else>
                </section>
                <section class="app-desc-detail">
                    <h2>【应用介绍】</h2>
                    <p :class="{'show-more': showMore}" v-html="appList[0].description"></p>
                </section>
                <a href="#" class="arrow-down-c" @click.prevent="showMore = !showMore">
                    <img src="../assets/arrow-down.webp" class="arrow-down" width="60" height="60"
                         :class="{rotated: showMore}">
                </a>
                <section class="app-version">
                    <p>最新版本: {{appList[0].versionName}}</p>
                    <p>更新时间: {{appList[0].updateTime}}</p>
                </section>
                <section class="app-ad" v-if="sameCatApps.length > 0">
                    <h2>相关推荐</h2>
                    <div class="app-ad-list">
                        <div class="flexbox">
                            <div class="flexbox-item ad-list-item" v-for="item in sameCatApps" :key="item.id">
                                <router-link
                                        :to="{name:'AppDetail', params: {appId: item.id, appName: item.name}, query: {isSub: true}}">
                                    <div class="logo-sm-c">
                                        <x-img class="logo-sm" default-src="http://360.cooseatech.cn/appstore/H5/storehome/static/appStore/palceholder-logo.webp"
                                               :src="item.largeIcon ? item.largeIcon : item.iconUrl"
                                               container=".view-body" width="130"
                                               height="130" v-if="onLine">
                                        </x-img>
                                        <img class="logo-sm" src="http://360.cooseatech.cn/appstore/H5/storehome/static/appStore/palceholder-logo.webp" v-else>
                                    </div>
                                </router-link>
                                <h3>{{item.name}}</h3>
                                <p>{{item.downloadTimes | timesFormat}}人使用</p>
                                <div class="btn-c">
                                    <btn-download :url="item.downloadUrl"
                                                  :app="item"
                                                  :mini="true">
                                    </btn-download>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section class="app-ad" v-if="sameDevApps.length > 0">
                    <h2>大家也喜欢</h2>
                    <div class="app-ad-list">
                        <div class="flexbox" :gutter="0">
                            <div class="flexbox-item ad-list-item" v-for="item in sameDevApps" :key="item.id">
                                <router-link
                                        :to="{name:'AppDetail', params: {appId: item.id, appName: item.name}, query: {isSub: true}}">
                                    <div class="logo-sm-c">
                                        <x-img class="logo-sm" default-src="http://360.cooseatech.cn/appstore/H5/storehome/static/appStore/palceholder-logo.webp"
                                               :src="item.largeIcon ? item.largeIcon : item.iconUrl"
                                               container=".view-body" width="130"
                                               height="130" v-if="onLine">
                                        </x-img>
                                        <img class="logo-sm" src="http://360.cooseatech.cn/appstore/H5/storehome/static/appStore/palceholder-logo.webp" v-else>
                                    </div>
                                </router-link>
                                <h3>{{item.name}}</h3>
                                <p>{{item.downloadTimes | timesFormat}}人使用</p>
                                <div class="btn-c">
                                    <btn-download :url="item.downloadUrl"
                                                  :app="item"
                                                  :mini="true">
                                    </btn-download>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section class="app-other">
                    <h2>其他信息</h2>
                    <p><span>开发者</span><span>{{appList[0].developer}}</span></p>
                </section>
            </div>
        </template>
        <!--loading spinner-->
        <div v-if="loading"
             style="width: 100%; height: 100%; position: absolute; z-index: 99; top: 0;left: 0; display: flex; justify-content: center; align-items: center">
            <spinner type="android"></spinner>
        </div>
        <router-link :to="{name: 'AppStoreHome', append: false}"
                     style="
                     position: fixed;
                     z-index: 999;
                     right: 20px;
                     background: #fff;
                     border-radius: 50%;
                     width: 44px;
                     height: 44px;
                     display: flex;
                     justify-content: center;
                     align-items: center;
                     box-shadow: 1px 1px 1px #ccc;
                      bottom: 60px;">
            <x-icon type="ios-home" size="30" style="fill:#009def;"></x-icon>
        </router-link>
        <refresh-tip v-if="!loading && failLoaded && appList.length === 0"
                     @click.native="refresh(null, true)">
        </refresh-tip>
    </div>
</template>
<script>
    import BtnDownload from '../components/btn-download.vue';
    import {XImg, Spinner} from 'vux';
    import RefreshTip from '../components/RefreshTip'
    import {fetchAppDetail} from '../services/appStore'

    export default {
        name: 'AppDetail',
        props: {
            appId: {
                require: true
            },
            appName: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                msg: '',
                showMore: false,
                loading: false,
                failLoaded: false,
                appList: [], //第一个是 需要详情的App
                onLine: window.navigator.onLine
            }
        },
        computed: {
            imgList() { //app宣传图片
                return this.appList[0].screenshotsUrl.split(',');
            },
            sameCatApps() { //相关推荐
                return this.appList.slice(1, 5);
            },
            sameDevApps() { //大家也喜欢
                return this.appList.slice(5, 9);
            }
        },
        created() {
            // 第三方来源需要添加的头
            /*const metaNode = document.createElement('meta')
            metaNode.name = 'referrer'
            metaNode.content = 'never'
            document.head.appendChild(metaNode)*/
            /*window.setState = function setState(id, state) { //给app调用改变组件按钮状态的接口函数
                let newAppList = this.appList.map(value => {
                    if (value.id == id) {
                        value.btnState = Object.assign({}, value.btnState, state)
                    }
                    return value;
                });
                this.appList = [...newAppList];
            }.bind(this);*/
            document.title = this.appName + ' APP详情'
            this.fetchData();
            this.$vux.bus.$on('off-line', () => {
                this.onLine = false
            })
            this.$vux.bus.$on('on-line', () => {
                this.onLine = true
            })
            window.addEventListener('popstate', (e) => {
                this.loading = false;
                this.$vux.confirm.hide();
                this.$vux.alert.hide();
            })
        },
        watch: {
            '$route': function () {
                this.fetchData()
                document.title = this.appName + ' App详情'
            }
        },
        methods: {
            fetchData() {
                this.loading = true
                fetchAppDetail({appId: this.appId}).then(res => {
                    this.loading = false
                    if (res.code === '0' || res.code === 0) {
                        let data = res.data;
                        this.appList = [data.app];
                        if (data.sameCatApps && Array.isArray(data.sameCatApps)) {
                            this.appList = [...this.appList, ...data.sameCatApps];
                        }
                        if (data.sameDevApps && Array.isArray(data.sameDevApps)) {
                            this.appList = [...this.appList, ...data.sameDevApps];
                        }
                        if (this.appList.length > 0) {
                            const scrollContainer = document.querySelector('.view-body')
                            const imgScrollContainer = document.querySelector('.app-images')
                            scrollContainer && (scrollContainer.scrollTop = 0);
                            imgScrollContainer && (imgScrollContainer.scrollLeft = 0);
                        }
                        /*
                        * 绑定按钮状态响应的data
                        * percentage 进度信息 0-100 整数
                        * startLoad 是否开始了下载
                        * pause 开始下载后暂停
                        * demo: setState('435', {startLoad:true, pause: false,  percentage: 20})
                        * */
                        this.appList = this.appList.map(value => {
                            return Object.assign(value, {
                                btnState: {
                                    percentage: 0,
                                    startLoad: false,
                                    pause: false
                                }
                            });
                        })

                    } else {
                        this.$vux.confirm.show({
                            title: '错误提示',
                            content: res.msg + ', 返回上一页?',
                            onConfirm: () => {
                                this.$router ? this.$router.back() : window.history.back();
                            }
                        });
                    }
                }, res => {
                    this.loading = false
                    this.failLoaded = true
                    this.$vux.confirm.show({
                        title: '错误提示',
                        content: '获取失败了',
                        onConfirm: () => {
                            this.$router ? this.$router.back() : window.history.back();
                        }
                    });
                });
            }
        },
        components: {
            BtnDownload,
            XImg,
            Spinner,
            RefreshTip
        },
        filters: {
            timesFormat(val) {
                let fm = '';
                let u = 0;
                while (u < 2 && val > 10000) {
                    u++;
                    val /= 10000;
                }
                let unit = '';
                switch (u) {
                    case 1:
                        unit = '万';
                        break;
                    case 2:
                        unit = '亿';
                        break;
                }
                fm += val.toFixed(0) + unit;
                return fm;
            }
        },
    }
</script>
<style lang="less" scoped>
    @import "../../node_modules/vux/src/styles/weui/base/fn.less";
    .vux-header {
        position: relative;
        padding: 3px 0;
        box-sizing: border-box;
        background-color: @header-background-color;
    }

    .vux-header .vux-header-title {
        line-height: 40px;
        text-align: center;
        font-size: 18px;
        font-weight: 400;
        color: @header-title-color;
    }

    .vux-header-title-area, .vux-header .vux-header-title {
        margin: 0 88px;
        height: 40px;
        width: auto;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .vux-header .vux-header-title > span {
        display: inline-block;
    }

    .vux-header .vux-header-left, .vux-header .vux-header-right {
        position: absolute;
        top: 14px;
        display: block;
        font-size: 14px;
        line-height: 21px;
        color: @header-text-color;
    }

    .vux-header .vux-header-left a, .vux-header .vux-header-left button, .vux-header .vux-header-right a, .vux-header .vux-header-right button {
        float: left;
        margin-right: 8px;
        color: @header-text-color;
    }

    .vux-header .vux-header-left a:active, .vux-header .vux-header-left button:active, .vux-header .vux-header-right a:active, .vux-header .vux-header-right button:active {
        opacity: .5
    }

    .vux-header .vux-header-left {
        left: 18px
    }

    .vux-header .vux-header-left .vux-header-back {
        padding-left: 16px
    }

    .vux-header .vux-header-left .left-arrow {
        position: absolute;
        width: 30px;
        height: 30px;
        top: -5px;
        left: -5px;

        &:before {
            content: "";
            position: absolute;
            width: 12px;
            height: 12px;
            border: 1px solid @header-arrow-color;
            border-width: 1px 0 0 1px;
            transform: rotate(315deg);
            top: 8px;
            left: 7px;
        }
    }

    .vux-header .vux-header-right {
        right: 15px
    }

    .vux-header .vux-header-right a, .vux-header .vux-header-right button {
        margin-left: 8px;
        margin-right: 0
    }

    .vux-header .vux-header-right .vux-header-more:after {
        content: "\2022\0020\2022\0020\2022\0020";
        font-size: 16px;
    }

    .vux-header-fade-in-right-enter-active {
        animation: fadeinR .5s;
    }

    .vux-header-fade-in-left-enter-active {
        animation: fadeinL .5s;
    }

    h1 {
        font-size: 32px/@ratio;
        font-weight: normal;
    }

    h2 {
        font-size: 28px/@ratio;
        font-weight: normal;
    }

    .flexbox {
        display: flex;
        width: 100%;

    }

    .flexbox-item {
        flex: 0 0 25%;
        min-width: 20px;
        width: 0;
    }

    .view-container {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .view-header {
        flex-shrink: 0;
    }

    .view-body {
        transform: translate3d(0, 0, 0);
        box-sizing: border-box;
        padding-bottom: 50px;
        flex: 1;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        -webkit-touch-callout: none;
    }

    //--基本信息
    .section-brief {
        background: #fff;
        position: relative;
        img {
            display: block;
        }
        //logo模糊
        .blur-img-c {
            width: 100%;
            height: 206px / @ratio;
            overflow: hidden;
            position: relative;
            .blur-img {
                display: block;
                position: absolute;
                z-index: 0;
                width: 805px/ @ratio;
                height: 805px/ @ratio;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                filter: blur(5px);
                max-width: none;
            }
            .mask-color {
                width: 100%;
                height: 100%;
                position: absolute;
                z-index: 1;
                background-color: #1abaf5;
                opacity: .1;
            }
            //波浪遮罩
            .mask-img {
                position: absolute;
                z-index: 2;
                bottom: -1px;
                width: 100%;
                height: auto;
            }
        }
        //倒影logo容器
        .logo-c {
            height: 103+19px;
            position: absolute;
            width: 100%;
            top: 0;
            overflow: hidden;
            .logo-big {
                display: block;
                position: absolute;
                z-index: 30+1;
                width: 172px/ @ratio;
                height: 172px/ @ratio;
                left: 0;
                right: 0;
                bottom: 19px;
                margin: auto;
                border: 2px solid #ffffff;
                border-radius: 14px;
                box-shadow: 0 2px 0 #e2e2e2;
                background: #fff;
                &.inverted {
                    box-shadow: none;
                    border-color: transparent;
                    -webkit-box-reflect: below;
                }
            }
            .inverted-logo-c {
                overflow: hidden;
                width: 100%;
                height: 19px;
                position: absolute;
                z-index: 30-1;
                bottom: 0;
            }
            .inverted-mask {
                overflow: hidden;
                width: 100%;
                height: 20px;
                position: absolute;
                z-index: 30;
                bottom: -1px;
                background: linear-gradient(to bottom, rgba(255, 255, 255, .7) 0%, rgba(255, 255, 255, .8) 20%, rgba(255, 255, 255, .9) 45%, #fff);
            }
        }
        //app describe
        .app-desc {
            text-align: center;
            margin-top: 38px/@ratio;
            .app-desc-title {
                font-size: 18px;
                color: #222;
                line-height: 1.1;
            }
            .app-desc-detail {
                color: #6c6c6c;
                line-height: 1.1;
                margin-top: 9px;
                font-size: 13px;
                span + span {
                    margin-left: 12px;
                }
            }
        }
        //下载按钮
        .app-down-btn {
            padding: 42px/@ratio 110px/@ratio 0 110px/@ratio;
        }
    }

    //--app图片
    .app-images {
        padding: 58px/@ratio 29px/@ratio 0 29px/@ratio;
        overflow-x: auto;
        overflow-y: hidden;
        white-space: nowrap;
        -webkit-overflow-scrolling: touch;
        transform: translate3d(0, 0, 0);
        .app-images-item {
            display: inline-block;
            font-size: 0;
            width: 268px/@ratio;
            height: auto;
            border: 1px solid #d9d9d9;
            & + .app-images-item {
                margin-left: 4px;
            }
        }
        .b-error {
            display: none !important;
        }
    }

    //详情detail
    .app-desc-detail {
        color: #6c6c6c;
        line-height: 22/26+1;
        > h2 {
            margin-top: 5px;
            font-size: 26px/@ratio;
            margin-left: 42px/@ratio;
        }
        > p {
            font-size: 26px/@ratio;
            padding: 0 30px/@ratio;
            height: 90px;
            overflow: hidden;
            text-align: justify;
            text-indent: 11px;
            &.show-more {
                height: auto;
            }
        }
    }

    //显示更多箭头
    .arrow-down-c {
        display: block;
        position: relative;
        padding-top: 30px;
        .arrow-down {
            width: 30px;
            height: auto;
            position: absolute;
            right: 12px;
            top: 10px;
            transition-duration: 500ms;
            &.rotated {
                transform: rotate(180deg);
            }
        }
    }

    //version
    .app-version {
        padding: 15px;
        font-size: 11px;
        color: #a0a0a0;
        line-height: 1.1;
        padding-bottom: 60px/@ratio;
        p + p {
            margin-top: 9px;
        }
    }

    //app-ad
    .app-ad {
        h2 {
            font-size: 14px;
            color: #2b2b2b;
            padding: 0 15px;
            line-height: 1.1;
        }
        h3, p {
            .ellipsis();
        }
        h3 {
            font-weight: normal;
            font-size: 13px;
            color: #2b2b2b;
            line-height: 1.1;
        }
        p {
            font-size: 11px;
            color: #a0a0a0;
        }
        .app-ad-list {
            margin: 26px/@ratio 12px 60px/@ratio;
            text-align: center;
        }
        .ad-list-item {
            text-align: center;
            box-sizing: border-box;
            padding: 0 5px;

        }
        .logo-sm-c {
            display: inline-block;
            font-size: 0;
            border-radius: 10px;
            overflow: hidden;
            width: 130px/@ratio;
            height: 130px/@ratio;
            .logo-sm {
                display: block;
                width: 100%;
                height: 100%;
            }
        }
        .btn-c {
            padding: 9px 10%;
            max-width: 100px;
            margin: auto;
        }
    }

    //other
    .app-other {
        h2 {
            font-weight: normal;
            font-size: 14px;
            color: #2b2b2b;
            line-height: 1.1;
            padding: 0 15px;
        }
        p {
            font-size: 13px;
            color: #6c6c6c;
            line-height: 1.1;
            margin-top: 14px;
            padding: 0 15px;
            span + span {
                margin-left: 21px;
            }
        }
    }
</style>
