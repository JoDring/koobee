<template>
    <!--底部app广告下载-->
    <btn-download class="orange"
                  style="width: 75px; height: 30px;border-radius: 15px; font-size: 15px;"
                  @click="handleClick"
                  :url="app.downloadUrl"
                  :mini="true"
                  :btn-text="btnState.btnText"
                  :percentage="btnState.percentage">
    </btn-download>
</template>

<script>
    import BtnDownload from './btn-download'
    import JsCallApp, {appState} from '../util/JsCallApp'; //客户端api
    export default {
        name: 'btn',
        data() {
            return {
                btnState: {
                    percentage: 0,
                    pause: false,
                    btnText: '安装'
                },
                client: window.jsObj ? JsCallApp.getApplicationName() : 'webBrowser'  //客户端名称
            }
        },
        props: {
            app: {
                type: Object,
                required: true
            }
        },
        mounted() {
            /*window.javaCallJsChangeStatus = this.changeState.bind(this);
            window.downloadBtnClickCallBack = this.changeState.bind(this);*/
            window.requestServerByAsyncCallBack = (type, status, json) => {};
            window.jsObj && this.changeState();
        },
        watch: {
            'app': function () {
                window.jsObj && this.changeState();
            }
        },
        methods: {
            //类似react的reducer函数处理action对象
            getNewState(state, payload) {
                if (payload.appStatus == appState.FINAL_OPEN) {  // --app已安装--
                    return Object.assign({}, state, {
                        percentage: 100,
                        btnText: '打开',
                        action: 'open'
                    })
                } else if (payload.appStatus == appState.FINAL_UPDATE) { //更新
                    return Object.assign({}, state, {
                        btnText: '更新',
                        action: 'update'
                    })
                } else if (payload.appStatus == appState.FINAL_DOWNLOAD) { //下载
                    window.MtaH5 && window.MtaH5.clickStat('game_download_from_info', {
                        'id': this.app.id,
                        'name': this.app.name,
                        'packagename': this.app.packageName,
                        'client' : this.client
                    });
                    return Object.assign({}, state, {
                        percentage: 0,
                        btnText: JsCallApp.isSystemAppstore() ? '安装' : '下载',
                        action: 'download'
                    })
                } else if (payload.appStatus == appState.FINAL_PAUSE) { //暂停
                    return Object.assign({}, state, {
                        percentage: payload.progress,
                        pause: true,
                        btnText: '继续',
                        action: 'continue'
                    })
                } else if (payload.appStatus == appState.FINAL_INSTALL) { //安装
                    return Object.assign({}, state, {
                        percentage: 100,
                        btnText: '安装',
                        action: 'install'
                    })
                } else if (payload.appStatus == appState.FINAL_INSTALL_ING) {
                    return Object.assign({}, state, {
                        percentage: 100,
                        btnText: '安装中',
                        action: 'install'
                    })
                } else if (payload.appStatus == appState.FINAL_DOWNLOAD_ING) {
                    return Object.assign({}, state, {
                        percentage: payload.progress,
                        btnText: payload.progress + '%',
                        action: 'pause'
                    })
                } else if (payload.appStatus == appState.FINAL_WAITING) {
                    return Object.assign({}, state, {
                        btnText: '等待',
                        action: 'pause'
                    })
                } else {
                    return state;
                }
            },
            changeState() {
                const appStatus = JsCallApp.getAppStatus(this.app.packageName, this.app.id, this.app.versionCode);
                const progress = JsCallApp.getAppProcess(this.app.packageName) || 0;
                this.btnState = this.getNewState(this.btnState, {
                    appStatus: appStatus,
                    progress: Number(progress).toFixed(1)
                });
            },
            handleClick() {
                if(window.jsObj) {
                    JsCallApp.handleAppAction(JSON.stringify(this.app), this.btnState.action);
                }
            }
        },
        components: {
            BtnDownload
        }
    }
</script>
