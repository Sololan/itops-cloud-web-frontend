<template>
    <yj-drawer v-model="visible" title="添加监控授权" size="middle" @open="handleDrawerOpen" @close="handleDrawerClose">
        <el-form ref="monitorFormData" :model="monitorFormData" :rules="monitorFormRules"
                 label-width="110px">
            <div class="div-col-monitor">
                <el-form-item label="租户名称">
                    <el-input class="drawer-input" :disabled="true" v-model="currentOrgFullName"></el-input>
                </el-form-item>
            </div>
            <div class="div-col-monitor">
                <el-form-item label="开始日期" prop="startDate">
                    <el-date-picker class="drawer-input"
                                    v-model="monitorFormData.startDate"
                                    type="date"
                                    :picker-options="start_date"
                                    placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
            </div>
            <el-form-item label="截止日期" prop="endDate">
                <el-date-picker class="drawer-input"
                                v-model="monitorFormData.endDate"
                                type="date"
                                :picker-options="end_date"
                                placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <div class="dotted-line"/>
            </el-form-item>
            <el-form-item>
                <span class="second-title">监控设置</span>
            </el-form-item>
            <div class="div-col-monitor">
                <el-form-item label="硬件（个）" prop="hardwareQuantity">
                    <el-input class="drawer-input" v-model="monitorFormData.hardwareQuantity"
                              placeholder="请输入"/>
                </el-form-item>
            </div>
            <div class="div-col-monitor">
                <el-form-item label="操作系统（个）" prop="osQuantity">
                    <el-input class="drawer-input" v-model="monitorFormData.osQuantity"
                              placeholder="请输入"/>
                </el-form-item>
            </div>
            <div class="div-col-monitor">
                <el-form-item label="数据库（个）" prop="dbQuantity">
                    <el-input class="drawer-input" v-model="monitorFormData.dbQuantity"
                              placeholder="请输入"/>
                </el-form-item>
            </div>
            <div class="div-col-monitor">
                <el-form-item label="中间件（个）" prop="middlewareQuantity">
                    <el-input class="drawer-input" v-model="monitorFormData.middlewareQuantity"
                              placeholder="请输入"/>
                </el-form-item>
            </div>
            <div class="div-col-monitor">
                <el-form-item label="app（个）" prop="applicationQuantity">
                    <el-input class="drawer-input" v-model="monitorFormData.applicationQuantity"
                              placeholder="请输入"/>
                </el-form-item>
            </div>
            <div class="div-col-monitor">
                <el-form-item label="网络（个）" prop="networkQuantity">
                    <el-input class="drawer-input" v-model="monitorFormData.networkQuantity"
                              placeholder="请输入"/>
                </el-form-item>
            </div>
            <div class="div-col-monitor">
                <el-form-item label="存储（个）" prop="storageQuantity">
                    <el-input class="drawer-input" v-model="monitorFormData.storageQuantity"
                              placeholder="请输入"/>
                </el-form-item>
            </div>
        </el-form>
        <template #footer>
            <el-button type="primary" @click="saveMonitor('monitorFormData')">保存</el-button>
            <el-button type="info" @click="cancel">取消</el-button>
        </template>
    </yj-drawer>
</template>

