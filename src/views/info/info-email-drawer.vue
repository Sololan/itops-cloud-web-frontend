<template>
    <yj-drawer v-model="visible" title="修改个人信息" @open="handleDrawerOpen" @close="handleDrawerClose">
        <el-form ref="infoFormData" :model="infoFormData" :rules="infoFormRules"
                 label-width="180px">
            <el-form-item label="邮箱" prop="email">
                <el-input class="drawer-input" v-model="infoFormData.email"
                          placeholder="请输入"/>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" @click="saveInfo('infoFormData')">保存</el-button>
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
    export default class InfoEmailDrawer extends Vue {

        @Prop() value: boolean

        get visible() {
            return this.value
        }

        set visible(visible) {
            this.$emit('input', visible)
        }


        roleList = {
            name: ''
        };

        userInfo: UserInfo = {
            fullName: '',
            username: '',
            roleList: [this.roleList],
            phone: 0,
            email: '',
        };

        infoFormData = {
            id: this.$store.state.userInfo.id,
            fullName: '',
            username: '',
            phone: '',
            email: '',
        };
        // 定义电话验证规则
        validatePhone = (rule: any, value: any, callback: any) => {
            if (value === '' || value === undefined) {
                callback()
            } else {
                const reg = /^1[3456789]\d{9}$/;
                if (!reg.test(value)) {
                    callback(new Error('请输入正确电话格式'))
                } else {
                    callback()
                }
            }
        };

        /*表单验证*/
        infoFormRules = {
            email: [{required: true, message: '请输入邮箱', trigger: 'blur'},
                {type: 'email', message: '请输入正确的邮箱', trigger: ['blur']},
                {min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur'}
            ],
        };

        handleDrawerClose() {
            (this.$refs.infoFormData as ElForm).resetFields();
        }

        handleDrawerOpen(): void {
            UsersService.getUserInfoById(this.$store.state.userInfo.id).then((data: any) => {
                this.infoFormData = data;
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
                    UsersService.updateUser(this.infoFormData).then(() => {
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

</style>