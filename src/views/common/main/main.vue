<template>
  <el-container class="yj-layout">
    <el-header height="auto">
      <yj-header />
    </el-header>
    <el-container>
      <el-aside width="auto">
        <yj-aside />
      </el-aside>
      <el-main v-loading="$store.state.loadingShow" element-loading-background="rgba(0,0,0,.5)">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import YjAside from '@/components/common/yj-aside.vue'
  import YjHeader from '@/components/common/yj-header.vue'

  @Component({components: {YjHeader, YjAside}})
  export default class Main extends Vue {

  }
</script>

<style scoped lang="scss">
  @import "../../../assets/styles/variable";

  .yj-layout {
    height: 100%;
    min-width: 888px;
    background-color: $-app-background-color;

    .el-header, {
      position: relative;
      z-index: 2;
      padding: 0;
      flex: none;
    }

    .el-aside {
      flex: none;
      overflow: inherit;
    }

    .el-main {
      padding: 0;
    }
  }
</style>
