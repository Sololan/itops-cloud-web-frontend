<template>
    <yj-container>
        <!--抽屉-->
        <info-edit-drawer v-model="drawerFlag.editFlag" @success="() => this.getUserInfo()"/>
        <info-password-drawer v-model="drawerFlag.pwdFlag" @success="() => this.getUserInfo()"/>
        <info-phone-drawer v-model="drawerFlag.phoneFlag" @success="() => this.getUserInfo()"/>
        <info-email-drawer v-model="drawerFlag.emailFlag" @success="() => this.getUserInfo()"/>
        <info-wx-drawer v-model="drawerFlag.wxFlag" @success="() => this.isBind()"/>

        <div class="yj-panel" :class="{'yj-auto-height': false}">
            <div class="yj-title-area">
                <span>基本信息</span>
            </div>
            <div class="item-block first-item">
                <span class="item-font item-style">用户名</span>
                <span class="right-span right-span-font1">{{userInfo.username}}</span>
            </div>
            <div class="item-block">
                <span class="item-font item-style">姓名</span>
                <span class="right-span right-span-font2">{{userInfo.fullName}}</span>
            </div>
            <div class="item-block last-item">
                <span class="item-font item-style">用户角色</span>
                <span class="right-span right-span-font2">{{userInfo.roleList[0].name}}</span>
            </div>
            <div class="yj-title-area">
                <span>联系信息</span>
            </div>
            <div class="center">
                <div class="item-block item-block-inline">
                    <img class="phone-icon" src="../../assets/images/phone.png" alt="icon">
                    <span class="span-block right-span-font1">手机</span>
                    <span class="span-block item-font crevice">用于接收告警信息</span>
                    <span class="span-float-left">{{userInfo.phone?userInfo.phone:'未设置'}}</span>
                    <el-button class="button-position" size="small" type="primary" @click="modifyPhone">
                        {{userInfo.phone?'修改':'设置'}}
                    </el-button>
                </div>
                <div class="div-vertical"/>
                <div class="item-block item-block-inline">
                    <img class="phone-icon" src="../../assets/images/wechat.png" alt="icon">
                    <span class="span-block right-span-font1">公众号</span>
                    <span class="span-block item-font crevice">用于接收告警信息</span>
                    <span class="span-float-right">{{bindStatus?'迎嘉运维平台':'未设置'}}</span>
                    <el-button class="button-position-s" size="small" type="primary" @click="modifyWx">
                        {{bindStatus?'修改':'设置'}}
                    </el-button>
                </div>
            </div>
            <div class="center">
                <div class="item-block item-block-inline">
                    <img class="phone-icon" src="../../assets/images/mail.png" alt="icon">
                    <span class="span-block right-span-font1">邮箱</span>
                    <span class="span-block item-font crevice">用于接收告警信息</span>
                    <span class="span-float-left">{{userInfo.email?userInfo.email:'未设置'}}</span>
                    <el-button class="button-position" size="small" type="primary" @click="modifyEmail">
                        {{userInfo.email?'修改':'设置'}}
                    </el-button>
                </div>
                <div class="div-vertical"/>
                <div class="item-block item-block-inline">
                    <img class="phone-icon" src="../../assets/images/password.png" alt="icon">
                    <span class="span-block right-span-font1">密码</span>
                    <span class="span-block item-font crevice">用于提高账号安全性</span>
                    <span class="span-float-right">*********</span>
                    <el-button class="button-position-s" size="small" type="primary" @click="modifyPwd">修改</el-button>
                </div>
            </div>
        </div>
    </yj-container>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator'
    import YjTable from '@/components/common/yj-table.vue'
    import YjContainer from '@/components/common/yj-container.vue'
    import YjTableSearch from '@/components/common/yj-table-search.vue'
    import YjTableOperate from '@/components/common/yj-table-operate.vue'
    import YjPanel from '@/components/common/yj-panel.vue';
    import YjDrawer from '@/components/common/yj-drawer.vue'
    import UsersService from '@/providers/services/uc/users-service';
    import NoticeUtil from '@/providers/utils/notice-util';
    import {ElForm} from 'element-ui/types/form';
    import User from "@/views/user/user.vue";
    import {UserInfo} from "@/providers/models/uc/users-model";
    import {BaseModel} from "@/providers/models/base-model";
    import {ResourceInfo} from "@/providers/models/uc/resources-model";
    import {OrgInfo} from "@/providers/models/uc/orgs-model";
    import {RoleInfo} from "@/providers/models/uc/roles-model";
    import {CATCH_ERROR} from "@/providers/models/consts";
    import InfoEditDrawer from "@/views/info/info-edit-drawer.vue";
    import InfoPasswordDrawer from "@/views/info/info-password-drawer.vue";
    import InfoPhoneDrawer from "@/views/info/info-phone-drawer.vue";
    import InfoEmailDrawer from "@/views/info/info-email-drawer.vue";
    import InfoWxDrawer from "@/views/info/info-wx-drawer.vue";

    @Component({
        components: {
            InfoWxDrawer,
            InfoEmailDrawer,
            InfoPhoneDrawer,
            InfoPasswordDrawer,
            InfoEditDrawer, YjPanel, YjTable, YjContainer, YjTableSearch, YjTableOperate, YjDrawer
        }
    })
    export default class Info extends Vue {

        drawerFlag = {
            editFlag: false,
            pwdFlag: false,
            phoneFlag: false,
            emailFlag: false,
            wxFlag: false,
        };

        bindStatus = false;

        roleList = {
            name: ''
        };

        userInfo: UserInfo = {
            fullName: '',
            username: '',
            roleList: [this.roleList],
            phone: '',
            email: '',
        };

        modifyInfo(): void {
            this.drawerFlag.editFlag = true;
        }

        modifyPwd(): void {
            this.drawerFlag.pwdFlag = true;
        }

        modifyPhone(): void {
            this.drawerFlag.phoneFlag = true;
        }

        modifyEmail(): void {
            this.drawerFlag.emailFlag = true;
        }

        modifyWx(): void {
            this.drawerFlag.wxFlag = true;
        }

        isBind() {
            UsersService.isBind(this.$store.state.userInfo.id).then((data: boolean) => {
                this.bindStatus = data;
            }).catch(CATCH_ERROR)
        }

        getUserInfo() {
            UsersService.getUserInfoById(this.$store.state.userInfo.id).then((data: UserInfo) => {
                this.userInfo = data;
            })
        }

        mounted() {
            UsersService.getUserInfoById(this.$store.state.userInfo.id).then((data: UserInfo) => {
                this.userInfo = data;
            });
            this.isBind()
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/styles/variable";

    .phone-icon {
        position: relative;
        float: left;
    }

    .dotted-line {
        margin-left: -200px;
        margin-right: -30px;
        border-bottom: 1px solid rgba(153, 153, 153, 1);
        border-bottom-style: dashed;
    }

    .second-title {
        margin-left: -200px;
        float: left;
        display: block;
        height: 14px;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
    }

    .red-block {
        content: '';
        float: left;
        top: 3px;
        left: -30px;
        width: 8px;
        height: 24px;
        border-radius: 2px;
        background-color: #D80D19;
    }

    .item-block-inline {
        display: inline-block;
        width: 47.5%;
        vertical-align: middle;
    }

    .first-item {
        margin-top: 21px;
        margin-bottom: 14px;
    }

    .last-item {
        margin-bottom: 21px;
        margin-top: 14px;
    }

    .right-span {
        padding-left: 1.2%;
    }

    .right-span-font1 {
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: rgba(8, 3, 103, 1);
    }

    .right-span-font2 {
        width: 40px;
        height: 14px;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
    }


    .item-style {
        padding-left: 2%;
        display: inline-block;
        text-align: right;
        width: 70px;
        height: 14px;
    }

    .item-font {
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(153, 153, 153, 1);

    }

    .span-block {
        margin-left: 60px;
        display: block;
        width: 25%;
    }

    .after-block {
        margin-top: 20px;
    }

    .button-position {
        margin-top: -35px;
        float: right;
        position: relative;
    }

    .button-position-s {
        margin-top: -35px;
        float: right;
        position: relative;

    }

    .span-float-left {
        float: right;
        position: relative;
        margin: -20px 80px;
    }

    .span-float-right {
        float: right;
        position: relative;
        margin: -20px 80px;
    }

    .div-vertical {
        margin: 0 1.5% 0 1.5%;
        display: inline-block;
        width: 2px;
        height: 50px;
        background: rgba(238, 238, 238, 1);
        border-radius: 1px;
        vertical-align: middle;
    }

    .center {
        vertical-align: middle;
        margin-top: 20px;
    }

    .notice {
        margin-left: -150px;
        margin-right: -30px;
        height: 12px;
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(253, 51, 51, 1);
    }

    .input-line {
        display: inline;
        margin-left: -100px;
    }

    .button-line {
        margin-left: 20px;
        display: inline;
    }

    .crevice {
        margin-top: 5px;
    }

    .yj-panel {
        padding: 20px 30px;
        border-radius: 10px;
        background-color: #FFF;
        box-sizing: border-box;
        box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.05);

        .yj-title-area {
            position: relative;
            height: 30px;
            line-height: 30px;
            font-size: 20px;
            color: $-color-primary;

            &::before {
                content: '';
                position: absolute;
                top: 3px;
                left: -30px;
                width: 8px;
                height: 24px;
                border-radius: 2px;
                background-color: $-color-danger;
            }
        }

        .yj-sub-title-area {
            height: 21px;
            line-height: 21px;
            font-size: 14px;
            color: #999;
        }

        .yj-body-area {
            margin-top: 10px;
        }

        &.yj-auto-height {
            display: block;
        }

        &:not(.yj-auto-height) {
            display: flex;
            flex-direction: column;
            height: 100%;

            .yj-title-area, .yj-sub-title-area {
                flex: none;
            }

            .yj-body-area {
                flex: auto;
                height: 0;
            }
        }
    }
</style>
