<template>
    <div class="information-list">
        <div class="list">
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
                    class="list-detail"
                    v-if="list.length"
                    ref="scroller"
                    :on-refresh="refresh"
                    :on-infinite="getMore">
                <div class="information-regions" v-show="regions && regions.length">
                    <div @click="goToPackageList(item)" class="regions-item" v-for="item in regions" :key="item.id">
                        <img class="regions-item-img" v-lazy="item.imageUrl">
                        <div>{{item.title}}</div>
                        <div class="regions-item-btn">进入</div>
                    </div>
                </div>
                <div class="list-item" v-for="item in list" :key="item.id">
                    <div class="list-item-c" @click="goToDetail(item)">
                        <div v-lazy:background-image="{src: item.imageUrl, loading: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'}"
                             class="list-item-img" v-if="onLine"></div>
                        <div class="list-item-img" style="background: #eee" v-else></div>
                        <div class="list-item-txt">
                            <div class="list-item-name">{{item.title}}</div>
                            <div class="list-item-brief">
                                <span>hot:{{item.hot || 1}}k</span>
                                <span>{{item.timeStr | timeFormat}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="app-info" v-if="item.app">
                        <div class="app-info-detail" @click="openApps(item.app)">
                            <div class="app-info-icon-c">
                                <img class="app-info-icon" v-lazy="item.app.iconUrl" v-if="onLine">
                                <img class="app-info-icon" src="static/images/palceholder-logo.png" v-else>
                            </div>
                            <div class="tag">推荐</div>
                            <div class="app-name">{{item.appName}}</div>
                        </div>
                        <btn class="app-info-btn"
                             :app="item.app"
                             ref="appBtn"
                             style="width: 55px;
                                    height: 25px;
                                    border-radius: 13px;
                                    font-size: 12px;">
                        </btn>
                    </div>
                    <div class="item-line"></div>
                </div>
                <svg class="spinner" style="fill: #ff6b3b;" slot="infinite-spinner" viewBox="0 0 64 64">
                    <g>
                        <circle cx="16" cy="32" stroke-width="0" r="3">
                            <animate attributeName="fill-opacity" dur="750ms" values=".5;.6;.8;1;.8;.6;.5;.5"
                                     repeatCount="indefinite"></animate>
                            <animate attributeName="r" dur="750ms" values="3;3;4;5;6;5;4;3"
                                     repeatCount="indefinite"></animate>
                        </circle>
                        <circle cx="32" cy="32" stroke-width="0" r="3.09351">
                            <animate attributeName="fill-opacity" dur="750ms" values=".5;.5;.6;.8;1;.8;.6;.5"
                                     repeatCount="indefinite"></animate>
                            <animate attributeName="r" dur="750ms" values="4;3;3;4;5;6;5;4"
                                     repeatCount="indefinite"></animate>
                        </circle>
                        <circle cx="48" cy="32" stroke-width="0" r="4.09351">
                            <animate attributeName="fill-opacity" dur="750ms" values=".6;.5;.5;.6;.8;1;.8;.6"
                                     repeatCount="indefinite"></animate>
                            <animate attributeName="r" dur="750ms" values="5;4;3;3;4;5;6;5"
                                     repeatCount="indefinite"></animate>
                        </circle>
                    </g>
                </svg>
            </scroller>
            <refresh-tip v-if="!loading && failLoaded && list.length===0"
                         @click.native="getInformationList">
            </refresh-tip>
        </div>
        <app-ad v-if="app" :app="app"></app-ad>
        <div v-if="gameApp" class="gamecenter-ad" @click="openGameCenter">
            <img :src="gameApp.iconUrl" class="gamecenter-ad-icon">
            更多精彩游戏就在{{gameApp.name}}
        </div>
    </div>
</template>

<script>
    import Btn from '../components/Btn'
    import RefreshTip from '../components/RefreshTip'
    import AppAd from '../components/AppAd'
    import {fetchInformationList} from '../services/appStore'
    import JsCallApp from '../util/JsCallApp'; //客户端api
    export default {
        name: "information-list",
        data() {
            return {
                list: [],
                regions: [],
                app: null,
                gameApp: null,
                loading: false,
                queryData: {
                    packageName: this.$route.query.packageName ? this.$route.query.packageName : '',
                    pageIndex: 1,
                    pageSize: 10
                },
                failLoaded: false,
                onLine: window.navigator.onLine,
                scrollPosition: {x: 0, y: 0, animate: false},
                showScrollerMask: false,
            }
        },
        props: {
            title: {
                type: String,
                default: '热门资讯'
            },
            resetScroller: {
                type: Boolean,
                default: null
            }
        },
        computed: {
            pageTitle() {
                return this.title ? this.title : this.app.name
            }
        },
        created() {
            document.title = this.title
            // 第三方来源需要添加的头
            const metaNode = document.createElement('meta')
            metaNode.name = 'referrer'
            metaNode.content = 'never'
            document.head.appendChild(metaNode)
            this.getInformationList()
            this.$vux.bus.$on('off-line', () => {
                this.onLine = false
            })
            this.$vux.bus.$on('on-line', () => {
                this.onLine = true
            })
        },
        mounted() {
            window.javaCallJsChangeStatus = this.updateBtn.bind(this);
            window.downloadBtnClickCallBack = this.updateBtn.bind(this);
        },
        beforeRouteUpdate(to, from, next) {
            if (to.query.packageName) {
                this.queryData.packageName = to.query.packageName
            } else {
                this.queryData.packageName = ''
            }
            this.refresh()
            next()
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                document.title = vm.title
                setTimeout(function () {
                    if (vm.resetScroller) {
                        vm.$refs['scroller'] && vm.$refs['scroller'].scrollTo(0, 0, true);
                    } else {
                        vm.$refs['scroller'] && vm.$refs['scroller'].scrollTo(0, vm.scrollPosition.y, true);
                    }
                }, 250)
                setTimeout(function () {
                    vm.showScrollerMask = false
                }, 500)
            })
        },
        methods: {
            //根据详情分类id获取详情
            getInformationList(done, refresh) {
                this.loading = true;
                this.showSpinner = true
                return fetchInformationList(this.queryData).then(res => {
                    this.successCb(res, done, refresh)
                }, () => {
                    this.failCb(done)
                })
            },
            successCb(res, done, refresh) {
                if (typeof done === 'function') {
                    done()
                }
                this.loading = false
                this.showScrollerMask = false
                document.title = this.title
                if (res.data) {
                    if (this.queryData.pageIndex === 1) {
                        this.regions = res.data.regions ? res.data.regions : []
                        this.gameApp = res.data.gameApp ? res.data.gameApp : null
                        this.app = res.data.app ? res.data.app : null
                    }
                    refresh && (this.list = [])
                    if (res.data.list && res.data.list.length) {
                        this.list = [...this.list, ...res.data.list]
                    } else {
                        if (typeof done === 'function') {
                            done(true)
                        }
                    }
                }
            },
            failCb(done) {
                this.loading = false
                this.showScrollerMask = false
                this.failLoaded = true
                if (typeof done === 'function') {
                    done(true)
                }
                this.$vux.toast.text('加载超时', 'bottom')
            },
            refresh(done, refresh = true) {
                this.queryData.pageIndex = 1
                !this.loading && this.getInformationList(done, refresh)
            },
            getMore(done) {
                this.queryData.pageIndex++
                !this.loading && this.getInformationList(done)
            },
            goToDetail(item) {
                const filterList = this.list.filter(v => {
                    return v.id !== item.id
                })
                this.$router.push({
                        name: 'InformationDetail',
                        append: false,
                        params: {
                            id: item.id,
                            informationList: filterList
                        }
                    }
                );
                const position = this.$refs['scroller'] && this.$refs['scroller'].getPosition();
                if (position) {
                    this.scrollPosition = {x: 0, y: position.top, animate: false}
                }
                this.showScrollerMask = true
            },
            goToPackageList(item) {
                this.$router.push({
                    name: 'InformationList',
                    params: {title: item.title},
                    query: {packageName: item.packageName}
                })
            },
            updateBtn() {
                this.$refs.appBtn.forEach((value) => {
                    if (typeof value.changeState === 'function') {
                        value.changeState()
                    }
                })
            },
            openGameCenter() {
                window.open('gamecenter://home?page=selected_page')
            },
            openApps(app) {
                window.jsObj && JsCallApp.handleAppAction(JSON.stringify(app), 'detail');
            }
        },
        components: {
            Btn,
            AppAd,
            RefreshTip
        },
        filters: {
            timeFormat(data) {
                return data.split(' ')[0]
            }
        }
    }
