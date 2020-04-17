<template>
  <yj-panel class="yj-table-search" :auto-height="true">
    <el-form :inline="true" label-width="100px" @submit.native.prevent>
      <slot />
    </el-form>
  </yj-panel>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import YjPanel from '@/components/common/yj-panel.vue'

  @Component({components: {YjPanel}})
  export default class YjTableSearch extends Vue {
  }
</script>

<style scoped lang="scss">
  @import "../../assets/styles/variable";

  .yj-table-search {
    .el-form {
      margin: 0 -10px;
    }

    /deep/ {
      .el-form-item {
        margin: 5px 10px;
      }

      .el-input {
        width: 190px;
      }
    }
  }
</style>
