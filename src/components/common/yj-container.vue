<template>
  <div class="yj-container" :class="{'no-padding': noPadding}">
    <div class="yj-content-area">
      <div class="yj-header-area" v-if="$slots.header">
        <slot name="header" />
      </div>
      <div class="yj-body-area">
        <slot />
      </div>
      <div class="yj-footer-area" v-if="$slots.footer">
        <slot name="footer" />
      </div>
    </div>
    <div class="yj-background-area" :style="{'background-color': backgroundColor || 'transparent'}">
      <slot name="background" />
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'

  @Component
  export default class YjContainer extends Vue {
    @Prop() backgroundColor: string
    @Prop() noPadding: boolean
  }
</script>

<style scoped lang="scss">
  @import "../../assets/styles/variable";

  .yj-container {
    position: relative;
    height: 100%;

    &.no-padding {
      .yj-content-area, .yj-content-area > * {
        padding: 0;
      }
    }
  }

  .yj-content-area {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    box-sizing: border-box;
    padding: $-container-padding 0;

    & > * {
      padding: 0 $-container-padding;
    }

    .yj-header-area, .yj-footer-area {
      flex: none;
    }

    .yj-body-area {
      flex: auto;
      height: 0;
      overflow-x: hidden;
      overflow-y: auto;
    }
  }

  .yj-background-area {
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
</style>