<script lang="ts">
    import YjDrawer from '@/components/common/yj-drawer.vue'
    import {Component, Prop, Vue} from 'vue-property-decorator'
    import {ElForm} from "element-ui/types/form";
    import HttpUtil from "@/providers/utils/http-util";
    import {Gateway} from "@/providers/models/enums";
    import CommonUtil from "@/providers/utils/common-util";

    @Component({components: {YjDrawer}})
    export default class AuthMonitorDrawer extends Vue {

        @Prop() value: boolean;
        @Prop() currentOrgId: number = 0;
        @Prop() currentOrgFullName: string = '';

        get visible() {
            return this.value
        }

        set visible(visible) {
            this.$emit('input', visible)
        }

        /*添加监控授权数据*/
        monitorFormData = {
            orgId: '',
            startDate: '',
            endDate: '',
            hardwareQuantity: '',
            osQuantity: '',
            dbQuantity: '',
            middlewareQuantity: '',
            webQuantity: '',
            applicationQuantity: '',
            networkQuantity: '',
            storageQuantity: ''
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
                if (this.monitorFormData.endDate) {
                    return time.getTime() >= this.monitorFormData.endDate;
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
                return time.getTime() <= this.monitorFormData.startDate
            }
        };

        // 定义数字验证规则
        validateNumber = (rule: any, value: any, callback: any) => {
            if (!value) {
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

        /*表单验证*/
        monitorFormRules = {
            startDate: [
                {required: true, message: '请选择时间', trigger: 'change'}
            ],
            endDate: [
                {required: true, message: '请选择时间', trigger: 'change'}
            ],
            hardwareQuantity: {validator: this.validateNumber, trigger: 'blur'},
            osQuantity: {validator: this.validateNumber, trigger: 'blur'},
            dbQuantity: {validator: this.validateNumber, trigger: 'blur'},
            middlewareQuantity: {validator: this.validateNumber, trigger: 'blur'},
            webQuantity: {validator: this.validateNumber, trigger: 'blur'},
            applicationQuantity: {validator: this.validateNumber, trigger: 'blur'},
            networkQuantity: {validator: this.validateNumber, trigger: 'blur'},
            storageQuantity: {validator: this.validateNumber, trigger: 'blur'},
        };

        saveMonitor(formName: any): void {
            (this.$refs[formName] as ElForm).validate((valid) => {
                if (!valid) {
                    return false;
                } else {
                    HttpUtil.post({
                        api: 'monitorLicenses',
                        gateway: Gateway.Bs,
                        body: {
                            orgId: this.currentOrgId,
                            startDate: CommonUtil.timeFormat(this.monitorFormData.startDate, 'yyyy-MM-dd HH:mm:ss'),
                            endDate: CommonUtil.timeFormat(this.monitorFormData.endDate, 'yyyy-MM-dd HH:mm:ss'),
                            hardwareQuantity: this.monitorFormData.hardwareQuantity ? this.monitorFormData.hardwareQuantity : 0,
                            osQuantity: this.monitorFormData.osQuantity ? this.monitorFormData.osQuantity : 0,
                            dbQuantity: this.monitorFormData.dbQuantity ? this.monitorFormData.dbQuantity : 0,
                            middlewareQuantity: this.monitorFormData.middlewareQuantity ? this.monitorFormData.middlewareQuantity : 0,
                            webQuantity: this.monitorFormData.webQuantity ? this.monitorFormData.webQuantity : 0,
                            applicationQuantity: this.monitorFormData.applicationQuantity ? this.monitorFormData.applicationQuantity : 0,
                            networkQuantity: this.monitorFormData.networkQuantity ? this.monitorFormData.networkQuantity : 0,
                            storageQuantity: this.monitorFormData.storageQuantity ? this.monitorFormData.storageQuantity : 0,
                            usedApplicationQuantity: 0,
                            usedDbQuantity: 0,
                            usedHardwareQuantity: 0,
                            usedMiddlewareQuantity: 0,
                            usedNetworkQuantity: 0,
                            usedOsQuantity: 0,
                            usedStorageQuantity: 0,
                            usedWebQuantity: 0,
                        }
                    }).then((data) => {
                        this.$emit('success');
                        this.visible = false
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
            (this.$refs.monitorFormData as ElForm).resetFields();
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

    .dotted-line {
        margin-left: -110px;
        margin-top: 20px;
        border-bottom: 1px solid rgba(153, 153, 153, 1);
        border-bottom-style: dashed;
    }

    .drawer-font {
        width: 56px;
        height: 14px;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
    }

    .drawer-input {
        width: 190px;
        height: 32px;
    }


    .drawer-block {
        margin-top: 41px;
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
        display: inline;
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

    .div-col-monitor {
        width: 50%;
        display: inline-block;
    }
</style>
