<template>
    <div style="padding: 100px 0; text-align: center; color: #10aeff">
        <i class="weui-icon weui_icon_info weui-icon-info weui-icon_msg"></i>
        <h3 style="margin-top: 15px;">{{msg}}</h3>
    </div>
</template>
<script>
    export default {
        name: 'NotFound',
        props: {
            msg: {
                default: '您访问的页面不存在哦!'
            }
        },
        data() {
            return {
                url:''
            }
        },
        created() {
            document.title = this.msg;
        },
        methods: {
            handleClick() {
                location.href = this.url
            },
            handleClick2() {
                window.open(this.url)
            }
        }
    }
</script>
