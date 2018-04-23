<template>
  <!--抽奖九宫格-->
  <div class="lottery-grid">
    <div class="grid-list">
      <div class="grid-list-item" v-for="item in positionedAwards">
        <div class="item-box">
          <div class="item-content" :class="{active: activeSn === (item && item.sn)}">
            <img class="item-active-img" src="../../static/images/lottery/lottery-grid/active.webp">
            <img v-if="item" :src="item.imageUrl" :alt="item.name">
          </div>
        </div>
      </div>
      <!--btn-->
      <div class="grid-list-item">
        <div class="item-box">
          <div @click="draw" class="item-content btn-draw" :class="{disabled: drawing ||  times < 1}">
            <span v-if="isLogin" class="times">
              还剩<span class="num">{{this.times}}</span>次
            </span>
            <span v-else class="times" style="line-height: 2.2">
              未登录
            </span>
            <img src="../../static/images/lottery/lottery-grid/btn-draw.webp">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {sortBy} from 'lodash'

  export default {
    name: 'LotteryGrid',
    data() {
      return {
        activeSn: 0, //高亮位置
        speed: 80, //间隔ms
        count: 0, //已跳次数
        endCount: 0, //最后总共跳次数
        drawing: false, //是否正在抽奖中
        showDialog: false,
      }
    },
    props: {
      awards: { //所有奖品列表
        type: Array,
        require: true
      },
      times: { //可抽奖次数
        type: Number,
        require: true
      },
      awardSn: { //奖品位置
        require: true,
        default: 0
      },
      isLogin: { //用户是否登录
        default: false
      },
      isOnline: { //活动是否还在线
        default: false
      },
    },
    computed: {
      positionedAwards() {
        let sortedAwards = sortBy(this.awards, o => o.sn);
        let awards = [];
        awards[0] = sortedAwards[0];
        awards[1] = sortedAwards[1];
        awards[2] = sortedAwards[2];
        awards[4] = sortedAwards[3];
        awards[7] = sortedAwards[4];
        awards[6] = sortedAwards[5];
        awards[5] = sortedAwards[6];
        awards[3] = sortedAwards[7];
        return awards;
      }
    },
    methods: {
      draw() {
        let _this = this;
        if (this.times < 1) {
          this.$vux.confirm.show({
            content: '<div style="font-size: 16px; padding-top:8px;">没机会啦, 去下载应用获取吧~</div>',
            confirmText: '去看看',
            cancelText: '取消',
            dialogTransition: 'none',
            maskTransition: 'none',
            onConfirm: function () {
              _this.$emit('noTimes');
            }
          });
          return;
        }
        if (this.drawing || !this.isLogin || !this.isOnline) {
          return;
        } else {
          this.drawing = true;
          this.$emit('onclick');
          this.go();
        }
      },
      go() {
        this.count++;
        this.activeSn++;
        if (this.activeSn > 8) {
          this.activeSn = 1;
        }
        if (this.count > 20) {
          this.speed += 10;
        }
        if (this.count > 30 && this.awardSn) {
          if (!this.endCount) {
            this.endCount = this.count + (8 - this.activeSn) + this.awardSn;
          }
        }
        if (this.drawing) {
          if (this.count === this.endCount) {
            setTimeout(() => {
              this.stop();
              this.$emit('success');
            }, 600);
          } else if (this.count > 100) {
            this.stop();
            this.$emit('timeout');
          } else {
            this.drawTimer = window.setTimeout(this.go.bind(this), this.speed)
          }
        }
      },
      stop() {
        this.activeSn = 0;
        this.endCount = 0;
        this.count = 0;
        this.speed = 80;
        this.drawing = false;
        window.clearTimeout(this.drawTimer);
      }
    },
  }

</script>

<style lang="less">
  @primary: #ffeeef;
  @secondary: #db1517;
  @success: #05a0ac;

  @btn-color: #db1517;
  @bg: #da151a;
  .lottery-grid {
    width: (500/@rem)*1rem;
    height: (500/@rem)*1rem;
    background: url("../../static/images/lottery/lottery-grid/bg.webp") no-repeat;
    background-size: 100%;
    position: absolute;
    z-index: 3+1;
    left: 0;
    right: 0;
    top: (700/@rem)*1rem;
    margin: auto;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: translate3d((3/@rem)*-1rem, 0, 0);
  }

  .grid-list {
    width: (446/@rem)*1rem;
    height: (446/@rem)*1rem;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    position: relative;
  }

  //默认九宫格,需要12宫格,另外修改
  .grid-list-item {
    width: (1/3)*100%;
    &:nth-child(5) {
      margin-left: (1/3)*100%;
    }
    &:last-child {
      position: absolute;
      top: (1/3)*100%;
      left: (1/3)*100%;
    }
  }

  .item-box {
    padding-top: 100%;
    position: relative;
  }

  //具体内容
  .item-content {
    position: absolute;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: (1/@rem)*1rem;
    top: 0;
    left: 0;
    img {
      display: block;
      width: 100%;
      height: auto;
      color: @secondary;
      overflow: hidden;
      white-space: nowrap;
    }
    .item-active-img {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      display: none;
    }
    &.btn-draw:active {
      opacity: .6;
    }
    &.active {
      .item-active-img {
        display: block;
      }
    }
    &.disabled {
      opacity: .6;
    }
  }

  .times {
    pointer-events: none;
    -webkit-touch-callout: none;
    display: block;
    position: absolute;
    width: 100%;
    top: (88/@rem)*1rem;
    left: 0;
    color: #ff6f08;
    font-size: (18/@rem)*1rem;
    z-index: 1;
    .num {
      font-size: (24/@rem)*1rem;
      padding: 0 2px;
    }
  }
  .weui-dialog .weui-dialog__ft {
     font-size: 16px;
  }
</style>
