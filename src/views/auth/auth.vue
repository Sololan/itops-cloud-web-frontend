<template>
  <yj-container>
    <!--抽屉1-->
    <auth-monitor-drawer v-model="flag.drawerFlag1" :current-org-id="this.currentSelect.id"
                         :current-org-full-name="this.currentSelect.fullName"
                         @success="() => this.refreshMonitorTable()" />
    <!--抽屉2-->
    <auth-notice-drawer v-model="flag.drawerFlag2" :current-org-id="this.currentSelect.id"
                        :current-org-full-name="this.currentSelect.fullName"
                        @success="() => this.refreshNoticeTable()" />
    <!--列表-查询-->
    <template #header>
      <yj-table-search class="m-b-15">
        <el-form-item label="开始日期">
          <el-date-picker class="drawer-input"
                          v-model="queryParam.startStartTime"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          type="date"
                          placeholder="选择日期">
          </el-date-picker>
          -
          <el-date-picker class="drawer-input"
                          v-model="queryParam.startEndTime"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          type="date"
                          placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="截至日期">
          <el-date-picker class="drawer-input"
                          v-model="queryParam.endStartTime"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          type="date"
                          placeholder="选择日期">
          </el-date-picker>
          -
          <el-date-picker class="drawer-input"
                          v-model="queryParam.endEndTime"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          type="date"
                          placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParam.status" clearable placeholder="请选择">
            <el-option label="有效" value="1" />
            <el-option label="失效" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryTable">查询</el-button>
        </el-form-item>
      </yj-table-search>
    </template>
    <el-row type="flex" class="layout-row">
      <!--左侧列表-->
      <el-col :span="6" class="layout-row">
        <!--                <div class="tenant-title"><span class="title-font">租户名称</span></div>-->
        <!--                <div class="list-left">-->
        <!--                    <div class="tenant-list" :class="{zebra:index%2 === 1,on:currentIndex===index}"-->
        <!--                         ref="tenantList"-->
        <!--                         @click="changeTable(index,item.id,item.fullName)"-->
        <!--                         v-for="(item ,index) in tenantsList">-->
        <!--                        <span :title="item.fullName" class="space-name-value">{{item.fullName}}</span>-->
        <!--                    </div>-->
        <!--                </div>-->
        <yj-list v-model="currentSelect" title="租户" data-label="fullName" data-value="id" :data="tenantsList"
                 @change="handleListClick" />
      </el-col>
      <el-col :span="18" class="layout-col">
        <!--列表-操作-->
        <div class="list-right">
          <yj-table-operate>
            <el-button type="primary" size="small" @click="addInfo" icon="el-icon-plus">添加</el-button>
          </yj-table-operate>
          <el-tabs v-model="activeName" type="card" @tab-click="">
            <el-tab-pane name="first" label="监控">
              <yj-table class="table" :config="tableConfig1" @row-click="handleClick"
                        @pagination-change="handlePaginationChange"
                        @size-change="handleSizeChange">
                <!--列表-自定义列-->
                <template #startDate="scope">
                  <span>{{scope.row.startDate.substring(0,10)}}</span>
                </template>
                <template #endDate="scope">
                  <span>{{scope.row.endDate.substring(0,10)}}</span>
                </template>
                <template #settings="scope">
                  <div>
                    <div class="table-div1"><span class="table-span">硬件</span></div>
                    <div class="table-div1"><span class="table-span">系统</span></div>
                    <div class="table-div1"><span class="table-span">数据库</span></div>
                    <div class="table-div1"><span class="table-span">中间件</span></div>
                    <div class="table-div1"><span class="table-span">web</span></div>
                  </div>
                  <div>
                    <div class="table-div1"><span class="table-span table-span-color">{{scope.row.usedHardwareQuantity}}/{{scope.row.hardwareQuantity}}&nbsp;</span>
                    </div>
                    <div class="table-div1"><span class="table-span table-span-color">{{scope.row.usedOsQuantity}}/{{scope.row.osQuantity}}&nbsp;</span>
                    </div>
                    <div class="table-div1"><span class="table-span table-span-color">{{scope.row.usedDbQuantity}}/{{scope.row.dbQuantity}}&nbsp;</span>
                    </div>
                    <div class="table-div1"><span class="table-span table-span-color">{{scope.row.usedMiddlewareQuantity}}/{{scope.row.middlewareQuantity}}&nbsp;</span>
                    </div>
                    <div class="table-div1"><span class="table-span table-span-color">{{scope.row.usedWebQuantity}}/{{scope.row.webQuantity}}</span>
                    </div>
                  </div>
                </template>
              </yj-table>
            </el-tab-pane>
            <el-tab-pane name="second" label="通知">
              <yj-table class="table" :config="tableConfig2" @row-click="handleClick"
                        @pagination-change="handlePaginationChange"
                        @size-change="handleSizeChange">
                <!--列表-自定义列-->
                <template #startDate="scope">
                  <span>{{scope.row.startDate.substring(0,10)}}</span>
                </template>
                <template #endDate="scope">
                  <span>{{scope.row.endDate.substring(0,10)}}</span>
                </template>
                <template #settings="scope">
                  <div>
                    <div class="table-div"><img class="table-icon"
                                                src="../../assets/images/wechat-icon.png" /></div>
                    <div class="table-div"><img class="table-icon"
                                                src="../../assets/images/email-icon.png" /></div>
                    <div class="table-div"><img class="table-icon"
                                                src="../../assets/images/message-icon.png" /></div>
                    <div class="table-div"><img class="table-icon"
                                                src="../../assets/images/phone-icon.png" /></div>
                  </div>
                  <div>
                    <div class="table-div"><span class="table-span2 table-span-color">{{scope.row.isWx?'无限制':'未开启'}}&nbsp;</span>
                    </div>
                    <div class="table-div"><span class="table-span2 table-span-color">{{scope.row.isEmail?'无限制':'未开启'}}&nbsp;</span>
                    </div>
                    <div class="table-div"><span class="table-span2 table-span-color">{{scope.row.isMsg?scope.row.usedMsgQuantity+'/'+scope.row.msgQuantity:'未开启'}}&nbsp;</span>
                    </div>
                    <div class="table-div"><span class="table-span2 table-span-color">{{scope.row.isPhone?scope.row.usedPhoneQuantity+'/'+scope.row.phoneQuantity:'未开启'}}&nbsp;</span>
                    </div>
                  </div>
                </template>
              </yj-table>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
    </el-row>
  </yj-container>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {RowCbParam, TableConfig} from '@/providers/models/common/table-model'
  import YjTable from '@/components/common/yj-table.vue'
  import YjContainer from '@/components/common/yj-container.vue'
  import YjTableSearch from '@/components/common/yj-table-search.vue'
  import YjTableOperate from '@/components/common/yj-table-operate.vue'
  import {ColumnAlign, ColumnType, Gateway} from '@/providers/models/enums'
  import YjDrawer from '@/components/common/yj-drawer.vue'
  import HttpUtil from '@/providers/utils/http-util'
  import AuthMonitorDrawer from '@/views/auth/auth-monitor-drawer.vue'
  import AuthNoticeDrawer from '@/views/auth/auth-notice-drawer.vue'
  import {AuthQueryModel} from '@/providers/models/bs/auth-query-model'
  import {PageQuery} from '@/providers/models/common/http-model'
  import AuthService from '@/providers/services/bs/auth-service'
  import YjList from '@/components/common/yj-list.vue'

  @Component({
    components: {
      AuthNoticeDrawer,
      AuthMonitorDrawer,
      YjTable,
      YjContainer,
      YjTableSearch,
      YjTableOperate,
      YjDrawer,
      YjList
    }
  })
  export default class Auth extends Vue {

    currentSelect = {
      id: 0,
      fullName: ''
    }

    defaultPageSize?: number = 10
    /*左侧列表当前选中项*/
    currentIndex: number = 0

    tableConfig1: TableConfig = {
      table: {data: []},
      page: {
        total: 0,
        currentPage: 1,
        pageSize: this.defaultPageSize
        // pageSizes: [this.defaultPageSize, 15, 20] /*行数*/
      },
      columns: [
        {label: '序号', type: ColumnType.Index, width: '70', align: ColumnAlign.Center},
        {label: '授权码', prop: 'licenseCode', minWidth: '70'},
        {label: '开始日期', template: 'startDate', minWidth: '50'},
        {label: '截止日期', template: 'endDate', minWidth: '50'},
        {label: '失效时间', prop: 'expireTime', minWidth: '70'},
        {label: '监控设置', template: 'settings', minWidth: '100'}
      ]
    }
    tableConfig2: TableConfig = {
      table: {data: []},
      page: {
        total: 0,
        currentPage: 1,
        pageSize: this.defaultPageSize
        // pageSizes: [this.defaultPageSize, 10, 20] /*行数*/
      },
      columns: [
        {label: '序号', type: ColumnType.Index, width: '70', align: ColumnAlign.Center},
        {label: '授权码', prop: 'licenseCode', minWidth: '70'},
        {label: '开始日期', template: 'startDate', minWidth: '50'},
        {label: '截止日期', template: 'endDate', minWidth: '50'},
        {label: '失效时间', prop: 'expireTime', minWidth: '70'},
        {label: '监控设置', template: 'settings', minWidth: '100'}
      ]
    }

    queryParam: AuthQueryModel = {
      endEndTime: '',
      endStartTime: '',
      orgId: this.currentSelect.id,
      startEndTime: '',
      startStartTime: '',
      status: ''
    }

    status = {
      id: '',
      value: ''
    }

    body: PageQuery<AuthQueryModel> = {
      offset: (this.tableConfig1.page.currentPage - 1) * this.tableConfig1.page.pageSize,
      limit: this.tableConfig1.page.pageSize,
      query: this.queryParam
    }

    tenantsList: any = ''

    flag = {
      drawerFlag1: false,
      drawerFlag2: false,
      tabFlag: false
    }

    /*分页参数*/
    handlePaginationChange(currentPage: number) {
      this.body.offset = (currentPage - 1) * this.tableConfig1.page.pageSize
      this.queryTable()
    }

    /*分页参数*/
    handleSizeChange(pageSize: number) {
      this.tableConfig1.page.pageSize = pageSize
      this.body.limit = pageSize
      this.queryTable()
    }

    /*查询*/
    queryTable() {
      this.body.query = this.queryParam
      if (this.$data.activeName === 'first') {
        this.refreshMonitorTable()
      } else {
        this.refreshNoticeTable()
      }
    }

    // 刷新table
    refreshMonitorTable(groupName = ''): void {
      AuthService.queryMonitorPage(this.body)
      .then(
          (data: any) => {
            this.tableConfig1.table.data = data.result
            this.tableConfig1.page.currentPage = data.pageNo
            this.tableConfig1.page.total = data.totalCount
          }
      )
    }

    // 刷新table
    refreshNoticeTable(groupName = ''): void {
      AuthService.queryNoticePage(this.body)
      .then(
          (data: any) => {
            this.tableConfig2.table.data = data.result
            this.tableConfig2.page.currentPage = data.pageNo
            this.tableConfig2.page.total = data.totalCount
          }
      )
    }

    /*查询其他组织信息*/
    changeTable(index: number, id: number, fullName: string) {
      this.currentIndex = index
      this.currentSelect.id = id
      this.currentSelect.fullName = fullName
      this.queryParam.orgId = id
      this.body.query = this.queryParam
      this.refreshMonitorTable()
      this.refreshNoticeTable()
      // this.$refs.tenantList.classList.add('tenant')
    }

    handleClick(scope: RowCbParam): void {
    }

    handleListClick(data: any): void {
      this.currentSelect.id = data.id
      this.currentSelect.fullName = data.fullName
      this.queryParam.orgId = data.id
      this.body.query = this.queryParam
      this.refreshMonitorTable()
      this.refreshNoticeTable()
    }

    /*添加保存*/
    addInfo(): void {
      if (this.$data.activeName === 'first') {
        this.flag.drawerFlag1 = true
      } else {
        this.flag.drawerFlag2 = true
      }
    }

    mounted() {
      this.initData()
    }

    compare = function(obj1: any, obj2: any) {
      let val1 = obj1.fullName
      let val2 = obj2.fullName
      if (val1 < val2) {
        return -1
      } else if (val1 > val2) {
        return 1
      } else {
        return 0
      }
    }

    initData() {
      HttpUtil.get({api: 'orgs/allTop', gateway: Gateway.Uc})
      .then(
          (data: any) => {
            this.tenantsList = data
            this.tenantsList.sort(this.compare)
            this.currentSelect.id = this.tenantsList[0].id
            this.currentSelect.fullName = this.tenantsList[0].fullName
            this.queryParam.orgId = this.tenantsList[0].id
            this.body.query = this.queryParam
            this.refreshMonitorTable()
            this.refreshNoticeTable()
          }
      )
    }

    data() {
      return {
        activeName: 'first',
        value1: '',
        value2: '',
        value3: '',
        value4: ''
      }
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

  .list-right {
    height: 100%;
    width: 99%;
    float: right;
    margin-left: 1%;
  }

  .list-left {
    float: left;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.05);
    overflow-x: hidden;
    overflow-y: auto;
  }

  .tenant-list {
    height: 60px;
    background: white;
    padding: 0 40px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }

  .tenant {
    background: rgba(234, 244, 254, 1);
  }

  .tenant-title {
    width: 100%;
    height: 60px;
    background: #EAEDF4;
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

  .space-name-value {
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 60px;
    -webkit-box-orient: vertical;
    white-space: nowrap;
  }

  .space-name-value:hover {
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .dotted-line {
    margin-top: 20px;
    margin-left: -120px;
    margin-right: -20px;
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

  .drawer-block {
    margin-top: 41px;
  }

  .second-title {
    margin-left: -120px;
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
    display: inline-block;
  }

  .table-div1 {
    width: 20%;
    display: inline-block;
    text-align: center;
  }

  .table-icon {
    display: inline-block;
    padding-right: 10px;
  }

  .table-div {
    width: 25%;
    display: inline-block;
    text-align: center;
  }

  .table-span2 {
    display: inline-block;
  }

  .table-span-color {
    color: #080367;
  }

  .table {
    height: 34vw;
  }

  .yj-table /deep/ .el-table:not(.yj-disable-radius) {
    border-radius: 0;
  }

  .on {
    background-color: #CAC8F0 !important;
  }

  .el-tabs /deep/ .el-tabs__header {
    margin: 0 0 0 0;
  }

  .el-tabs /deep/ .el-tabs__content {
    padding: 0 0 0 0;
  }

  .el-tabs /deep/ .el-tabs__item.is-active {
    background-color: #EAEDF4;
    border-bottom-color: #EAEDF4;
    border-left: none;
  }

</style>
