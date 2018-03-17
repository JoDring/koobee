<template>
  <div style="padding: 100px 0; text-align: center; color: #10aeff">
      <icon type="info" is-msg></icon>
      <h3 style="margin-top: 15px;">{{msg}}</h3>
  </div>
</template>

<script>
  import {Box, Icon} from 'vux';
  export default {
    name: 'NotFound',
    props: {
      msg: {
        default: '您访问的页面不存在哦!'
      }
    },
    data() {
      return {
      }
    },
    created() {
      document.title = this.msg;
    },
    components: {
      Box,
      Icon,
    }
  }
</script>
<style lang="less">
</style>
