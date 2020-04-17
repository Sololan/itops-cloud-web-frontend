<template>
  <el-dialog custom-class="yj-dialog" :visible.sync="visible" :width="dialogWidth" :before-close="handleBeforeClose"
             :close-on-click-modal="wrapperClosable" :close-on-press-escape="false" :appendToBody="appendToBody"
             @open="handleOpenOrClose(true)" @opened="$emit('opened')" @close="handleOpenOrClose(false)" @closed="$emit('closed')">
    <template #title>
      <div class="yj-header-inner">
        <span class="yj-title">{{title}}</span>
      </div>
    </template>
    <div class="yj-body-area" :class="{'yj-auto-height': autoHeight}">
      <div class="yj-body-scroll">
        <slot />
      </div>
    </div>
    <template #footer v-if="$slots.footer">
      <div class="yj-footer-inner">
        <slot name="footer" />
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'
  import {Mutations} from '@/providers/models/enums'
  import NoticeUtil from '@/providers/utils/notice-util'
  import {CATCH_ERROR, CLOSE_CONFIRM} from '@/providers/models/consts'

  @Component({components: {}})
  export default class YjDialog extends Vue {
    @Prop() value: boolean
    @Prop() title!: string
    @Prop() size?: string
    @Prop() appendToBody?: boolean
    @Prop() autoHeight?: boolean
    @Prop() wrapperClosable?: boolean
    @Prop() needConfirm?: boolean

    readonly sizeMap: { [key: string]: string } = {small: '550px', middle: '800px', large: '1000px'}

    get visible() {return this.value}
    set visible(visible) {this.$emit('input', visible)}

    get dialogWidth() {return this.sizeMap[this.size || 'large']}

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

  /deep/ .yj-dialog {
    margin: 10vh auto 0 !important;
    border-radius: 10px;

    .el-dialog__header {
      padding: 0 20px;

      .el-dialog__headerbtn {
        top: 15px;
        right: 20px;
        font-size: 20px;
        line-height: 1;

        .el-dialog__close {
          color: #333;
          font-weight: bold;
        }
      }
    }

    .el-dialog__body {
      padding: 0;
    }

    .el-dialog__footer {
      padding: 0 20px;
    }
  }

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
    }
  }

  .yj-body-area {
    padding: 10px 0;

    .yj-body-scroll {
      padding: 0 20px;
      overflow-x: hidden;
      overflow-y: auto;
    }

    &.yj-auto-height .yj-body-scroll {
      max-height: calc(80vh - 125px);
    }

    &:not(.yj-auto-height) {
      height: calc(80vh - 125px);

      .yj-body-scroll {
        height: 100%;
      }
    }
  }

  .yj-footer-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 54px;
    border-top: 1px solid #999;
  }
</style>
