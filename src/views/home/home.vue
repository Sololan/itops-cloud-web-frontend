<template>
  <yj-container style="width: 100%">
<!--    40 500 20 1040 20-->
    <el-row :gutter="15">
      <el-col :span="8">
        <el-row>
          <yj-panel title="告警级别分析" class="left-panel" :sub-title="dateRange" :auto-height="true">
            <chart :option="levelOption" class="level-chart"></chart>
          </yj-panel>
        </el-row>
        <el-row>
          <!--          class="status-panel"-->
          <yj-panel title="告警状态分析" class="left-panel" :sub-title="dateRange" :auto-height="true">
            <div v-for="info in status">
              <div class="status-label">{{info.name}}</div>
              <el-progress
                  :stroke-width="26"
                  :percentage="info.num"
                  :color="info.color">
              </el-progress>
            </div>
          </yj-panel>
        </el-row>
      </el-col>

      <el-col :span="16">
        <el-row>
          <today-warning class="today-warning-panel" :levelList="levelList"></today-warning>
        </el-row>
        <el-row>
          <yj-panel class="info-panel" title="告警内容分析TOP10" :sub-title="dateRange" :auto-height="true">
            <yj-table class="info-table" :config="tableConfig" :disableRadius="true"></yj-table>
          </yj-panel>
        </el-row>
      </el-col>
    </el-row>

