<template>
    <!--snow 风格-->
    <view-box ref="viewBox" class="lottery-chunjie2018" :body-padding-bottom="0"
              :style="{backgroundColor: '#'+detail.backgroundColor}">
        <div class="content" id="lottery-content">
            <img :src="detail.introduction" class="bg-img">
            <!--规则链接-->
            <div class="rule-link">
                <button @click="fetchMyAward" class="rule-link-item">我的奖品</button>
                <button @click="handleClickRules" class="rule-link-item">活动规则</button>
            </div>
            <!--中奖播报-->
            <marquee class="gamer-list" v-if="records.length > 0">
                <marquee-item v-for="(item, index) in records" :key="index">
                    恭喜 <span class="text-primary">{{item.tel}}</span> 获得 <span class="text-primary">{{item.name}}</span>
                </marquee-item>
            </marquee>
            <!--<div class="gamer-list text-shadow" v-else>
              <span v-if="detail.istatus === 1">活动已结束，期待下次活动吧</span>
              <span v-else-if="detail.istatus === -1">活动未开始，稍后再来</span>
            </div>-->
            <lottery-grid :awards="awards"
                          :isLogin="!!userInfo.userId"
                          :isOnline="String(detail.istatus) === '0'"
                          :times="times"
                          :award-sn="awardSn"
                          @onclick="callServerGetAwardResp"
                          @click.native="login"
                          @success="showDialog = true"
                          @timeout="drawTimeOut"
                          @noTimes="$refs.viewBox.scrollTo(630)"
                          ref="lotteryGrid"
            >

            </lottery-grid>
            <button @click="handleDownloadAll" class="btn-download-all">
                {{userInfo && !!userInfo.userId ? '一键下载' : '登录抽奖'}}
            </button>
            <div class="lottery-rule text-primary">在本页每下载一个APP就可获得一次抽奖机会</div>
            <!--app list-->
            <div class="app-list" v-if="apps.length > 0">
                <div class="list-item" v-for="(item, index) in apps" :key="item.id">
                    <div class="img-c">
                        <x-img @click.native="handleImgClick(item)" :src="item.iconUrl" class="item-logo"
                               container="#vux_view_box_body"></x-img>
                    </div>

                    <h1 class="item-title">{{item.name}}</h1>
                    <btn-download v-if="item.btnState"
                                  @click.native="handleBtnClick(item, $event)"
                                  :url="item.downloadUrl"
                                  :mini="true"
                                  :btnText="item.btnState.btnText"
                                  :start-load="item.btnState.startLoad" :percentage="item.btnState.percentage"
                                  class="chunjie2018"
                                  :class="{hasAward: item.btnState.btnText === '已抽奖'}"
                    >
                    </btn-download>
                </div>
            </div>
            <!--more-->
            <div class="more-list">
                <a v-if="showMoreList" :href="item.url" :style="{backgroundImage: `url(${item.bannerUrl})`}"
                   class="more-list-item" v-for="item in more">
                </a>
                <x-img @on-error="showMoreList = true" :src="'x-img'"
                       container="#vux_view_box_body"></x-img>
            </div>
            <!--预加载弹框图片-->
            <div style="position: absolute; bottom: 0;left: 0;width: 1px; height: 1px; opacity: 0;" v-if="loadDialogBg">
                <img src="../../static/images/lottery/snow/award-bgs/form-big.webp">
                <img src="../../static/images/lottery/snow/award-bgs/form-sm.webp">
                <img src="../../static/images/lottery/snow/award-bgs/integral.webp">
                <img src="../../static/images/lottery/snow/award-bgs/note.webp">
                <img src="../../static/images/lottery/snow/award-bgs/none.webp">
            </div>
        </div>
        <!--中奖结果对话框-->
        <div v-transfer-dom>
            <x-dialog v-model="showDialog"
                      class="award-dialog"
                      :dialog-style="{'width': '100%', 'height':'100%', 'background-color': 'transparent', 'max-width' : '100%'}"
                      dialog-transition="none" mask-transition="none"
            >
                <!--实物-->
                <div class="form-big" v-show="showDialogType === 'form-big'">
                    <group class="dialog-form">
                        <div class="dialog-form-title">获得<strong>{{award.name}}</strong></div>
                        <x-input ref="name" :show-clear="false" v-model="userInput.name" :min="2" :max="14"
                                 :required="true"
                                 placeholder=" ">
                            <label slot="label" class="dialog-form-label"><span class="star">*</span>收件人:</label>
                        </x-input>
                        <x-input ref="tel" :show-clear="false" v-model="userInput.tel" type="tel" is-type="china-mobile"
                                 :max="13"
                                 placeholder=" "
                                 :required="true" @on-focus="setDefaultTel">
                            <label slot="label" class="dialog-form-label"><span class="star">*</span>联系电话:</label>
                        </x-input>
                        <x-input ref="qq" :show-clear="false" v-model="userInput.qq" :min="5" :max="14" type="number"
                                 :required="true"
                                 placeholder=" ">
                            <label slot="label" class="dialog-form-label"><span class="star">*</span>QQ号:</label>
                        </x-input>
                        <x-input ref="address" :show-clear="false" v-model="userInput.address" :min="6" :max="25"
                                 :required="true"
                                 placeholder="请注明省/市/县/乡/镇">
                            <label slot="label" class="dialog-form-label"><span class="star">*</span>收件地址:</label>
                        </x-input>
                    </group>
                    <div class="btn-c" :class="{hasSubmit: userInput.hasSubmit}" @click="awardBtnClick">
                        <x-button class="weui-btn_primary">确认</x-button>
                    </div>
                </div>

                <!--流量-->
                <div class="form-big form-sm" v-show="showDialogType === 'form-sm'">
                    <group class="dialog-form">
                        <div class="dialog-form-title">获得<strong>{{award.name}}</strong></div>
                        <x-input :show-clear="false" v-model="userInput.tel" type="tel" is-type="china-mobile" :max="13"
                                 :required="true" placeholder=" " @on-focus="setDefaultTel">
                            <label slot="label" class="dialog-form-label"><span class="star">*</span>联系电话:</label>
                        </x-input>
                        <x-input :show-clear="false" v-model="userInput.qq" :min="5" :max="14" type="number"
                                 :required="true"
                                 placeholder=" ">
                            <label slot="label" class="dialog-form-label"><span class="star">*</span>QQ号:</label>
                        </x-input>
                    </group>
                    <div class="btn-c" :class="{hasSubmit: userInput.hasSubmit}" @click="awardBtnClick">
                        <x-button class="weui-btn_primary">确认</x-button>
                    </div>
                </div>

                <!--note-->
                <div class="form-big note" v-show="showDialogType === 'note'">
                    <group class="dialog-form">
                        <div class="dialog-form-title">获得<strong>{{award.name}}</strong></div>
                    </group>
                    <div class="btn-c" @click="awardBtnClick">
                        <x-button>确定</x-button>
                    </div>
                </div>

                <!--积分-->
                <div class="form-big integral" v-show="showDialogType === 'integral'">
                    <group class="dialog-form">
                        <div class="dialog-form-title">获得<strong>{{award.name}}</strong></div>
                    </group>
                    <div class="btn-c" @click="awardBtnClick">
                        <x-button>确定</x-button>
                    </div>
                </div>

                <!--谢谢-->
                <div class="form-big none" v-show="showDialogType === 'none'">
                    <div class="btn-c" @click="awardBtnClick">
                        <x-button>确定</x-button>
                    </div>
                </div>

                <!--close-->
                <!--<div @click="closeDialog">
                  <x-icon type="ios-close-outline" size="40" class="close"></x-icon>
                </div>-->
            </x-dialog>
        </div>
        <!-- 规则弹框-->
        <div v-transfer-dom>
            <alert v-model="showAlert" title="活动规则" dialog-transition="none" mask-transition="none">
                <div style="text-align: left" v-html="detail.rules"></div>
            </alert>
        </div>
        <!--我的奖品-->
        <div v-transfer-dom>
            <alert v-model="showMyAward" title="我的奖品" dialog-transition="none" mask-transition="none">
                <ul v-if="myAwardList.length > 0">
                    <li class="alert-list-item" v-for="item in myAwardList">{{item.name}} <br>
                        {{'(' + item.createTime + ')'}}
                    </li>
                </ul>
                <div v-else>您还没有中奖纪录哦</div>
            </alert>
        </div>
        <!--clear btn-->
        <button class="weui-btn"
                @click="clearCache"
                style="position: absolute; z-index: 999; top: 0; right: 0;width: 10%; opacity: 0">
        </button>
    </view-box>
