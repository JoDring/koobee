<template>
    <div class="bg">
        <div class="btn" @click="downloadApp"></div>
    </div>
</template>
<script>
    export default {
        name: 'check-app-installed',
        props: {
            msg: {
                default: '游戏中心AppStore下载'
            },
            url: {
                required: true
            },
            urlSchema: {
                required: true
            }
        },
        data() {
            return {}
        },
        mounted() {
            document.title = this.msg;
            this.openApp()
        },
        methods: {
            openApp() {
                const iframe = document.createElement('iframe')
                iframe.src = this.urlSchema
                iframe.style.display = 'none'
                document.body.appendChild(iframe)
                setTimeout(function () {
                    document.body.removeChild(iframe)
                }, 1000)
            },
            downloadApp() {
                location.href = this.url
            }
        }
    }
</script>
<style lang="less" scoped>
    .bg {
        width: 100%;
        height: 100%;
        background: url("http://360.cooseatech.cn/appstore/H5/storehome/static/appStore/gamecenter-download-bg.webp") no-repeat left bottom;
        background-size: 100%;
    }
    .btn {
        position: absolute;
        top: 17%;
        left: 0;
        right: 0;
        margin: auto;
        width: 296/2*1px;
        height: 517/2*1px;
        background: url("http://360.cooseatech.cn/appstore/H5/storehome/static/appStore/gamecenter-download-btn.webp") no-repeat;
        background-size: cover;
    }
</style>