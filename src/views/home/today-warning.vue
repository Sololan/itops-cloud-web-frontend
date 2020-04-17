<template>
  <yj-panel title="今日告警情况" :auto-height="true">
    <div class="body">
      <span class="left">
        <div class="left-item">
          <span>今日新增告警</span>
          <span class="totalCount">{{totalCount}}</span>
        </div>
        <div class="left-space"></div>
        <div class="left-item">
          <span>今日关闭告警</span>
          <span class="closedCount">{{closedCount}}</span>
        </div>
      </span>

      <span class="right">
        <div
            v-for="(level, index) in levelList"
            class="right-item">
          <span :style="{'color':level.color}">{{level.name}}</span>
          <div class="right-box">
            <img class="right-image" :src="level.src">
            <span>{{levelCountList[index]}}</span>
          </div>
        </div>
      </span>
    </div>

    <!--      <span class="level">-->
    <!--        <span-->
    <!--            v-for="(level, index) in levelList"-->
    <!--            class="level-item">-->
    <!--          <span :style="{'color':level.color}" class="level-text">{{level.name}}</span>-->
    <!--          <span class="level-count">{{levelCountList[index]}}</span>-->
    <!--          <img class="level-img" :src="level.src">-->
    <!--        </span>-->
    <!--      </span>-->

  </yj-panel>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'
  import YjPanel from '@/components/common/yj-panel.vue'
  import WarningService from '../../providers/services/bs/warning-service'
  import {CATCH_ERROR} from '@/providers/models/consts'

  @Component({
    components: {YjPanel}
  })
  export default class TodayWarning extends Vue {
    @Prop() levelList: any[]

    totalCount: number = 0
    closedCount: number = 0
    levelCountList: number[] = [0, 0, 0];

    mounted() {
      this.countTodayWarning()
    }

    countTodayWarning() {
      WarningService.countTodayWarning()
      .then((response: any) => {
        this.totalCount = response.totalCount
        this.closedCount = response.closedCount;
        this.levelCountList[0] = response.remindCount;
        this.levelCountList[1] = response.preCount;
        this.levelCountList[2] = response.heavyCount
      }).catch(CATCH_ERROR)
    }
  }
</script>

<style scoped lang="scss">

  .level {
    display: flex;
    /*align-self: flex-end;*/

    .level-item {
      margin: 18px;
      margin-bottom: 0px;

      display: inline-flex;
      justify-content: center;
      position: relative;

      .level-count {
        flex: none;
        position: absolute;
        margin-top: 30px;

        height: 25px;
        font-size: 34px;
        color: rgba(102, 102, 102, 1);
      }

      .level-text {
        position: absolute;
        margin-top: -20px;
        font-weight: bold;
        font-style: italic;
      }

      .level-img {
        width: 69px;
        height: 78px;
      }
    }

    /*margin-bottom: 14px;*/
  }

  /**/

  .body {
    height: 100%;
    padding: 0 20px;
    background-color: #FFF;
    display: flex;
  }

  .left {
    flex: none;
    width: 50%;
    display: flex;
    align-items: flex-end;
  }

  .left-space {
    flex: 1;
    width: 0;
  }

  .left-item {
    flex: 10;
    width: 0;
  }

  .left-item > span:nth-child(1) {
    display: inline-block;
    vertical-align: middle;
    white-space: nowrap;
    font-size: 14px;
    color: #333;
    margin-top: 15px;
    line-height: 1.5;
  }

  .left-item > span:nth-child(2) {
    display: inline-block;
    vertical-align: middle;
    min-width: 84px;
    max-width: 100%;
    font-size: 48px;
    font-weight: bold;
    text-align: center;
    overflow: hidden;
    white-space: normal;
    text-overflow: ellipsis;
  }

  .totalCount {
    color: #080367;
  }

  .closedCount {
    color: #333333;
  }

  .right {
    flex: none;
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .right-item {
    width: 79px;
    padding: 0 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }

  .right-item + .right-item {
    margin-left: 8%;
  }

  .right-item > span {
    font-size: 16px;
    font-style: oblique;
    font-weight: bold;
    height: 30px;
    line-height: 30px;
  }

  .right-box {
    height: 78px;
    position: relative;
  }

  .right-image {
    width: 100%;
    height: 100%;
  }

  .right-image + span {
    position: absolute;
    top: 20px;
    left: 0;
    right: 0;
    bottom: 0;
    font-size: 34px;
    color: #666;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>