<template>
    <!--snow 风格-->
    <view-box ref="viewBox" class="lottery" :body-padding-bottom="0">
        <div class="content" id="lottery-content">
            <img src="../../static/images/lottery/snow/bg.webp" class="bg-img">
            <marquee class="gamer-list text-shadow" v-if="records.length > 0">
                <marquee-item v-for="(item, index) in records" :key="index">
                    <span class="text-secondary">中奖播报</span><i class="icon-laba"></i>恭喜 {{item.tel}}<span
                        class="text-secondary"> 获得 </span>{{item.name}}
                </marquee-item>
            </marquee>
            <!--<div class="gamer-list text-shadow" v-else>
              <span v-if="detail.istatus === 1">活动已结束，期待下次活动吧</span>
              <span v-else-if="detail.istatus === -1">活动未开始，稍后再来</span>
            </div>-->

            <button @click="handleDownloadAll" class="weui-btn btn-download-all">
                {{userInfo && !!userInfo.userId ? '一键下载' : '登录抽奖'}}
            </button>
            <div class="app-list" v-if="apps.length > 0">
                <div class="list-item" v-for="(item, index) in apps" :key="item.id">
                    <div class="img-c">
                        <div class="item-bg animated" :class="{rotate: item.imgAnimated}"
                             :style="{'background-image': `url(${path}/static/images/lottery/snow/item-bgs/${index+1}.webp)`}"></div>
                        <x-img @click.native="handleImgClick(item)" :src="item.iconUrl" class="item-logo"
                               container="#vux_view_box_body">
                        </x-img>
                    </div>
                    <h1 class="item-title">{{item.name}}</h1>
                    <btn-download v-if="item.btnState"
                                  @click.native="handleBtnClick(item, $event)"
                                  :url="item.downloadUrl"
                                  :mini="true"
                                  :btnText="item.btnState.btnText"
                                  :start-load="item.btnState.startLoad" :percentage="item.btnState.percentage"
                                  class="yuandan2017"
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
            <!--雪花-->
            <canvas id="canvas" class="canvas"></canvas>
            <!--预加载弹框图片-->
            <div style="position: absolute; bottom: 0;left: 0;width: 1px; height: 1px; opacity: 0;">
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
    </view-box>
</template>

