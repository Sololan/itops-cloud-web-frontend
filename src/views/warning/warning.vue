
<template>
  <yj-container>

    <warning-show-drawer
            :visibles="drawerController"
            @input="handleDrawerVisible"
            :formDrawerData = "formWarnings">

    </warning-show-drawer>

    <yj-table :config="tableConfig"
              @pagination-change="handlePaginationChange"
              @size-change="handleSizeChange">

      <!--列表-查询条件-->
      <template #search>
        <yj-table-search>

          <el-form-item label="告警级别">
            <el-select v-model="formSearch.warningLevel" clearable placeholder="请选择">
              <el-option label="提醒" value="1" />
              <el-option label="预告" value="2" />
              <el-option label="严重" value="3" />
            </el-select>
          </el-form-item>

          <el-form-item label="告警内容">
            <el-input v-model="formSearch.warningInfo" clearable placeholder="请输入"  maxlength="50"/>
          </el-form-item>

          <el-form-item label="IP地址">
            <el-input v-model="formSearch.ipAddress" clearable placeholder="请输入"  maxlength="50"/>
          </el-form-item>

          <el-form-item label="告警时间">
            <el-date-picker
                    v-model = "formSearch.startTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="date"
                    placeholder="起始时间">
            </el-date-picker>
            -
            <el-date-picker
                    v-model="formSearch.endTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="date"
                    placeholder="终止时间">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="状态">
            <el-select v-model="formSearch.warningStatus" clearable placeholder="请选择">
              <el-option label="未关闭" value="0" />
              <el-option label="已关闭" value="1" />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSearch">查询</el-button>
          </el-form-item>
        </yj-table-search>
      </template>

      <!--告警级别显示-->
      <template #warningLevelName = "scope">
        <span :class="getWarningLevelNameStyle(scope.row.warningLevelName)">{{scope.row.warningLevelName}}</span>
      </template>

      <!--报警时长显示-->
      <template #warningAllTime = "scope">
        <span>{{ countWarningTime(scope.row.warningTime, scope.row.closeTime)}}</span>
      </template>

      <!--状态显示-->
      <template #warningStatus = "scope">
        <span>{{scope.row.warningStatus == 0?'未关闭':'已关闭'}}</span>
      </template>

      <!--操作显示-->
      <template #oper = "scope">
        <el-link class="el-link" type="primary" @click="handleClick(scope)">详细</el-link>
      </template>

    </yj-table>
  </yj-container>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {TableConfig, RowCbParam} from '@/providers/models/common/table-model'
  import YjTable from '@/components/common/yj-table.vue'
  import YjContainer from '@/components/common/yj-container.vue'
  import YjTableSearch from '@/components/common/yj-table-search.vue'
  import YjTableOperate from '@/components/common/yj-table-operate.vue'
  import YjDrawer from '@/components/common/yj-drawer.vue'
  import {ColumnAlign, ColumnType} from '@/providers/models/enums';
  import { WarningQueryParam } from '@/providers/models/bs/warning-query-model'
  import {WarningParam} from '@/providers/models/bs/warning-model';
  import WarningService from '@/providers/services/bs/warning-service';
  import {PageQuery} from '@/providers/models/common/http-model';
  import WarningShowDrawer from '@/views/warning/warning-show-drawer.vue';
  import {CATCH_ERROR} from '@/providers/models/consts';


  @Component({components: {WarningShowDrawer, YjTable, YjContainer, YjTableSearch, YjTableOperate, YjDrawer}})
  export default class Warning extends Vue {

    defaultTotal?: number = 20
    defaultPageSize?: number = 10
    defaultCurrentPage?: number = 1

    tableConfig: TableConfig = {
      table: {data: []},
      page: {
        total: this.defaultTotal,
        pageSize: this.defaultPageSize,
        currentPage: this.defaultCurrentPage
      },
      columns: [
        {label: '序号', type: ColumnType.Index, width: '60'},
        {label: '告警编号', prop: 'warningCode', showOverflowTooltip: true, minWidth: '18'},
        {label: '告警级别', template: 'warningLevelName', minWidth: '18'},
        {label: '告警内容', prop: 'warningInfo', minWidth: '30'},
        {label: 'IP地址', prop: 'ipAddress', minWidth: '18'},
        {label: '告警时间', prop: 'warningTime', minWidth: '20'},
        {label: '告警时长', template: 'warningAllTime', minWidth: '18'},
        {label: '状态', template: 'warningStatus', minWidth: '12'},
        {label: '操作', template: 'oper', minWidth: '12'}
      ]
    }

    /* 弹窗变量 */
    drawerController: boolean = false

    /* 变量区 */
    formSearch: WarningQueryParam = { // 告警查询条件变量
      warningLevel: null,
      warningInfo: '',
      ipAddress: '' ,
      startTime: '' ,
      endTime: '' ,
      warningStatus: ''
    }
    formWarnings: WarningParam = { // 告警信息变量
      id: null ,
      orgId: null ,
      warningCode: '' ,
      warningLevel: null ,
      warningInfo: '' ,
      ipAddress: '' ,
      warningTime: '' ,
      warningStatus: '' ,
      closeTime: '' ,
      equipmentId: null ,
      monitorId: null ,
      users: '无' ,
      warningLevelName: ''
    }
    warningPage: PageQuery<WarningQueryParam> = { // 分页条件
      limit: this.tableConfig.page.pageSize,
      offset: (this.tableConfig.page.currentPage - 1) * this.tableConfig.page.pageSize,
      query: this.formSearch
    }

    /* 查询按钮 */
    onSearch() {
      if (this.formSearch.endTime !== '') {
        const endDateTime = new Date(this.formSearch.endTime)
        const endDate = endDateTime.getFullYear() + '-' + (endDateTime.getMonth() + 1) + '-' + endDateTime.getDate()
        this.formSearch.endTime = endDate + ' 23:59:59'
      }
      this.tableConfig.page.currentPage = 1
      this.warningPage.offset = (this.tableConfig.page.currentPage - 1) * this.tableConfig.page.pageSize
      this.warningPage.query = this.formSearch
      this.initWarningsData()
    }

    handleDrawerVisible() {
      this.drawerController = false
    }

    /* 函数区 */
    /* 触发抽屉函数 */
    handleClick(scope: RowCbParam) {
      this.formWarnings = scope.row
      this.drawerController = true
    }
    /* 触发页码更改函数 */
    handlePaginationChange(currentPage: number) {
      this.warningPage.offset = (currentPage - 1) * this.tableConfig.page.pageSize
      this.initWarningsData()
    }
    /* 触发每页显示数量 函数 */
    handleSizeChange(pageSize: number) {
      this.tableConfig.page.pageSize = pageSize
      this.warningPage.limit = pageSize
      this.initWarningsData()
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
      if(endDate == null || endDate == ''){
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



    /* 初始化加载区 */
    mounted() {
      this.initWarningsData()
    }

    /* 方法区 */
    /* 获取告警信息数据 */
    initWarningsData() {
      WarningService.getWarningPage(this.warningPage)
              .then((res: any) => {
                this.tableConfig.table.data = res.result
                this.tableConfig.page.currentPage = res.pageNo,
                this.tableConfig.page.total = res.totalCount
              })
              .catch(CATCH_ERROR)
    }

  }
</script>

<style scoped lang="scss">
  .remindClass{
    color: #04FFFD;
  }
  .preClass{
    color: #FFDD00;
  }
  .strictClass{
    color: #E70012;
  }
  .el-link {
    text-decoration: underline;
  }
</style>
