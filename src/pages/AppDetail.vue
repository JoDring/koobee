<template>
    <div class="view-container">
        <template v-if="appList.length > 0">
            <x-header class="view-header" v-if="$route.query.isSub" slot="header" :left-options="{backText: ''}">
                {{appList.length &&
                appList[0].name}}
            </x-header>
            <div class="view-body">
                <section class="section-brief">
                    <div class="blur-img-c">
                        <x-img container=".view-body" class="blur-img"
                               default-src="static/images/palceholder-logo.png" :src="appList[0].iconUrl" width="180"
                               height="180"></x-img>
                        <div class="mask-color"></div>
                        <img class="mask-img" src="static/images/bg-mask.png" width="720" height="122">
                    </div>
                    <div class="logo-c">
                        <x-img container=".view-body" class="logo-big"
                               default-src="static/images/palceholder-logo.png" :src="appList[0].iconUrl" width="180"
                               height="180"></x-img>
                        <div class="inverted-logo-c">
                            <x-img container=".view-body" class="logo-big inverted"
                                   default-src="static/images/palceholder-logo.png" :src="appList[0].iconUrl"
                                   width="180"
                                   height="180"></x-img>
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
                        <btn-download :url="appList[0].downloadUrl"></btn-download>
                    </div>

                </section>
                <section class="app-images">
                    <img v-for="item in imgList"
                         class="app-images-item"
                         v-lazy="{src: item, loading: 'static/images/placeholder-appbg.png'}"
                         :key="item"
                         v-if="onLine">
                </section>
                <section class="app-desc-detail">
                    <h2>【应用介绍】</h2>
                    <p :class="{'show-more': showMore}" v-html="appList[0].description"></p>
                </section>
                <a href="#" class="arrow-down-c" @click.prevent="showMore = !showMore">
                    <img src="../assets/arrow-down.png" class="arrow-down" width="60" height="60"
                         :class="{rotated: showMore}">
                </a>
                <section class="app-version">
                    <p>最新版本: {{appList[0].versionName}}</p>
                    <p>更新时间: {{appList[0].updateTime}}</p>
                </section>
                <section class="app-ad" v-if="sameCatApps.length > 0">
                    <h2>相关推荐</h2>
                    <div class="app-ad-list">
                        <flexbox :gutter="0">
                            <flexbox-item :span="3" class="ad-list-item" v-for="item in sameCatApps" :key="item.id">
                                <router-link :to="{name:'AppDetail', params: {appId: item.id}, query: {isSub: true}}">
                                    <div class="logo-sm-c">
                                        <x-img class="logo-sm" default-src="static/images/palceholder-logo.png"
                                               :src="item.largeIcon ? item.largeIcon : item.iconUrl"
                                               container=".view-body" width="130"
                                               height="130" v-if="onLine"></x-img>
                                        <img class="logo-sm" src="static/images/palceholder-logo.png" v-else>
                                    </div>
                                </router-link>
                                <h3>{{item.name}}</h3>
                                <p>{{item.downloadTimes | timesFormat}}人使用</p>
                                <div class="btn-c">
                                    <btn-download :url="item.downloadUrl"
                                                  :mini="true"></btn-download>
                                </div>
                            </flexbox-item>
                        </flexbox>
                    </div>
                </section>
                <section class="app-ad" v-if="sameDevApps.length > 0">
                    <h2>大家也喜欢</h2>
                    <div class="app-ad-list">
                        <flexbox :gutter="0">
                            <flexbox-item :span="3" class="ad-list-item" v-for="item in sameDevApps" :key="item.id">
                                <router-link :to="{name:'AppDetail', params: {appId: item.id}, query: {isSub: true}}">
                                    <div class="logo-sm-c">
                                        <x-img class="logo-sm" default-src="static/images/palceholder-logo.png"
                                               :src="item.largeIcon ? item.largeIcon : item.iconUrl"
                                               container=".view-body" width="130"
                                               height="130" v-if="onLine"></x-img>
                                        <img class="logo-sm" src="static/images/palceholder-logo.png" v-else>
                                    </div>
                                </router-link>
                                <h3>{{item.name}}</h3>
                                <p>{{item.downloadTimes | timesFormat}}人使用</p>
                                <div class="btn-c">
                                    <btn-download :url="item.downloadUrl"
                                                  :mini="true"></btn-download>
                                </div>
                            </flexbox-item>
                        </flexbox>
                    </div>
                </section>
                <section class="app-other">
                    <h2>其他信息</h2>
                    <p><span>开发者</span><span>{{appList[0].developer}}</span></p>
                </section>
            </div>
        </template>
    </div>
