
<template>
  <yj-container>
    <tenant-add-edit-drawer :formDrawerData="formDrawerData"
                            :visibles="visible"
                            @input="handleDrawerVisible"
                            @initTenantData="initDataAfterAdd"
                            @clearDrawerData="clearDrawerData">
    </tenant-add-edit-drawer>
    <yj-table :config="tableConfig"
              @pagination-change="handlePageNumberChange"
              @size-change="handlePageSizeChange">
      <template #search>
        <yj-table-search>
          <el-form-item label="租户名称">
            <el-input v-model="formSearch.fullName" clearable placeholder="请输入租户名称" maxlength="100"/>
          </el-form-item>
          <el-form-item label="连接状态">
            <el-select v-model="formSearch.connectStatus" clearable placeholder="请选择连接状态">
              <el-option label="未连接" :value='0' />
              <el-option label="已连接" :value='1' />
            </el-select>
          </el-form-item>

          <el-form-item label="联系人">
            <el-input v-model="formSearch.contact" clearable placeholder="请输入联系人" maxlength="50"/>
          </el-form-item>

          <el-form-item label="添加日期">
            <el-date-picker
                    v-model = "formSearch.startTime"
                    type="date"
                    placeholder="起始时间">
            </el-date-picker>
            -
            <el-date-picker
                    v-model="formSearch.endTime"
                    type="date"
                    placeholder="终止时间">
            </el-date-picker>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSearch">查询</el-button>
          </el-form-item>
        </yj-table-search>
      </template>
      <!--列表-添加-->
      <template #operate>
        <yj-table-operate>
          <el-button size="small" type="primary" icon="el-icon-plus" @click="addTenant">添加</el-button>
        </yj-table-operate>
      </template>

      <!--列表-显示数据-->
      <template #oper="scope">
        <el-link type="primary" @click.native.stop="forbiddenClick(scope.row.id, scope.row.status)" class="opers">{{ scope.row.status === 1 ? '禁用': '启用' }}</el-link>
        <el-link type="primary" @click.native.stop="handleRowClick(scope.row.id)" class="opers">修改</el-link>
      </template>

      <!--连接状态-->
      <template #status = 'scope'>
        <div :class="scope.row.connectStatus === 0 ? 'red': 'green'"></div>
      </template>

      <!--添加日期-->
      <template #addDate = 'scope'>
        <div>{{ dateFormatAddDate(scope.row.createTime) }}</div>
      </template>

      <!--最后连接时间-->
      <template #lastConnectTime = 'scope'>
        <div>{{scope.row.lastConnectTime === null ? '-' : scope.row.lastConnectTime}}</div>
      </template>
    </yj-table>



  </yj-container>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {TableConfig} from '@/providers/models/common/table-model'
  import YjTable from '@/components/common/yj-table.vue'
  import YjContainer from '@/components/common/yj-container.vue'
  import YjTableSearch from '@/components/common/yj-table-search.vue'
  import YjTableOperate from '@/components/common/yj-table-operate.vue'
  import {ColumnAlign, ColumnType, NoticeType} from '@/providers/models/enums'
  import YjDrawer from '@/components/common/yj-drawer.vue';
  import {TenantQueryParam} from '@/providers/models/bs/tenant-query-model';
  import {TenantParam} from '@/providers/models/bs/tenant-model';
  import {PageQuery} from '@/providers/models/common/http-model';
  import TenantService from '@/providers/services/bs/tenant-service';
  import NoticeUtil from '@/providers/utils/notice-util';
  import {CATCH_ERROR} from '@/providers/models/consts';
  import TenantAddEditDrawer from '@/views/tenant/tenant-add-edit-drawer.vue';


  @Component({components: {TenantAddEditDrawer, YjDrawer, YjTable, YjContainer, YjTableSearch, YjTableOperate}})
  export default class Tenant extends Vue {

    defaultTotal?: number = 0
    defaultCurrentPage?: number = 1
    defaultPageSize?: number = 10

    tableConfig: TableConfig = {
      table: {data: []},
      page: {
        total: this.defaultTotal,
        currentPage: this.defaultCurrentPage,
        pageSize: this.defaultPageSize
      },
      columns: [
        {label: '序号', type: ColumnType.Index, width: '60'},
        {label: '租户名称', prop: 'fullName', minWidth: '20'},
        {label: '连接状态', template: 'status', minWidth: '15'},
        {label: '最后连接时间', template: 'lastConnectTime', minWidth: '30'},
        {label: '联系人', prop: 'contact', minWidth: '20'},
        {label: '联系电话', prop: 'phone', minWidth: '25'},
        {label: '添加日期', template: 'addDate', minWidth: '20'},
        {label: '操作', template: 'oper', minWidth: '20', align: ColumnAlign.Center}
      ]
    }

    /* 变量区 */
    // 查询表单
    formSearch?: TenantQueryParam = {
      fullName: '',
      connectStatus: null,
      contact: '',
      startTime: '',
      endTime: ''
    }
    // 弹窗表格变量
    formDrawerData: TenantParam = {
      id: null,
      lastConnectTime: '',
      connectStatus: null,
      fullName: '',
      contact: '',
      phone: '',
      createTime: '',
      code: 'default',
      address: ''
    }

    // 控制弹窗变量
    visible: boolean = false

    // 查询条件
    pageQuery?: PageQuery<TenantParam> = {
      limit: this.tableConfig.page.pageSize,
      offset: (this.tableConfig.page.currentPage - 1) * this.tableConfig.page.pageSize,
      query: this.formSearch
    }

    /* 方法区 */
    // 查询按钮
    onSearch() {

      if (this.formSearch.endTime) {
        const endDateTime = new Date(this.formSearch.endTime)
        const endDate = endDateTime.getFullYear() + '-' + (endDateTime.getMonth() + 1) + '-' + endDateTime.getDate()
        this.formSearch.endTime = endDate + ' 23:59:59'
      }

      this.tableConfig.page.currentPage = 1
      this.pageQuery.offset = (this.tableConfig.page.currentPage - 1) * this.tableConfig.page.pageSize
      this.initTenantData();
    }
    // 页码变换处理函数
    handlePageNumberChange(pageNumber: number) {
      this.pageQuery.offset = (pageNumber - 1) * this.pageQuery.limit
      this.initTenantData()
    }
    // 页面显示数量改变处理函数
    handlePageSizeChange(pageSize: number) {
      this.tableConfig.page.pageSize = pageSize
      this.pageQuery.limit = pageSize
      this.initTenantData()
    }
    // 行禁用事件
    forbiddenClick(tenantId: number, state: number) {
      const states = (state === 1) ? 0 : 1
      const tid = tenantId
      const templateStatus = {
        status: states,
        id: tid
      }
      NoticeUtil.showConfirm(states === 0 ? '确定禁用该租户吗？' : '确定启用该租户吗？', states === 0 ? '禁用提醒' : '启用提醒')
            .then( () => {
                TenantService.updateTenant(tid, templateStatus)
                      .then(() => {
                         this.initTenantData()
                         NoticeUtil.showMsg(states === 0 ? '已禁用' : '已启用')
                      })
                      .catch(CATCH_ERROR)
            })
            .catch(CATCH_ERROR)
    }
    // 修改事件
    handleRowClick(id: number) {
      this.formDrawerData.id = id
      this.visible = true
    }
    // 关闭抽屉
    handleDrawerVisible() {
      this.visible = false
    }
    // 格式化添加日期 --- 只显示年月日
    dateFormatAddDate(addDate: string) {
      if (addDate === null || addDate === ''){
        return null
      }
      const dates = new Date(addDate)
      return dates.getFullYear() + '-' + (dates.getMonth() + 1) + '-' + dates.getDate();
    }
    // 清空抽屉
    clearDrawerData() {
      this.formDrawerData = {
        id: null,
        lastConnectTime: '',
        connectStatus: null,
        fullName: '',
        contact: '',
        phone: '',
        createTime: '',
        code: '',
        address: ''
      }
    }
    // 添加按钮
    addTenant() {
      this.formDrawerData.id = 0
      this.visible = true
    }
    // 添加数据后初始化数据
    initDataAfterAdd() {
      this.tableConfig.page.currentPage = 1
      this.pageQuery.offset = (this.tableConfig.page.currentPage - 1) * this.tableConfig.page.pageSize
      this.initTenantData();
    }


    // 获取表格数据
    initTenantData() {
      TenantService.getTenantPage(this.pageQuery)
              .then((res: any) => {
                this.tableConfig.table.data = res.result,
                        this.tableConfig.page.total = res.totalCount,
                        this.tableConfig.page.currentPage = res.pageNo
              })
              .catch(CATCH_ERROR)
    }

    mounted() {
      this.initTenantData();
    }

  }


</script>

<style scoped lang="scss">
  .green{
    width: 10px;
    height: 10px;
    margin: 0px auto;
    border-radius: 50%;
    background-color: #98FB98;
  }
  .red{
    width: 10px;
    height: 10px;
    margin: 0px auto;
    border-radius: 50%;
    background-color: #FD3333;
  }
  .opers {
    text-decoration: underline;
  }
</style>
