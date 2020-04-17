<template>
  <yj-dialog
      title="选择人员"
      :value="value"
      @input="(flag) => this.$emit('input', flag)"
      @open="handleDialogOpen"
      @close="handleDialogClose">
<!--    body-->
    <div class="dialog-body">
<!--      query form-->
<!--      class="search-form"-->
      <el-form
          :inline="true"
          :model="queryParam"
          label-width="68px"
          class="dialog-header yj-search-form">
        <el-form-item label="用户名">
          <el-input v-model="queryParam.username" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="queryParam.fullName" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="queryParam.phone" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
        </el-form-item>
      </el-form>
<!--      user table-->
<!--      class="table"-->
      <yj-table class="dialog-content"
                ref="userTable"
                :config="tableConfig"
                @select="handleRowChecked"
                @select-all="handleAllChecked"
                @pagination-change="handlePaginationChange"
                @size-change="handleSizeChange">
      </yj-table>
    </div>

    <!--      class="dialog-footer"-->
    <template #footer>
      <div class="footer-btn">
        <el-button size="small" type="primary" @click="saveCheckedUsers">保存</el-button>
        <el-button size="small" @click="closeDialog">取消</el-button>
      </div>
    </template>
  </yj-dialog>

<!--  <el-dialog class="user-dialog"-->
<!--             title="选择人员"-->
<!--             :visible.sync="dialogVisible"-->
<!--             @open="handleDialogOpen"-->
<!--             width="48.2%"-->
<!--             top="11vh">-->
<!--  </el-dialog>-->
</template>

<script lang="ts">
  import {Component, Prop, Ref, Vue, Watch} from 'vue-property-decorator'
  import {TableConfig} from '@/providers/models/common/table-model'
  import {ColumnAlign, ColumnType} from '@/providers/models/enums'
  import YjTable from '@/components/common/yj-table.vue'
  import YjTableSearch from '@/components/common/yj-table-search.vue'
  import UsersService from '@/providers/services/uc/users-service'
  import {UserQueryModel} from '@/providers/models/uc/user-query-model'
  import {PageResult} from '@/providers/models/common/http-model'
  import {UserInfo} from '@/providers/models/uc/users-model'
  import {NoticeUserModel} from '@/providers/models/bs/notice-user'
  import {namespace, State} from 'vuex-class'
  import YjDialog from '@/components/common/yj-dialog.vue'
  import {CATCH_ERROR} from '@/providers/models/consts'

  const NoticeRuleModule = namespace('noticeRuleModule')
  @Component({
    components: {YjTable, YjTableSearch, YjDialog}
  })
  export default class NoticeUser extends Vue {
    @Prop() value: boolean

    @Prop() selectedUsers: NoticeUserModel[]  //Prop传递已选择的通知人

    @Ref() readonly userTable: YjTable

    @State
    private userInfo: UserInfo

    defaultParam: UserQueryModel = {
      orgId: 0,
      username: null,
      fullName: null,
      phone: null
    }

    queryParam: UserQueryModel = {...this.defaultParam}

    tableConfig: TableConfig = {
      table: {data: [{}, {}, {}, {}, {}]},
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 10
      },
      columns: [
        {type: ColumnType.Selection, minWidth: '70'},
        {label: '序号', type: ColumnType.Index, width: '60'},
        {label: '用户名', prop: 'username', minWidth: '70'},
        {label: '姓名', prop: 'fullName', minWidth: '70'},
        {label: '用户角色', prop: 'roleList[0].name', minWidth: '70'},
        {label: '联系电话', prop: 'phone', minWidth: '70'},
        {label: '添加日期', prop: 'createTime', minWidth: '90'}
      ]
    }
    table = this.tableConfig.table
    page = this.tableConfig.page

    allPageChecked: Map<number, string>

    handleDialogOpen() {
      //构造tableChecked, 每次勾选变化时, 更新, 保存时 赋值store
      this.initAllPageChecked()
      this.queryParam.orgId = this.userInfo.topOrg.id
      this.loadTable()
    }

    /** dialog刚打开, 表格所有页勾选的人, 初始化为已经选择的人 */
    initAllPageChecked() {
      this.allPageChecked = new Map<number, string>()
      this.selectedUsers.forEach(value => {
        this.allPageChecked.set(value.noticeUser, value.fullName)
      })
    }

    loadTable() {
      UsersService.queryUsers({
        offset: (this.page.currentPage - 1) * this.page.pageSize,
        limit: this.page.pageSize,
        query: this.queryParam
      })
      .then((response: PageResult<UserInfo[]>) => {
        this.page.total = response.totalCount
        this.table.data = response.result
        this.checkCurrentPage()
      }).catch(CATCH_ERROR)
    }

    checkCurrentPage() {
      this.$nextTick(() => {
        this.table.data.forEach((value: UserInfo) => {
          if (this.allPageChecked.has(value.id)) {
            (this.userTable as any).toggleRowSelection(value)
          }
        })
      })
    }

    handleRowChecked(selection: UserInfo[], row: UserInfo) {
      if (this.allPageChecked.has(row.id)) {
        this.allPageChecked.delete(row.id)
      } else {
        this.allPageChecked.set(row.id, row.fullName)
      }
    }

    handleAllChecked(selection: UserInfo[]) {
      if (selection.length > 0) { //全选
        for (let user of selection) {
          if (!this.allPageChecked.has(user.id)) {
            this.allPageChecked.set(user.id, user.fullName)
          }
        }
      } else {  //全不选
        const users: UserInfo[] = this.table.data
        for (let user of users) {
          if (this.allPageChecked.has(user.id)) {
            this.allPageChecked.delete(user.id)
          }
        }
      }
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

    /** 事件: 要将表格所有页勾选的人, 保存为选择的人 */
    saveCheckedUsers() {
      this.$emit('selectedUsersChanged', this.allPageChecked)
      this.closeDialog()
    }

    closeDialog() {
      this.$emit('input', false)
    }

    handleDialogClose() {
      this.queryParam = {...this.defaultParam};
      (this.userTable as any).clearSelection()
      this.page.currentPage = 1
      this.page.pageSize = 10
    }

  }