<script>
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
//    querystring,
        TransferDomDirective as TransferDom
    } from 'vux';
    import snowLittle from '../../static/images/lottery/snow/particles/1.webp';
    import random from 'lodash/random';
    import reduce from 'lodash/reduce';
    import pickBy from 'lodash/pickBy';
    import isEqual from 'lodash/isEqual';
    import BtnDownload from '../components/btn-download.vue';
    import JsCallApp, {appState} from '../util/JsCallApp'; //客户端api
    import {fetchLotteryDetail, fetchLotteryRecords} from '../services/appStore'
    //  let appsJson = '[{"id":1146862,"name":"波克捕鱼","packageName":"com.pokercity.bydrqp","downloadUrl":"http://appstore.szprize.cn/appstore/appinfo/download?appId\u003d1146862","iconUrl":"http://cdnimages-10068954.file.myqcloud.com/open/images/596c8b86909c5.png","versionCode":421,"versionName":"4.21","apkSize":33821259,"istatus":0,"downloadTimes":61337630},{"id":2381056,"name":"传奇战域","packageName":"com.cqzy.ewan","downloadUrl":"http://appstore.szprize.cn/appstore/appinfo/download?appId\u003d2381056","iconUrl":"http://tximg.szprize.cn/open/images/59b89e917c684.png","versionCode":51,"versionName":"6.1","apkSize":257192987,"istatus":0,"downloadTimes":35345612},{"id":2380898,"name":"COC部落冲突","packageName":"com.supercell.clashofclans.ewan","downloadUrl":"http://appstore.szprize.cn/appstore/appinfo/download?appId\u003d2380898","iconUrl":"http://tximg.szprize.cn/open/images/59cca1abad42d.png","versionCode":919,"versionName":"9.256.17","apkSize":106057899,"istatus":0,"downloadTimes":79876543},{"id":1146940,"name":"大话西游","packageName":"com.netease.dhxy","downloadUrl":"http://appstore.szprize.cn/appstore/appinfo/download?appId\u003d1146940","iconUrl":"http://tximg.szprize.cn/open/images/59aceaba93ce8.png","versionCode":23361,"versionName":"1.1.102","apkSize":727469220,"istatus":0,"downloadTimes":54173540},{"id":2380885,"name":"皇室战争","packageName":"com.supercell.clashroyale.ewan","downloadUrl":"http://appstore.szprize.cn/appstore/appinfo/download?appId\u003d2380885","iconUrl":"http://tximg.szprize.cn/open/images/59ccabe6dcf1f.png","versionCode":212,"versionName":"2.0.5","apkSize":110854427,"istatus":0,"downloadTimes":64998234},{"id":2377275,"name":"新欢乐斗地主","packageName":"com.mas.wawagame.HLlord.cooee","downloadUrl":"http://appstore.szprize.cn/appstore/appinfo/download?appId\u003d2377275","iconUrl":"http://tximg.szprize.cn/open/images/59a3b04177261.png","versionCode":3589,"versionName":"3.5.89","apkSize":21936953,"istatus":0,"downloadTimes":25137355},{"id":2381716,"name":"拳皇97OL","packageName":"com.ledo.kof97ol.az.ewan","downloadUrl":"http://appstore.szprize.cn/appstore/appinfo/download?appId\u003d2381716","iconUrl":"http://bjtximg.szprize.cn/open/images/5a0164c7887ac.png","versionCode":55,"versionName":"1.4.15","apkSize":231296158,"istatus":0,"downloadTimes":7512071},{"id":2379960,"name":"诛仙","packageName":"com.wanmei.zhuxian.ewan","downloadUrl":"http://appstore.szprize.cn/appstore/appinfo/download?appId\u003d2379960","iconUrl":"http://tximg.szprize.cn/open/images/59cca6d1c1ce7.png","versionCode":1227,"versionName":"1.227.0","apkSize":776894275,"istatus":0,"downloadTimes":44531},{"id":1146891,"name":"梦幻西游","packageName":"com.netease.my","downloadUrl":"http://appstore.szprize.cn/appstore/appinfo/download?appId\u003d1146891","iconUrl":"http://img.szprize.cn/appstore/appinfo/largeIcon/1458967363920.png","versionCode":11420,"versionName":"1.142.0","apkSize":590685268,"istatus":0,"downloadTimes":59884324}]';
    //detail的istatus = 0开始了 1:结束 -1:未开始
    //  let detailJson = '{"id":1038,"type":2,"title":"中秋之夜，花好月圆","bannerUrl":"http://360.cooseatech.cn/appstore/images/1506132086214_中秋banner2.jpg","introduction":"八月桂花香，花开月圆时，希望我总能陪在你的身边。送你一份来自月亮的祝福，请查收！","award":"1、充电宝*30个；#2、精美雨伞*15个；#3、游戏公仔*50个；#4、豪华鼠标垫*30个；#5、高瓷水杯*10个.","rules":"1、活动期间在本页面每安装并打开一个APP，增加一次抽奖机会；#2、活动结束后一般10个工作内会寄出奖品，抽中实物奖品的用户请按当前页面提示填写准确的联系方式（地址必须可顺丰邮寄），若用户信息错误或不完整，视为放弃中奖资格。#3、实物奖品以收到物品为准，图片仅作参考。非实物奖品直接发至对应账号/手机号；#4、本活动解释权归应用市场所有，凡以不正当手段进行抽奖兑换，平台有权终止该用户资格。##联系QQ：2738627803","cid":415,"startTime":"2017-10-04","endTime":"2017-10-06","updateTime":"2017-09-30","more":"","url":"http://appstore.szprize.cn/appstore/web/activitydetail?id\u003d1038\u0026sign\u003de85fda7b70619c46ac63f6b69c6b1bd3","turnplateImages":"http://360.cooseatech.cn/appstore/images/1506065060330_2fc5b4bd0f6c0248e47ed4ece7363b59.png","backgroundColor":"203471","style":1,"displayStatus":1,"istatus":1}';
    //  let recordJson = '[{"activityId":1038,"accountId":505065087,"tel":"152******54","awardId":93,"name":"豪华鼠标垫"},{"activityId":1038,"accountId":397360367,"tel":"135******48","awardId":97,"name":"游戏公仔"},{"activityId":1038,"accountId":780985749,"tel":"137******70","awardId":97,"name":"游戏公仔"},{"activityId":1038,"accountId":434233816,"tel":"152******26","awardId":93,"name":"豪华鼠标垫"},{"activityId":1038,"accountId":15688081,"tel":"150******67","awardId":97,"name":"游戏公仔"},{"activityId":1038,"accountId":19544399,"tel":"182******70","awardId":98,"name":"充电宝"},{"activityId":1038,"accountId":100088724,"tel":"177******75","awardId":97,"name":"游戏公仔"},{"activityId":1038,"accountId":146290229,"tel":"185******90","awardId":97,"name":"游戏公仔"},{"activityId":1038,"accountId":397495108,"tel":"180******80","awardId":97,"name":"游戏公仔"},{"activityId":1038,"accountId":370829233,"tel":"158******44","awardId":96,"name":"精美雨伞"}]';

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
        name: 'LotteryYuandan',
        data() {
            return {
                path:'http://360.cooseatech.cn/appstore/H5/activity',
                apps: [],
                detail: {},
                records: [], //中奖名单
                awards: [], //奖品
                userInfo: {},
                snows: [], //雪花,
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
                window.javaCallJsChangeStatus = this.javaCallJsChangeStatus.bind(this);
                window.downloadBtnClickCallBack = this.changeState.bind(this);
                window.requestServerByAsyncCallBack = (type, status, json) => {
                };
                window.loginSuccessCallBack = (res) => {
                    this.userInfo = this.userInfo = JSON.parse(JsCallApp.getUserLoginInfo());
                };
                window.javaCallJsExitOutSwitch = () => {
//       重要: 必须清除 雪花定时器 不然webview会崩溃
                    window.cancelAnimationFrame(this.updateSnowTimer);
                    window.clearInterval(this.addSnowTimer);
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
                    }, 25000);
                    //上次未领的奖品
                    /*this.userInput = this.getCacheUserInput() || this.userInput;
                    if (this.userInput && (this.userInput.showDialogType === 'form-big' || this.userInput.showDialogType === 'form-sm') && !this.userInput.hasSubmit && !this.userInput.hasAbandon) {
                      this.showDialog = true;
                    }*/
                }
                //雪花效果
                window.addEventListener('load', () => {
                    let canvas = document.getElementById('canvas');
                    let scrollContent = document.getElementById('lottery-content');
                    let offsetWidth = scrollContent.offsetWidth;
                    let offsetHeight = scrollContent.offsetHeight;
                    canvas.width = offsetWidth;
                    canvas.height = offsetHeight;

                    this.addSnowTimer = window.setInterval(() => {
                        this.addSnowParticle(offsetWidth)
                    }, 4000);

                    function runSnow() {
                        this.updateCanvas(canvas);
                        this.updateSnowTimer = window.requestAnimationFrame(runSnow.bind(this));
                    }

                    window.requestAnimationFrame(runSnow.bind(this));
                    /*this.updateSnowTimer = window.setInterval(() => {
                        this.updateCanvas(canvas);
                    }, 33);*/
                });

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
                    if (window.jsObj) {
                        //添加额外的属性目前没用到
                        let apps = JSON.parse(JsCallApp.initStatusApps(JSON.stringify(res.data.apps)));
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
                    } else { //--打开
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
                //JsCallApp.handleAppAction(JSON.stringify(app), 'detail');
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
                this.$refs.viewBox.scrollTo(230);
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
            //app轮询调用 下载进度（0-100）
            javaCallJsChangeStatus(packName, status, progress) {
                this.changeState();
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
            addSnowParticle(canvasWidth) {
                let num = random(3, 5);
                let url;
                let x, y;
                let canStop; //是否中途可停
                for (let i = 0; i < num; i++) {
                    let img = new Image();
                    img.src = snowLittle;
                    x = canvasWidth * random(0.01, .99);
                    y = random(-5.0, -120.0);
                    canStop = !!random(1);
                    this.snows.unshift({
                        img: img,
                        x: x,
                        y: y,
                        size: 15 * random(.5, 1.3),
                        xOffset: random(-.1, .4),
                        yOffset: random(.8, 1.4),
                        canStop: canStop
                    });
                }
                if (this.snows.length > 120) {
                    this.snows.length = 100;
                }
            },
            updateCanvas(canvas) {
                this.snows = this.snows.map((v, i) => {
                    if (v.canStop && (v.x > 90 * canvas.width / 360) && (v.x < 290 * canvas.width / 360) && (v.y > 290 * canvas.width / 360)) {
                        return v;
                    }
                    if (v.y > canvas.height + 15) {
                        return {};
                    } else {
                        return {
                            ...v,
                            x: v.x + v.xOffset,
                            y: v.y + v.yOffset
                        }
                    }
                });
                this.snows = this.snows.filter(v => {
                    return !!v.img;
                });
                let ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                this.snows.forEach(v => {
                    if (v.img) {
                        ctx.drawImage(v.img, v.x, v.y, v.size, v.size);
                    }
                });
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
            Alert,
            XImg,
        },
        directives: {
            TransferDom
        }
    }
</script>

<style lang="less" scoped>
    @primary: #d0121e;
    @secondary: #5e3a07;
    @success: #05a0ac;

    @btn-color: #ffca29;
    @bg: #f2d1ae;

    //主体
    .lottery {
        .bg-img {
            display: block;
            margin: 0 auto;
            width: 100%;
            height: auto;
        }
        .icon-laba {
            display: inline-block;
            width: (28/@rem)*1rem;
            height: (29/@rem)*1rem;
            background: url("../../static/images/lottery/snow/laba.webp") no-repeat center;
            background-size: (21/@rem)*1rem;
            vertical-align: top;
        }
        .text-secondary {
            color: @secondary;
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
            background: @bg;
        }
        .text-shadow {
            text-shadow: 0 1px 1px #d4d4d4;
        }
        .gamer-list {
            position: absolute;
            top: (484/@rem)*1rem;
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
            top: (600/@rem)*1rem;
            width: (296/@rem)*1rem;
            height: (56/@rem)*1rem;
            left: 0;
            right: 0;
            margin: auto;
            background: transparent;
            border: none;
            color: @primary;
            font-size: (26/@rem)*1rem;;
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
            top: 10.46rem;
            left: 0;
        }
        .list-item {
            position: absolute;
            top: 0;
            width: (178/@rem)*1rem;
            /*row1*/
            &:nth-child(1) {
                top: (59/@rem)*1rem;
                left: ((64-10)/@rem)*1rem;
            }
            &:nth-child(2) {
                top: 0;
                left: ((290-10)/@rem)*1rem;
                .item-bg {
                    background-size: 93%;
                }
            }
            &:nth-child(3) {
                top: (126/@rem)*1rem;
                left: ((498-10)/@rem)*1rem;
                .item-bg {
                    background-size: 92%;
                }
            }
            /*row2*/
            &:nth-child(4) {
                top: (445/@rem)*1rem;
                left: ((75-10)/@rem)*1rem;
                .item-bg {
                    background-size: 88%;
                }
            }
            &:nth-child(5) {
                top: (396/@rem)*1rem;
                left: ((301-10)/@rem)*1rem;
                .item-bg {
                    background-size: 105%;
                }
            }
            &:nth-child(6) {
                top: (513/@rem)*1rem;
                left: ((530-10)/@rem)*1rem;
                .item-bg {
                    background-size: 88%;
                }
            }
            /*row3*/
            &:nth-child(7) {
                top: (774/@rem)*1rem;
                left: ((132-10)/@rem)*1rem;
                .item-bg {
                    background-size: 102%;
                }
            }
            &:nth-child(8) {
                top: (831/@rem)*1rem;
                left: ((409-10)/@rem)*1rem;
                .item-bg {
                    background-size: 102%;
                }
            }
            /*row4*/
            &:nth-child(9) {
                top: (1216/@rem)*1rem;
                left: ((50-10)/@rem)*1rem;
            }
            &:nth-child(10) {
                top: (1141/@rem)*1rem;
                left: ((294-10)/@rem)*1rem;
                .item-bg {
                    background-size: 88%;
                }
            }
            &:nth-child(11) {
                top: (1333/@rem)*1rem;
                left: ((522-10)/@rem)*1rem;
                .item-bg {
                    background-size: 87%;
                }
            }
            /*row5*/
            &:nth-child(12) {
                top: (1526/@rem)*1rem;
                left: ((215-10)/@rem)*1rem;
                .item-bg {
                    background-size: 100%;
                }
            }
            &:nth-child(13) {
                top: (1626/@rem)*1rem;
                left: ((20-10)/@rem)*1rem;
                .item-bg {
                    background-size: 88%;
                }
            }
            &:nth-child(14) {
                top: (1646/@rem)*1rem;
                left: ((420-10)/@rem)*1rem;
                .item-bg {
                    background-size: 110%;
                }
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
                z-index: 1;
                background-repeat: no-repeat;
                background-position: center center;
                background-size: 90%;
            }
            .item-logo {
                display: block;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                z-index: 12;
                width: (80/@rem)*1rem;
                height: (80/@rem)*1rem;
                border-radius: (14/@rem)*1rem;
            }
        }
        .item-title {
            font-weight: normal;
            font-size: (24/@rem)*1rem;
            color: @primary;
            line-height: 2;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }

        //雪花
        .canvas {
            display: block;
            position: absolute;
            left: 0;
            top: 0;
            z-index: 3;
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

    }

    /* --- lottery  end--*/

    //活动规则链接
    .rule-link {
        position: absolute;
        z-index: 11;
        bottom: 2.57rem;
        left: 0;
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
</style>
