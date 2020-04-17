<template>
  <div class="yj-panel" :class="{'yj-auto-height': autoHeight}">
    <div class="yj-title-area" v-if="title">
      <span>{{title}}</span>
      <div class="yj-title-operate-area">
        <slot name="operate" />
      </div>
    </div>
    <div class="yj-sub-title-area" v-if="title && subTitle">
      <span>{{subTitle}}</span>
    </div>
    <div class="yj-title-border" v-if="title && titleBorder"></div>
    <div class="yj-body-area">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'

  @Component
  export default class YjPanel extends Vue {
    @Prop() title?: string
    @Prop() subTitle?: string
    @Prop() autoHeight?: boolean
    @Prop() titleBorder?: boolean
  }
</script>

<style scoped lang="scss">
  @import "../../assets/styles/variable";

  .yj-panel {
    padding: 10px 20px;
    border-radius: 10px;
    background-color: #FFF;
    box-sizing: border-box;
    box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.05);

    .yj-title-area {
      position: relative;
      display: flex;
      align-items: center;
      height: 30px;

      & > span {
        display: block;
        flex: auto;
        width: 0;
        font-size: 16px;
        font-weight: bold;
        color: $-color-primary;
        @include overflow-ellipsis
      }

      &::before {
        flex: none;
        content: '';
        position: absolute;
        left: -20px;
        width: 6px;
        height: 20px;
        border-radius: 2px;
        background-color: $-color-danger;
      }

      .yj-title-operate-area {
        flex: none;
      }
    }

    .yj-sub-title-area {
      height: 21px;
      line-height: 21px;
      font-size: 14px;
      color: #999;
    }

    .yj-title-area > span, .yj-sub-title-area > span {
      @include overflow-ellipsis;
    }

    .yj-title-border {
      margin: 10px -20px;
      border-top: 1px solid #CCC;
    }

    .yj-title-area + .yj-body-area,
    .yj-sub-title-area + .yj-body-area {
      padding-top: 10px;
    }

    &.yj-auto-height {
      display: block;
    }

    &:not(.yj-auto-height) {
      display: flex;
      flex-direction: column;
      height: 100%;

      .yj-title-area, .yj-sub-title-area, .yj-title-border {
        flex: none;
      }

      .yj-body-area {
        flex: auto;
        height: 0;
      }
    }
  }
</style>
