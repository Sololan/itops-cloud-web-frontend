import {NoticeType} from "@/providers/models/enums";
import {NoticeType} from "@/providers/models/enums";

<template>
  <yj-container>
        <div class="yj-panel" :class="{'yj-auto-height': true}">
            <div class="yj-title-area">
                工作时间
            </div>
            <div>
                <el-form :model="workTimeParam" ref="workTimeParam" rule = "rules">
                    <el-form-item hidden>
                        <el-input :model="workTimeParam.id"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <div>
                             <el-checkbox-group prop="checkedList" v-model="checkedList">
                                <el-checkbox label="周一"></el-checkbox>
                                <el-checkbox label="周二"></el-checkbox>
                                <el-checkbox label="周三"></el-checkbox>
                                <el-checkbox label="周四"></el-checkbox>
                                <el-checkbox label="周五"></el-checkbox>
                                <el-checkbox label="周六"></el-checkbox>
                                <el-checkbox label="周日"></el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </el-form-item>

                    <el-form-item label="选择时间" class="chooseTime">
                        <el-time-picker
                                v-model="workTimeParam.startTime"
                                format = 'HH:mm'
                                :picker-options="{
                                    format: 'HH:mm'
                                }"/>
                        -
                        <el-time-picker
                                v-model="workTimeParam.endTime"
                                format = 'HH:mm'
                                :picker-options="{
                                    format: 'HH:mm'
                                }"/>
                    </el-form-item>
                </el-form>
            </div>

            <div class="footer">
                <el-button type="primary" @click="saveWorkTime">保存</el-button>
                <el-button type="info" @click="resetWorkTime">重置</el-button>
            </div>

        </div>

  </yj-container>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator'
    import YjTable from '@/components/common/yj-table.vue'
    import YjContainer from '@/components/common/yj-container.vue'
    import YjTableSearch from '@/components/common/yj-table-search.vue'
    import YjTableOperate from '@/components/common/yj-table-operate.vue'
    import NoticeUtil from '@/providers/utils/notice-util';
    import WorkTimeService from '@/providers/services/bs/worktime-service';
    import {WorkTimeParam} from '@/providers/models/bs/worktime-model';
    import {NoticeType} from '@/providers/models/enums'
    import {CATCH_ERROR} from '@/providers/models/consts';
    import YjPanel from '@/components/common/yj-panel.vue';


    @Component({components: {YjPanel, YjTable, YjContainer, YjTableSearch, YjTableOperate}})
  export default class WorkTime extends Vue {

      // 变量区
      workTimeParam: WorkTimeParam = { // 工作时间
          id: 0,
          orgId: null,
          week: '',
          startTime: '2020-02-26 08:30:00',
          endTime: '2020-02-26 17:30:00'
      }
      checkedList = ['周一', '周二', '周三', '周四', '周五']


     // 保存按钮事件
      saveWorkTime() {
          // 将数组转成后端可接收的字符串
          this.workTimeParam.week = this.checkedList.toString()

          // 工作日不为空
          if (this.workTimeParam.week === '') {
              NoticeUtil.showAlert('请选择工作日', '提示', NoticeType.Error)
              return false;
          }

          // 将日期格式化成我们想要的格式
          this.workTimeParam.startTime = this.dateFormat(this.workTimeParam.startTime)
          this.workTimeParam.endTime  = this.dateFormat(this.workTimeParam.endTime)

          // 工作时间不为空
          if (this.workTimeParam.endTime === '1970-1-1 8:0:0' || this.workTimeParam.startTime === '1970-1-1 8:0:0') {
              NoticeUtil.showAlert('工作起止时间不能为空, 请重新设置', '提示', NoticeType.Error)
                  .then(() => {
                      this.getInitWorkTime()
                  })
                  .catch(CATCH_ERROR)
              return false
          }

          // 起始时间不能大于终止时间
          if (new Date(this.workTimeParam.startTime) > new Date(this.workTimeParam.endTime)) {
              NoticeUtil.showAlert('起止时间不能大于终止时间, 请重新设置', '提示', NoticeType.Error)
                  .then(() => {
                      this.getInitWorkTime()
                  })
                  .catch(CATCH_ERROR)
              return false;
          }

          // 更新工作时间
          WorkTimeService.updateWorkTime(this.workTimeParam)
          .then(() => {
              NoticeUtil.showMsg('修改成功')
          })
          .catch(CATCH_ERROR)
      }

      // 重置按钮事件
      resetWorkTime() {
          NoticeUtil.showConfirm('确定要重置工作时间吗？', '重置提示')
          .then(() => {
              WorkTimeService.getWorkTime()
                  .then((res: WorkTimeParam) => {
                          this.workTimeParam = res
                          this.checkedList = res.week.split(',')
                          NoticeUtil.showMsg('工作时间重置成功')
                          .catch(CATCH_ERROR)
                      }
                  )
                  .catch(CATCH_ERROR)
          })
          .catch(CATCH_ERROR)
      }
      // 格式化时间
      dateFormat(date: string) {
          const date1 = new Date(date)
          const ymd = date1.getFullYear() + '-' +　(date1.getMonth() + 1) + '-' + date1.getDate()
          const hms = date1.getHours() + ':' + date1.getMinutes() + ':' + date1.getSeconds()
          return ymd + ' ' + hms
      }

      // 页面加载事件
      mounted() {
          WorkTimeService.getWorkTime()
          .then((res: WorkTimeParam) => {
              if (res === null) {
                  // 初始化插入数据
                  this.initInsertWorkTime()
              } else {
                  this.workTimeParam = res
                  this.checkedList = res.week.split(',')
              }
          })
          .catch(CATCH_ERROR)
      }

      // 初始化获取数据
        getInitWorkTime() {
            WorkTimeService.getWorkTime()
                .then((res: WorkTimeParam) => {
                    this.workTimeParam = res
                    this.checkedList = res.week.split(',')
                })
                .catch(CATCH_ERROR)
        }


      // 初始化插入数据
      initInsertWorkTime() {
        this.workTimeParam.orgId = this.$store.state.userInfo.topOrg.id
        this.workTimeParam.week = this.checkedList.toString()
        WorkTimeService.initWorkTime(this.workTimeParam)
          .then(() => {
              console.log('初始化工作时间成功')
          })
          .catch(CATCH_ERROR)
      }

  }
</script>

<style scoped lang="scss">
    @import "../../assets/styles/variable";
    .yj-panel {
        padding: 20px 30px;
        border-radius: 10px;
        background-color: #FFF;
        box-sizing: border-box;
        box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.05);
        height: 100%;
        position: relative;

        .yj-title-area {
            position: relative;
            height: 30px;
            line-height: 30px;
            font-size: 20px;
            color: $-color-primary;
            margin-bottom: 20px;

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
    }
    .chooseTime {
        margin-left: 30px;
    }
    .footer {
        position: absolute;
        bottom: 20px;
        left: 35%;
    }

</style>