</template>

<script>
    /* TODO:
    * 1:切换用户账号后 已经领取过的 app 状态没设置正确(bug)
    * 2:背景图片结构 x-img 组件的问题
    * */
    import {
        ViewBox,
        Marquee,
        MarqueeItem,
        XDialog,
        Group,
        XButton,
        XInput,
        Alert,
        XImg,
        TransferDomDirective as TransferDom
    } from 'vux';
    import reduce from 'lodash/reduce';
    import pickBy from 'lodash/pickBy';
    import isEqual from 'lodash/isEqual';

    import BtnDownload from '../components/btn-download.vue';
    import LotteryGrid from '../components/Lottery-grid.vue'; //抽奖宫格

    import JsCallApp, {appState} from '../util/JsCallApp'; //客户端api
    import {fetchLotteryDetail, fetchLotteryRecords} from '../services/appStore'

    // for debugger
    function alertObj(obj) {
        alert(JSON.stringify(obj, null, 4))
    }

    function alertObjKeys(obj) {
        alert(Object.keys(obj).join('\n'))
    }

    export default {
        name: 'LotteryChunjie',
        data() {
            return {
                path: process.env.NODE_ENV === 'production' ? '\/appstore\/H5' : '',  //重要: build的时候需要修改, dev= '' product= '\/appstore\/H5'
                apps: [],
                detail: {},
                more: {},
                showMoreList: false,
                records: [], //中奖名单
                awards: [], //奖品列表
                userInfo: {},
                snows: [], //雪花,
                showAlert: false,
                showMyAward: false,
                myAwardList: [],
                award: {}, //最新的中奖结果,
                showDialog: false,
                loadDialogBg: false,
                showDialogType: '',
                times: this.getCacheTimes() || 0, //抽奖次数
                awardSn: 0, //抽奖次数
                userInput: {
                    name: '',
                    tel: '',
                    qq: '',
                    address: '',
                    accountId: '',
                    activityId: '',
                    orderId: '', //抽奖后返回中奖
                    hasSubmit: false, //是否已经提交领奖 个人信息
                    hasAbandon: false, //是否放弃领奖
                },
                clickTimes: 0,
            }
        },
        props: {
            id: {
                require: true
            }
        },
        beforeCreate() {
            //set rem responsible
            (function (a) {
                "use strict";
                var c = a.document, d = c.documentElement;

                function j() {
                    var b = d.getBoundingClientRect().width, c = b / 10;
                    d.style.fontSize = c + "px"
                }

                j();
                a.addEventListener("resize", j)
            })(window);

        },
        created() {
            //所有初始化要等获得数据后
            this.fetchData().then(() => {
                document.title = this.detail.title || '抽奖活动';
                //曝光全局方法 给客户端调用
                window.javaCallJsChangeStatus = this.javaCallJsChangeStatus.bind(this);
                window.downloadBtnClickCallBack = this.changeState.bind(this);
                window.requestServerByAsyncCallBack = (type, status, json) => {
                };
                window.loginSuccessCallBack = (res) => {
                    this.userInfo = this.userInfo = JSON.parse(JsCallApp.getUserLoginInfo());
                };
                window.javaCallJsExitOutSwitch = () => {
//       重要: 必须清除定时器 不然webview会崩溃
                    window.clearInterval(this.recordsTimer);
                    window.clearTimeout(this.drawTimer);
                    this.setCacheAppsAction(this.apps);
                    // 弹框未完成输入缓存, 未放弃领奖
                    if ((this.showDialogType === 'form-big' || this.showDialogType === 'form-sm') && !this.userInput.hasAbandon) {
                        this.setCacheUserInput();
                    }
//          window.jsObj && JsCallApp.transferParam('exitOut');
                    /*if (window.isEditing) {
                      JsCallApp.transferParam('stopExitOut');
                    } else {
                      JsCallApp.transferParam('exitOut');
                    }*/
                };

                /*轮询获取中奖广播*/
                if (String(this.detail.istatus) === '0') {
                    this.recordsTimer = setInterval(() => {
                        fetchLotteryRecords({id: this.id}).then(res => {
                            if (String(res.code) === '0') {
                                this.records = res.data.records;
                            }
                        });
                    }, 45000);
                }

                //init page state
                window.jsObj && this.changeState();
                window.jsObj && (this.userInfo = JSON.parse(JsCallApp.getUserLoginInfo()) || {});
                window.MtaH5 && window.MtaH5.clickStat('loaded_activity_' + this.detail.id);
            });
        },
        methods: {
            fetchData() {
                return fetchLotteryDetail({id: this.id}).then((res) => {
                    if (String(res.code) === '-1') {
                        return;
                    }
                    this.records = res.data.records;
                    this.awards = res.data.awards;
                    this.detail = res.data.detail;
                    this.more = res.data.more;
                    if (window.jsObj) {
                        //添加额外的属性目前没用到
                        let apps = JSON.parse(JsCallApp.initStatusApps(JSON.stringify(res.data.apps)));
                        //获取缓存 判断action
                        let cacheAppsAction = this.getCacheAppsAction();
                        if (cacheAppsAction && cacheAppsAction.length > 0) {
                            cacheAppsAction.forEach(a => {
                                apps = apps.map(b => {
                                    if (a.id === b.id) {
                                        return {...b, ...a}
                                    } else {
                                        return b;
                                    }
                                })
                            });
                        }
                        //add react prop
                        this.apps = apps.map(v => {
                                return {
                                    ...v,
                                    btnState: {
                                        percentage: 0,
                                        pause: false,
                                        btnText: '安装'
                                    }
                                }
                            }
                        );
                        //action='open'的app排到后面
                        let notInstall = apps.filter(v => {
                                return v.action !== 'open'
                            }
                        );
                        let installed = apps.filter(v => {
                                return v.action === 'open'
                            }
                        );
                        this.apps = [...notInstall, ...installed];
                    } else {
                        this.apps = res.data.apps.map(v => {      //add react prop
                            return {
                                ...v,
                                btnState: {
                                    percentage: 0,
                                    pause: false,
                                    btnText: '安装'
                                }
                            }
                        });
                    }
                }, () => {
                    document.title = '网络出错了, 可尝试重进';
                })
            },
            login() {
                this.userInfo = JSON.parse(JsCallApp.getUserLoginInfo()) || {};
                if (!this.userInfo.userId) {
                    JsCallApp.jumpToLogin();
                    return;
                }
            },
            handleImgClick(app) {
                window.jsObj && this.jumpToDetail(app);
            },
            /*下载 , 领取, 打开逻辑*/
            handleBtnClick(app, e) {
                if (window.jsObj) {
                    e.preventDefault();
                    if (app.action === 'get') { //--获取抽奖机会
                        //用户信息
                        this.userInfo = JSON.parse(JsCallApp.getUserLoginInfo()) || {};
                        if (!this.userInfo || !this.userInfo.userId) {
                            JsCallApp.jumpToLogin();
                            return;
                        }
                        this.getting = true;  //正在获取中 状态
                        JsCallApp.alertAToast('领取中...');
                        window.setTimeout(() => {
                            JsCallApp.handleAppAction(JSON.stringify(app), 'open');
                        }, 500);
                        //需要先打开一次才可以抽奖
                        this.apps = this.apps.map((v) => {
                            if (app.id === v.id) {
                                return {
                                    ...v,
                                    action: 'open',
                                    btnState: {
                                        ...v.btnState,
                                        btnText: '领取中'
                                    }
                                }
                            } else {
                                return v;
                            }
                        });
                        //必须异步
                        this.drawTimer = window.setTimeout(() => {
                            let getTimer = window.setTimeout(() => {
                                this.getting = false;
                                this.apps = this.apps.map((v) => {
                                    if (app.id === v.id) {
                                        return {
                                            ...v,
                                            action: 'get',
                                            btnState: {
                                                ...v.btnState,
                                                btnText: '领取'
                                            }
                                        }
                                    } else {
                                        return v;
                                    }
                                });
                                JsCallApp.alertAToast('网络请求超时!');
                            }, 6000);
                            let resp = JSON.parse(JsCallApp.requestServer('/web/download', 'accountId=' + this.userInfo.userId + '&activityId=' + this.detail.id + '&tel=' + this.userInfo.phone + '&appId=' + app.id + '&packageName=' + app.packageName));
                            this.getting = false;
                            window.clearTimeout(getTimer);
                            if (String(resp.code) === '0') {
                                if (resp.msg === 'done') {
                                    JsCallApp.alertAToast('该应用已领过');
                                    this.apps = this.apps.map((v) => {
                                        if (app.id === v.id) {
                                            return {
                                                ...v,
                                                action: 'open',
                                                istatus: -1, //0 可领取 -1不可领取
                                                btnState: {
                                                    ...v.btnState,
                                                    btnText: '已领取'
                                                }
                                            }
                                        } else {
                                            return v;
                                        }
                                    });
                                    this.setCacheAppsAction(this.apps);
                                    window.MtaH5 && window.MtaH5.clickStat('A' + this.detail.id + '_done_' + app.id + '_' + app.packageName + '_' + app.name);
                                    window.MtaH5 && window.MtaH5.clickStat('click_app_done', {
                                        'activityid': this.detail.id,
                                        'name': app.name,
                                        'packagename': app.packageName
                                    });
                                } else {
                                    this.times++;
                                    this.setCacheTimes();
                                    this.apps = this.apps.map((v) => {
                                        if (app.id === v.id) {
                                            return {
                                                ...v,
                                                action: 'open',
                                                istatus: -1, //0 可领取 -1不可领取
                                                btnState: {
                                                    ...v.btnState,
                                                    btnText: '打开'
                                                }
                                            }
                                        } else {
                                            return v;
                                        }
                                    });
                                    this.setCacheAppsAction(this.apps);
                                    JsCallApp.alertAToast('抽奖机会+1');
                                    window.MtaH5 && window.MtaH5.clickStat('A' + this.detail.id + '_get_' + app.id + '_' + app.packageName + '_' + app.name);
                                    window.MtaH5 && window.MtaH5.clickStat('click_app_get', {
                                        'activityid': this.detail.id,
                                        'name': app.name,
                                        'packagename': app.packageName
                                    });
                                }
                            } else {
                                JsCallApp.alertAToast(resp.msg);
                                if (String(this.detail.istatus) === '1') { //活动结束
                                    this.apps = this.apps.map((v) => {
                                        if (app.id === v.id) {
                                            return {
                                                ...v,
                                                istatus: -1,
                                                action: 'open',
                                                btnState: {
                                                    ...v.btnState,
                                                    btnText: '打开'
                                                }
                                            }
                                        } else {
                                            return v;
                                        }
                                    });
                                } else if (String(this.detail.istatus) === '-1') { //活动未开始
                                    this.apps = this.apps.map((v) => {
                                        if (app.id === v.id) {
                                            return {
                                                ...v,
                                                action: 'get',
                                                btnState: {
                                                    ...v.btnState,
                                                    btnText: '领取'
                                                }
                                            }
                                        } else {
                                            return v;
                                        }
                                    });
                                }
                                this.setCacheAppsAction(this.apps);
                                window.MtaH5 && window.MtaH5.clickStat('click_app_error', {
                                    'activityid': this.detail.id,
                                    'name': app.name,
                                    'packagename': app.packageName
                                });
                            }
                        }, 2000);
                        /*抽奖*/
                    } else if (app.action === 'draw') {
                        //用户信息
                        this.userInfo = JSON.parse(JsCallApp.getUserLoginInfo()) || {};
                        if (!this.userInfo || !this.userInfo.userId) {
                            JsCallApp.jumpToLogin();
                            return;
                        }
                        this.callServerGetAwardResp(app);
                    } else {
                        //初始化的istatus 0(未安装)和1(已经安装), 安装 升级 继续 action 记录一下app按钮 改成2(可领取)
                        if (!(app.action === 'open')) {
                            this.apps = this.apps.map(v => {
                                if (app.id === v.id) {
                                    return {
                                        ...v,
                                        istatus: 2,
                                    }
                                } else {
                                    return v;
                                }
                            });
                            this.setCacheAppsAction(this.apps);
                        }
                        JsCallApp.handleAppAction(JSON.stringify(app), app.action);
                        window.MtaH5 && window.MtaH5.clickStat('click_app_' + app.action, {
                            'activityid': this.detail.id,
                            'name': app.name,
                            'packagename': app.packageName
                        });
                    }
                }
            },
            /*抽奖*/
            callServerGetAwardResp() {
                this.loadDialogBg = true;
                //用户信息
                this.userInfo = JSON.parse(JsCallApp.getUserLoginInfo()) || {};
                if (!this.userInfo || !this.userInfo.userId) {
                    JsCallApp.jumpToLogin();
                    return;
                }
                if (window.jsObj && this.times) {
                    let resp = JSON.parse(JsCallApp.requestServer('/web/draw', 'accountId=' + this.userInfo.userId + '&tel=' + this.userInfo.phone + '&activityId=' + this.detail.id, 'draw'));
                    if (resp && resp.msg === 'ok') {
                        this.times--;
                        this.setCacheTimes();
                        this.awardSn = resp.data.order.award.sn; //奖品位置
                        this.userInput.orderId = resp.data.order.id; //提交地址需要的orderId
                        let type = resp.data.order.award.type;
                        if (type == 1) {
                            this.showDialogType = 'integral'; //积分
                            this.award = resp.data.order.award;
                            this.setCacheAward();
                        } else if (type == 2) {
                            this.showDialogType = 'form-big'; //邮寄
                            this.award = resp.data.order.award;
                            this.setCacheAward();
                        } else if (type == 3) {
                            this.showDialogType = 'note'; //纸条
                            this.award = resp.data.order.award;
                            this.setCacheAward();
                        } else if (type == 4) {
                            this.showDialogType = 'form-sm'; //流量充值
                            this.award = resp.data.order.award;
                            this.setCacheAward();
                        } else {
                            this.showDialogType = 'none'; //谢谢参与
                        }
                        //缓存
                        this.setCacheAppsAction(this.apps);
                        window.MtaH5 && window.MtaH5.clickStat('activity_click_getaward', {
                            'activityid': this.detail.id,
                            'userphone': this.userInfo.phone,
                            'userid': this.userInfo.userId
                        });
                    } else {
                        /*抽奖失败*/
                        this.$refs.lotteryGrid.stop();
                        JsCallApp.alertAToast(resp.msg);
                    }
                }
            },
            /*抽奖九宫格按钮*/
            drawTimeOut() {
                window.jsObj && JsCallApp.alertAToast('抽奖超时');
            },
            /*跳转详情*/
            jumpToDetail(app) {
                //alertObj(app);
                //JsCallApp.handleAppAction(JSON.stringify(app), 'detail');
            },
            /*下载所有*/
            handleDownloadAll() {
                if (this.userInfo.userId) {
                    this.apps.forEach((v) => {
                        let appStatus = JsCallApp.getAppStatus(v.packageName, v.id, v.versionCode);
                        if (appStatus == appState.FINAL_DOWNLOAD || appStatus == appState.FINAL_PAUSE) {
                            JsCallApp.handleAppAction(JSON.stringify(v), 'download');
                            this.apps = this.apps.map(m => {
                                if (v.id === m.id) {
                                    return {
                                        ...m,
                                        istatus: 2,
                                    }
                                } else {
                                    return m;
                                }
                            });
                        }
                    });
                    this.setCacheAppsAction(this.apps);
                    window.MtaH5 && window.MtaH5.clickStat('activity_click_dowloadall', {
                        'activityid': this.detail.id,
                        'userphone': this.userInfo.phone,
                        'userid': this.userInfo.userId
                    });
                } else {
                    window.jsObj && JsCallApp.jumpToLogin();
                }
                this.$refs.viewBox.scrollTo(630);
            },
            /*
            * just like reactJs's reducer function
            * app.istatus === 0; //安装了, 未领取
            * app.istatus === -1; //已经领取
            * */
            getNewState(state, payload) {
                if (payload.appStatus == appState.FINAL_OPEN) {  // --app已安装--
                    if (String(state.istatus) === '2') { //未领取
                        return {
                            ...state,
                            action: 'get',
                            btnState: {
                                ...state.btnState,
                                percentage: 100,
                                btnText: '领取'
                            }
                        }
                    } else if (String(state.istatus) === '-1') { //已经安装并且领取过
                        return {
                            ...state,
                            action: 'open',
                            btnState: {
                                ...state.btnState,
                                percentage: 100,
                                btnText: '打开'
                            }
                        }
                    } else {
                        return {
                            ...state,
                            action: 'open',
                            btnState: {
                                ...state.btnState,
                                percentage: 100,
                                btnText: '打开'
                            }
                        }
                    }
                } else if (payload.appStatus == appState.FINAL_UPDATE) { //更新
                    return {
                        ...state,
                        action: 'update',
                        btnState: {
                            ...state.btnState,
                            btnText: '更新'
                        }
                    }
                } else if (payload.appStatus == appState.FINAL_DOWNLOAD) { //下载
                    return {
                        ...state,
                        action: 'download',
                        btnState: {
                            ...state.btnState,
                            percentage: 0,
                            btnText: JsCallApp.isSystemAppstore() ? '安装' : '下载'
                        }
                    }
                } else if (payload.appStatus == appState.FINAL_PAUSE) { //暂停
                    return {
                        ...state,
                        action: 'continue',
                        btnState: {
                            ...state.btnState,
                            percentage: payload.progress,
                            pause: true,
                            btnText: '继续'
                        }
                    }
                } else if (payload.appStatus == appState.FINAL_INSTALL) { //安装
                    return {
                        ...state,
                        action: 'install',
                        btnState: {
                            ...state.btnState,
                            percentage: 100,
                            btnText: '安装'
                        }
                    }
                } else if (payload.appStatus == appState.FINAL_INSTALL_ING) {
                    return {
                        ...state,
                        action: 'install',
                        btnState: {
                            ...state.btnState,
                            percentage: 100,
                            btnText: '安装中'
                        }
                    }
                } else if (payload.appStatus == appState.FINAL_DOWNLOAD_ING) {
                    return {
                        ...state,
                        action: 'pause',
                        btnState: {
                            ...state.btnState,
                            percentage: payload.progress,
                            btnText: payload.progress + '%'
                        }
                    }
                } else if (payload.appStatus == appState.FINAL_WAITING) {
                    return {
                        ...state,
                        action: 'pause',
                        btnState: {
                            ...state.btnState,
                            btnText: '等待'
                        }
                    }
                } else {
                    return state;
                }
            },
            changeState() {
                if (this.getting) {
                    return;
                }
                let appStatus;
                let progress;
                this.apps = this.apps.map((v) => {
                    appStatus = JsCallApp.getAppStatus(v.packageName, v.id, v.versionCode);
                    progress = JsCallApp.getAppProcess(v.packageName) || 0;
                    return this.getNewState(v, { //类似react的 reducer
                        appStatus: appStatus,
                        progress: Number(progress).toFixed(1)
                    });
                })
            },
            /*app轮询调用 下载进度（0-100）*/
            javaCallJsChangeStatus(packName, status, progress) {
                this.changeState();
            },
            /*缓存*/
            setCacheAppsAction(apps = []) {
                if (apps.length > 0) {
                    let appsAction = apps.map(v => {
                        return {
                            id: v.id,
                            action: v.action,
                            istatus: v.istatus
                        }
                    });
                    window.localStorage.setItem('lotteryAppsAction' + this.id, JSON.stringify(appsAction));
                }
            },
            getCacheAppsAction() {
                return JSON.parse(window.localStorage.getItem('lotteryAppsAction' + this.id));
            },
            setCacheUserInput() {
                this.userInput.showDialogType = this.showDialogType;
                window.localStorage.setItem('lotteryUerInput' + this.id, JSON.stringify(this.userInput));
            },
            getCacheUserInput() {
                return JSON.parse(window.localStorage.getItem('lotteryUerInput' + this.id));
            },
            setCacheAward() {
                this.award.showDialogType = this.showDialogType;
                window.localStorage.setItem('lotteryLastAward' + this.id, JSON.stringify(this.award));
            },
            getCacheAward() {
                return JSON.parse(window.localStorage.getItem('lotteryLastAward' + this.id));
            },
            setCacheTimes() {
                window.localStorage.setItem('lotteryTimes' + this.id, JSON.stringify(this.times));
            },
            getCacheTimes() {
                return JSON.parse(window.localStorage.getItem('lotteryTimes' + this.id));
            },
            clearCache() {
                this.clickTimes++;
                if (this.clickTimes === 6) {
                    localStorage.clear();
                    this.$http.get('http://192.168.1.148:8090/appstore/record/clear');
                    window.jsObj && JsCallApp.alertAToast('reset done!');
                    this.clickTimes = 0;
                    window.location.reload();
                }
            },
            /*奖品弹框按钮*/
            awardBtnClick() {
                if (String(this.detail.istatus) !== '0') {
                    JsCallApp.alertAToast('活动已结束，期待下次活动吧');
                    this.showDialog = false;
                    return;
                }

                //上传参数
                if (this.showDialogType === 'form-sm' || this.showDialogType === 'form-big') {
                    //活动id
                    this.userInput.activityId = this.detail.id;
                    //用户输入检查
                    if (!(this.$refs.name && this.$refs.name.valid)) {
                        this.$refs.name.focus();
                        this.$refs.name.showErrorToast = true;
                        return;
                    }
                    if (!(this.$refs.tel && this.$refs.tel.valid)) {
                        this.$refs.tel.focus();
                        this.$refs.tel.showErrorToast = true;
                        return;
                    }
                    if (!(this.$refs.qq && this.$refs.qq.valid)) {
                        this.$refs.qq.focus();
                        this.$refs.qq.showErrorToast = true;
                        return;
                    }
                    if (!(this.$refs.address && this.$refs.address.valid)) {
                        this.$refs.address.focus();
                        this.$refs.address.showErrorToast = true;
                        return;
                    }
                    if (this.$refs.name.currentValue === '') {
                        this.$refs.name && this.$refs.name.focus();
                    } else if (this.$refs.tel.currentValue === '') {
                        this.$refs.tel && this.$refs.tel.focus();
                    } else if (this.$refs.qq.currentValue === '') {
                        this.$refs.qq && this.$refs.qq.focus();
                    } else if (this.$refs.address.currentValue === '') {
                        this.$refs.address && this.$refs.address.focus();
                    }
                    if (!this.userInfo.userId) {
                        this.userInfo = JSON.parse(JsCallApp.getUserLoginInfo()) || {};
                    }
                    //用户id
                    if (!this.userInfo || !this.userInfo.userId) {
                        window.jsObj && JsCallApp.jumpToLogin();
                        return;
                    }
                    this.userInput.accountId = this.userInfo.userId;

                    if (!isEqual(this.oldUserInput, {...this.userInput})) { //输入为改变
                        //上传参数
                        let paramsObj = pickBy(this.userInput, function (v) {
                            return !!v;
                        });
//          let params = querystring.stringify(paramsObj);
                        let params = reduce(paramsObj, (result, v, k) => {
                            return `${result}&${k}=${v}`;
                        }, '');
                        try {
                            this.showDialog = false;
                            this.$vux.loading.show();
                            let resp = JSON.parse(JsCallApp.requestServer('/web/upaddress', params));
                            if (String(resp.code) === '0') {
                                this.$vux.loading.hide();
                                !this.userInput.hasSubmit && JsCallApp.alertAToast(resp.msg);
                                this.userInput.hasSubmit && window.MtaH5 && window.MtaH5.clickStat('activity_click_editadress', {
                                    'activityid': this.detail.id,
                                    'userphone': this.userInfo.phone,
                                    'userid': this.userInfo.userId,
                                    'qq': this.userInput.qq
                                });
                                this.userInput.hasSubmit = true;
                                this.setCacheUserInput();
                            } else {
                                this.$vux.loading.hide();
                                this.showDialog = true;
                                JsCallApp.alertAToast(resp.msg);
                                this.setCacheUserInput();
                            }

                        } catch (e) {
                            this.$vux.loading.hide(); //提交出现异常：保持提交对话框
                            this.showDialog = true;
                            JsCallApp.alertAToast('未正确填写');
                            this.setCacheUserInput();
                        }
                    } else {
                        this.showDialog = false;
                    }
                } else {
                    this.showDialog = false;
                }
            },
            closeDialog() {
                this.showDialog = false;
                if (this.showDialogType === 'form-sm' || this.showDialogType === 'form-big') {
                    let _this = this;
                    this.$vux.confirm.show({
                        title: '放弃领奖',
                        content: '放弃后无法恢复哦',
                        theme: 'ios',
                        onConfirm() {
                            _this.userInput.hasAbandon = true;
                            _this.setCacheUserInput();
                        },
                        onCancel() {
                            _this.showDialog = true;
                        }
                    })
                }
            },
            setDefaultTel(value) {
                if (this.userInfo.phone && value === '') {
                    this.userInput.tel = this.userInfo.phone;
                }
            },
            fetchMyAward() {
                /*this.userInfo = JSON.parse(JsCallApp.getUserLoginInfo());
                if (!this.userInfo || !this.userInfo.userId) {
                  JsCallApp.jumpToLogin();
                  return;
                }
                this.$vux.loading.show();
                this.$http.get(`${myAwardUrl}?accountId=${this.userInfo.userId}&activityId=${this.detail.id}`).then(res => {
                  if (String(res.data.code) === '0') {
                    this.$vux.loading.hide();
                    this.myAwardList = res.data.data.list;
                    this.showMyAward = true;
                  } else {
                    this.$vux.loading.hide();
                    JsCallApp.alertAToast('获取失败');
                  }
                })*/
                /*获取缓存的抽奖信息/用户输入*/
                if (!this.$refs.lotteryGrid.drawing) {
                    let award = this.getCacheAward();
                    if (award && award.id) {
                        this.award = award;
                        this.showDialogType = award.showDialogType;
                        this.userInput = this.getCacheUserInput() || {};
                        this.showDialog = true; //上次中奖弹框
                    } else {
                        this.showMyAward = true; //无中奖提示
                    }
                    this.oldUserInput = {...this.userInput};
                    window.MtaH5 && window.MtaH5.clickStat('activity_click_myaward', {
                        'activityid': this.detail.id,
                        'userphone': this.userInfo.phone,
                        'userid': this.userInfo.userId
                    });
                }

            },
            handleClickRules() {
                this.showAlert = true;
                window.MtaH5 && window.MtaH5.clickStat('activity_click_rulse', {
                    'activityid': this.detail.id,
                    'userphone': this.userInfo.phone,
                    'userid': this.userInfo.userId
                });
            },

        },
        filters: {
            telTruncate(v) {
                let arr = String(v).split('');
                return [...arr.slice(0, 3), ...['*', '*', '*'], ...arr.slice(-4)].join('');
            }
        },
        components: {
            ViewBox,
            BtnDownload,
            Marquee,
            MarqueeItem,
            XDialog,
            XInput,
            Group,
            XButton,
            LotteryGrid,
            Alert,
            XImg,
        },
        directives: {
            TransferDom
        }
    }
