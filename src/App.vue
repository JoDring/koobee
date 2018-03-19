<template>
  <div id="app">
    <transition name="vux-fade">
      <keep-alive :include="['app-store-search', 'app-store-home', 'app-store-category']">
        <router-view></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>

  export default {
    name: 'app',
    data() {
      return {}
    }
  }
</script>

<style lang="less">
  //包含有公用的mixin和reset.less(引用了vux的variable.less), 注意:全局的必须在theme.less里覆盖;
  @import "~vux/src/styles/reset.less";
  html, body {
    height: 100%;
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
    .vux-header .vux-header-title{
      font-size: 16px;
    }
  }
</style>
