<template>
  <yj-container>
<!--    user table-->
    <yj-table
        ref="userTable"
        :config="tableConfig"
        @pagination-change="handlePaginationChange"
        @size-change="handleSizeChange">
      <!--列表-查询-->
      <template class="yj-table-search" #search>
        <yj-table-search>
<!--          <el-form :model="queryParam">-->
            <el-form-item label="用户名">
              <el-input v-model="queryParam.username" clearable placeholder="请输入" />
            </el-form-item>
            <el-form-item label="姓名">
              <el-input v-model="queryParam.fullName" clearable placeholder="请输入" />
            </el-form-item>
            <el-form-item label="联系电话">
              <el-input v-model="queryParam.phone" clearable placeholder="请输入" />
            </el-form-item>
            <el-form-item label="用户角色">
              <el-select v-model="queryParam.roleId" clearable placeholder="请选择">
                <el-option
                    v-for="role in roles"
                    :key="role.id"
                    :label="role.name"
                    :value="role.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="添加日期">
              <el-date-picker
                  v-model="queryParam.startDate"
                  type="date"
                  :picker-options="startPickerOptions">
              </el-date-picker>
              -
              <el-date-picker
                  v-model="queryParam.endDate"
                  type="date"
                  :picker-options="endPickerOptions">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button
                  v-if="isManager"
                  type="primary"
                  @click="handleQuery">查询
              </el-button>
            </el-form-item>
<!--          </el-form>-->
        </yj-table-search>
      </template>
      <!--列表-操作-->
      <template #operate>
        <yj-table-operate>
          <template>
            <el-button
                v-if="isManager"
                type="primary"
                size="small"
                icon="el-icon-plus"
                @click="handleAdd">添加
            </el-button>
          </template>
        </yj-table-operate>
      </template>
      <!--列表-自定义列-->
      <template #userOp="scope">
        <div v-if="isManager && scope.row.roleList.length > 0 && scope.row.roleList[0].code === RoleUser">
          <el-link class="text-underline" type="primary" @click="handleResetPassword(scope)">重置密码</el-link>
          <el-link class="text-underline" type="primary" @click="handleUpdate(scope)">修改</el-link>
          <el-link class="text-underline" type="danger" @click="handleDelete(scope)">删除</el-link>
        </div>
      </template>
    </yj-table>
<!--    user drawer -->
    <user-drawer
        v-model="drawerFlag"
        :op="op"
        :data="formData"
        @tableDataChange="loadTable" />

  </yj-container>
</template>

