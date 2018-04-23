<template>
    <div id="app">
        <transition name="vux-fade" mode="out-in">
            <keep-alive :include="['app-store-search', 'app-store-home', 'app-store-category', 'information-list', 'app-store-apps']">
                <router-view></router-view>
            </keep-alive>
        </transition>
    </div>
</template>

<script>
    export default {
        name: 'app',
        mounted() {
            window.addEventListener('online', () => {
                this.$vux.toast.text('网络已连接')
                this.$vux.bus.$emit('on-line')
            });
            window.addEventListener('offline', () => {
                this.$vux.toast.text('网络已断开')
                this.$vux.bus.$emit('off-line')
            });
            //隐藏服务器恶意广告
            var adDiv1 = document.querySelector('[id^="chunasqwd"]')
            if (adDiv1) {
                adDiv1.style.display = 'none'
            }
            var adDiv2 = document.querySelector('[id^="_embed"]')
            if (adDiv2) {
                adDiv2.style.display = 'none'
            }

        }
    }
</script>

<style lang="less">
    //包含有公用的mixin和reset.less(引用了vux的variable.less), 注意:全局的必须在theme.less里覆盖;
    @import "~vux/src/styles/reset.less";

    html, body {
        height: 100%;
    }
    input::-webkit-search-cancel-button{
        display: none;
    }
    body {
        overflow: hidden;
        font-size: 16px;
    }
    .weui-mask {
        touch-action: none;
    }
    #app {
        height: 100%;
        background: #fff;
        .vux-header {
            padding: 0;
            background-color: #fff;
            height: 45px;
            &:after {
                .setBottomLine(#cacaca)
            }
        }
        .vux-header .vux-header-title {
            font-size: 16px;
            height: 100%;
            line-height: 45px;
        }
        .vux-header .vux-header-right {
            height: 100%;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            top: 0;
            width: 40px;
        }
        .vux-header .vux-header-right a, .vux-header .vux-header-right button {
            height: 100%;
            display: flex;
            justify-content: flex-end;
            margin: 0;
            align-items: center;
        }
    }
</style>
