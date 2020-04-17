<template>
    <yj-drawer v-model="visible" title="修改密码" @open="handleDrawerOpen" @close="handleDrawerClose">
        <el-form ref="pwd" :model="pwd" :rules="infoFormRules"
                 label-width="180px">
            <el-form-item label="原密码" prop="originPwd">
                <el-input type="password" class="drawer-input" show-password
                          v-model="pwd.originPwd"
                          placeholder="请输入"/>
            </el-form-item>
            <el-form-item label="新密码" prop="newPwd">
                <el-input type="password" class="drawer-input" show-password v-model="pwd.newPwd"
                          autocomplete="off"
                          placeholder="请输入"/>
            </el-form-item>
            <el-form-item label="重复新密码" prop="repeatPwd">
                <el-input type="password" class="drawer-input" show-password v-model="pwd.repeatPwd"
                          autocomplete="off"
                          placeholder="请输入"/>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" @click="saveInfo('pwd')">保存</el-button>
            <el-button type="info" @click="cancel">取消</el-button>
        </template>
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

    @Component({components: {YjDrawer}})
    export default class InfoPasswordDrawer extends Vue {

        @Prop() value: boolean

        get visible() {
            return this.value
        }

        set visible(visible) {
            this.$emit('input', visible)
        }

        pwd: PasswordModel = {
            id: this.$store.state.userInfo.id,
            originPwd: '',
            newPwd: '',
            repeatPwd: '',
        };

        validateOriginPass = (rule: any, value: string, callback: (arg0?: Error) => void) => {
            if (value) {
                callback(new Error('请输入原密码'));
            } else {
                callback();
            }
        };

        validatePassword = (rule: any, value: string, callback: (arg0?: Error) => void) => {
            this.pwd.newPwd = value;
            if (this.pwd.repeatPwd) {
                (this.$refs.pwd as ElForm).validateField('repeatPwd');
            }
            callback();
        };

        validateRepeatPass = (rule: any, value: string, callback: (arg0?: Error) => void) => {
            if (value !== this.pwd.newPwd) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };

        /*表单验证*/
        infoFormRules = {
            originPwd: [{required: true, message: '原密码不能为空', trigger: 'blur'},
                {min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur'}
            ],
            newPwd: [{required: true, message: '密码不能为空', trigger: 'blur'},
                {min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur'},
                {validator: this.validatePassword, trigger: 'blur'}],
            repeatPwd: [{required: true, message: '重复密码不能为空', trigger: 'blur'},
                {min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur'},
                {validator: this.validateRepeatPass, trigger: 'blur'},]
        };

        handleDrawerClose() {
            (this.$refs.infoFormRules as ElForm).resetFields();
        }

        handleDrawerOpen(): void {
            UsersService.getUserInfoById(this.$store.state.userInfo.id).then((data: any) => {
                this.pwd = data;
            });
        }

        cancel() {
            this.visible = false
        }

        saveInfo(formName: any) {
            (this.$refs[formName] as ElForm).validate((valid) => {
                if (!valid) {
                    return false;
                } else {
                    UsersService.changePwd(this.pwd).then(() => {
                        NoticeUtil.showMsg('保存成功');
                        this.$emit('success');
                        this.cancel()
                    }).catch(CATCH_ERROR)
                }
            });
        }
    }
</script>

<style scoped lang="scss">

    .dotted-line {
        margin-left: -180px;
        margin-right: -30px;
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

    .drawer-input {
        width: 70%;
    }

</style>