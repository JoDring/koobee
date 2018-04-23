<template>
    <!--snow 风格-->
    <div class="lottery" :body-padding-bottom="0">
        <div class="content" id="lottery-content">
            <!--clear btn-->
            <button class="weui-btn"
                    @click="clearCache"
                    style="position: absolute; z-index: 999; top: 0; right: 0;width: 10%; opacity: 0">
            </button>
            <img src="../../static/images/lottery/wuyi2018/bg.webp" class="bg-img">
            <img src="../../static/images/lottery/wuyi2018/butterfly.gif" class="bg-decoration">
            <marquee class="gamer-list text-shadow" v-if="records.length > 0">
                <marquee-item v-for="(item, index) in records" :key="index">
                    <span class="text-secondary">
                        中奖播报</span>
                    <x-icon type="volume-medium" size="17" class="icon-laba"></x-icon>
                    恭喜 {{item.tel}}<span class="text-secondary"> 获得 </span>{{item.name}}
                </marquee-item>
            </marquee>
            <button @click="handleDownloadAll"
                    class="weui-btn btn-download-all">
                <span v-if="!userInfo || !userInfo.userId" class="btn-login"></span>
            </button>
            <div class="app-list" v-if="apps.length > 0">
                <div class="list-item" v-for="(item, index) in apps" :key="item.id">
                    <div class="img-c" @click="handleImgClick(item)">
                        <x-img v-if="onLine" :src="item.iconUrl" class="item-logo animated" :class="{rubberBand: item.imgAnimated}"
                               container=".lottery">
                        </x-img>
                        <div class="item-bg"></div>
                    </div>
                    <h1 class="item-title">{{item.name}}</h1>
                    <btn-download v-if="item.btnState"
                                  @click.native="handleBtnClick(item, $event)"
                                  :url="item.downloadUrl"
                                  :mini="true"
                                  :btnText="item.btnState.btnText"
                                  :start-load="item.btnState.startLoad"
                                  :percentage="item.btnState.percentage"
                                  class="wuyi2018"
                                  :class="{hasAward: item.btnState.btnText === '已抽奖'}"
                    >
                    </btn-download>
                </div>
            </div>
            <!--规则链接-->
            <div class="rule-link">
                <span @click="fetchMyAward" class="rule-link-item">我的奖品</span>
                <span @click="handleClickRules" class="rule-link-item">活动规则</span>
            </div>
            <!--预加载弹框图片-->
            <div v-if="loadFormBg" style="position: absolute; bottom: 0;left: 0;width: 1px; height: 1px; opacity: 0;">
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
                        <x-input ref="name" :show-clear="false" v-model="userInput.name" :min="2" :required="true"
                                 placeholder=" ">
                            <label slot="label" class="dialog-form-label"><span class="star">*</span>收件人:</label>
                        </x-input>
                        <x-input ref="tel" :show-clear="false" v-model="userInput.tel" type="tel" is-type="china-mobile"
                                 :max="13"
                                 placeholder=" "
                                 :required="true" @on-focus="setDefaultTel">
                            <label slot="label" class="dialog-form-label"><span class="star">*</span>联系电话:</label>
                        </x-input>
                        <x-input ref="qq" :show-clear="false" v-model="userInput.qq" :min="5" type="number"
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
                        <x-input :show-clear="false" v-model="userInput.qq" :min="5" type="number" :required="true"
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

    </div>
</template>