<!--    <div class="left-panel"></div>-->
<!--    <div class="right-panel"></div>-->
  </yj-container>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import YjContainer from '@/components/common/yj-container.vue'
  import YjPanel from '@/components/common/yj-panel.vue'
  import Chart from './chart.vue'
  import DictsService from '@/providers/services/uc/dicts-service'
  import {ColumnAlign, ColumnType, DictGroupKey} from '@/providers/models/enums'
  import WarningService from '@/providers/services/bs/warning-service'
  import {WarningQueryParam} from '@/providers/models/bs/warning-query-model'
  import YjTable from '@/components/common/yj-table.vue'
  import {TableConfig} from '@/providers/models/common/table-model'
  import {DictItem} from '@/providers/models/uc/dicts-model'
  import {WarningStatisticsModel} from '@/providers/models/bs/warning-statistics-model'
  import {State} from 'vuex-class'
  import {UserInfo} from '@/providers/models/uc/users-model'
  import moment from "moment";
  import {CATCH_ERROR} from '@/providers/models/consts'
  import TodayWarning from '@/views/home/today-warning.vue'

  @Component({
    components: {YjContainer, YjPanel, Chart, YjTable, TodayWarning}
  })
  export default class Home extends Vue {
    dateRange: string = '过去7天内'

    levelList: any[] = [
      {name: '提醒', color: 'rgba(4, 255, 253, 1)', src: require('@/assets/images/remind.png')},
      {name: '警告', color: 'rgba(255, 221, 0, 1)', src: require('@/assets/images/warning.png')},
      {name: '严重', color: 'rgba(231, 0, 18, 1)', src: require('@/assets/images/serious.png')},
    ]

    statusSum: number = 0
    status: any[] = [
      {name: '未关闭', num: 0, color: 'rgba(250,45,160,1)'},
      {name: '已关闭', num: 0, color: 'rgba(130,21,215,1)'}
    ]

    levelOption = {
      tooltip: {  //提示框组件
        trigger: 'item',  // 触发类型: item:数据项触发，axis：坐标轴触发
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'horizontal',
        left: 'center',
        bottom: 0,
        align: 'right',
        itemGap: 50,
        data: [this.levelList[0].name, this.levelList[1].name, this.levelList[2].name]
      },
      series: [
        {
          name: '告警级别',
          type: 'pie',
          width: '90%',
          height: '90%',
          center: ['55%', '50%'],
          // top: "middle",
          // left: "center",
          radius: ['50%', '70%'],
          hoverAnimation: false,
          label: {
            formatter: function(data: any) {
              return data.percent.toFixed(0) + '%'
            }
          },
          data: [
            {value: 0, name: this.levelList[0].name, itemStyle: {color: this.levelList[0].color}},
            {value: 0, name: this.levelList[1].name, itemStyle: {color: this.levelList[1].color}},
            {value: 0, name: this.levelList[2].name, itemStyle: {color: this.levelList[2].color}}
          ]
        }
      ]
    }

    @State
    private userInfo: UserInfo

    queryParam: WarningQueryParam = {
      orgId: 2,
      startTime: '2020-02-14 00:00:00',
      endTime: '2020-02-19 23:59:59',
      topNumber: 10
    }

    tableConfig: TableConfig = {
      table: {data: []},
      page: {
        total: 0,
        hideOnSinglePage: true
      },
      columns: [
        {label: '排名', type: ColumnType.Index, width: '60'},
        {label: '告警内容', prop: 'warningInfo', minWidth: '60%%', align: ColumnAlign.Center},
        {label: '发生频率', prop: 'warningInfoCount', minWidth: '20%', align: ColumnAlign.Center}
      ]
    }

    page = this.tableConfig.page

    mounted() {
      this.queryParam.orgId = this.userInfo.topOrg.id
      this.setDateRange()
      this.countWarningLevel(this.queryParam)
      this.countWarningStatus(this.queryParam)
      this.countWarningInfoTop(this.queryParam)
    }

    setDateRange() {
      const dateFormat = 'YYYY-MM-DD HH:mm:ss'
      const today = moment().set('hour', 0).set('minute', 0).set('second', 0)
      const start = moment(today).subtract(7, 'days')
      const end = moment(today).subtract(1, 'seconds')
      this.queryParam.startTime = start.format(dateFormat)
      this.queryParam.endTime = end.format(dateFormat)
    }

    countWarningLevel(queryParam: WarningQueryParam) {
      WarningService.countLevel(queryParam)
      .then((response: WarningStatisticsModel[]) => {

        const pieData = this.levelOption.series[0].data;
        response.forEach((item) => {  //level - 1 == index
          if(item.warningLevel >= 1 && item.warningLevel <= 3)
          pieData[item.warningLevel - 1].value = item.warningSum;
        })
        this.levelOption = {...this.levelOption}  // 代替深度监听

      }).catch(CATCH_ERROR)
    }

    countWarningStatus(queryParam: WarningQueryParam) {
      WarningService.countStatus(queryParam)
      .then((response: object[]) => {
        response.forEach((item: any) => {
          this.statusSum += item.statusSum
          this.status[item.warningStatus].num = item.statusSum
        })
        if (this.statusSum !== 0) {
          this.status.forEach((item: any) => {
            item.num = Math.round(item.num * 100 / this.statusSum)
          })
        }
      }).catch(CATCH_ERROR)
    }

    countWarningInfoTop(queryParam: WarningQueryParam) {
      WarningService.countInfoTop(queryParam)
      .then((response: object[]) => {
        this.loadTable(response)
      }).catch(CATCH_ERROR)
    }

    loadTable(payload: object[]) {
      // this.page.total = payload.length
      this.tableConfig.table.data = payload
    }

  }
</script>

<style scoped lang="scss">

  .left-panel {
    height: 406px;
    margin-bottom: 15px;

    /deep/ .yj-body-area {
      height: 85%;
    }

    .level-chart {
      height: 100%;
      width: 100%;
      margin: auto;
    }

    .status-label {
      margin-top: 56px;
      margin-bottom: 19px;

      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
    }
  }

  .today-warning-panel {
    min-height: 172px;
    margin-bottom: 15px;
  }

  .info-panel {
    height: 640px;
    margin-bottom: 15px;

    .info-table {
      margin: 0 -20px;
      width: calc(100% + 40px);
    }

    /deep/ .yj-body-area {
      height: 93%;
    }
  }

</style>
