<template>
  <div class="yj-aside-item">
    <el-menu-item v-if="!menu.children || !menu.children.length" :class="[menuLevelClass]" :index="menu.uri">
      <yj-aside-title :title="menu.name" :icon="menu.icon" />
    </el-menu-item>
    <el-submenu v-else :class="[menuLevelClass]" :index="String(menu.id)" popper-class="yj-aside-popper">
      <template #title>
        <yj-aside-title :title="menu.name" :icon="menu.icon" />
      </template>
      <!--下一级-->
      <yj-aside-item v-for="menu2 in menu.children" :key="menu2.id" :menu="menu2" :level="level + 1" />
    </el-submenu>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'
  import {ResourceInfo} from '@/providers/models/uc/resources-model'
  import YjAsideTitle from '@/components/common/yj-aside-title.vue'

  @Component({name: 'yj-aside-item', components: {YjAsideTitle}})
  export default class YjAsideItem extends Vue {
    @Prop() menu!: ResourceInfo
    @Prop() level!: number

    get menuLevelClass() {return `yj-${this.level % 2 === 0 ? 'even' : 'odd'} yj-${this.level}`}
  }
</script>
