import {DateFormat} from '@/providers/models/enums'
<template>
    <yj-drawer v-model="visible" class="drawer" size="middle" title="添加通知授权" @open="handleDrawerOpen"
               @close="handleDrawerClose">
        <el-form ref="noticeFormData" :model="noticeFormData" :rules="noticeFormRules"
                 label-width="110px">
            <div class="div-col-notice">
                <el-form-item label="租户名称" prop="fullName">
                    <el-input class="drawer-input" :disabled="true" v-model="currentOrgFullName"
                              placeholder="请输入"/>
                </el-form-item>
            </div>
            <div class="div-col-notice">
                <el-form-item label="开始日期" prop="startDate">
                    <el-date-picker class="drawer-input" v-model="noticeFormData.startDate"
                                    type="date"
                                    :picker-options="start_date"
                                    placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
            </div>
            <el-form-item label="截止日期" prop="endDate">
                <el-date-picker class="drawer-input"
                                v-model="noticeFormData.endDate"
                                type="date"
                                :picker-options="end_date"
                                placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <div class="dotted-line"/>
            </el-form-item>
            <el-form-item>
                <span class="second-title">通知设置</span>
            </el-form-item>
            <div class="div-line-left">
                <img class="table-icon-left" src="../../assets/images/wechat-icon.png"/>
                <el-form-item class="item-style" label="微信" prop="isWx">
                    <el-switch
                            v-model="noticeFormData.isWx"
                            active-color="#4A8DF0"
                            inactive-color="#999999">
                    </el-switch>
                </el-form-item>
            </div>
            <div class="div-line-right">
                <img class="table-icon-left" src="../../assets/images/email-icon.png" alt=""/>
                <el-form-item class="item-style" label="邮件" prop="isEmail">
                    <el-switch
                            v-model="noticeFormData.isEmail"
                            active-color="#4A8DF0"
                            inactive-color="#999999">
                    </el-switch>
                </el-form-item>
            </div>
            <div class="div-line-left">
                <img class="table-icon-left" src="../../assets/images/message-icon.png" alt=""/>
                <el-form-item class="item-style" label="短信" prop="msgQuantity">
                    <el-switch
                            v-model="noticeFormData.isMsg"
                            active-color="#4A8DF0"
                            inactive-color="#999999">
                    </el-switch>
                    <el-input class="switch" :disabled="!noticeFormData.isMsg" v-model="noticeFormData.msgQuantity"
                              placeholder="请输入">
                        <template slot="append">条</template>
                    </el-input>
                </el-form-item>
            </div>
            <div class="div-line-right">
                <img class="table-icon-left" src="../../assets/images/phone-icon.png" alt=""/>
                <el-form-item class="item-style" label="电话" prop="phoneQuantity">
                    <el-switch
                            v-model="noticeFormData.isPhone"
                            active-color="#4A8DF0"
                            inactive-color="#999999">
                    </el-switch>
                    <el-input class="switch" :disabled="!noticeFormData.isPhone"
                              v-model="noticeFormData.phoneQuantity"
                              placeholder="请输入">
                        <template slot="append">条</template>
                    </el-input>
                </el-form-item>
            </div>
        </el-form>
        <template #footer>
            <el-button type="primary" @click="saveNotice('noticeFormData')">保存</el-button>
            <el-button type="info" @click="cancel">取消</el-button>
        </template>
    </yj-drawer>
</template>

