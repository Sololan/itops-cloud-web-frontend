<template>
  <div class="yj-aside" :class="{'yj-collapse': collapse}">
    <div class="yj-body-area">
      <div class="yj-scroll-area">
        <el-menu :collapse="collapse" :default-active="$route.fullPath" :router="true" unique-opened="true">
          <yj-aside-item v-for="menu in menus" :key="menu.id" :menu="menu" :level="1" />
        </el-menu>
      </div>
    </div>
    <div class="yj-switch-area" :title="collapse ? '展开' : '收起'" @click="handleToggleMenu">
      <i class="itopsfont itops-toggle" />
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {Mutations} from '@/providers/models/enums'
  import YjAsideItem from '@/components/common/yj-aside-item.vue'

  @Component({components: {YjAsideItem}})
  export default class YjAside extends Vue {
    get collapse() {return this.$store.state.menuHide}
    get menus() {return this.$store.getters.menus}

    /**
     * 处理展开或隐藏菜单
     */
    handleToggleMenu(): void {
      this.$store.commit(Mutations.SetMenuHide, !this.collapse)
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/styles/variable";

  .yj-aside {
    position: relative;
    height: 100%;
    box-sizing: border-box;
    padding-bottom: 56px;
    background-color: $-menu-background-color;

    .yj-body-area {
      position: relative;
      height: 100%;
      width: $-menu-width;
      overflow: visible;
      transition: .3s width ease-in-out;

      .yj-scroll-area {
        position: absolute;
        top: 0;
        height: 100%;
        overflow: auto;
      }
    }

    .el-menu {
      border: none;

      &:not(.el-menu--collapse) {
        width: $-menu-width;
      }
    }

    .yj-switch-area {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 56px;
      display: flex;
      cursor: pointer;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      border-top: 1px solid #CCC;

      & > i {
        font-size: 20px;
        transform: rotateY(-180deg);
        transition: .3s transform ease-in-out;
      }
    }

    &.yj-collapse {
      .yj-body-area {
        width: $-menu-collapse-width;
      }

      .yj-switch-area > i {
        transform: rotateY(0);
      }
    }
  }
</style>

<style lang="scss">
  @import "../../assets/styles/variable";

  .yj-aside, .yj-aside-popper {
    .yj-icon-area {
      margin: 0 5% 0 7%;
      font-size: $-menu-sub-item-font-size + 4;
    }

    /deep/ .el-submenu__icon-arrow,
    .yj-aside-title {
      font-size: $-menu-sub-item-font-size;
    }

    .el-menu-item:focus {
      background-color: transparent;
    }

    .el-menu-item.is-active {
      background-color: #DCE0E9;
    }
  }

  .yj-aside {
    .yj-1 {
      & > .el-tooltip > .yj-icon-area,
      & > .el-submenu__title > .yj-icon-area,
      & > .yj-icon-area {
        font-size: $-menu-item-font-size + 4;
      }

      & > .el-submenu__title > .yj-aside-title,
      & > .yj-aside-title {
        font-size: $-menu-item-font-size;
        font-weight: bold;
      }
    }

    .yj-odd > .el-menu {
      background-color: #E3E7F2;
    }

    .yj-icon-area {
      margin: 0 5% 0 7%;
      font-size: $-menu-sub-item-font-size + 4;
    }

    .el-menu-item.is-active::after {
      position: absolute;
      content: '';
      top: 0;
      right: 0;
      width: 4px;
      height: 100%;
      background-color: $-color-primary;
    }

    .el-menu--collapse > .yj-aside-item > .el-menu-item span,
    .el-menu--collapse > .yj-aside-item > .el-submenu > .el-submenu__title span {
      height: 0;
      width: 0;
      overflow: hidden;
      visibility: hidden;
      display: inline-block;
    }

    .el-menu--collapse > .yj-aside-item > .el-menu-item .el-submenu__icon-arrow,
    .el-menu--collapse > .yj-aside-item > .el-submenu > .el-submenu__title .el-submenu__icon-arrow {
      display: none;
    }
  }
</style>
