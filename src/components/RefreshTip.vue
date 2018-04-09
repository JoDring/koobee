<template>
    <!--加载失败刷新提示-->
    <div class="fail-tip">
        <div>
            <div>oops!获取失败了</div>
            <div class="fail-tip-refresh">
                <x-icon type="ios-refresh" style="fill: #1AAD19"></x-icon>
                <span>重新获取</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'refresh-tip',
    }
</script>
<style lang="less">
    .fail-tip{
        width: 100%;
        height: 100%;
        min-height: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        text-align: center;
        color: #999;
        .fail-tip-refresh{
            margin-top: 5px;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #009def;
        }
    }
</style>