</script>

<style scoped lang="scss">
  .dialog-body {
    height: 100%;
    display: flex;
    flex-direction: column;

    .dialog-header {
      flex: none;
      margin: 32px 167px;
      height: 96px;

      .yj-search-form {
        padding: 0 0 10px;

        /deep/ {
          .el-form-item {
            margin: 7.5px 10px;
          }

          .el-input {
            width: 190px;
          }
        }
      }
    }

    .dialog-content {
      flex: auto;
      height: 0;
    }
  }

  /*/deep/ .el-dialog {*/
  /*  height: 77.7%;*/
  /*  margin: auto;*/
  /*}*/
  /*/deep/ .el-dialog__header{*/
  /*  width: 93.5%;*/
  /*  height: 2%;*/
  /*  margin: 0 auto;*/
  /*  padding: 2% 0;*/
  /*  border-bottom: solid 1px rgba(153,153,153,1)*/
  /*}*/
  /*/deep/ .el-dialog__body {*/
  /*  height: 83.7%;*/
  /*  padding: 0;*/
  /*}*/
  /*.search-form {*/
  /*  height: 14%;*/
  /*  margin-top: 3.5%;*/
  /*  margin-left: 21.2%;*/
  /*  margin-bottom: 3.5%;*/
  /*}*/
  /*.table {*/
  /*  font-size: 100%;*/
  /*  height: 80%;*/
  /*  float: none;*/
  /*}*/
  /*/deep/ .el-dialog__footer {*/
  /*  height: 6%;*/
  /*  text-align: center;*/
  /*  bottom: 2%;*/
  /*  width: 93.5%;*/
  /*  padding: 1% 0;*/
  /*  margin: 0 auto;*/
  /*  border-top: solid 1px rgba(153,153,153,1)*/
  /*}*/

  /*.footer-btn {*/
  /*  margin: auto;*/
  /*  height: 60.4%;*/
  /*}*/
</style>