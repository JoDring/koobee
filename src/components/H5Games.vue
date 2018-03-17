<template>
  <view-box ref="viewBox" class="h5-games" :body-padding-bottom="0">
    <!--<nav class="loc clearfix">
      <span class="loc_left">
        <img class="lazy" src="http://png.myaora.net/rechange/images/title_back_bai.png">高品质H5游戏
      </span>
      <span class="loc_right">
        <img class="lazy" src="http://png.myaora.net/rechange/images/title_share_bai.png">
      </span>
    </nav>-->
    <div class="main main2">
      <div class="banner">
        <img :src="dataObj.bannerUrl">
      </div>
      <div class="main_box">
        <div class="top_box">
          <div class="top_box_mask"></div>
          <p>{{dataObj.content}}</p>
          <p v-if="emptyList">当前专题无内容!</p>
        </div>
        <div class="cp_list" v-if="dataObj.list && dataObj.list.length > 0">
          <div class="cp-box" v-for="item in dataObj.list" :key="item.id">
            <p class="item-title">/<span class="cbt_soft_name">{{item.subTitle}}</span>/</p>
            <p class="desc">{{item.subContent}}</p>
            <p class="big-img">
              <x-img :src="item.imageUrl" container="#vux_view_box_body"></x-img>
            </p>
            <a class="down-btn" :href="item.h5Url" @click.prevent="uploadState(item)">立即开玩</a>
          </div>
        </div>
        <!-- <div class="recent_recommend">
           <div class="end_des">
             <div class="cp_end_l"></div>
             <div class="cp_end_c"><span>近期专题</span></div>
           </div>
           <div class="recent_special">
             <ul>
               <li class="recent_li_0">
                 <a class="recent_a_0" ad_name="手账可以打印诶！" action_params="1108"
                    href="http://act.myaora.net/rechange/special.php?id=1108&amp;t=web"><img
                   src="../assets/h5games/1.jpg"></a>
               </li>
               <li class="recent_li_1">
                 <a class="recent_a_1" ad_name="感恩节，我组了一个温暖的歌单" action_params="1109"
                    href="http://act.myaora.net/rechange/special.php?id=1109&amp;t=web"><img
                   src="../assets/h5games/2.jpg"></a>
               </li>
               <li class="recent_li_2">
                 <a class="recent_a_2" ad_name="一招提升艳遇指数" action_params="1085"
                    href="http://act.myaora.net/rechange/special.php?id=1085&amp;t=web"><img
                   src="../assets/h5games/3.jpg"></a>
               </li>
               <li class="recent_li_3">
                 <a class="recent_a_3" ad_name="本周最值得下VOL.21" action_params="1084"
                    href="http://act.myaora.net/rechange/special.php?id=1084&amp;t=web"><img
                   src="../assets/h5games/4.jpg"></a>
               </li>
             </ul>
           </div>
         </div>-->
      </div>
      <div class="clearfix"></div>
    </div>
  </view-box>
</template>

<script>
  import {ViewBox, XImg} from 'vux';

  const url = /szprize\.cn/i.test(location) ? 'http://appstore.szprize.cn/appstore/html/getData?id=' : 'http://192.168.1.148:8080/appstore/html/getData?id=';
  export default {
    name: 'H5Games',
    props: {
      id: {
        require: true,
      }
    },
    data() {
      return {
        dataObj: {},
        clickedItemId: '',
        emptyList: false
      }
    },
    created() {
      this.fetchData();
      //加入统计 代码
      let mtaScript = document.createElement('script');
      mtaScript.setAttribute('name', 'MTAH5');
      mtaScript.setAttribute('sid', '500397080');
      mtaScript.setAttribute('cid', '500397118');
      mtaScript.async = true;
      mtaScript.src = 'http://pingjs.qq.com/h5/stats.js';
      document.querySelector('body').appendChild(mtaScript);
    },
    mounted() {
      //页面打开后上报 专题id 统计
      window.MtaH5 && window.MtaH5.clickStat('html_game_h5_click', {'album': this.id});
    },
    methods: {
      fetchData() {
        this.$vux.loading.show();
        this.$http.get(url.concat(this.id)).then(res => {
          this.$vux.loading.hide();
          if (res.data && String(res.data.code) === '0') {
            this.dataObj = res.data.data.all;
            if (this.dataObj.list.length === 0) {
              this.emptyList = true;
            }
            document.title = this.dataObj.title;
          }
        })
      },
      uploadState(item) { //上报项目id和标题统计后跳转
        if (window.MtaH5 && this.clickedItemId !== item.id) {
          window.MtaH5.clickStat('html_game_h5_click', {'title': item.subTitle, 'item': item.id});
          this.clickedItemId = item.id;
        }
        setTimeout(function () {
          location.href = item.h5Url;
        }, 100)
      }
    },
    components: {
      ViewBox,
      XImg
    }
  }
