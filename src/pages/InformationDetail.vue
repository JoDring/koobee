<template>
    <div class="information-detail">
        <main class="main">
            <!--<div style="width: 100%; height: 250px" id="aliPlayerContainer"></div>-->
            <div id="information-content" class="information-detail-content">
                <div v-if="detail" v-html="detail.body"></div>
                <refresh-tip v-else-if="!loading && failLoaded"
                             @click.native="getInformationDetail(id)">
                </refresh-tip>
            </div>
            <div class="detail-information-list" v-if="sampleList && sampleList.length > 0">
                <div class="list-item" v-for="item in sampleList" @click="goToDetail(item)">
                    <div v-lazy:background-image="{
                    src: item.imageUrl,
                    error:'http://360.cooseatech.cn/appstore/H5/storehome/static/appStore/gamecenter-itembg.webp',
                    loading: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'}"
                         class="list-item-img" v-if="onLine"></div>
                    <div class="list-item-img" v-else></div>
                    <div class="list-item-txt">
                        <div class="item-title">
                            {{item.title}}
                        </div>
                        <div class="item-time">
                            <span>《{{item.appName}}》</span>
                            <span>{{item.timeStr}}</span>
                        </div>
                    </div>
                </div>
                <router-link :to="{name:'InformationList', params: {resetScroller: true}}" class="list-bottom-btn">查看更多</router-link>
            </div>
        </main>
        <app-ad v-if="app" :app="app"></app-ad>
    </div>
</template>

<script>
    import sampleSize from 'lodash/sampleSize'
    import BtnDownload from '../components/btn-download'
    import AppAd from '../components/AppAd'
    import RefreshTip from '../components/RefreshTip'
    import {fetchInformationList, fetchInformationDetail} from '../services/appStore'

    export default {
        name: "information-detail",
        data() {
            return {
                detail: null,
                loading: false,
                list: [],
                app: null,
                failLoaded: false,
                onLine: window.navigator.onLine
            }
        },
        props: {
            title: {
                type: String,
                default: '资讯详情'
            },
            id: {
                require: true
            },
            informationList: Array
        },
        computed: {
            sampleList() {
                if (this.list && this.list.length > 0) {
                    return sampleSize(this.list, 2)
                } else {
                    return sampleSize(this.informationList, 2)
                }
            }
        },
        created() {
            // 第三方来源需要添加的头
            const metaNode = document.createElement('meta')
            metaNode.name = 'referrer'
            metaNode.content = 'never'
            document.head.appendChild(metaNode)
            document.title = this.title
            this.getInformationDetail();
            this.$vux.bus.$on('off-line', () => {
                this.onLine = false;
                this.removeSrc()
            })
            this.$vux.bus.$on('on-line', () => {
                this.onLine = true;
                this.refillSrc()
            })
            // 添加阿里播放器 测试用
            /*let aliLink = document.createElement('link');
            aliLink.rel = 'stylesheet';
            aliLink.href = '//g.alicdn.com/de/prismplayer/2.6.0/skins/default/aliplayer-min.css';
            let aliScript = document.createElement('script');
            aliScript.type = 'text/javascript';
            aliScript.src = '//g.alicdn.com/de/prismplayer/2.6.0/aliplayer-min.js';
            document.head.appendChild(aliLink)
            document.head.appendChild(aliScript)
            this.isAlipayTimmer = setInterval(() => {
                if (Aliplayer) {
                    let player = new Aliplayer({
                        id: 'aliPlayerContainer',
                        autoplay: false,
                        width: '100%',
                        source: '//player.alicdn.com/video/aliyunmedia.mp4',
                        cover: 'http://liveroom-img.oss-cn-qingdao.aliyuncs.com/logo.png'
                    })
                    clearInterval(this.isAlipayTimmer)
                }
            }, 500)*/
        },
        beforeRouteUpdate(to, from, next) {
            this.getInformationDetail(to.params.id)
            next()
        },
        methods: {
            //根据详情分类id获取详情
            getInformationDetail(id) {
                const appId = id ? id : this.id
                this.loading = true;
                this.$vux.loading.show();
                return fetchInformationDetail({id: appId}).then(res => {
                    this.loading = false;
                    document.title = this.title
                    this.$vux.loading.hide();
                    if (res.code === '0') {
                        this.detail = res.data.detail
                        this.app = res.data.detail.app;
                        const scrollElm = document.querySelector('.main')
                        scrollElm.scrollTop = 0
                        //更新推荐列表
                        if (!this.informationList || this.informationList.length === 0) {
                            fetchInformationList({pageIndex: 1, pageSize: 100}).then(res => {
                                if (res.code === '0') {
                                    this.list = res.data.list
                                }
                            })
                        }
                        const list = this.informationList ? this.informationList : this.list
                        if (list && list.length) {
                            this.list = list.filter(v => {
                                return v.id !== this.id
                            })
                        }
                        //上报统计
                        window.MtaH5 && window.MtaH5.clickStat('game_to_info_detail', {
                            'id': this.detail.id,
                            'title': this.detail.title,
                            'source': this.detail.source,
                            'appname': this.detail.appName
                        });
                    } else {
                        this.failLoaded = true
                    }

                }, () => {
                    this.loading = false;
                    this.$vux.loading.hide();
                    this.failLoaded = true;
                    this.$vux.toast.text('加载超时', 'bottom')
                })
            },
            goToDetail(item) {
                this.$router.push({
                        name: 'InformationDetail',
                        append: false,
                        params: {
                            id: item.id,
                            informationList: this.list
                        }
                    }
                )
            },
            removeSrc() {
                const container = document.getElementById('information-content')
                if (container) {
                    //处理图片
                    this.imgArray = Array.from(container.getElementsByTagName('img'))
                    this.imgArray.forEach(v => {
                        v.setAttribute('width', v.width)
                        v.setAttribute('height', v.height)
                        v.setAttribute('data-src', v.src)
                        v.src = ''
                    })
                    //处理视频
                    this.iframeArray = Array.from(container.getElementsByTagName('iframe'))
                    this.iframeArray.forEach(v => {
                        v.setAttribute('sandbox', 'allow-same-origin')
                        v.setAttribute('data-src', v.src)
                    })
                }

            },
            refillSrc() {
                if (this.imgArray) {
                    this.imgArray.forEach(v => {
                        v.src = v.getAttribute('data-src')
                    })
                }
                if (this.iframeArray) {
                    this.iframeArray.forEach(v => {
                        v.removeAttribute('sandbox')
                        v.src = '';
                        v.src = v.getAttribute('data-src')
                    })
                }
            }
        },
        components: {
            BtnDownload,
            AppAd,
            RefreshTip
        }
    }
