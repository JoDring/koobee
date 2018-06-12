<template>
    <a @click="handleClick($event, url)" download="app.apk" :href="url"
       class="weui-btn"
       :class="[String(percentage) == '0.0' || (percentage > 0 && percentage < 100) ? 'weui-btn_plain-primary' : 'weui-btn_primary',
              mini ? 'weui-btn_small' : '', $route.query.from==='gamecenter' ? 'orange': '']">
        <div class="process-bg" :style="{width: percentage + '%'}">
            <div class="process-bg-img"></div>
        </div>
        <div class="process-text">{{btnText ? btnText : text}}</div>
    </a>
</template>

<script>
    export default {
        props: {
            url: {
                required: true
            },
            urlSchema: String,
            percentage: {
                type: [Number, String],
                default: 0
            },
            mini: {
                type: Boolean,
                default: false
            },
            btnText: {
                type: String,
                default: ''
            },
            pause: {
                type: Boolean,
                default: false
            },
            app: {
                type: Object,
                default: () => {
                    return {}
                }
            }
        },
        methods: {
            handleClick(e, url) {
                e.preventDefault()
                //不是自家客户端webview
                if(!window.jsObj) {
                    if(this.urlSchema) {
                        const iframe = document.createElement('iframe')
                        iframe.src = this.urlSchema
                        iframe.style.display = 'none'
                        document.body.appendChild(iframe)
                        setTimeout(function () {
                            document.body.removeChild(iframe)
                        }, 1000)
                        return
                    }
                    if(window.navigator.onLine) {
                        //is weixin?
                        let isWeixin = navigator.userAgent.match(/MicroMessenger/i);
                        if (isWeixin) {
                            this.$vux.toast.show({
                                text: '<div class="padding: 8px 14px">请点击右上角<br>选"在浏览器打开"</div>',
                                width: '9em',
                                type: 'text',
                                position: 'top'
                            })
                            return
                        }
                        window.MtaH5 && window.MtaH5.clickStat('appstore_h5_download_click', {
                            'id': this.app.id,
                            'name': this.app.name,
                            'packagename': this.app.packageName,
                            'client' : window.jsObj ? JsCallApp.getApplicationName() : 'webBrowser'
                        });
                        //友盟统计
                        _czc.push(['_trackEvent', '下载app', this.app.name])
                        //window.open(url);
                        location.href = url
                    } else {
                        alert('网络异常')
                    }
                } else {
                    this.$emit('click')
                }
            }
        },
        computed: {
            text() {
                if (this.percentage === 0) {
                    return this.mini ? '安装' : '安全下载';
                } else if (this.percentage > 0 && this.percentage < 100) {
                    if (this.mini) {
                        return this.pause ? `继续` : `${this.percentage}%`;
                    }
                    return this.pause ? `继续...${this.percentage}%` : `下载中...${this.percentage}%`;
                } else if (this.percentage >= 100) {
                    return this.mini ? '打开' : '立即打开';
                }
            }
        }
    }
</script>
<style lang="less">
    @import "~vux/src/styles/weui/base/fn.less";

    @weuiBtnFontSize: 15px;
    @weuiBtnHeight: 35px;
    @weuiBtnBorderRadius: @weuiBtnHeight;

    @weuiBtnPrimaryBg: @theme-color;
    @weuiBtnFontColor: #fff;

    @weuiBtnActiveFontColor: #fff;
    @weuiBtnPrimaryActiveBg: lighten(@theme-color, 5%);

    @weuiBtnPlainPrimaryColor: #222;
    @weuiBtnPlainPrimaryBorderColor: @weuiBtnPrimaryBg;
    @weuiBtnPlainPrimaryActiveColor: @weuiBtnPrimaryActiveBg;
    @weuiBtnPlainPrimaryActiveBorderColor: @weuiBtnPrimaryBg;

    button, input {
        &.weui-btn {
            width: 100%;
            border-width: 0;
            outline: 0;
            -webkit-appearance: none;
            &:focus {
                outline: 0;
            }
        }
        &.weui-btn_inline, &.weui-btn_mini {
            width: auto;
        }
        &.weui-btn_plain-primary, &.weui-btn_plain-default {
            border-width: 1px;
            background-color: transparent;
        }
    }

    .weui-btn {
        position: relative;
        display: block;
        margin-left: auto;
        margin-right: auto;
        box-sizing: border-box;
        font-size: @weuiBtnFontSize;
        text-align: center;
        text-decoration: none;
        color: @weuiBtnFontColor;
        height: @weuiBtnHeight;
        border-radius: @weuiBtnBorderRadius;
        .setTapColor();
        overflow: hidden;
        flex-shrink: 0;
        &:after {
            content: " ";
            width: 200%;
            height: 200%;
            position: absolute;
            top: 0;
            left: 0;
            /*border: 1px solid rgba(0, 0, 0, .2);*/
            border: 1px solid transparent;
            transform: scale(.5);
            transform-origin: 0 0;
            box-sizing: border-box;
            border-radius: @weuiBtnBorderRadius*2;
        }
        &.weui-btn_small {
            height: 48px/@ratio;
            font-size: 12px;
        }
    }

    .weui-btn_inline {
        display: inline-block;
    }

    //实体按钮
    .weui-btn_primary {
        background-color: @weuiBtnPrimaryBg;
        &:not(.weui-btn_disabled):visited {
            color: @weuiBtnFontColor;
        }
        &:not(.weui-btn_disabled):active {
            color: @weuiBtnActiveFontColor;
            background-color: @weuiBtnPrimaryActiveBg;
        }
    }

    //镂空按钮
    .weui-btn_plain-primary {
        color: @weuiBtnPlainPrimaryColor;
        border: 1px solid @weuiBtnPlainPrimaryBorderColor;
        &:not(.weui-btn_plain-disabled):active {
            color: @weuiBtnPlainPrimaryActiveColor;
            border-color: @weuiBtnPlainPrimaryActiveBorderColor;
            background-color: transparent;
        }
        &:after {
            border-width: 0;
        }
        .process-text {
            color: @weuiBtnPlainPrimaryColor;
        }
    }

    //内部进度
    .process-bg {
        width: 100%;
        height: 100%;
        background: @weuiBtnPlainPrimaryActiveBorderColor;
        overflow: hidden;
    }

    .process-text {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: normal;
    }

    /*橙色按钮样式*/
    @orange : #ff6c3a;
    .weui-btn.orange {
        background: @orange;
        color: @orange;
        .process-bg {
            background: @orange;
        }
        .process-text {
            color: #fff;
        }
        &:active {
            background: lighten(@orange, 5%);
        }
        &.weui-btn_plain-primary {
            background: transparent;
            border-color: @orange;
            .process-text {
                color: @weuiBtnPlainPrimaryColor;
            }
        }
    }
</style>
