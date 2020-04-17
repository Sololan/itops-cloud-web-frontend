<template>
  <el-drawer custom-class="yj-drawer" :with-header="false" :visible.sync="visible" :size="drawerSize" :before-close="handleBeforeClose"
             :wrapper-closable="wrapperClosable" :close-on-press-escape="false" :appendToBody="appendToBody"
             @open="handleOpenOrClose(true)" @opened="$emit('opened')" @close="handleOpenOrClose(false)" @closed="$emit('closed')">
    <div class="yj-content-area">
      <div class="yj-header-area">
        <div class="yj-header-inner">
          <span class="yj-title" tabindex="0">{{title}}</span>
          <div class="yj-close-button" @click="handleBeforeClose(() => visible = false)" title="关闭">
            <img class="yj-image" src="../../assets/images/common/close.png" alt="img">
          </div>
        </div>
      </div>
      <div class="yj-body-area">
        <div class="yj-body-scroll">
          <slot />
        </div>
      </div>
      <div class="yj-footer-area" v-if="$slots.footer">
        <div class="yj-footer-inner">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'
  import NoticeUtil from '@/providers/utils/notice-util'
  import {CATCH_ERROR, CLOSE_CONFIRM} from '@/providers/models/consts'
  import {Mutations} from '@/providers/models/enums'

  @Component({components: {}})
  export default class YjDrawer extends Vue {
    @Prop() value: boolean
    @Prop() title!: string
    @Prop() size?: string
    @Prop() appendToBody?: boolean
    @Prop() wrapperClosable?: boolean
    @Prop() needConfirm?: boolean

    readonly sizeMap: { [key: string]: string } = {small: '550px', middle: '800px', large: '1000px', xLarge: '1200px'}

    get visible() {return this.value}
    set visible(visible) {this.$emit('input', visible)}

    get drawerSize() {return this.sizeMap[this.size || 'small']}

    handleOpenOrClose(open: boolean): void {
      this.$store.commit(Mutations.SetLoadingFullScreen, open)
      this.$emit(open ? 'open' : 'close')
    }

    handleBeforeClose(done: Function): void {
      if (!this.needConfirm) {
        done()
        return
      }
      NoticeUtil.showConfirm(CLOSE_CONFIRM).then(() => done()).catch(CATCH_ERROR)
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/styles/variable";

  .yj-drawer .yj-content-area {
    height: 100%;
    display: flex;
    flex-direction: column;

    .yj-header-area {
      flex: none;
      padding: 0 20px;

      .yj-header-inner {
        display: flex;
        align-items: center;
        height: 51px;
        border-bottom: 1px solid #999;

        .yj-title {
          flex: auto;
          width: 0;
          font-size: 16px;
          font-weight: bold;
          @include overflow-ellipsis;

          &:focus {
            outline: none;
          }
        }

        .yj-close-button {
          flex: none;
          cursor: pointer;

          .yj-image {
            width: 14px;
            height: 15px;
          }
        }
      }
    }

    .yj-body-area {
      flex: auto;
      height: 0;
      padding: 10px 0;

      .yj-body-scroll {
        height: 100%;
        padding: 0 20px;
        overflow-x: hidden;
        overflow-y: auto;
      }
    }

    .yj-footer-area {
      flex: none;
      padding: 0 20px;

      .yj-footer-inner {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 54px;
        border-top: 1px solid #999;
      }
    }
  }

</style>