</script>
<style lang="less">
  html {
    font-size: 62.5%;
  }

  img {
    max-width: 100%;
  }

  ul, li {
    list-style: none;
  }

  .h5-games {
    background: #01080c;
    .clearfix:after {
      content: "";
      display: block;
      height: 0;
      clear: both;
    }

    .hide {
      display: none;
    }

    .main {
      min-width: 280px;
      /*max-width: 640px;*/
      margin: 0 auto;
      padding-bottom: 20px;
    }

    .banner {
      line-height: 0;
      min-height: 140px;
      position: relative;
      img{
        width: 100%;
        height: auto;
      }
    }

    /*推荐专题*/
    .recent_special {
      position: relative;
      z-index: 1000;
      padding-bottom: 6rem;
    }

    .recent_special li {
      float: left;
      width: 48.5%;
      margin-right: 3%;
      margin-bottom: 3%;
    }

    .recent_special .recent_li_1, .recent_special .recent_li_3 {
      margin-right: 0;
    }

    /*导航栏*/
    .loc {
      background: #fff;
      min-width: 280px;
      max-width: 640px;
      height: 5rem;
      position: fixed;
      top: 0;
      left: 50%;
      width: 100%;
      line-height: 5rem;
      z-index: 9;
      border-bottom: 1px solid #d9d9d9;
      -webkit-transform: translateX(-50%);
      -moz-transform: translateX(-50%);
      -ms-transform: translateX(-50%);
      transform: translateX(-50%);
    }

    .loc span {
      font-size: 1.6rem;
    }

    .loc_left {
      float: left;
      color: #000;
      padding-left: 1rem;
      font-weight: bold;
    }

    .loc_right {
      float: right;
      color: #4fc397;
      padding-right: 1rem;
    }

    .loc_left img, .loc_right img {
      margin-right: 1.2rem;
    }

    .loc_left img {
      width: 0.7rem;
    }

    .loc_right img {
      width: 2rem;
      margin-bottom: -0.5rem;
      margin-right: 0;
    }

    .loc {
      background: #013c60;
      border-bottom: 0;
    }

    .loc_left {
      color: #fff;
    }

    .top_box {
      position: relative;
      background: url(../assets/h5games/20171024-bg-1.jpg) no-repeat;
      background-size: 100% 100%;
      overflow: hidden;
      text-align: center;
    }
    .top_box_mask {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100px;
    }

    .top_box p {
      color: #fffff6;
      font-size: 1.2rem;
      line-height: 2rem;
      margin: 0 auto;
      background: linear-gradient(to top, #01080c 0%, transparent 100%);
      display: inline-block;
      text-align: left;
      padding: 0 4%;
    }

    .cp-box {
      padding: 8% 5% 5%;
      background: url(../assets/h5games/20171024-bg-2.png) no-repeat;
      background-size: 100% 100%;
      width: 81%;
      margin: 3rem auto 0;
    }

    .item-title {
      text-align: center;
      font-size: 2rem;
      color: #fee184;
      line-height: 2.8rem;
      font-weight: 700;
      padding-bottom: 3%;
    }

    .cbt_soft_name {
      font-size: 1.8rem;
      display: inline-block;
      margin: 0 5%;
    }

    .desc {
      font-size: 1.3rem;
      line-height: 2.2rem;
      color: #fff9f1;
    }

    .big-img {
      line-height: 0;
      margin: 5% 0;
      min-height: 113px;
      img{
        display: block;
        height: auto;
        width: 100%;
      }
    }

    .down-btn {
      background: url(../assets/h5games/20171024-btn.png) no-repeat center;
      background-size: auto 100%;
      color: #faf4e2;
      font-size: 1.3rem;
      font-weight: 700;
      text-align: center;
      display: block;
      width: auto;
      height: 4rem;
      line-height: 3.5rem;
    }

    .recent_recommend {
      width: 91%;
      margin: 4rem auto 0;
    }

    .end_des {
      text-align: center;
    }

    .cp_end_l {
      border-bottom: 0.1rem dashed #fffff6;
    }

    .cp_end_c span {
      color: #fffff6;
      background: #01080c;
      font-size: 1.6rem;
      position: relative;
      top: -1rem;
      line-height: 2rem;
      padding: 0 0.5rem;
      display: inline-block;
    }

    .recent_special {
      padding-bottom: 0 !important;
    }
  }
</style>
