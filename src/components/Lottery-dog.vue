<template>
  <!--dog 风格备份-->
  <view-box ref="viewBox" class="lottery">
    <div class="content">
      <img src="../assets/lottery/dog/bg.png" class="bg-img">
      <marquee class="gamer-list text-shadow" v-if="records.length > 0">
        <marquee-item v-for="(item, index) in records" :key="index">
          <span class="text-secondary">中奖播报</span><i class="icon-laba"></i>恭喜 {{item.tel}}<span
          class="text-secondary"> 获得 </span>{{item.name}}
        </marquee-item>
      </marquee>
      <button @click="handleDownloadAll" class="weui-btn btn-download-all">一键下载</button>
      <div class="lottery-rule text-shadow">每安装并打开一个APP, 即可抽取礼品!</div>
      <div class="app-list" v-if="apps.length > 0">
        <div class="list-item" v-for="item in apps" :key="item.id">
          <div class="img-c animated" :class="{rubberBand: item.imgAnimated}"
               @click.stop="handleImgClick(item, $event)">
            <div class="item-bg">
              <img src="../assets/lottery/dog/item-bg-eye.png" class="item-bg-eye animated"
                   :class="{'eyes-blink': item.blink}">
            </div>
            <img :src="item.iconUrl" class="item-logo">
          </div>
          <h1 class="item-title">{{item.name}}</h1>
          <btn-download v-if="item.btnState" @click.native.prevent="handleBtnClick(item)" :url="item.downloadUrl"
                        :mini="true"
                        :btnText="item.btnState.btnText"
                        :start-load="item.btnState.startLoad" :percentage="item.btnState.percentage"
                        class="item-btn"></btn-download>
        </div>
      </div>
    </div>
    <!--中奖结果对话框-->
    <div v-transfer-dom>
      <x-dialog v-model="showDialog" class="dialog">
        <div class="img-award" v-if="award.imageUrl">
          <!--<img :src="award.imageUrl" style="max-width:100%">-->
          <img src="https://ss0.bdstatic.com/-0U0bnSm1A5BphGlnYG/tam-ogel/2b267cece246f9a1f695eb236d4153c2_259_194.jpg" style="max-width:100%">
        </div>
        <div v-else>{{award.name}}</div>
        <div @click="showDialog = false">
          <span class="vux-close"></span>
        </div>
      </x-dialog>
    </div>
  </view-box>
</template>

