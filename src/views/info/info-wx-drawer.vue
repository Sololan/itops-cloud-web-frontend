<template>
    <yj-drawer v-model="visible" title="修改个人信息" @open="handleDrawerOpen" @close="handleDrawerClose">
        <el-form ref="infoFormData"
                 label-width="180px">
            <el-form-item>
                <span class="second-title">绑定微信公众号</span>
            </el-form-item>
            <el-form-item>
                <el-input class="drawer-input input-line" :disabled="true" :value="this.title()" >
                </el-input>
                <el-button class="button-line" type="primary" @click="unBind">解除绑定</el-button>
            </el-form-item>
            <el-form-item>
                <div class="notice">注：绑定微信公众号,在开通微信时,用于接收微信通知</div>
            </el-form-item>
            <el-form-item>
                <img class="img" src="../../assets/images/wechat-QR.png"/>
            </el-form-item>
        </el-form>
    </yj-drawer>
</template>

<script lang="ts">
    import YjDrawer from '@/components/common/yj-drawer.vue'
    import {Component, Prop, Vue} from 'vue-property-decorator'
    import {ElForm} from 'element-ui/types/form';
    import UsersService from '@/providers/services/uc/users-service';
    import NoticeUtil from '@/providers/utils/notice-util';
    import {CATCH_ERROR} from '@/providers/models/consts';
    import {PasswordModel} from '@/providers/models/uc/password-model';
    import {UserInfo} from '@/providers/models/uc/users-model';
    import User from "@/views/user/user.vue";

    @Component({components: {YjDrawer}})
    export default class InfoWxDrawer extends Vue {

        @Prop() value: boolean

        get visible() {
            return this.value
        }

        set visible(visible) {
            this.$emit('input', visible)
        }

        bindStatus = false;
        title(){
            if(this.bindStatus){
                return '迎嘉运维平台';
            }else {
                return ''
            }
        }


        isBind() {
            UsersService.isBind(this.$store.state.userInfo.id).then((data: boolean) => {
                this.bindStatus = data;
            }).catch(CATCH_ERROR)
        }

        unBind() {
            if (this.bindStatus) {
                NoticeUtil.showConfirm('是否取消绑定').then(() => {
                    UsersService.unBind(this.$store.state.userInfo.id).then(() => {
                        NoticeUtil.showMsg('解绑成功');
                        this.isBind()
                    }).catch(CATCH_ERROR)
                });
            } else {
                NoticeUtil.showMsg('未绑定公众号');
            }
        }

        handleDrawerOpen(){
            this.isBind()
        }

        handleDrawerClose(){
            this.$emit('success');
        }
    }
</script>

<style scoped lang="scss">

    .dotted-line {
        margin-left: -180px;
        border-bottom: 1px solid rgba(153, 153, 153, 1);
        border-bottom-style: dashed;
    }

    .second-title {
        margin-left: -180px;
        float: left;
        display: block;
        height: 14px;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        margin-bottom: 30px;
    }

    .notice {
        margin-left: -80px;
        margin-right: -30px;
        margin-top: -10px;
        height: 12px;
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(253, 51, 51, 1);
    }

    .input-line {
        display: inline-block;
        margin-left: -100px;
    }

    .button-line {
        margin-left: 20px;
        display: inline-block;
    }

    .drawer-input {
        width: 70%;
    }

    .img {
        margin-left: -55px;
    }

</style>