<script lang="ts">
    import YjDrawer from '@/components/common/yj-drawer.vue'
    import {Component, Prop, Vue} from 'vue-property-decorator'
    import {ElForm} from 'element-ui/types/form'
    import HttpUtil from '@/providers/utils/http-util'
    import {DateFormat, Gateway} from '@/providers/models/enums'
    import CommonUtil from '@/providers/utils/common-util'

    @Component({components: {YjDrawer}})
    export default class AuthMonitorDrawer extends Vue {

        @Prop() value: boolean;
        @Prop() currentOrgId: number = 0;
        @Prop() currentOrgFullName: string = '';
        curDate: any;

        get visible() {
            return this.value
        }

        set visible(visible) {
            this.$emit('input', visible)
        }

        /*添加通知授权数据*/
        noticeFormData = {
            orgId: '',
            startDate: '',
            endDate: '',
            isEmail: 0,
            isMsg: 0,
            isPhone: 0,
            isWx: 0,
            msgQuantity: '',
            phoneQuantity: '',
        };





        // 日期验证
        start_date = {
            disabledDate: (time: any) => {
                const now = new Date();
                now.setHours(0);
                now.setMinutes(0);
                now.setSeconds(0);
                now.setMilliseconds(0);
                if (time.getTime() < now.getTime()) {
                    return true
                }
                if (this.noticeFormData.endDate) {
                    return time.getTime() >= this.noticeFormData.endDate;
                }
            }
        };
        end_date = {
            disabledDate: (time: any) => {
                const now = new Date();
                now.setHours(0);
                now.setMinutes(0);
                now.setSeconds(0);
                now.setMilliseconds(0);
                if (time.getTime() <= now.getTime()) {
                    return true
                }
                return time.getTime() <= this.noticeFormData.startDate
            }
        };

        validateMsgQuantity = (rule: any, value: any, callback: any) => {
            if (!this.noticeFormData.isMsg) {
                callback()
            } else {
                const reg = /^[1-9]\d{0,5}$/;
                if (!reg.test(value)) {
                    callback(new Error('请输入整数，且不要超过六位,不要以零开头'))
                } else {
                    callback()
                }
            }
        };

        validatePhoneQuantity = (rule: any, value: any, callback: any) => {
            if (!this.noticeFormData.isPhone) {
                callback()
            } else {
                const reg = /^[1-9]\d{0,5}$/;
                if (!reg.test(value)) {
                    callback(new Error('请输入整数，且不要超过六位,不要以零开头'))
                } else {
                    callback()
                }
            }
        };


        noticeFormRules = {
            startDate: [
                {required: true, message: '请选择时间', trigger: 'change'},
            ],
            endDate: [
                {required: true, message: '请选择时间', trigger: 'change'},
            ],
            msgQuantity: [
                {validator: this.validateMsgQuantity, trigger: 'change'},
            ],
            phoneQuantity: [
                {validator: this.validatePhoneQuantity, trigger: 'change'},
            ],
        };

        saveNotice(formName: any): void {
            (this.$refs[formName] as ElForm).validate((valid) => {
                if (!valid) {
                    return false;
                } else {
                    HttpUtil.post({
                        api: 'warningMsgLicense/monitorLicenses',
                        gateway: Gateway.Bs,
                        body: {
                            orgId: this.currentOrgId,
                            startDate: CommonUtil.timeFormat(this.noticeFormData.startDate, 'yyyy-MM-dd HH:mm:ss'),
                            endDate: CommonUtil.timeFormat(this.noticeFormData.endDate, 'yyyy-MM-dd HH:mm:ss'),
                            isEmail: this.noticeFormData.isEmail ? 1 : 0,
                            isMsg: this.noticeFormData.isMsg ? 1 : 0,
                            isPhone: this.noticeFormData.isPhone ? 1 : 0,
                            isWx: this.noticeFormData.isWx ? 1 : 0,
                            msgQuantity: this.noticeFormData.msgQuantity ? this.noticeFormData.msgQuantity : 0,
                            phoneQuantity: this.noticeFormData.phoneQuantity ? this.noticeFormData.phoneQuantity : 0,
                            usedMsgQuantity: 0,
                            usedPhoneQuantity: 0
                        }
                    }).then((data) => {
                        this.$emit('success');
                        this.visible = false;
                        this.$message({
                            message: '保存成功',
                            type: 'success'
                        });
                    }).catch((error) => {
                        console.log(error)
                        this.$message({
                            message: '保存失败',
                            type: 'error'
                        });
                    })
                }
            });
        }

        handleDrawerClose() {
            console.log(new Date(CommonUtil.timeFormat(this.noticeFormData.startDate,DateFormat.Date)))
            console.log(new Date(CommonUtil.timeFormat(new Date(),DateFormat.Date)));
            console.log(new Date(CommonUtil.timeFormat(new Date(),DateFormat.Date)) <= new Date(CommonUtil.timeFormat(this.noticeFormData.startDate,DateFormat.Date)));
            (this.$refs.noticeFormData as ElForm).resetFields();
        }

        handleDrawerOpen(): void {
        }

        cancel() {
            this.visible = false
        }
    }
</script>

<style scoped lang="scss">

    .is-active {
        background-color: #EAEDF4;
    }

    .yj-body-area {
        flex: auto;
        height: 0;
        min-height: 143px;
    }

    .tenant {
        background: rgba(234, 244, 254, 1);
    }

    .tenant-title {
        width: 100%;
        height: 60px;
        background: rgba(8, 3, 103, 1);
        border-radius: 10px 10px 0px 0px;
        text-align: center;
    }

    .title-font {
        width: 64px;
        height: 16px;
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        line-height: 60px;
        color: rgba(255, 255, 255, 1);
    }

    .table-icon-left {
        display: inline-block;
        margin-right: -60px;
        margin-left: 80px;
    }

    .table-icon-right {
        display: inline-block;
        margin-right: -150px;
        margin-left: 80px;
    }

    .dotted-line {
        margin-left: -110px;
        margin-top: 20px;
        border-bottom: 1px solid rgba(153, 153, 153, 1);
        border-bottom-style: dashed;
    }

    .drawer-input {
        width: 190px;
        height: 32px;
    }

    .drawer-font {
        width: 56px;
        height: 14px;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
    }

    .drawer-block {
        margin-top: 41px;
    }

    .div-line-left {
        width: 50%;
        display: inline-block;
        margin-left: -50px;
    }

    .div-line-right {
        width: 50%;
        display: inline-block;
    }

    .second-title {
        margin-top: -20px;
        margin-left: -110px;
        float: left;
        display: block;
        width: 56px;
        height: 14px;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
    }

    .switch {
        /*display: inline;*/
        width: 150px;
    }

    .table-span {
        width: 20%;
        display: inline-block;
    }

    .table-span-color {
        color: #080367;
    }

    .on {
        background: rgba(234, 244, 254, 1);
    }

    .item-style {
        display: inline-block;
    }

    .div-col-notice {
        width: 50%;
        display: inline-block;
    }
</style>