</script>

<style lang="less">
    @import "~vux/src/styles/weui/base/fn.less";

    @black: #000;
    @gray-dark: #5d5d5d;
    @gray-light: #a1a1a1;
    @bg-gray: #e5e5e5;

    .information-detail {
        height: 100%;
        font-size: 15px;
        color: #222;
        background: #f5f5f5;
        display: flex;
        flex-direction: column;
        .main {
            flex: 1;
            overflow: auto;
            transform: translate3d(0, 0, 0);
            position: relative;
            user-select: none;
            -webkit-overflow-scrolling: touch;
        }
        //-- 详情
        .information-detail-content {
            padding: 17px 12px;
            color: #313736;
            line-height: 1.8;
            text-align: justify;
            min-height: 300px;
            p {
                font-size: 15px;
                color: #313736;
                & + p {
                    margin-top: 20px;
                }
            }
            h1 {
                font-size: 21px;
                line-height: 1.5;
                color: #2b2b2b;
            }
            img {
                display: block;
                margin: 15px 0 25px 0;
                max-width: 100%;
                background: #eee;
            }
            iframe {
                max-width: 100% !important;
                height: auto !important;
                margin-top: 10px;
                background: #000;
            }
            embed{
                display: none !important;
                max-width: 100% !important;
            }
            .Mid2L_title {
                text-align: left;
                h1 {
                    display: inline-block;
                    text-align: left;
                }
                .detail {
                    display: block;
                    text-align: left;
                    margin-top: 5px;
                    font-size: 15px;
                    color: #a1a1a1;
                }
            }
            .Mid2L_con {
                padding-top: 25px;
            }
        }
        //--list
        .detail-information-list {
            line-height: 1.4;
            background: #f7f7f7;
            padding-bottom: 75px;
            .list-item {
                display: flex;
                align-items: center;
                min-height: 94px;
                padding: 0 12px;
                box-sizing: border-box;
                position: relative;
                &:before {
                    .setTopLine(#e4e4e4)
                }
                &:first-child:before {
                    border-top-color: #cacaca;
                }
                &:active {
                    background-color: #eee;
                }
            }
            .list-item-img {
                width: 98px;
                height: 65px;
                margin-right: 11px;
                flex-shrink: 0;
                background-color: #eee;
                background-repeat: no-repeat;
                background-size: cover;
                background-position: center;
            }
            .list-item-txt {
                min-height: 65px;
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }
            .item-title {
                font-size: 15px;
                color: #222;
                .ellipsisLn(2)
            }
            .item-time {
                display: flex;
                justify-content: space-between;
                font-size: 11px;
                color: #a1a1a1;
            }
            .list-bottom-btn {
                width: 90px;
                height: 35px;
                background: #ff6b3b;
                font-size: 15px;
                color: #fff;
                text-align: center;
                border-radius: 35px;
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 10px auto;
            }
        }
    }
</style>