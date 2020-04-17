<template>
  <yj-container class="full-page">
    <div class="login-form">
      <div class="item-area">
        <span class="login-slogan">绑定微信公众号</span>
        <el-form :model="wxInfo" ref="loginForm">
          <el-form-item prop="username">
            <el-input v-model="wxInfo.username" class="login-username" placeholder="请输入用户名"
                      @keyup.enter.native="bindId">
            </el-input>
          </el-form-item>
        </el-form>
        <div class="login-submit">
          <el-button type="default" class="login-btn" @click="bindId"><span style="font-size: 16px;
    font-weight: bold;">绑 定</span></el-button>
        </div>
      </div>
    </div>
    <template #background>
      <img class="login-background" src="../../assets/images/common/login-bg.jpg" alt="background">
    </template>
  </yj-container>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import YjTable from '@/components/common/yj-table.vue'
  import YjContainer from '@/components/common/yj-container.vue'
  import YjTableSearch from '@/components/common/yj-table-search.vue'
  import YjTableOperate from '@/components/common/yj-table-operate.vue'
  import YjPanel from '@/components/common/yj-panel.vue'
  import {LoginInfo} from '@/providers/models/base-model'
  import {WxInfo} from '@/providers/models/bs/wechat-model'
  import WechatUtil from '@/providers/utils/wechat-util'
  import NoticeUtil from '@/providers/utils/notice-util'
  import { CATCH_ERROR } from '@/providers/models/consts'

  @Component({components: {YjPanel, YjTable, YjContainer, YjTableSearch, YjTableOperate}})
  export default class Wechat extends Vue {
    // 微信传递过来的code
    code = "";
    // 登录信息数据对象
    wxInfo: WxInfo = {username: '', code: ''}

    bindId(): void {
      WechatUtil.bindId(this.wxInfo)
      .then(() => {
        NoticeUtil.showAlert("绑定成功")
      })
      .catch(CATCH_ERROR)
    }

    // 页面加载事件
    mounted() {
      this.wxInfo.code = this.$route.query.code as string
    }

  }
</script>

<style scoped lang="scss">

  .full-page {
    height: 100%;
    background:rgba(0,0,0,0.8);
  }

  .login-form {
    margin-top: 7%;
    height: 70%;
    width: 100%;
    text-align: center;
  }

  .login-background {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .login-slogan {
    color: #FFF;
    font-size: 24px;
    font-weight: bold;
    margin: 55px 0;
  }

  .el-button {
    color: #07035d;
    border-color: #07035d;
    outline: none;
    width: 300px;
    border-radius: 20px;
  }

  .login-username, .login-password {
    /deep/ {
      .el-input__inner {
        margin-top: 100px;
        margin-bottom: 50px;
        width: 300px;
        color: #FFF;
        font-size: 16px;
        height: 60px;
        line-height: 60px;
        border-radius: 10px;
        padding: 0 20px;
        background: none;
        border-color: #FFF;
      }

      .el-input__prefix {
        left: 15px;
        height: 60px;
        line-height: 60px;

        & > i {
          color: #FFF;
          font-size: 18px;
        }
      }

      .el-input__suffix {
        right: 15px;
        color: #FFF;
        height: 60px;
        line-height: 60px;

        .el-input__clear {
          color: #FFF;
          font-size: 18px;
        }
      }
    }

  }
</style>
