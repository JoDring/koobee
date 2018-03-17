<template>
  <scroller
          class="list-result"
          ref="scroller"
          :on-refresh="refresh"
          :on-infinite="getMore"
          v-if="searchResult">
    <div class="list-item" v-for="item in searchResult.apps" :key="item.id">
      <router-link :to="{name: 'AppDetail',append:false, params:{appId: item.id}, query: {isSub: true}}" class="list-item-icon-c">
        <img class="list-item-icon" :src="item.iconUrl">
      </router-link>
      <router-link :to="{name: 'AppDetail',append:false, params:{appId: item.id}, query: {isSub: true}}">
        <div class="list-item-name">{{item.name}}</div>
        <div class="list-item-brief">{{item.apkSize | formatSize(2)}}</div>
        <div class="list-item-brief">{{item.brief}}</div>
      </router-link>
      <btn-download class="btn-download" :url="item.downloadUrl" btnText="下载"></btn-download>
    </div>
  </scroller>
</template>

<script>
  export default {
    name: 'app-list',
    props: {

    },
    data() {
      return {

      }
    }
  }
</script>
<style lang="less">

</style>
