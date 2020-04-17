<template>
  <div class="yj-header">
    <a href="javascript:" class="yj-logo-area">
      <img src="../../assets/images/common/logo.png" alt="logo" />
      <a class="org-name">—— {{orgName}}</a>
    </a>
    <div class="yj-right-area">
      <a class="yj-avatar-area">
        <img src="../../assets/images/common/avatar.png" alt="avatar" />
      </a>
      <div class="yj-account-area">
        <span class="yj-user-area">{{fullName}}</span>
        <span class="yj-role-area">{{roleName}}</span>
      </div>
      <a href="javascript:" class="yj-logout-area" @click="handleLogout" title="退出">
        <i class="itopsfont itops-logout" />
      </a>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import NoticeUtil from '@/providers/utils/notice-util'
  import HttpUtil from '@/providers/utils/http-util'
  import {CATCH_ERROR} from '@/providers/models/consts'
  import {Mutations} from '@/providers/models/enums'
  import store from '@/store'

  @Component
  export default class YjHeader extends Vue {
    get fullName(): string {return this.$store.getters.fullName}
    get roleName(): string {return this.$store.getters.roleName}
    get orgName(): string {return this.$store.getters.orgName}

    handleLogout(): void {
      NoticeUtil.showConfirm('确定要退出？')
      .then(() => HttpUtil.logout()
      .finally(() => {
        store.commit(Mutations.SetDefault)
        return this.$router.push('/login')
      }))
      .catch(CATCH_ERROR)
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/styles/variable";

  .org-name {
    color: black;
    margin-left: 15px;
    margin-top: 13px;
    font-size: 16px;
  }

  .yj-header {
    display: flex;
    height: $-header-height;
    background-color: $-header-background-color;
    box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.05);
  }

  .yj-logo-area {
    flex: auto;
    width: 0;
    display: flex;
    align-items: center;
    padding: 0 30px 0 3.6458%;

    & > img {
      max-width: 100%;
    }
  }

  .yj-right-area {
    flex: none;
    position: relative;
    margin-left: auto;
    width: 288px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    background-color: $-color-primary;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -40px;
      width: 40px;
      height: $-header-height;
      border-style: solid;
      border-color: transparent $-color-primary $-color-primary transparent;
      border-width: $-header-height/2 20px $-header-height/2 20px;
      box-sizing: border-box;
    }

    .yj-avatar-area, .yj-logout-area, .yj-account-area {
      padding: 0 10px;
    }

    .yj-avatar-area, .yj-logout-area {
      flex: none;
    }

    .yj-avatar-area > img {
      width: 55px;
      height: 55px;
      object-fit: contain;
      border-radius: 50%;
    }

    .yj-account-area {
      flex: auto;
      width: 0;

      & > span {
        display: block;
        color: #FFF;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;

        &.yj-user-area {
          font-size: 18px;
        }

        &.yj-role-area {
          margin-top: 10px;
        }
      }
    }

    .yj-logout-area > i {
      font-size: 36px;
      color: #FFF;
    }
  }
</style>
