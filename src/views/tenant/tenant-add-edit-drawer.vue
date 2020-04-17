
<template>
    <yj-drawer v-model="visible"
               :title="title"
               @open="handleDrawerOpen"
               @close="handleDrawerClose">
        <el-form :model="formDrawerData" ref="formDrawerData" :rules="rules" label-width="205px" class="p-t-10 p-b-10">
            <el-form-item prop="id" label="租户ID" hidden>
                <el-input style="width: 190px" v-model="formDrawerData.id"></el-input>
            </el-form-item>
            <el-form-item prop="fullName" label="租户名称">
                <el-input style="width: 190px" :disabled="flag" v-model="formDrawerData.fullName" placeholder="请输入租户名称" maxlength="100"></el-input>
            </el-form-item>
            <el-form-item prop="contact" label="联系人">
                <el-input style="width: 190px" v-model="formDrawerData.contact" placeholder="请输入联系人" maxlength="50"></el-input>
            </el-form-item>
            <el-form-item prop="phone" label="联系电话">
                <el-input style="width: 190px" v-model="formDrawerData.phone" placeholder="请输入联系电话" maxlength="50"></el-input>
            </el-form-item>
            <el-form-item prop="email" label="邮箱">
                <el-input style="width: 190px" v-model="formDrawerData.email" type="email" placeholder="请输入邮箱" maxlength="50"></el-input>
            </el-form-item>
            <el-form-item prop="address" label="地址">
                <el-input style="width: 190px" v-model="formDrawerData.address" placeholder="请输入地址" maxlength="200"></el-input>
            </el-form-item>
        </el-form>

        <template #footer>
            <el-button type="primary" @click="submitFormDrawer"  :loading="loading">{{ loading ? '提交中 ...' : '保存' }}</el-button>
            <el-button type="info" @click="handleDrawerClose">取消</el-button>
        </template>
    </yj-drawer>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator'
    import YjDrawer from '@/components/common/yj-drawer.vue'
    import {TenantParam} from '@/providers/models/bs/tenant-model'
    import {ElForm} from 'element-ui/types/form'
    import TenantService from '@/providers/services/bs/tenant-service'
    import NoticeUtil from '@/providers/utils/notice-util'
    import {CATCH_ERROR} from '@/providers/models/consts'

    @Component({components: {YjDrawer}})
    export default class TenantDrawer extends Vue {
        @Prop() formDrawerData: TenantParam  // 弹窗数据
        @Prop() id: number  // 租户id
        @Prop() visibles: boolean

        get visible() {return this.visibles}
        set visible(visibles) {this.$emit('input', visibles)}

        // 变量区
        flag = false;
        title: string =  '租户添加'
        loading = false
        formName: string = 'formDrawerData'
        addTenantTemp = {
            address: '',
            code: '',
            contact: '',
            email: '',
            fullName: '',
            id: 0,
            orgId: '',
            phone: '',
            pid: 0,
            sort: 0,
            status: 0
        }

        // 定义电话验证规则
        validMobile = (rule: any, value: any, callback: any) => {
            if (value === '' || value === undefined) {
                callback()
            } else {
                const reg = /^1[3456789]\d{9}$/
                if (!reg.test(value)) {
                    callback(new Error('请输入正确电话格式'))
                } else {
                    callback()
                }
            }
        };
        rules = {
            fullName: [
                {required: true, message: '租户名不能为空', trigger: 'blur' },
                {max: 100, message: '最大长度为100个字符', trigger: 'blur'}
            ],
            contact: [
                {required: true, message: '联系人不能为空', trigger: 'blur' },
                {max: 50, message: '最大长度为50个字符', trigger: 'blur'}
            ],
            phone: [
                {required: true, message: '联系电话不能为空', trigger: 'blur' },
                {validator: this.validMobile, trigger: 'blur'},
                {max: 50, message: '最大长度为50个字符', trigger: 'blur'}
            ],
            email: [
                {required: true, message: '邮箱不能为空', trigger: 'blur' },
                {type: 'email', message: '请输入正确邮箱格式', trigger: 'blur'},
                {max: 50, message: '最大长度为50个字符', trigger: 'blur'}
            ],
            address: [
                {max: 200, message: '最大长度为200个字符', trigger: 'blur'}
            ]
        }

        // 抽屉打开事件
        handleDrawerOpen() {
            this.formDrawerData.id !== 0 ? this.title = '租户编辑': this.title = '租户添加'
            if (this.formDrawerData.id !== 0) {
                this.flag = true
                TenantService.getTenant(this.formDrawerData.id)
                .then((res: TenantParam) => {
                    this.formDrawerData = res
                })
                .catch(CATCH_ERROR)
            } else {
                this.flag = false
                this.$emit('clearDrawerData')
            }
        }

        // 抽屉关闭事件
        handleDrawerClose() {
            this.$emit('input'),  // 关闭弹窗
            this.$emit('clearDrawerData'),  // 清空表格
            (this.$refs[this.formName] as ElForm).clearValidate();  // 清空验证信息
        }

        // 提交按钮
        submitFormDrawer() {
            (this.$refs[this.formName] as ElForm).validate((valid: boolean) => {
                    if (!valid) {
                        return false
                    }
                    if (this.formDrawerData.id > 0) {
                        TenantService.updateTenant(this.formDrawerData.id, this.formDrawerData)
                        .then(() => {
                            NoticeUtil.showMsg('更新成功!')
                            this.$emit('clearDrawerData')
                            this.$emit('initTenantData')  // 重新加载父页面数据
                            this.$emit('input'),
                            (this.$refs[this.formName] as ElForm).clearValidate();
                        })
                        .catch(CATCH_ERROR)
                    } else {
                        this.addTenantTemp.pid = -1
                        this.addTenantTemp.code = 'default'
                        this.addTenantTemp.fullName = this.formDrawerData.fullName
                        this.addTenantTemp.contact = this.formDrawerData.contact
                        this.addTenantTemp.phone = this.formDrawerData.phone
                        this.addTenantTemp.email = this.formDrawerData.email
                        this.addTenantTemp.address = this.formDrawerData.address
                        TenantService.addTenant(this.addTenantTemp)
                            .then(() => {
                                NoticeUtil.showMsg('添加成功!')
                                this.$emit('clearDrawerData')
                                this.$emit('initTenantData')  // 重新加载父页面数据
                                this.$emit('input'),
                                (this.$refs[this.formName] as ElForm).clearValidate();
                            })
                            .catch(CATCH_ERROR)
                    }
            })
        }

    }
</script>

<style scoped lang="css">

</style>
