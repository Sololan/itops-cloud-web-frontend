<template>
  <yj-container>
    <template #header>
      <yj-table-search class="m-b-15">
        <el-form-item label="用户名">
          <el-input v-model="formInline.username" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="formInline.fullName" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="添加日期">
          <el-date-picker
              v-model="formInline.startDate"
              type="date"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="请选择日期"
              :picker-options="start_date">
          </el-date-picker>
          -
          <el-date-picker
              v-model="formInline.endDate"
              type="date"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="请选择日期"
              :picker-options="end_date">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </yj-table-search>
    </template>
    <el-row type="flex" class="layout-row">
      <el-col :span="6">
        <yj-list v-model="selectedUser" title="租户" data-label="fullName" data-value="id" :data="userList"
                 @change="handleListClick" />
      </el-col>
      <el-col :span="18" class="layout-col">
        <yj-table :config="tableConfig" @row-click="handleClick"
                  @pagination-change="handlePaginationChange"
                  @size-change="handleSizeChange">
          <!-- 添加操作 -->
          <template #operate>
            <yj-table-operate>
              <el-button type="primary" size="small" icon="el-icon-plus" @click="showAddDrawer">添加</el-button>
            </yj-table-operate>
          </template>
          <!-- 列表自定义列 -->
          <template #address="scope">
            <el-link @click="resetPwd(scope)" type="primary">重置密码</el-link>
            <el-link @click="toUpdateTenantManager(scope)" type="primary">修改</el-link>
            <el-link @click="deleteTenantManager(scope)" type="danger">删除</el-link>
          </template>
        </yj-table>
      </el-col>
    </el-row>

    <yj-drawer v-model="addEditDrawerVisible" :title="!isEdit ? '添加租户管理员': '修改租户管理员'" @close="handleDrawerClose">
      <el-form label-width="205px" class="p-t-10 p-b-10" ref="tenantManagerModel" :model="tenantManagerModel" :rules="rules">
        <el-form-item label="用户名" prop="username">
          <el-input style="width: 190px" v-model="tenantManagerModel.username" :disabled="isDisabled"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="fullName">
          <el-input style="width: 190px" v-model="tenantManagerModel.fullName"></el-input>
        </el-form-item>
        <el-form-item label="所属租户" prop="orgId">
          <el-select style="width: 190px" v-model="tenantManagerModel.orgId" :disabled="isDisabled" placeholder="请选择" @change="showrole">
            <el-option v-for="item in userList" :key="item.id" :label="item.fullName"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户角色" prop="roleId">
          <el-select style="width: 190px" v-model="tenantManagerModel.roleId" disabled>
            <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone" required>
          <el-input style="width: 190px" v-model="tenantManagerModel.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" required>
          <el-input style="width: 190px" v-model="tenantManagerModel.email"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="addTenantManager('tenantManagerModel')">保存</el-button>
        <el-button type="info" @click="closeDrawer">取消</el-button>
      </template>
    </yj-drawer>
  </yj-container>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {RowCbParam, TableConfig} from '@/providers/models/common/table-model'
  import YjTable from '@/components/common/yj-table.vue'
  import YjContainer from '@/components/common/yj-container.vue'
  import YjTableSearch from '@/components/common/yj-table-search.vue'
  import YjTableOperate from '@/components/common/yj-table-operate.vue'
  import {UserInfo} from '@/providers/models/uc/users-model'
  import YjList from '@/components/common/yj-list.vue'
  import YjDrawer from '@/components/common/yj-drawer.vue'
  import {ColumnType, Gateway, ColumnAlign} from '@/providers/models/enums'
  import {RoleInfo} from '@/providers/models/uc/roles-model'
  import {PageQuery} from '@/providers/models/common/http-model'
  import TentantManagerService from '@/providers/services/bs/tenantManager-service'
  import NoticeUtil from '@/providers/utils/notice-util'
  import {ElForm} from 'element-ui/types/form'
  import {TenantManagerModel, TenantManagerQueryModel} from '@/providers/models/bs/tenantManager-model'
  import {CATCH_ERROR} from '@/providers/models/consts'
  import UsersService from "@/providers/services/uc/users-service";

  @Component({components: {YjDrawer, YjTable, YjContainer, YjTableSearch, YjTableOperate, YjList}})
  export default class Home extends Vue {
    tenantManageId: number = null
    selectedUser: UserInfo = {}
    a: number = null
    get isEdit() {return this.tenantManageId}

    isDisabled = false

    // 控制抽屉flag
    addEditDrawerVisible = false

    // 租户列表
    userList: UserInfo[] = []

    // 角色列表
    roleList: RoleInfo[] = []

    // 租户管理员数据
    tenantManagerModel: TenantManagerModel = {
      username: '',
      fullName: '',
      orgId: null,
      roleId: null,
      phone: null,
      email: ''
    }

    start_date = {
      disabledDate: (time: any) => {
        if (this.formInline.endDate) {
          return time.getTime() > this.formInline.endDate
        }
      }
    }
    end_date = {
      disabledDate: (time: any) => {
        return time.getTime() < this.formInline.startDate
      }
    }
    // 表单验证
    rules = {
      username: [
        {required: true, message: '请输入用户名', trigger: 'blur'},
        {min: 1, max: 50, message: '长度在1到50个字符', trigger: 'blur'},
        {
          validator: (rule: any, value: any, callback: Function) => {
             if (!(/^[0-9a-zA-Z]*$/g.test(value))) {
               return callback(new Error('用户名只能包含数字和字母'))
             }
            UsersService.getByUsername(value.trim()).then((user: UserInfo) => {
               if (this.tenantManagerModel.id && this.tenantManagerModel.id === user.id) {
                    return callback()
               }
               callback(new Error('用户名已存在'))
            }).catch((error) => {
              callback()
            })
          }
        }
      ],
      fullName: [
        {required: true, message: '请输入姓名', trigger: 'blur'},
        {min: 1, max: 100, message: '长度在1到100个字符', trigger: 'blur'}
      ],
      orgId: [
        {required: true, message: '请选择所属租户', trigger: 'change'}
      ],
      roleId: [
        {required: true, message: '请选择用户角色', trigger: 'change'}
      ],
      phone: [
        {
          validator: (rule: any, value: any, callback: any) => {
            const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/
            if (!value) {
              return callback(new Error('请输入联系电话'))
            }
            setTimeout(() => {
              if (!Number.isInteger(+value)) {
                callback(new Error('请输入数字'))
              } else {
                if (phoneReg.test(value)) {
                  callback()
                } else {
                  callback(new Error('联系电话格式不正确'))
                }
              }
            }, 100)
          }, trigger: 'blur'
        }
      ],
      email: [
        {
          validator: (rule: any, value: any, callback: any) => {
            const emailReg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
            if (!value) {
              return callback(new Error('请输入邮箱'))
            }
            setTimeout(() => {
              if (emailReg.test(value)) {
                callback()
              } else {
                callback(new Error('请输入正确的邮箱格式'))
              }
            }, 100)
          }, trigger: 'blur'
        }
      ]
    }

    tableConfig: TableConfig = {
      table: {data: []},
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 10
      },
      columns: [
        {label: '序号', type: ColumnType.Index, width: '70', align: ColumnAlign.Center},
        {label: '用户名', prop: 'username', minWidth: '40', align: ColumnAlign.Center},
        {label: '姓名', prop: 'fullName', minWidth: '40', align: ColumnAlign.Center},
        {label: '联系电话', prop: 'phone', minWidth: '50', align: ColumnAlign.Center},
        {label: '邮箱', prop: 'email', minWidth: '70', align: ColumnAlign.Center},
        {label: '添加日期', prop: 'createTime', minWidth: '70', align: ColumnAlign.Center},
        {label: '操作', template: 'address', minWidth: '80', align: ColumnAlign.Center}
      ]
    }

    formInline: TenantManagerQueryModel = {}

    private tenantManagePage: PageQuery<TenantManagerQueryModel> = {
      limit: this.tableConfig.page.pageSize,
      offset: (this.tableConfig.page.currentPage - 1) * this.tableConfig.page.pageSize,
      query: this.formInline
    }

    onSubmit() {
      this.refreshTable()
    }

    handleClick(scope: RowCbParam): void {
    }

    handleListClick(data: any): void {
      this.formInline.orgId = data.id
      this.tenantManagerModel.orgId = data.id
      this.refreshTable()
    }

    // 跳转到添加租户管理员抽屉
    showAddDrawer(): void {
      this.isDisabled = false
      this.addEditDrawerVisible = true
      this.showrole()
    }

    handleDrawerClose(): void {
      this.resetValidate('tenantManagerModel')
    }

    // // 关闭抽屉
    closeDrawer(): void {
      this.addEditDrawerVisible = false
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

    // 获取租户列表
    getTenant(): void {
      TentantManagerService.getTenantList().then((data: any) => {
        if (!data) {
          return
        }
        this.userList = data
        this.userList.sort(this.compare)
        this.selectedUser = data[0]
        this.formInline.orgId = data[0].id
        this.tenantManagerModel.orgId = data[0].id
        this.refreshTable()
      })
    }

    // 清空表单数据
    private resetValidate(fromName: string): void {
      this.tenantManageId = null;
      (this.$refs[fromName] as ElForm).resetFields()
      this.tenantManagerModel.id = null
      this.tenantManagerModel.username = ''
      this.tenantManagerModel.fullName = ''
      this.tenantManagerModel.roleId = null
      this.tenantManagerModel.phone = null
      this.tenantManagerModel.email = null
    }

    handlePaginationChange(currentPage: number): void {
      this.tenantManagePage.offset = (currentPage - 1) * this.tableConfig.page.pageSize
      this.refreshTable()
    }

    handleSizeChange(pageSize: number): void {
      this.tableConfig.page.pageSize = pageSize
      this.tenantManagePage.limit = pageSize
      this.refreshTable()
    }

    // 刷新table
    refreshTable(): void {
      this.formInline.roleCode = 'ROLE_MANAGER'
      TentantManagerService.getTenantManagerPage(this.tenantManagePage).then(
          (data: any) => {
            this.tableConfig.table.data = data.result
            this.tableConfig.page.currentPage = data.pageNo
            this.tableConfig.page.total = data.totalCount
          }
      )
    }

    // 查询角色
    showrole(): void {
      const orgId: number = this.tenantManagerModel.orgId
      TentantManagerService.getRolesList(orgId).then((data: any) => {
        this.roleList = [data]
        if (data) {
          this.tenantManagerModel.roleId = data.id
        }
      })
    }

    // 添加租户管理员
    addTenantManager(formName: any): void {
      this.tenantManagerModel.orgIdList = [this.tenantManagerModel.orgId]
      this.tenantManagerModel.roleIdList = [this.tenantManagerModel.roleId];
      (this.$refs[formName] as ElForm).validate((valid) => {
        if (!valid) {
          return false
        }
        if (!this.tenantManageId) {
          TentantManagerService.addTenantManager(this.tenantManagerModel).then((data) => {
            this.addEditDrawerVisible = false
            NoticeUtil.showMsg('添加成功')
            this.refreshTable()
          }).catch((error) => {
            this.addEditDrawerVisible = false
            NoticeUtil.showAlert('添加失败')
          })
        } else {
          TentantManagerService.updateTenantManager(this.tenantManagerModel).then((data) => {
            this.addEditDrawerVisible = false
            NoticeUtil.showMsg('修改成功')
            this.refreshTable()
          }).catch(error => {
            this.addEditDrawerVisible = false
            NoticeUtil.showAlert('修改失败')
          })
        }
      })
    }

    // 重置密码
    resetPwd(scope: RowCbParam): void {
      const rowData = scope.row as TenantManagerModel
      NoticeUtil.showConfirm('确定要重置密码码？').then(() => {
        TentantManagerService.restPwd(rowData.id).then(() => {
          NoticeUtil.showMsg('重置密码成功!')
          this.refreshTable()
        }).catch(() => {
          NoticeUtil.showAlert('重置密码失败！')
        })
      }).catch(CATCH_ERROR)
    }

    // 显示修改租户管理员抽屉
    toUpdateTenantManager(scope: RowCbParam): void {
      this.isDisabled = true
      const rowData = scope.row as TenantManagerModel
      TentantManagerService.getTenantMangerById(rowData.id).then((data: UserInfo) => {
        if (!data) {
          return false
        }
        this.tenantManagerModel.id = data.id
        this.tenantManageId = data.id
        this.tenantManagerModel.username = data.username
        this.tenantManagerModel.fullName = data.fullName
        this.tenantManagerModel.orgId = data.orgList[0].id
        this.tenantManagerModel.roleId = data.roleList[0].id
        this.tenantManagerModel.phone = data.phone
        this.tenantManagerModel.email = data.email
        this.addEditDrawerVisible = true
        this.showrole()
      })
    }
    // 删除租户管理员
    deleteTenantManager(scope: RowCbParam): void {
      NoticeUtil.showConfirm('是否确定删除吗？').then(() => {
        const rowData = scope.row as TenantManagerModel
        TentantManagerService.deleteTenantManager(rowData.id).then(() => {
          NoticeUtil.showMsg('删除成功')
          this.refreshTable()
        }).catch(() => {
          NoticeUtil.showAlert('删除失败')
        })
      }).catch(CATCH_ERROR)
    }

    mounted() {
      this.getTenant()
    }
  }
</script>

<style scoped lang="scss">

  .layout-row {
    height: 100%;
  }

  .layout-col {
    margin-left: 15px;
  }

</style>