<script>
  import {ViewBox, Marquee, MarqueeItem , XDialog, XButton, TransferDomDirective as TransferDom} from 'vux';
  import random from 'lodash/random';
  import BtnDownload from './btn-download.vue';
  import JsCallApp, {appState} from '../util/JsCallApp'; //客户端api
  let appsJson = '[{"id":1146862,"name":"波克捕鱼","packageName":"com.pokercity.bydrqp","downloadUrl":"http://appstore.szprize.cn/appstore/appinfo/download?appId\u003d1146862","iconUrl":"http://cdnimages-10068954.file.myqcloud.com/open/images/596c8b86909c5.png","versionCode":421,"versionName":"4.21","apkSize":33821259,"istatus":0,"downloadTimes":61337630},{"id":2381056,"name":"传奇战域","packageName":"com.cqzy.ewan","downloadUrl":"http://appstore.szprize.cn/appstore/appinfo/download?appId\u003d2381056","iconUrl":"http://tximg.szprize.cn/open/images/59b89e917c684.png","versionCode":51,"versionName":"6.1","apkSize":257192987,"istatus":0,"downloadTimes":35345612},{"id":2380898,"name":"COC部落冲突","packageName":"com.supercell.clashofclans.ewan","downloadUrl":"http://appstore.szprize.cn/appstore/appinfo/download?appId\u003d2380898","iconUrl":"http://tximg.szprize.cn/open/images/59cca1abad42d.png","versionCode":919,"versionName":"9.256.17","apkSize":106057899,"istatus":0,"downloadTimes":79876543},{"id":1146940,"name":"大话西游","packageName":"com.netease.dhxy","downloadUrl":"http://appstore.szprize.cn/appstore/appinfo/download?appId\u003d1146940","iconUrl":"http://tximg.szprize.cn/open/images/59aceaba93ce8.png","versionCode":23361,"versionName":"1.1.102","apkSize":727469220,"istatus":0,"downloadTimes":54173540},{"id":2380885,"name":"皇室战争","packageName":"com.supercell.clashroyale.ewan","downloadUrl":"http://appstore.szprize.cn/appstore/appinfo/download?appId\u003d2380885","iconUrl":"http://tximg.szprize.cn/open/images/59ccabe6dcf1f.png","versionCode":212,"versionName":"2.0.5","apkSize":110854427,"istatus":0,"downloadTimes":64998234},{"id":2377275,"name":"新欢乐斗地主","packageName":"com.mas.wawagame.HLlord.cooee","downloadUrl":"http://appstore.szprize.cn/appstore/appinfo/download?appId\u003d2377275","iconUrl":"http://tximg.szprize.cn/open/images/59a3b04177261.png","versionCode":3589,"versionName":"3.5.89","apkSize":21936953,"istatus":0,"downloadTimes":25137355},{"id":2381716,"name":"拳皇97OL","packageName":"com.ledo.kof97ol.az.ewan","downloadUrl":"http://appstore.szprize.cn/appstore/appinfo/download?appId\u003d2381716","iconUrl":"http://bjtximg.szprize.cn/open/images/5a0164c7887ac.png","versionCode":55,"versionName":"1.4.15","apkSize":231296158,"istatus":0,"downloadTimes":7512071},{"id":2379960,"name":"诛仙","packageName":"com.wanmei.zhuxian.ewan","downloadUrl":"http://appstore.szprize.cn/appstore/appinfo/download?appId\u003d2379960","iconUrl":"http://tximg.szprize.cn/open/images/59cca6d1c1ce7.png","versionCode":1227,"versionName":"1.227.0","apkSize":776894275,"istatus":0,"downloadTimes":44531},{"id":1146891,"name":"梦幻西游","packageName":"com.netease.my","downloadUrl":"http://appstore.szprize.cn/appstore/appinfo/download?appId\u003d1146891","iconUrl":"http://img.szprize.cn/appstore/appinfo/largeIcon/1458967363920.png","versionCode":11420,"versionName":"1.142.0","apkSize":590685268,"istatus":0,"downloadTimes":59884324}]';
  //detail的istatus = 0开始了 1:结束 -1:未开始
  let detailJson = '{"id":1038,"type":2,"title":"中秋之夜，花好月圆","bannerUrl":"http://360.cooseatech.cn/appstore/images/1506132086214_中秋banner2.jpg","introduction":"八月桂花香，花开月圆时，希望我总能陪在你的身边。送你一份来自月亮的祝福，请查收！","award":"1、充电宝*30个；#2、精美雨伞*15个；#3、游戏公仔*50个；#4、豪华鼠标垫*30个；#5、高瓷水杯*10个.","rules":"1、活动期间在本页面每安装并打开一个APP，增加一次抽奖机会；#2、活动结束后一般10个工作内会寄出奖品，抽中实物奖品的用户请按当前页面提示填写准确的联系方式（地址必须可顺丰邮寄），若用户信息错误或不完整，视为放弃中奖资格。#3、实物奖品以收到物品为准，图片仅作参考。非实物奖品直接发至对应账号/手机号；#4、本活动解释权归应用市场所有，凡以不正当手段进行抽奖兑换，平台有权终止该用户资格。##联系QQ：2738627803","cid":415,"startTime":"2017-10-04","endTime":"2017-10-06","updateTime":"2017-09-30","more":"","url":"http://appstore.szprize.cn/appstore/web/activitydetail?id\u003d1038\u0026sign\u003de85fda7b70619c46ac63f6b69c6b1bd3","turnplateImages":"http://360.cooseatech.cn/appstore/images/1506065060330_2fc5b4bd0f6c0248e47ed4ece7363b59.png","backgroundColor":"203471","style":1,"displayStatus":1,"istatus":1}';
  let recordJson = '[{"activityId":1038,"accountId":505065087,"tel":"152******54","awardId":93,"name":"豪华鼠标垫"},{"activityId":1038,"accountId":397360367,"tel":"135******48","awardId":97,"name":"游戏公仔"},{"activityId":1038,"accountId":780985749,"tel":"137******70","awardId":97,"name":"游戏公仔"},{"activityId":1038,"accountId":434233816,"tel":"152******26","awardId":93,"name":"豪华鼠标垫"},{"activityId":1038,"accountId":15688081,"tel":"150******67","awardId":97,"name":"游戏公仔"},{"activityId":1038,"accountId":19544399,"tel":"182******70","awardId":98,"name":"充电宝"},{"activityId":1038,"accountId":100088724,"tel":"177******75","awardId":97,"name":"游戏公仔"},{"activityId":1038,"accountId":146290229,"tel":"185******90","awardId":97,"name":"游戏公仔"},{"activityId":1038,"accountId":397495108,"tel":"180******80","awardId":97,"name":"游戏公仔"},{"activityId":1038,"accountId":370829233,"tel":"158******44","awardId":96,"name":"精美雨伞"}]';
  const url = /szprize\.cn/i.test(location) ? 'http://appstore.szprize.cn/appstore/web/api/detail?id=' : 'http://192.168.1.148:8090/appstore/web/api/detail?id=';

  // for debugger
  function alertObj(obj) {
    alert(JSON.stringify(obj, null, 4))
  }

  function alertObjKeys(obj) {
    alert(Object.keys(obj).join('\n'))
  }

  /*window.onerror = function(...arg) {
    alertObj(arg)
  };*/

  export default {
    name: 'Lottery',
    data() {
      return {
        apps: [],
        detail: {},
        records: [], //中奖名单
        awards: [], //奖品
        userInfo: {},
        showDialog:  true,
        award:{} //最新的中奖结果
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
      this.fetchData().then(() => {
        document.title = this.detail.title || '无标题活动';
        //曝光全局方法 给客户端调用
        window.javaCallJsChangeStatus = this.javaCallJsChangeStatus.bind(this);
        window.downloadBtnClickCallBack = this.changeState.bind(this);
        window.requestServerByAsyncCallBack = (type, status, json) => {
        };
        window.javaCallJsExitOutSwitch = () => {
          this.setCacheAppsAction(this.apps);
          if (window.isEditing) {
            JsCallApp.transferParam('stopExitOut');
          } else {
            JsCallApp.transferParam('exitOut');
          }
        };
        //随机眨眼
        setInterval(() => {
          let randomIndex = random(0, this.apps.length);
          this.apps = this.apps.map((value, index) => {
              if (index === randomIndex) {
                return {
                  ...value,
                  blink: !value.blink //加眨眼class
                }
              } else {
                return value
              }
            }
          )
        }, 300);
        //init app state
        window.jsObj && this.changeState();
      });
    },
    methods: {
      fetchData() {
        this.$vux.loading.show();
        return this.$http.get(url.concat(this.id)).then((res) => {
          this.$vux.loading.hide();
          let resData = res.data;
          if (String(resData.code) === '-1') {
            return;
          }
          this.records = resData.data.records;
          this.awards = resData.data.awards;
          this.detail = resData.data.detail;
          if (window.jsObj) {
            //添加额外的属性目前没用到
            let apps = JSON.parse(JsCallApp.initStatusApps(JSON.stringify(resData.data.apps)));
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
            this.apps = apps.map(v => {      //add react prop
                return {
                  ...v,
                  btnState: {
                    percentage: 0,
                    pause: false,
                    btnText: '安装'
                  },
                  blink: false, //加眨眼动画class
                  imgAnimated: false //抽奖跳动动画
                }
              }
            );
          } else {
            this.apps = resData.data.apps;
          }
        },() => {
          document.title = '网络出错了, 可尝试重进';
        })
      },
      handleImgClick(app) {
        this.jumpToDetail(app);
      },
      //下载 , 领取, 打开逻辑
      handleBtnClick(app) {
        if (app.action === 'get') { //获取抽奖机会
          this.userInfo = JSON.parse(JsCallApp.getUserLoginInfo());
          if (!this.userInfo || !this.userInfo.userId) {
            JsCallApp.jumpToLogin();
            return;
          }
          JsCallApp.alertAToast('领取中...');
          JsCallApp.handleAppAction(JSON.stringify(app), 'open');  //需要先打开一次才可以抽奖
          setTimeout(() => { //必须异步
            let resp = JSON.parse(JsCallApp.requestServer('/web/download', 'accountId=' + this.userInfo.userId + '&activityId=' + this.detail.id + '&tel=' + this.userInfo.phone + '&appId=' + app.id + '&packageName=' + app.packageName));
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
                        btnText: '已抽奖'
                      }
                    }
                  } else {
                    return v;
                  }
                });
                this.setCacheAppsAction(this.apps);
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
              }
            } else {
              JsCallApp.alertAToast(resp.msg);
            }
          }, 6000);
          this.changeState(); //刷新所有应用 按钮状态
        } else if (app.action === 'draw') { //抽奖
          this.userInfo = JSON.parse(JsCallApp.getUserLoginInfo());
          if (!this.userInfo || !this.userInfo.userId) {
            JsCallApp.jumpToLogin();
            return;
          }
          this.callServerGetAwardResp(app);
        } else {
          JsCallApp.handleAppAction(JSON.stringify(app), app.action);
          this.changeState(); //刷新所有应用 按钮状态
        }
      },
      handleDownloadAll() {
        this.apps.forEach((v) => {
          let appStatus = JsCallApp.getAppStatus(v.packageName, v.id, v.versionCode);
          if (appStatus == appState.FINAL_DOWNLOAD || appStatus == appState.FINAL_PAUSE) {
            JsCallApp.handleAppAction(JSON.stringify(v), 'download');
          }
        });
      },
      //抽奖
      callServerGetAwardResp(app) {
        let resp = JSON.parse(JsCallApp.requestServer('/web/draw', 'accountId=' + this.userInfo.userId + '&tel=' + this.userInfo.phone + '&activityId=' + this.detail.id, 'draw'));
        if(resp && resp.msg === 'ok') {
          this.award = resp.data.award;
          let item = resp.data.order.award.sn;
          let txt = resp.data.order.name;
          let type = resp.data.order.type;
          if (type == 1 || type == 4) {
            this.$vux.confirm.show({
                title: '抽奖结果',
                content: '恭喜您获得“' + txt + '”'
              }
            )
          } else if (type == 2) {
            this.$vux.confirm.show({
                title: '抽奖结果',
                content: '恭喜您获得“' + txt + '”，请填写奖品联系方式'
              }
            );
          } else if (type == 3) {
            this.$vux.confirm.show({
                title: '抽奖结果',
                content: '恭喜您获得“' + txt + '”，奖品将以兑换码形式发送至您的【个人中心】界面左上角【小纸条】中'
              }
            );
          } else {
            this.$vux.confirm.show({
                title: '抽奖结果',
                content: '谢谢参与，别灰心，后面还有更多机会噢！'
              }
            );
          }
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
        }
      },
      /*跳转详情*/
      jumpToDetail(app) {
        JsCallApp.handleAppAction(JSON.stringify(app), 'detail');
      },
      //缓存 所有apps 状态
      /*
      gg(status, isStatus, progress) {
        let btnNewState = {};
        switch (String(status)) {
          case '0': //队列中等待下载
            btnNewState = {
              percentage: 0,
              pause: false,
              btnText: '等待...',
              status: status
            };
            break;
          case '1': //下载完成
            btnNewState = {
              percentage: 0,
              pause: false,
              btnText: '领取',
              status: status
            };
            break;
          case '4': //暂停
            btnNewState = {
              percentage: progress,
              pause: true,
              btnText: '继续',
              status: status
            };
            break;
          case '5': //正在下载
            btnNewState = {
              percentage: progress,
              pause: false,
              btnText: progress + '%',
              status: status
            };
            break;
          case '6': //安装成功
            if (String(isStatus) === '0') {
              btnNewState = {
                percentage: progress,
                pause: false,
                btnText: '抽奖',
                status: status
              };
            } else {
              btnNewState = {
                percentage: progress,
                pause: false,
                btnText: '已抽奖',
                status: status
              };
            }
            break;
          default:
            btnNewState = {
              percentage: 0,
              pause: false,
              btnText: '安装',
              status: ''
            };
        }
        return btnNewState;
      },*/
      /*
      * just like reactJs's reducer function
      * app.istatus === 0; //安装了, 未领取
      * app.istatus === -1; //已经领取
      * */
      getNewState(state, payload) {
        if (payload.appStatus == appState.FINAL_OPEN) {  // --app已安装--
          if (state.istatus === 0) {  // 安装后未打开过
            return {
              ...state,
              action: 'get',
              btnState: {
                ...state.btnState,
                percentage: 100,
                btnText: '领取'
              }
            }
          } else if (state.istatus === -1) { //已经安装并且领取过
            return {
              ...state,
              action: 'open',
              btnState: {
                ...state.btnState,
                percentage: 100,
                btnText: '已抽奖'
              }
            }
          } else if (state.action === 'draw' && state.istatus === 1) { //已安装
            return {
              ...state,
              btnState: {
                action: 'draw',
                ...state.btnState,
                percentage: 100,
                btnText: '抽奖'
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
              btnText: JsCallApp.isSystemAppstore() ? '安装?' : '下载'
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
        if(apps.length > 0) {
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
      XButton
    },
    directives: {
      TransferDom
    }
  }
</script>
<style lang="less">
  @import '~vux/src/styles/close';
  @primary: #e1c062;
  @btn-color: #d49b20;
  /*rem 适配wexin ui css fix*/
  .vux-loading {
    font-size: 16px;
  }

  .lottery {
    .bg-img {
      display: block;
      margin: 0 auto;
      width: 100%;
      height: auto;
    }
    .icon-laba {
      display: inline-block;
      width: (30/@rem)*1rem;
      height: (30/@rem)*1rem;
      background: url("../assets/lottery/dog/laba.png") no-repeat;
      background-size: (30/@rem)*1rem  (30/@rem)*1rem;
      vertical-align: middle;
    }
    .text-secondary {
      color: #fff;
    }

    //内容
    .content {
      position: absolute;
      z-index: 1;
      top: 0;
      color: @primary;
      font-size: (24/@rem)*1rem;
      text-align: center;
      overflow: hidden;
      width: 100%;
      background: #000;
    }
    .text-shadow {
      text-shadow: 0 1px 1px @primary;
    }
    .gamer-list {
      position: absolute;
      width: 100%;
      top: (510/@rem)*1rem;
      font-size: (22/@rem)*1rem;
    }
    .btn-download-all {
      position: absolute;
      top: (607/@rem)*1rem;
      width: (296/@rem)*1rem;
      height: (56/@rem)*1rem;
      left: 0;
      right: 0;
      margin: auto;
      opacity: 0;
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
      z-index: 2;
      top: (780/@rem)*1rem;
      left: 0;
    }

    .list-item {
      position: absolute;
      top: 0;
      width: (138/@rem)*1rem;
      /*row1*/
      &:nth-child(1) {
        top: (59/@rem)*1rem;
        left: (64/@rem)*1rem;
      }
      &:nth-child(2) {
        top: 0;
        left: (290/@rem)*1rem;
      }
      &:nth-child(3) {
        top: (126/@rem)*1rem;
        left: (498/@rem)*1rem;
      }
      /*row2*/
      &:nth-child(4) {
        top: (445/@rem)*1rem;
        left: (75/@rem)*1rem;
      }
      &:nth-child(5) {
        top: (396/@rem)*1rem;
        left: (301/@rem)*1rem;
      }
      &:nth-child(6) {
        top: (513/@rem)*1rem;
        left: (530/@rem)*1rem;
      }
      /*row3*/
      &:nth-child(7) {
        top: (774/@rem)*1rem;
        left: (132/@rem)*1rem;
      }
      &:nth-child(8) {
        top: (831/@rem)*1rem;
        left: (409/@rem)*1rem;
      }
      /*row4*/
      &:nth-child(9) {
        top: (1216/@rem)*1rem;
        left: (50/@rem)*1rem;
      }
      &:nth-child(10) {
        top: (1141/@rem)*1rem;
        left: (294/@rem)*1rem;
      }
      &:nth-child(11) {
        top: (1333/@rem)*1rem;
        left: (522/@rem)*1rem;
      }
      /*row5*/
      &:nth-child(12) {
        top: (1526/@rem)*1rem;
        left: (215/@rem)*1rem;
      }
      &:nth-child(13) {
        top: (1626/@rem)*1rem;
        left: (20/@rem)*1rem;
      }
      &:nth-child(14) {
        top: (1646/@rem)*1rem;
        left: (420/@rem)*1rem;
      }
    }
    .img-c {
      position: relative;
      width: 100%;
      height: (190/@rem)*1rem;
      .item-bg {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 3;
        width: 100%;
        height: (162/@rem)*1rem;
        background: url("../assets/lottery/dog/item-bg.png") no-repeat center center;
        background-size: 100%;
      }
      .item-bg-eye {
        position: absolute;
        z-index: 4;
        top: (32/@rem)*1rem;;
        left: 1px;
        right: 0;
        margin: auto;
        width: (62/@rem)*1rem;
        height: (18/@rem)*1rem;
      }

      .item-logo {
        position: absolute;
        left: (6/@rem)*1rem;
        right: 0;
        margin: auto;
        top: (112/@rem)*1rem;
        z-index: 1;
        display: block;
        width: (77/@rem)*1rem;
        height: (77/@rem)*1rem;
        border-radius: (14/@rem)*1rem;
      }
    }
    .item-title {
      font-weight: normal;
      font-size: (24/@rem)*1rem;
      color: #fff;
      line-height: 2;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    .item-btn {
      width: (112/@rem)*1rem;
      height: (50/@rem)*1rem;
      line-height: 1.1;
      font-size: (24/@rem)*1rem;
      background: @btn-color;
      white-space: nowrap;
      &.weui-btn_plain-primary {
        background: transparent;
        border-color: @btn-color;
      }
      .process-bg {
        background: @btn-color;
      }
      .process-text {
        color: #fff;
      }
    }

    //--animation--
    .animated {
      animation-duration: 400ms;
      animation-fill-mode: both;
      /*animation-iteration-count: infinite*/
      &.rubberBand {
        animation-duration: 1s;
      }
    }
    @keyframes eyes-blink {
      0% {
        animation-timing-function: cubic-bezier(0.42, -0.01, 1, 1);
        transform: scaleY(1);
      }
      50% {
        animation-timing-function: cubic-bezier(0.42, -0.01, 1, 1);
        transform: scaleY(.1);
      }
      100% {
        animation-timing-function: cubic-bezier(0.42, -0.01, 1, 1);
        transform: scaleY(1);
      }
    }
    .eyes-blink {
      animation-name: eyes-blink;
      transform-origin: center center
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
</style>