<script>
    import {
        Marquee,
        MarqueeItem,
        XDialog,
        Group,
        XButton,
        XInput,
        Alert,
        XImg,
//    querystring,
        TransferDomDirective as TransferDom
    } from 'vux';
    import random from 'lodash/random';
    import reduce from 'lodash/reduce';
    import pickBy from 'lodash/pickBy';
    import isEqual from 'lodash/isEqual';
    import BtnDownload from '../components/btn-download.vue';
    import JsCallApp, {appState} from '../util/JsCallApp'; //客户端api
    import {fetchLotteryDetail, fetchLotteryRecords, clearTestCache} from '../services/appStore'
    // for debugger
    function alertObj(obj) {
        alert(JSON.stringify(obj, null, 4))
    }
    function alertObjKeys(obj) {
        alert(Object.keys(obj).join('\n'))
    }

    //  for test
    //  localStorage.removeItem('lotteryAppsAction');
    //  localStorage.removeItem('lotteryUerInput');
    //  localStorage.removeItem('lotteryLastAward');
    //    localStorage.clear();
    export default {
        name: 'lottery-wuyi',
        data() {
            return {
                apps: [],
                detail: {},
                records: [], //中奖名单
                awards: [], //奖品
                userInfo: {},
                showAlert: false,
                showMyAward: false,
                myAwardList: [],
                award: {}, //最新的中奖结果,
                showDialog: false,
                showDialogType: '',
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
                loadFormBg: false,
                onLine: window.navigator.onLine
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
                document.title = this.detail.title || '无标题活动';
                //曝光全局方法 给客户端调用
                window.javaCallJsChangeStatus = this.changeState.bind(this);
                window.downloadBtnClickCallBack = this.changeState.bind(this);
                window.requestServerByAsyncCallBack = (type, status, json) => {};
                window.loginSuccessCallBack = (res) => {
                    this.userInfo = this.userInfo = JSON.parse(JsCallApp.getUserLoginInfo());
                };
                window.javaCallJsExitOutSwitch = () => {
                    window.clearInterval(this.recordsTimer);
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
                    }, 25000);
                    //上次未领的奖品
                    /*this.userInput = this.getCacheUserInput() || this.userInput;
                    if (this.userInput && (this.userInput.showDialogType === 'form-big' || this.userInput.showDialogType === 'form-sm') && !this.userInput.hasSubmit && !this.userInput.hasAbandon) {
                      this.showDialog = true;
                    }*/
                }
                //init page state
                window.jsObj && this.changeState();
                window.jsObj && (this.userInfo = JSON.parse(JsCallApp.getUserLoginInfo()) || {});
                window.MtaH5 && window.MtaH5.clickStat('loaded_activity_' + this.detail.id);
            });
            this.$vux.bus.$on('off-line', () => {
                this.onLine = false
            })
            this.$vux.bus.$on('on-line', () => {
                this.onLine = true
            })
        },
        methods: {
            fetchData() {
                return fetchLotteryDetail({id : this.id}).then(res => {
                    if (String(res.code) !== '0') {
                        return;
                    }
                    let resData = res.data;
                    this.records = resData.records;
                    this.awards = resData.awards;
                    this.detail = resData.detail;
                    if (window.jsObj) {
                        //添加额外的属性目前没用到
                        let apps = JSON.parse(JsCallApp.initStatusApps(JSON.stringify(resData.apps)));
                        //限制12个
                        if (apps && apps.length > 12) {
                            apps.length = 12;
                        }
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
                                    },
                                    imgAnimated: false //雪花转动
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
                        this.apps = resData.apps.map(v => {      //add react prop
                            return {
                                ...v,
                                btnState: {
                                    percentage: 0,
                                    pause: false,
                                    btnText: '安装'
                                }
                            }
                        });
                        if (this.apps.length > 12) {
                            this.apps.length = 12;
                        }
                    }
                }, () => {
                    document.title = '网络出错了, 可尝试重进';
                })
            },
            handleImgClick(app) {
                window.jsObj && this.jumpToDetail(app);
            },
            //下载 , 领取, 打开逻辑
            handleBtnClick(app, e) {
                this.loadFormBg = true
                if (window.jsObj) {
                    e.preventDefault();
                    if (app.action === 'get') { //--获取抽奖机会
                        //用户信息
                        this.userInfo = JSON.parse(JsCallApp.getUserLoginInfo()) || {};
                        if (!this.userInfo || !this.userInfo.userId) {
                            JsCallApp.jumpToLogin();
                            return;
                        }
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
                            let resp = JSON.parse(JsCallApp.requestServer('/web/download', 'accountId=' + this.userInfo.userId + '&activityId=' + this.detail.id + '&tel=' + this.userInfo.phone + '&appId=' + app.id + '&packageName=' + app.packageName));
                            if (String(resp.code) === '0') {
                                if (resp.msg === 'done') {
                                    JsCallApp.alertAToast('该应用已领过');
                                    this.apps = this.apps.map((v) => {
                                        if (app.id === v.id) {
                                            if (String(v.action) === 'draw') {
                                                return {
                                                    ...v,
                                                    action: 'draw',
                                                    istatus: -1, //0 可领取 -1不可领取
                                                    btnState: {
                                                        ...v.btnState,
                                                        btnText: '抽奖'
                                                    }
                                                }
                                            } else {
                                                return {
                                                    ...v,
                                                    action: 'open',
                                                    istatus: -1, //0 可领取 -1不可领取
                                                    btnState: {
                                                        ...v.btnState,
                                                        btnText: '已抽奖'
                                                    }
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
                                    JsCallApp.alertAToast('抽奖机会+1');
                                    this.apps = this.apps.map((v) => {
                                        if (app.id === v.id) {
                                            return {
                                                ...v,
                                                action: 'draw', //抽奖
                                                istatus: -1, //0或者1表示 可领取 -1不可领取
                                                btnState: {
                                                    ...v.btnState,
                                                    btnText: '抽奖'
                                                }
                                            }
                                        } else {
                                            return v;
                                        }
                                    });
                                    this.setCacheAppsAction(this.apps);
                                    window.MtaH5 && window.MtaH5.clickStat('A' + this.detail.id + '_get_' + app.id + '_' + app.packageName + '_' + app.name);
                                    window.MtaH5 && window.MtaH5.clickStat('click_app_get', {
                                        'activityid': this.detail.id,
                                        'name': app.name,
                                        'packagename': app.packageName
                                    });
                                }
                            } else {
                                JsCallApp.alertAToast(resp.msg);
                                this.setCacheAppsAction(this.apps);
                                window.MtaH5 && window.MtaH5.clickStat('click_app_error', {
                                    'activityid': this.detail.id,
                                    'name': app.name,
                                    'packagename': app.packageName
                                });
                            }
                            this.getting = false;
                        }, 2000);
                    } else if (app.action === 'draw') { //--抽奖
                        this.userInfo = JSON.parse(JsCallApp.getUserLoginInfo()) || {};
                        if (!this.userInfo || !this.userInfo.userId) {
                            JsCallApp.jumpToLogin();
                            return;
                        }
                        this.callServerGetAwardResp(app);
                    }
                    else { //--打开
                        JsCallApp.handleAppAction(JSON.stringify(app), app.action);
                        window.MtaH5 && window.MtaH5.clickStat('A' + this.detail.id + '_' + app.action + '_' + app.id + '_' + app.packageName + '_' + app.name);
                        window.MtaH5 && window.MtaH5.clickStat('click_app_' + app.action, {
                            'activityid': this.detail.id,
                            'name': app.name,
                            'packagename': app.packageName
                        });
                    }
                }
            },
            //抽奖
            callServerGetAwardResp(app) {
                this.apps = this.apps.map((v) => {
                    if (app.id === v.id) {
                        return {
                            ...v,
                            action: '',
                            btnState: {
                                ...v.btnState,
                                btnText: '抽奖中'
                            }
                        }
                    } else {
                        return v;
                    }
                });
                let resp = JSON.parse(JsCallApp.requestServer('/web/draw', 'accountId=' + this.userInfo.userId + '&tel=' + this.userInfo.phone + '&activityId=' + this.detail.id, 'draw'));
                if (resp && resp.msg === 'ok') {
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
                    window.setTimeout(() => {
                        this.showDialog = true;
                    }, 500);

                    //抽奖后
                    this.apps = this.apps.map((v) => {
                        if (app.id === v.id) {
                            return {
                                ...v,
                                imgAnimated: true,
                                action: 'open',
                                istatus: -1,
                                btnState: {
                                    ...v.btnState,
                                    btnText: '已抽奖'
                                }
                            }
                        } else {
                            return v;
                        }
                    });
                    //缓存
                    this.setCacheAppsAction(this.apps);
                    window.MtaH5 && window.MtaH5.clickStat('activity_click_getaward', {
                        'activityid': this.detail.id,
                        'name': app.name,
                        'packagename': app.packageName,
                        'userphone': this.userInfo.phone,
                        'userid': this.userInfo.userId
                    });
                } else {
                    JsCallApp.alertAToast(resp.msg);
                    this.apps = this.apps.map((v) => {
                        if (app.id === v.id) {
                            return {
                                ...v,
                                action: 'draw',
                                btnState: {
                                    ...v.btnState,
                                    btnText: '抽奖'
                                }
                            }
                        } else {
                            return v;
                        }
                    });
                }
            },
            /*跳转详情*/
            jumpToDetail(app) {
                JsCallApp.handleAppAction(JSON.stringify(app), 'detail');
            },
            //下载所有
            handleDownloadAll() {
                if (this.userInfo.userId) {
                    this.apps.forEach((v) => {
                        let appStatus = JsCallApp.getAppStatus(v.packageName, v.id, v.versionCode);
                        if (appStatus == appState.FINAL_DOWNLOAD || appStatus == appState.FINAL_PAUSE) {
                            JsCallApp.handleAppAction(JSON.stringify(v), 'download');
                        }
                    });
                    window.MtaH5 && window.MtaH5.clickStat('activity_click_dowloadall', {
                        'activityid': this.detail.id,
                        'userphone': this.userInfo.phone,
                        'userid': this.userInfo.userId
                    });
                } else {
                    window.jsObj && JsCallApp.jumpToLogin();
                }
                document.querySelector('.lottery').scrollTop = 430;
            },
            /*
            * just like reactJs's reducer function
            * app.istatus === 0; //安装了, 未领取
            * app.istatus === -1; //已经领取
            * */
            getNewState(state, payload) {
                if (payload.appStatus == appState.FINAL_OPEN) {  // --app已安装--
                    if (state.action === 'draw') { //已安装
                        return {
                            ...state,
                            btnState: {
                                action: 'draw',
                                ...state.btnState,
                                percentage: 100,
                                btnText: '抽奖'
                            }
                        }
                    } else if (state.istatus === -1) { //已经安装并且领取过
                        return {
                            ...state,
                            action: 'open',
//              action: 'draw', //for test
                            btnState: {
                                ...state.btnState,
                                percentage: 100,
                                btnText: '已抽奖'
                            }
                        }
                    } else {
                        return {
                            ...state,
                            action: 'get',
//              action: 'draw', //for test
                            btnState: {
                                ...state.btnState,
                                percentage: 100,
                                btnText: '领取'
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
            setCacheAppsAction(apps = []) {
                if (apps.length > 0) {
                    let appsAction = apps.map(v => {
                        return {
                            id: v.id,
                            action: v.action,
                            istatus: v.istatus
                        }
                    });
                    window.localStorage.setItem('lotteryAppsAction', JSON.stringify(appsAction));
                }
            },
            getCacheAppsAction() {
                return JSON.parse(window.localStorage.getItem('lotteryAppsAction'));
            },
            setCacheUserInput() {
                this.userInput.showDialogType = this.showDialogType;
                window.localStorage.setItem('lotteryUerInput', JSON.stringify(this.userInput));
            },
            getCacheUserInput() {
                return JSON.parse(window.localStorage.getItem('lotteryUerInput'));
            },
            setCacheAward() {
                this.award.showDialogType = this.showDialogType;
                window.localStorage.setItem('lotteryLastAward', JSON.stringify(this.award));
            },
            getCacheAward() {
                return JSON.parse(window.localStorage.getItem('lotteryLastAward'));
            },
            //奖品弹框按钮
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
                let award = this.getCacheAward();
                if (award && award.id) {
                    this.award = award;
                    this.showDialogType = award.showDialogType;
                    this.userInput = this.getCacheUserInput() || {};
                    this.showDialog = true;
                } else {
                    this.showMyAward = true;
                }
                this.oldUserInput = {...this.userInput};
                window.MtaH5 && window.MtaH5.clickStat('activity_click_myaward', {
                    'activityid': this.detail.id,
                    'userphone': this.userInfo.phone,
                    'userid': this.userInfo.userId
                });
            },
            handleClickRules() {
                this.showAlert = true;
                window.MtaH5 && window.MtaH5.clickStat('activity_click_rulse', {
                    'activityid': this.detail.id,
                    'userphone': this.userInfo.phone,
                    'userid': this.userInfo.userId
                });
            },
            clearCache() {
                this.clickTimes++;
                if (this.clickTimes === 6) {
                    localStorage.clear();
                    clearTestCache().then(() => {
                        window.jsObj && JsCallApp.alertAToast('reset done!');
                        this.clickTimes = 0;
                        window.location.reload();
                    })
                }
            }
        },
        filters: {
            telTruncate(v) {
                let arr = String(v).split('');
                return [...arr.slice(0, 3), ...['*', '*', '*'], ...arr.slice(-4)].join('');
            }
        },
        components: {
            BtnDownload,
            Marquee,
            MarqueeItem,
            XDialog,
            XInput,
            Group,
            XButton,
            Alert,
            XImg,
        },
        directives: {
            TransferDom
        }
    }
</script>

<style lang="less" scoped>
    @primary: #fff;
    @secondary: #ffce49;
    @success: #05a0ac;

    @btn-color: #ffca29;
    @bg: #0d5628;

    //主体
    .lottery {
        width: 100%;
        height: 100%;
        overflow: scroll;
        -webkit-overflow-scrolling: touch;
        transform: translate3d(0, 0, 0);
        .bg-img {
            display: block;
            margin: 0 auto;
            width: 100%;
            height: auto;
        }
        .bg-decoration {
            position: absolute;
            top: (954/@rem)*1rem;
            left: 0;
            width: 100%;
            height: auto;
            z-index: 1;
        }
        .icon-laba {
            fill: @secondary;
            vertical-align: middle;
        }
        .text-secondary {
            color: @secondary;
        }

        //内容
        .content {
            position: relative;
            z-index: 2;
            top: 0;
            font-size: (24/@rem)*1rem;
            text-align: center;
            overflow: hidden;
            width: 100%;
            color: @primary;
            background: @bg;
        }
        .text-shadow {
            text-shadow: 0 1px 1px #0a441f;
        }
        .gamer-list {
            position: absolute;
            top: (890/@rem)*1rem;
            font-size: (24/@rem)*1rem;
            text-align: left;
            padding: 0 .4rem 0 1.4rem;
            box-sizing: border-box;
            li {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                list-style: none;
            }
        }
        .btn-download-all {
            position: absolute;
            z-index: 9;
            top: (950/@rem)*1rem;
            width: (340/@rem)*1rem;
            height: (109/@rem)*1rem;
            left:(10/@rem)*-1rem;
            right: 0;
            margin: auto;
            background: transparent;
            border: none;
            color: @primary;
            font-size: (26/@rem)*1rem;
        }
        .btn-login {
            display: block;
            width: (224/@rem)*1rem;
            height: (64/@rem)*1rem;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
            background: url("../../static/images/lottery/wuyi2018/btn-login.webp") no-repeat;
            background-size: 100%;
        }
        .lottery-rule {
            position: absolute;
            width: 100%;
            top: (694/@rem)*1rem;
            font-size: (26/@rem)*1rem;
        }
        //app list
        .app-list {
            position: absolute;
            z-index: 9;
            top: (1148/@rem)*1rem;
            left: 0;
        }
        .list-item {
            position: absolute;
            top: 0;
            width: (200/@rem)*1rem;
            /*row1*/
            &:nth-child(1) {
                top: (59/@rem)*1rem;
                left: ((64-28)/@rem)*1rem;
            }
            &:nth-child(2) {
                top: 0;
                left: ((290-28)/@rem)*1rem;
            }
            &:nth-child(3) {
                top: (126/@rem)*1rem;
                left: ((498-28)/@rem)*1rem;
            }
            /*row2*/
            &:nth-child(4) {
                top: (445/@rem)*1rem;
                left: ((75-28)/@rem)*1rem;
            }
            &:nth-child(5) {
                top: (396/@rem)*1rem;
                left: ((301-28)/@rem)*1rem;
            }
            &:nth-child(6) {
                top: (513/@rem)*1rem;
                left: ((530-28)/@rem)*1rem;
            }
            /*row3*/
            &:nth-child(7) {
                top: (774/@rem)*1rem;
                left: ((132-28)/@rem)*1rem;
            }
            &:nth-child(8) {
                top: (831/@rem)*1rem;
                left: ((409-28)/@rem)*1rem;
            }
            /*row4*/
            &:nth-child(9) {
                top: (1216/@rem)*1rem;
                left: ((50-28)/@rem)*1rem;
            }
            &:nth-child(10) {
                top: (1141/@rem)*1rem;
                left: ((294-28)/@rem)*1rem;
            }
            &:nth-child(11) {
                top: (1333/@rem)*1rem;
                left: ((522-28)/@rem)*1rem;
            }
            /*row5*/
            &:nth-child(12) {
                top: (1526/@rem)*1rem;
                left: ((215-28)/@rem)*1rem;
            }
            &:nth-child(13) {
                top: (1626/@rem)*1rem;
                left: ((20-28)/@rem)*1rem;
            }
            &:nth-child(14) {
                top: (1646/@rem)*1rem;
                left: ((420-28)/@rem)*1rem;
            }
        }
        .img-c {
            position: relative;
            width: 100%;
            padding-top: 100%;
            overflow: hidden;
            .item-bg {
                width: 100%;
                padding-top: 100%;
                position: absolute;
                top: 0;
                left: 0;
                z-index: 12;
                background-image: url(../../static/images/lottery/wuyi2018/icon-bg.webp);
                background-repeat: no-repeat;
                background-position: center center;
                background-size: 100%;
            }
            .item-logo {
                display: block;
                position: absolute;
                left: 33%;
                top: 21%;
                z-index: 1;
                width: (81/@rem)*1rem;
                height: (81/@rem)*1rem;
                border-radius: 50%;
            }
        }
        .item-title {
            font-weight: normal;
            font-size: (24/@rem)*1rem;
            color: @primary;
            line-height: 2.6;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            margin-top: (30/@rem)*-1rem;;
        }
    }

    /* --- lottery  end--*/

    //活动规则链接
    .rule-link {
        position: absolute;
        z-index: 11;
        bottom: (480/@rem)*1rem;
        left: (12/@rem)*1rem;;
        right: 0;
        margin: auto;
    }

    .rule-link-item {
        display: inline-block;
        color: @primary;
        padding: (24/@rem)*1rem;
    }

    .alert-list-item {
        list-style: none;
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
</style>
