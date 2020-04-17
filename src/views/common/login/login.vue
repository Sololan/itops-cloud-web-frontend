<template>
  <yj-container :no-padding="true">
    <div class="login-scroll">
      <div class="login-box">
        <img class="login-logo" src="../../../assets/images/common/login.png" alt="logo">
        <span class="login-slogan">欢迎来到智能运维云平台</span>
        <el-form :model="loginInfo" :rules="loginRules" ref="loginForm">
          <el-form-item prop="username">
            <el-input v-model="loginInfo.username" class="login-username" placeholder="请输入用户名"
                      @keyup.enter.native="handleLogin" @focus="loginError=''">
              <template #prefix>
                <i class="itopsfont itops-account" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginInfo.password" class="login-password" placeholder="请输入密码" :show-password="true"
                      @keyup.enter.native="handleLogin" @focus="loginError=''">
              <template #prefix>
                <i class="itopsfont itops-password" />
              </template>
            </el-input>
          </el-form-item>
        </el-form>
        <div class="login-submit">
          <div class="login-error">{{loginError}}</div>
          <el-button type="default" class="login-btn" @click="handleLogin">登录</el-button>
        </div>
      </div>
    </div>

    <template #background>
      <img class="login-background" src="../../../assets/images/common/login-bg.jpg" alt="background">
    </template>
  </yj-container>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {CATCH_ERROR, CODE_UNAUTHORIZED, LOGIN_ERROR, ROOT_PATH, TITLE_ERROR} from '@/providers/models/consts'
  import YjContainer from '@/components/common/yj-container.vue'
  import {LoginInfo} from '@/providers/models/base-model'
  import HttpUtil from '@/providers/utils/http-util'
  import StorageUtil from '@/providers/utils/storage-util'
  import CommonUtil from '@/providers/utils/common-util'
  import {HttpResult} from '@/providers/models/common/http-model'
  import NoticeUtil from '@/providers/utils/notice-util'
  import {Mutations, NoticeType} from '@/providers/models/enums'
  import store from '@/store'
  import {ElForm} from 'element-ui/types/form'

  @Component({components: {YjContainer}})
  export default class Login extends Vue {
    // 登录信息数据对象
    loginInfo: LoginInfo = {username: '', password: ''}
    // 登录表单校验
    loginRules = {
      username: [{required: true, message: '请输入用户名', trigger: 'change'}],
      password: [{required: true, message: '请输入密码', trigger: 'change'}]
    }
    // 登录错误
    loginError = ''

    /**
     * 登录
     */
    handleLogin(): void {
      CommonUtil.formValidate(this.$refs.loginForm as ElForm)
      .then(() => HttpUtil.login(this.loginInfo))
      .then(this.onLoginSuccess, this.onLoginFail)
    }

    /**
     * 登录成功
     */
    private onLoginSuccess(): void {
      const path: string = (this.$route.query.redirect as string) || ROOT_PATH
      this.$router.push({path}).catch(CATCH_ERROR)
    }

    /**
     * 登录失败
     * @param error
     */
    private onLoginFail(error: HttpResult<void>): void {
      if (!error.hasBsError && error.code === CODE_UNAUTHORIZED) {
        this.loginError = LOGIN_ERROR
        return
      }
      NoticeUtil.showAlert(error.message, TITLE_ERROR, NoticeType.Error).catch(CATCH_ERROR)
    }

    /**
     * 生命周期 - beforeCreate
     */
    beforeCreate(): void {
      store.commit(Mutations.SetDefault)
      StorageUtil.clear()
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/styles/variable";

  .login-background {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .login-scroll {
    position: absolute;
    top: 0;
    right: 0;
    width: $-login-box-width;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: rgba(0, 0, 0, 0.7);
  }

  .login-box {
    min-height: 100%;
    padding: 22px 0;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    & > * {
      flex: none;
    }

    .login-logo {
      width: 94px;
      height: 94px;
      object-fit: cover;
    }

    .login-slogan {
      color: #FFF;
      font-size: 24px;
      font-weight: bold;
      margin: 55px 0;
    }

    .el-form-item + .el-form-item {
      margin-top: 34px;
    }

    .login-username, .login-password {
      /deep/ {
        .el-input__inner {
          width: 300px;
          color: #FFF;
          font-size: 16px;
          height: 60px;
          line-height: 60px;
          border-radius: 30px;
          padding: 0 40px;
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

    .login-submit {
      position: relative;
      padding-top: 68px;

      .login-error {
        position: absolute;
        top: 100%;
        left: 0;
        width: 300px;
        text-align: center;
        box-sizing: border-box;
        color: $-color-danger;
        font-size: 14px;
        padding: 5px 30px;
      }

      .login-btn {
        width: 300px;
        height: 60px;
        color: $-color-primary;
        font-size: 24px;
        font-weight: bold;
        border-radius: 30px;
        background-color: #FFF;
      }
    }

    /deep/ .el-form-item__error {
      font-size: 14px;
      padding: 5px 30px 0;
    }
  }
</style>