</script>

<style lang="less">
    @import "~vux/src/styles/weui/base/fn.less";

    @black: #000;
    @gray-dark: #5d5d5d;
    @gray-light: #a1a1a1;
    @bg-gray: #e5e5e5;
    .information-list {
        height: 100%;
        font-size: 13px;
        color: #222;
        display: flex;
        flex-direction: column;
        .information-regions {
            background: #f8f8f8;
            color: #222;
            font-size: 17px;
            .regions-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 100%;
                padding: 13px;
                color: #222;
            }
            .regions-item-img {
                display: block;
                width: 60px;
                height: 45px;
                overflow: hidden;
                margin-left: 7px;
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
            }
            .regions-item-btn {
                display: block;
                background: #ff6b3b;
                color: #fff;
                text-align: center;
                line-height: 25px;
                font-size: 12px;
                border-radius: 25px;
                width: 55px;
                height: 25px;
            }
        }
        //-- 详情列表
        .list {
            flex: 1;
            overflow: auto;
            transform: translate3d(0, 0, 0);
            position: relative;
            -webkit-overflow-scrolling: touch;
        }
        .list-detail {
            .list-item-c {
                height: 100px;
                display: flex;
                align-items: center;
                box-sizing: border-box;
                background: #fff;
                padding: 0 13px;
                position: relative;
                z-index: 2;
                text-align: justify;
                &:active {
                    background-color: #eee;
                }

            }
            .list-item-img {
                background-color: #eee;
                width: 98px;
                height: 65px;
                margin-right: 20px;
                flex-shrink: 0;
                background-repeat: no-repeat;
                background-size: cover;
                background-position: center;

            }
            .list-item-txt {
                flex: 1;
                height: 65px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }
            .list-item-name {
                font-size: 14px;
                line-height: 1.4;
                color: @black;
                .ellipsisLn(2)
            }
            .list-item-brief {
                font-size: 11px;
                color: @gray-light;
                display: flex;
                justify-content: space-between;
            }
            //line
            .item-line {
                width: 100%;
                height: 1px;
                position: relative;
                &:after {
                    .setBottomLine(#f1f1f1)
                }
            }
            //app信息
            .app-info {
                display: flex;
                width: 100%;
                height: 40px;
                justify-content: space-between;
                align-items: center;
                padding: 0 13px;
                box-sizing: border-box;
                position: relative;
                z-index: 1;
                margin-top: -8px;
                color: #666;
                .app-info-detail {
                    height: 100%;
                    flex: 1;
                    display: flex;
                    align-items: center;
                }
                .app-info-icon-c {
                    width: 25px;
                    height: 25px;
                    overflow: hidden;
                    border-radius: 4px;
                }
                .app-info-icon {
                    width: 100%;
                }
                .app-name {
                    white-space: nowrap;
                    max-width: 180px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    font-size: 13px;
                }
                .tag {
                    margin:0 4px;
                    padding: 0 1px;
                    font-size: 10px;
                    color: #ccc;
                    position: relative;
                    &:after {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 44px;
                        height: 28px;
                        border: 1px solid #ccc;
                        transform: scale(.5);
                        transform-origin: 0 0;
                    }
                }
                .app-info-btn {
                    flex-shrink: 1;
                }
            }
        }
        //
        .gamecenter-ad {
            position: fixed;
            z-index: 9;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 63px;
            background-color: #fff;
            color: #333;
            display: flex;
            align-items: center;
            padding: 0 13px;
            box-sizing: border-box;
            flex-shrink: 0;
            font-size: 15px;
            &:before {
                .setTopLine()
            }
        }
        .gamecenter-ad-icon {
            width: 40px;
            height: 40px;
            margin-right: 5px;
        }
    }
</style>