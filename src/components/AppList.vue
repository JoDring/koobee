<template>
  <div class="list-c">
    <!--滚动临时遮盖-->
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
    <!--滚动-->
    <scroller
            class="list-detail"
            ref="scroller"
            v-if="apps.length"
            :on-refresh="refresh"
            :on-infinite="getMore">
      <div class="list-item" v-for="item in apps" :key="item.id">
        <div @click="goToDetail(item)"
             class="list-item-c">
          <div class="list-item-icon-c">
            <img class="list-item-icon" v-lazy="item.largeIcon ? item.largeIcon : item.iconUrl" v-if="onLine">
            <img class="list-item-icon" src="http://360.cooseatech.cn/appstore/H5/storehome/static/appStore/palceholder-logo.webp" v-else>
          </div>
          <div>
            <div class="list-item-name">{{item.name}}</div>
            <div class="list-item-brief">{{item.apkSize | formatSize(2)}}</div>
            <div class="list-item-brief">{{item.brief}}</div>
          </div>
        </div>
        <btn class="btn-download" :app="item">
        </btn>
      </div>
    </scroller>
    <!--goToTop-->
    <scroll-to-top v-if="$refs['scroller']"
                   :scrollTop="scrollPosition.y"
                   @click.native="scrollPosition.y = 0"
                   :scroller="$refs['scroller']">
    </scroll-to-top>
    <!--spinner-->
    <div v-if="loading && showSpinner"
         style="width: 100%; height: 100%;
                 position: absolute; z-index: 999;
                 top: 0;left: 0; display: flex;
                  justify-content: center; align-items: center">
      <spinner type="android">
      </spinner>
    </div>
    <!--刷新-->
    <refresh-tip v-if="!loading && failLoaded && apps.length === 0"
                 @click.native="refresh(null, true)">
    </refresh-tip>
  </div>
</template>

<script>
    import {Spinner} from 'vux'
    import Btn from '../components/Btn'
    import RefreshTip from '../components/RefreshTip'
    import {formatSize} from '../filters'
    import {fetchSearchHotWords, fetchCategoryList, fetchGame, fetchNeed, fetchRank} from '../services/appStore'
    import ScrollToTop from '../components/ScrollToTop'
    export default {
        name: "app-list",
        data() {
            return {
                apps: [],
                hotWords: null,
                loading: false,
                showSpinner: true,
                failLoaded: false,
                queryData: {
                    catId: '',
                    pageIndex: 1,
                    pageSize: 10
                },
                onLine: window.navigator.onLine,
                scrollPosition: {x: 0, y: 0, animate: false},
                showScrollerMask: false,
                typeMap: {
                    need: '装机必备',
                    rank: '下载榜单',
                    category: '应用分类',
                    game: '热门游戏'
                }
            }
        },
        props: {
            type: {
                type: String
            },
            title: {
                type: String,
                default: '应用分类'
            }
        },
        computed: {
            myTitle() {
                if (this.apps[0]) {
                    if (this.apps[0].categoryName) {
                        return this.apps[0].categoryName
                    } else {
                        return this.typeMap[this.type]
                    }
                } else {
                    return ''
                }
            }
        },
        watch: {
            'type': function () {
                this.apps = []
                !this.loading && this.refresh(null, true)
            }
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                document.title = '应用分类'
                setTimeout(function () {
                    vm.$refs['scroller'] && vm.$refs['scroller'].scrollTo(0, vm.scrollPosition.y, true)
                }, 250)
                setTimeout(function () {
                    vm.showScrollerMask = false
                }, 500)
            })

        },
        beforeRouteLeave(to, from, next) {
            if (this.onLine) {
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
        created() {
            this.showSpinner = true
            this.getApps()
            this.getHotWords()
            this.$vux.bus.$on('off-line', () => {
                this.onLine = false
            })
            this.$vux.bus.$on('on-line', () => {
                this.onLine = true
            })
        },
        methods: {
            getApps(done, refresh) {
                switch (this.type) {
                    case 'need':
                        this.getNeed(done, refresh)
                        break;
                    case 'rank':
                        this.getRank(done, refresh)
                        break;
                    case 'game':
                        this.getGame(done, refresh)
                        break;
                    default:
                        this.getCategoryList(done, refresh)
                        break;
                }
            },
            getHotWords() {
                fetchSearchHotWords().then(res => {
                    if (res.code === '0') {
                        this.hotWords = res.data.hotwords
                    }
                })
            },
            //根据详情分类id获取详情
            getCategoryList(done, refresh) {
                this.loading = true;
                this.queryData.catId = this.type
                return fetchCategoryList(this.queryData).then(res => {
                    this.successCb(res, done, refresh)
                }, () => {
                    this.failCb(done)
                })
            },
            getRank(done, refresh) {
                this.loading = true;
                delete this.queryData.catId
                return fetchRank(this.queryData).then(res => {
                    this.successCb(res, done, refresh)
                }, () => {
                    this.failCb(done)
                })
            },
            getNeed(done, refresh) {
                this.loading = true;
                delete this.queryData.catId
                return fetchNeed(this.queryData).then(res => {
                    this.successCb(res, done, refresh)
                }, () => {
                    this.failCb(done)
                })
            },
            getGame(done, refresh) {
                this.loading = true;
                delete this.queryData.catId
                return fetchGame(this.queryData).then(res => {
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
                if (refresh) {
                    this.apps = []
                }
                if (res.data && res.data.apps && res.data.apps.length) {
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
            },
            failCb(done) {
                this.loading = false
                this.showScrollerMask = false
                this.failLoaded = true
                if (typeof done === 'function') {
                    done(true)
                }
                if (this.queryData.pageIndex > 1) {
                    this.queryData.pageIndex--
                }
                this.$vux.toast.text('获取数据失败', 'bottom')
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
                this.getApps(done, true)
            },
            getMore(done) {
                if (!this.onLine) {
                    this.$vux.toast.text('网络断开了')
                    if (typeof done === 'function') {
                        done(true)
                    }
                    return
                }
                this.showSpinner = false
                this.queryData.pageIndex++
                !this.loading && this.getApps(done)
            },
            goToDetail(app) {
                this.$router.push({
                    name: 'AppDetail',
                    append: false,
                    params: {appId: app.id, appName: app.name},
                    query: {isSub: true}
                })
            }

        },
        components: {
            Btn,
            RefreshTip,
            Spinner,
            ScrollToTop
        },
        filters: {
            formatSize
        }
    }
</script>

<style lang="less" scoped>
  @import "~vux/src/styles/weui/base/fn.less";
  @black: #000;
  @gray-dark: #5d5d5d;
  @gray-light: #919191;
  @bg-gray: #e5e5e5;
    .list-container {
      flex: 1;
      overflow: auto;
      position: relative;
      transform: translate3d(0, 0, 0);
      -webkit-overflow-scrolling: touch;
    }
      .list-item {
        position: relative;
      }
      .list-item-c {
        min-height: 94px;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        background: #fff;
        padding: 0 20px;
        &:active {
          background-color: #eee;
        }
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
</style>
