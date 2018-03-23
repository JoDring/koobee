<template>
    <!--底部app广告下载-->
    <div class="app-ad" v-if="app">
        <div class="app-info-brief">
            <div v-lazy:background-image="app.iconUrl" class="app-info-icon"></div>
            <div class="brief-txt">
                <span>{{app.name}}</span>
                <span class="txt-gray">{{app.apkSize | formatSize(2)}}</span>
            </div>
        </div>
        <div>
            <btn-download class="app-info-btn" btn-text="下载" :url="app.downloadUrl"></btn-download>
        </div>
    </div>
</template>

<script>
    import BtnDownload from './btn-download'
    import {formatSize} from '../filters'
    export default {
        name: 'app-ad',
        data() {
            return {}
        },
        props: {
           app: {
               type: Object,
               required: true
           }
        },
        components: {
            BtnDownload
        },
        filters: {
            formatSize
        }
    }
</script>
<style lang="less">
    @import "~vux/src/styles/weui/base/fn.less";
    .app-ad {
        height: 63px;
        background: rgba(255, 255, 255, .8);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 15px;
        box-sizing: border-box;
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 9;
        &:before {
            .setTopLine(#e4e4e4)
        }
        .app-info-brief {
            display: flex;
            align-items: center;
        }
        .brief-txt {
            display: flex;
            flex-direction: column;
            font-size: 15px;
            color: #2b2b2b;
        }
        .txt-gray {
            font-size: 11px;
            color: #c6c6c6;
        }
        .app-info-icon {
            width: 38px;
            height: 38px;
            border-radius: 4px;
            overflow: hidden;
            background-size: cover;
            margin-right: 9px;
        }
        .app-info-btn {
            width: 75px;
            height: 30px;
            background-color: #ff6b3b;
        }
    }
</style>