</template>

<script>
    import BtnDownload from '../components/btn-download.vue';
    import {Flexbox, FlexboxItem, ViewBox, XHeader, XImg} from 'vux';
    import assign from 'lodash/assign';

    const url = /szprize\.cn/i.test(location) ? 'http://appstore.szprize.cn/appstore/appinfo/details?appId=' : 'http://192.168.1.148:8090/appstore/appinfo/details?appId=';
    export default {
        name: 'AppDetail',
        props: {
            appId: {
                require: true
            }
        },
        data() {
            return {
                msg: '',
                showMore: false,
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
            this.fetchData();
            window.setState = function setState(id, state) { //给app调用改变组件按钮状态的接口函数
                let newAppList = this.appList.map(value => {
                    if (value.id == id) {
                        value.btnState = assign({}, value.btnState, state)
                    }
                    return value;
                });
                this.appList = [...newAppList];
            }.bind(this);
            this.$vux.bus.$on('off-line', () => {
                this.onLine = false
            })
            this.$vux.bus.$on('on-line', () => {
                this.onLine = true
            })
            // document.title = '应用详情';
        },
        watch: {
            '$route': 'fetchData'
        },
        methods: {
            fetchData() {
                this.$vux.loading.show();
                this.$http.get(url.concat(this.appId)).then(res => {
                    this.$vux.loading.hide();
                    if (res.data.code === '0' || res.data.code === 0) {
                        let data = res.data.data;
                        this.appList = [data.app];
                        if (data.sameCatApps && Array.isArray(data.sameCatApps)) {
                            this.appList = [...this.appList, ...data.sameCatApps];
                        }
                        if (data.sameDevApps && Array.isArray(data.sameDevApps)) {
                            this.appList = [...this.appList, ...data.sameDevApps];
                        }
                        if (this.appList.length > 0) {
                            const scrollContainer = document.querySelector('.view-body')
                            scrollContainer && (scrollContainer.scrollTop = 0);
                            document.title = this.appList[0].name || '应用详情';
                        }
                        /*
                        * 绑定按钮状态响应的data
                        * percentage 进度信息 0-100 整数
                        * startLoad 是否开始了下载
                        * pause 开始下载后暂停
                        * demo: setState('435', {startLoad:true, pause: false,  percentage: 20})
                        * */
                        this.appList = this.appList.map(value => {
                            return assign(value, {
                                btnState: {
                                    percentage: 0,
                                    startLoad: false,
                                    pause: false
                                }
                            });
                        })

                    } else {
                        this.$vux.alert.show({
                            title: '错误提示',
                            content: res.data.msg,
                            onHide: () => {
                                this.$router ? this.$router.go(-1) : window.history.go(-1);
                            },
                        });
                    }
                }, res => {
                    this.$vux.loading.hide();
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
            Flexbox,
            FlexboxItem,
            ViewBox,
            XHeader,
            XImg
        },
        filters: {
            sizeFormat(val) {
                let fm = '';
                let u = 0;
                while (u < 4 && val > 1024) {
                    u++;
                    val /= 1024;
                }
                let unit = 'Byte';
                switch (u) {
                    case 1:
                        unit = 'KB';
                        break;
                    case 2:
                        unit = 'MB';
                        break;
                    case 3:
                        unit = 'GB';
                        break;
                    case 4:
                        unit = 'TB';
                }
                fm += val.toFixed(2) + unit;
                return fm;
            },
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
<style lang="less">
    @import "../../node_modules/vux/src/styles/weui/base/fn.less";

    h1 {
        font-size: 32px/@ratio;
        font-weight: normal;
    }

    h2 {
        font-size: 28px/@ratio;
        font-weight: normal;
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
        transform: translate3d(0,0,0);
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
