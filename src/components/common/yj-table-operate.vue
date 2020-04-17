<template>
  <div class="yj-table-operate">
    <div class="yj-left-area">
      <slot />
    </div>
    <div class="yj-right-area" v-if="$slots.right">
      <slot name="right" />
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'

  @Component
  export default class YjTableOperate extends Vue {
  }
</script>

<style scoped lang="scss">
  @import "../../assets/styles/variable";

  .yj-table-operate {
    display: flex;
    align-items: center;
  }

  .yj-left-area, {
    flex: auto;
    width: 0;
    margin: 0 -10px;

    /deep/ .el-button {
      margin: 5px 10px;
    }
  }

  .yj-right-area {
    flex: none;
  }
</style>