<script lang="ts">
  import {Component, Vue, Watch} from 'vue-property-decorator'
  import {RowCbParam, TableConfig} from '@/providers/models/common/table-model'
  import YjTable from '@/components/common/yj-table.vue'
  import YjContainer from '@/components/common/yj-container.vue'
  import YjTableSearch from '@/components/common/yj-table-search.vue'
  import YjTableOperate from '@/components/common/yj-table-operate.vue'
  import YjPanel from '@/components/common/yj-panel.vue'
  import UserDrawer from './user-drawer.vue'
  import {UserInfo} from '@/providers/models/uc/users-model'
  import {namespace, State} from 'vuex-class'
  import {RoleInfo} from '@/providers/models/uc/roles-model'
  import UsersService from '@/providers/services/uc/users-service'
  import {ColumnAlign, ColumnType, CRUD, RoleCode} from '@/providers/models/enums'
  import {PageResult} from '@/providers/models/common/http-model'
  import NoticeUtil from '@/providers/utils/notice-util'
  import {UserQueryModel} from '@/providers/models/uc/user-query-model'
  import {CATCH_ERROR} from '@/providers/models/consts'
  import moment from 'moment'

  const UserModule = namespace('userModule')
  @Component({
    components: {YjPanel, YjTable, YjContainer, YjTableSearch, YjTableOperate, UserDrawer}
  })
  export default class User extends Vue {

    queryParam: UserQueryModel = {
      orgId: 0,
      fullName: null,
      username: null,
      roleId: null,
      phone: null,
      startDate: null,
      endDate: null
    }

    readonly dateFormat: string = 'YYYY-MM-DD HH:mm:ss'

    startPickerOptions = {
      disabledDate: (time: any) => {
        if (time.getTime() > Date.now()) {
          return true
        }
        if (this.queryParam.endDate) {
          return time.getTime() > this.queryParam.endDate
        }
      }
    }

    endPickerOptions = {
      disabledDate: (time: any) => {
        if (time.getTime() > Date.now()) {
          return true
        }
        if (this.queryParam.startDate) {
          return time.getTime() < this.queryParam.startDate
        }
      }
    }

    tableConfig: TableConfig = {
      table: {data: []},
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
      }, //行数
      columns: [
        {label: '序号', type: ColumnType.Index, width: '60'},
        {label: '用户名', prop: 'username', minWidth: '70'},
        {label: '姓名', prop: 'fullName', minWidth: '70'},
        {label: '用户角色', prop: 'roleList[0].name', minWidth: '70'},
        {label: '联系电话', prop: 'phone', minWidth: '70'},
        {label: '邮箱', prop: 'email', minWidth: '90'},
        {label: '添加日期', prop: 'createTime', minWidth: '90'},
        {label: '操作', template: 'userOp', width: '200'}
      ]
    }

    table = this.tableConfig.table

    page = this.tableConfig.page

    get isManager() {
      return this.userInfo.roleList.length > 0 && this.userInfo.roleList[0].code === RoleCode.Manager
    }

    private readonly RoleUser = RoleCode.User

    /// user drawer

    drawerFlag: boolean = false

    op: CRUD = CRUD.Create

    formData: UserInfo = {}

    @State
    private userInfo: UserInfo
    @UserModule.State
    private usersPage: PageResult<UserInfo[]>
    @UserModule.State
    private roles: RoleInfo[]

    @UserModule.Action
    public pagingQueryUsers: Function
    @UserModule.Action
    public getRoles: Function

    @Watch('usersPage')
    watchItem(newUsersPage: PageResult<UserInfo[]>, oldUsersPage: PageResult<UserInfo[]>): void {
      this.page.total = newUsersPage.totalCount
      this.table.data = newUsersPage.result.slice(0, this.page.pageSize)
    }

    mounted() {
      this.getRoles(this.userInfo.topOrg.id)
      this.queryParam.orgId = this.userInfo.topOrg.id
      this.loadTable()
    }

    loadTable() {
      const request: UserQueryModel = {...this.queryParam}
      if (this.queryParam.startDate){
        request.startDate = moment(this.queryParam.startDate).format(this.dateFormat)
      }
      if (this.queryParam.endDate){
        request.endDate = moment(this.queryParam.endDate).format(this.dateFormat)
      }
      this.pagingQueryUsers({
        offset: (this.page.currentPage - 1) * this.page.pageSize,
        limit: this.page.pageSize,
        query: request
      })
    }

    handlePaginationChange(currentPage: number) {
      this.page.currentPage = currentPage
      this.loadTable()
    }

    handleSizeChange(pageSize: number) {
      this.page.pageSize = pageSize
      this.loadTable()
    }

    handleQuery() {
      this.page.currentPage = 1
      this.loadTable()
    }

    handleResetPassword(scope: RowCbParam): void {
      NoticeUtil.showConfirm('您确定要重置密码吗？')
      .then(() => {
        UsersService.resetPwd((scope.row as any).id)
        .then((response: any) => {
          NoticeUtil.showMsg('密码重置成功')
        }).catch(CATCH_ERROR)
      })
    }

    handleDelete(scope: RowCbParam): void {
      NoticeUtil.showConfirm('您确定要删除吗？')
      .then(() => {
        UsersService.deleteUser((scope.row as any).id)
        .then((response: any) => {
          this.loadTable()
          NoticeUtil.showMsg('删除成功')
        }).catch(CATCH_ERROR)
      })
    }

    /// user drawer

    handleAdd() {
      this.openDrawer(CRUD.Create)
    }

    handleUpdate(scope: RowCbParam): void {
      //todo getById
      const user: UserInfo = scope.row;

      this.openDrawer(CRUD.Update, user
      //     {
      //   ...scope.row,
      //   roleId: (scope.row as any).roleList[0].id
      // }
      )
    }

    openDrawer(op: CRUD, formData?: UserInfo) {
      this.op = op
      if (formData) {
        this.formData = formData
      }
      this.drawerFlag = true
    }
  }
</script>

<style scoped lang="scss">
  .text-underline {
    text-decoration: underline
  }
</style>