</script>

<style lang="less" scoped>
    @primary: #ffeeef;
    @secondary: #db1517;
    @success: #05a0ac;

    @btn-color: #db1517;
    @bg: #da151a;

    //主体
    .lottery-chunjie2018 {
        .bg-img {
            display: block;
            margin: 0 auto;
            width: 100%;
            height: auto;
        }
        .text-secondary {
            color: @secondary;
        }
        .text-primary {
            color: @primary;
        }

        //内容
        .content {
            position: relative;
            z-index: 1;
            top: 0;
            font-size: (24/@rem)*1rem;
            text-align: center;
            overflow: hidden;
            width: 100%;
            color: @primary;
        }
        .gamer-list {
            -webkit-touch-callout: none;
            pointer-events: none;
            position: absolute;
            top: (610/@rem)*1rem;
            font-size: (24/@rem)*1rem;
            text-align: left;
            padding: 0 .4rem 0 2.4rem;
            box-sizing: border-box;
            color: #fcd77a;
            font-weight: bold;
            li {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                list-style: none;
            }
        }
        .btn-download-all {
            -webkit-touch-callout: none;
            position: absolute;
            z-index: 9;
            top: (1296/@rem)*1rem;
            width: (150/@rem)*1rem;
            height: (52/@rem)*1rem;
            left: 0;
            right: 0;
            margin: auto;
            border: none;
            color: @btn-color;
            font-size: (26/@rem)*1rem;
            font-weight: bold;
            background: url(../../static/images/lottery/chunjie2018/btn-bg.webp) no-repeat center;
            background-size: 100%;
            &:active {
                opacity: .8;
            }
        }
        .lottery-rule {
            pointer-events: none;
            -webkit-touch-callout: none;
            position: absolute;
            width: 100%;
            top: ((1296+30+52)/@rem)*1rem;
            font-size: (26/@rem)*1rem;
        }
        //app list
        .app-list {
            -webkit-touch-callout: none;

            position: absolute;
            z-index: 9;
            top: (1452/@rem)*1rem;
            left: 0;
            width: 100%;
            box-sizing: border-box;
            padding: 0 (30/@rem)*1rem;
            max-height: (500*2/@rem)*1rem;
            overflow-y: auto;
            overflow-x: hidden;
        }
        .list-item {
            float: left;
            width: 25%;
            padding-bottom: (50/@rem)*1rem;
        }
        .img-c {
            display: block;
            margin: 0 auto;
            width: (108/@rem)*1rem;
            height: (108/@rem)*1rem;
            border-radius: (26/@rem)*1rem;
            border: 1px solid #fff;
            overflow: hidden;
            font-size: 0;
            line-height: 0;
            .item-logo {
                display: block;
                width: 100%;
                height: 100%;
            }
        }
        .item-title {
            pointer-events: none;
            -webkit-touch-callout: none;
            font-weight: normal;
            font-size: (24/@rem)*1rem;
            color: @primary;
            line-height: 2.4;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }
        //more-list
        .more-list {
            position: absolute;
            z-index: 3+1;
            top: (2619/@rem)*1rem;
            left: 0;
            right: 0;
            width: (655/@rem)*1rem;
            margin: auto;
            white-space: nowrap;
            overflow-x: auto;
            overflow-y: hidden;
            font-size: 0;
        }
        .more-list-item {
            display: inline-block;
            position: relative;
            width: (320/@rem)*1rem;
            height: (200/@rem)*1rem;
            border-radius: (16/@rem)*1rem;
            overflow: hidden;
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
            & + .more-list-item {
                margin-left: (15/@rem)*1rem;
            }
        }

        //--animation--
        .animated {
            animation-duration: 1s;
            animation-fill-mode: both;
            /*animation-iteration-count: infinite;*/
        }

        @keyframes rotate {
            0% {
                transform: rotate(0deg)
            }
            to {
                transform: rotate(360deg)
            }
        }
        .rotate {
            animation-name: rotate
        }

        @keyframes zoomIn {
            0% {
                opacity: 0;
                transform: scale3d(.3, .3, .3)
            }

            50% {
                opacity: 1
            }
        }
        .zoomIn {
            animation-name: zoomIn
        }

        @keyframes rubberBand {
            0% {
                transform: scaleX(1)
            }

            30% {
                transform: scale3d(1.25, .75, 1)
            }

            40% {
                transform: scale3d(.75, 1.25, 1)
            }

            50% {
                transform: scale3d(1.15, .85, 1)
            }

            65% {
                transform: scale3d(.95, 1.05, 1)
            }

            75% {
                transform: scale3d(1.05, .95, 1)
            }

            to {
                transform: scaleX(1)
            }
        }

        .rubberBand {
            animation-name: rubberBand
        }

        //活动规则链接
        .rule-link {

            -webkit-touch-callout: none;
            position: absolute;
            z-index: 11;
            top: (535/@rem)*1rem;
            left: 0;
            right: 0;
            margin: auto;
        }

        .rule-link-item {
            display: inline-block;
            color: @btn-color;
            width: (150/@rem)*1rem;
            height: (52/@rem)*1rem;
            background: transparent url(../../static/images/lottery/chunjie2018/btn-bg.webp) no-repeat center;
            background-size: 100%;
            margin: 0 (35/@rem)*1rem;
            border: none;
            font-weight: bold;
            font-size: (26/@rem)*1rem;
            padding: 0;
            &:active {
                opacity: .8;
            }
        }

    }

</style>
