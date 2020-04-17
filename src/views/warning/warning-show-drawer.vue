<template>
    <yj-drawer title="告警详细"
               v-model="visible"
               @open="handleDrawerOpen">
        <el-form :model="formWarningDrawer" label-width="205px" class="yj-detail-form p-b-10 p-t-10">
            <el-form-item prop="warningCode" label="告警编号">
                <label style="width: 190px"> {{ formWarningDrawer.warningCode }}</label>
            </el-form-item>
            <el-form-item prop="warningLevelName" label="告警级别">
                <label style="width: 190px" :class="getWarningLevelNameStyle(formWarningDrawer.warningLevelName)"> {{ formWarningDrawer.warningLevelName }}</label>
            </el-form-item>
            <el-form-item prop="warningInfo" label="告警内容">
                <div style="width: 190px" class="textWarning">{{ formWarningDrawer.warningInfo }}</div>
            </el-form-item>
            <el-form-item prop="ipAddress" label="IP地址">
                <label style="width: 190px"> {{ formWarningDrawer.ipAddress }}</label>
            </el-form-item>
            <el-form-item prop="warningTime" label="告警时间">
                <label style="width: 190px"> {{ formWarningDrawer.warningTime }}</label>
            </el-form-item>
            <el-form-item prop="warningTime" label="告警时长">
                <label style="width: 190px"> {{ countWarningTime(formWarningDrawer.warningTime, formWarningDrawer.closeTime) }}</label>
            </el-form-item>
            <el-form-item prop="warningStatus" label="告警状态">
                <label style="width: 190px"> {{ formWarningDrawer.warningStatus == 0?'未关闭':'已关闭' }}</label>
            </el-form-item>
            <el-form-item prop="users" label="通知人">
                <label style="width: 190px"> {{ formWarningDrawer.users }}</label>
            </el-form-item>
            <el-form-item prop="closeTime" label="解决时间">
                <label style="width: 190px"> {{ formWarningDrawer.closeTime }}</label>
            </el-form-item>

        </el-form>

        <template #footer>
            <el-button @click="closeWarningDrawer" type="primary">关 闭</el-button>
        </template>
    </yj-drawer>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import YjDrawer from '../../components/common/yj-drawer.vue';
    import {WarningParam} from '@/providers/models/bs/warning-model';
    import WarningService from '@/providers/services/bs/warning-service';
    import {CATCH_ERROR} from '@/providers/models/consts';

    @Component({components: {YjDrawer}})
    export default class WarningDrawer extends Vue {
        @Prop() visibles: boolean
        @Prop() formDrawerData: WarningParam

        get visible() {return this.visibles}
        set visible(visibles) {this.$emit('input', visibles)}

        // 弹窗变量
        formWarningDrawer: WarningParam = {
            id: null,
            orgId: null,
            warningCode: '',
            warningLevel: null,
            warningInfo: '',
            ipAddress: '',
            warningTime: '',
            warningStatus: '',
            closeTime: '',
            equipmentId: null,
            monitorId: null,
            users: '',
            warningLevelName: ''
        }

        // 关闭弹窗
        closeWarningDrawer() {
            this.$emit('input')
        }

        // 打开弹窗
        handleDrawerOpen() {
            WarningService.getWarning(this.formDrawerData.id)
            .then((res: WarningParam) => {
                this.formDrawerData.users = '无'
                this.formWarningDrawer = res === null ? this.formDrawerData : res
                this.formWarningDrawer.warningLevelName = this.formDrawerData.warningLevelName
            })
            .catch(CATCH_ERROR)
        }

        /* 设置告警级别颜色 */
        getWarningLevelNameStyle(warningLevelName: string) {
            return (warningLevelName === '提醒') ? 'remindClass' : (warningLevelName === '预告' ? 'preClass' : 'strictClass')
        }

        // 告警时长
        countWarningTime(startTime: string, endTime: string) {

            // 转换成日期形式
            const startDate = new Date(startTime);
            let endDate;
            if(endTime == null || endTime == ''){
                endDate = new Date();
            }else {
                endDate = new Date(endTime);
            }
            const diff = endDate.getTime() - startDate.getTime(); // 时间差的毫秒数

            // 计算出相差天数
            const days = Math.floor(diff / (24 * 3600 * 1000));

            // 计算出小时数
            const leave1 = diff % (24 * 3600 * 1000);    // 计算天数后剩余的毫秒数
            const hours = Math.floor(leave1 / (3600 * 1000));

            // 计算相差分钟数
            const leave2 = leave1 % ( 3600 * 1000);        // 计算小时数后剩余的毫秒数
            const minutes = Math.floor(leave2 / (60 * 1000));

            // 计算相差秒数
            const leave3 = leave2 % (60 * 1000);      // 计算分钟数后剩余的毫秒数
            const seconds = Math.round(leave3 / 1000);

            let returnStr = seconds + '秒';

            if (minutes > 0) {
                returnStr = minutes + '分' + returnStr;
            }

            if (hours > 0) {
                returnStr = hours + '小时' + returnStr;
            }

            if (days > 0 ) {
                returnStr = days + '天' + returnStr;
            }

            return returnStr;
        }
    }
</script>

<style scoped>
    .remindClass{
        color: #04FFFD;
    }
    .preClass{
        color: #FFDD00;
    }
    .strictClass{
        color: #E70012;
    }
    .textWarning {
        width: 100%;
        word-wrap:break-word
    }
</style>
