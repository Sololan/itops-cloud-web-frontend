<template>
  <yj-container>
    <yj-drawer :title="groupTitle" v-model="flag.groupFlag" @close="closeGroupDrawer()">
      <div>
        <el-form ref="groupFormData" :model="groupFormData" :rules="groupRules" label-width="205px" class="p-t-10 p-b-10">
          <el-form-item label="字典组名称" prop="name">
            <el-input v-model="groupFormData.name" style="width: 190px"></el-input>
          </el-form-item>
          <el-form-item label="KEY" prop="key">
            <el-input v-model="groupFormData.key" style="width: 190px"></el-input>
          </el-form-item>
          <el-form-item label="排序号" prop="sort">
            <el-input v-model.number="groupFormData.sort" style="width: 190px"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input type="textarea" v-model="groupFormData.description" style="width: 190px"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="addDictGroup('groupFormData')" v-if="flag.groupAddBtnFlag">保存</el-button>
        <el-button type="primary" @click="editDictGroup('groupFormData')" v-if="flag.groupEditBtnFlag">保存</el-button>
        <el-button type="info" @click="closeDrawer">取消</el-button>
      </div>
    </yj-drawer>
    <yj-drawer :title="itemTitle" v-model="flag.itemFlag" @close="closeItemDrawer()">
      <div>
        <el-form ref="itemFormData" :model="itemFormData" :rules="itemRules" label-width="205px" class="p-t-10 p-b-10">
          <el-form-item label="字典项名称" prop="name">
            <el-input v-model="itemFormData.name" style="width: 190px"></el-input>
          </el-form-item>
          <el-form-item label="KEY" prop="key">
            <el-input v-model="itemFormData.key" style="width: 190px"></el-input>
          </el-form-item>
          <el-form-item label="值" prop="value">
            <el-input v-model="itemFormData.value" style="width: 190px"></el-input>
          </el-form-item>
          <el-form-item label="父级字典项" prop="pId">
            <el-select v-model="itemFormData.pId" placeholder="请选择" :disabled="flag.itemEditBtnFlag" style="width: 190px" @change="checkSelf(itemFormData.pId)" clearable="clearable">
              <el-option :value="-1" label="无">无</el-option>
              <el-option
                  v-for="item in dictItems"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序号" prop="sort">
            <el-input v-model.number="itemFormData.sort" style="width: 190px"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input type="textarea" v-model="itemFormData.description" style="width: 190px"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="addDictItem('itemFormData')" v-if="flag.itemAddBtnFlag">保存</el-button>
        <el-button type="primary" @click="editDictItem('itemFormData')" v-if="flag.itemEditBtnFlag">保存</el-button>
        <el-button type="info" @click="closeDrawer">取消</el-button>
      </div>
    </yj-drawer>
    <yj-table :config="tableConfig1" @row-click="chooseDictGroup" class="left-table">
      <!--列表-查询-->
      <!--      <template #search>-->
      <!--        <yj-table-search title="字典组">-->
      <!--          <el-form-item label="字典组名称">-->
      <!--            <el-input v-model="selectForm.groupName" clearable placeholder="请输入" />-->
      <!--          </el-form-item>-->
      <!--          <el-form-item>-->
      <!--            <el-button type="primary" @click="selectGroupByName">查询</el-button>-->
      <!--          </el-form-item>-->
      <!--        </yj-table-search>-->
      <!--      </template>-->
      <!--列表-操作-->
      <template #operate>
        <yj-table-operate>
          <el-button type="primary" icon="el-icon-plus" @click="showDictGroupDrawer" size="small">添加字典组</el-button>
        </yj-table-operate>
      </template>
      <!--列表-自定义列-->
      <template #opr="scope">
        <div v-if="scope.row.isEdit === 1">
          <el-link @click="toEditDictGroup(scope)" type="primary">修改</el-link>
          <el-link @click="deleteDictGroup(scope)" type="danger">删除</el-link>
        </div>
      </template>
    </yj-table>
    <yj-table :config="tableConfig2" class="right-table" style="height: 95%">
      <!--列表-查询-->
      <template #search>
        <yj-table-search title="字典项">
          <el-form-item label="字典项名称">
            <el-input v-model="selectForm.itemName" clearable placeholder="请输入" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="selectItemByName">查询</el-button>
          </el-form-item>
        </yj-table-search>
      </template>
      <!--列表-操作-->
      <template #operate>
        <yj-table-operate >
          <el-button type="primary" icon="el-icon-plus" v-if="isEdit === 1" @click="showDictItemDrawer" size="small">添加字典项</el-button>
        </yj-table-operate>
      </template>
      <!--列表-自定义列-->
      <template #address="scope">
        <div v-if="scope.row.isEdit === 1">
          <el-link type="primary" @click="toEditDictItem(scope)">编辑</el-link>
          <el-link @click="deleteDictItem(scope)" type="danger">删除</el-link>
        </div>
      </template>
    </yj-table>
  </yj-container>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {RowCbParam, TableConfig} from '@/providers/models/common/table-model'
  import YjTable from '@/components/common/yj-table.vue'
  import YjContainer from '@/components/common/yj-container.vue'
  import YjTableSearch from '@/components/common/yj-table-search.vue'
  import YjTableOperate from '@/components/common/yj-table-operate.vue'
  import HttpUtil from '@/providers/utils/http-util'
  import {ColumnType, Gateway} from '@/providers/models/enums'
  import YjDrawer from '@/components/common/yj-drawer.vue'
  import NoticeUtil from '@/providers/utils/notice-util'
  import {DictsGroupModel} from '@/providers/models/uc/dicts-group-model'
  import {DictsItemModel} from '@/providers/models/uc/dicts-item-model'
  import {ElForm} from 'element-ui/types/form'
  import DictsService from '@/providers/services/uc/dicts-service'

  @Component({components: {YjDrawer, YjTable, YjContainer, YjTableSearch, YjTableOperate}})
  export default class Dict extends Vue {
    groupTitle = "新增字典组"
    itemTitle = "新增字典项"

    //检查是否选中自己
    checkself: number
    // 控制可见性的flag
    flag = {
      groupFlag: false,
      itemFlag: false,
      groupAddBtnFlag: false,
      groupEditBtnFlag: false,
      itemAddBtnFlag: false,
      itemEditBtnFlag: false
    }

    // 搜索框
    selectForm = {
      groupName: '',
      itemName: ''
    }

    // 字典组数据
    groupFormData = {
      name: '',
      key: '',
      sort: '',
      description: '',
      id: ''
    }

    // 字典项数据
    itemFormData = {
      name: '',
      key: '',
      sort: '',
      value: '',
      description: '',
      groupId: '',
      id: 0,
      pId: -1
    }

    // 字典组列表
    dictGroups: any = []

    // 字典项列表
    dictItems: any = []

    // 表单验证规则
    data(){
      return {
        groupRules: {
          name: [
            { required: true, message: '请输入字典组名称', trigger: 'blur' },
            { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'blur' }
          ],
          key: [
            { required: true, message: '请输入KEY', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
          sort: [
            { required: true, type: 'number', message: '序号必须为数字值'}
          ],
          description: [
            { min: 0, max: 200, message: '长度在 0 到 200 个字符', trigger: 'blur' }
          ]
        },
        itemRules: {
          name: [
            { required: true, message: '请输入字典项名称', trigger: 'blur' },
            { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'blur' }
          ],
          key: [
            { required: true, message: '请输入KEY', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
          sort: [
            { required: true, type: 'number', message: '序号必须为数字值'}
          ],
          pId: [
            { required: true, type: 'number', message: '请选择父级字典项'}
          ],
          value: [
            { min: 0, max: 20, message: '长度在 0 到 20 个字符', trigger: 'blur' }
          ],
          description: [
            { min: 0, max: 200, message: '长度在 0 到 200 个字符', trigger: 'blur' }
          ]
        }
      }
    }


    // 字典组table配置
    tableConfig1: TableConfig = {
      table: {data: []},
      page: {
        hideOnSinglePage: true
      },
      columns: [
        {label: '字典组名称', prop: 'name', minWidth: '90'},
        {label: '操作', template: 'opr', minWidth: '40'}
        // , {
        //   label: '子级', children: [
        //     {prop: 'date2', label: '日期', minWidth: '90'},
        //     {prop: 'name2', label: '姓名', minWidth: '70'},
        //     {label: '操作', template: 'cz', minWidth: '80'}
        //   ]
        // }
      ]
    }

    // 字典项table配置
    tableConfig2: TableConfig = {
      table: {
        data: [],
        rowKey: 'id'
      },
      page: {
        hideOnSinglePage: true
      },
      columns: [
        {label: '序号', type: ColumnType.Index, width: '60'},
        {label: '字典项名称', prop: 'name', minWidth: '90'},
        {label: '字典项KEY', prop: 'itemKey', minWidth: '70'},
        {label: '字典项值', prop: 'value', minWidth: '80'},
        {label: '操作', template: 'address', minWidth: '80'}
        // , {
        //   label: '子级', children: [
        //     {prop: 'date2', label: '日期', minWidth: '90'},
        //     {prop: 'name2', label: '姓名', minWidth: '70'},
        //     {label: '操作', template: 'cz', minWidth: '80'}
        //   ]
        // }
      ]
    }

    checkSelf(value: number): void {
      // if(this.checkself == value){
      //   NoticeUtil.showAlert("不能选中自己，请重新选择")
      //   return;
      // }
    }

    selectItemByName(): void {
      if(this.groupFormData.id != null && this.groupFormData.id != ''){
        this.getDictItems(this.groupFormData.id,this.selectForm.itemName)
      }else {
        NoticeUtil.showAlert("请先选择字典组")
      }
    }

    closeGroupDrawer(): void {
      (this.$refs['groupFormData'] as ElForm).resetFields()
    }

    closeItemDrawer(): void {
      (this.$refs['itemFormData'] as ElForm).resetFields()
    }

    // 跳转编辑字典组抽屉
    toEditDictGroup(scope: RowCbParam): void {
      this.groupTitle = "修改字典组"
      console.log(scope.row)
      let dictGroup:DictsGroupModel = scope.row
      this.groupFormData.name = dictGroup.name;
      this.groupFormData.sort = dictGroup.sort;
      this.groupFormData.description = dictGroup.description;
      this.groupFormData.key = dictGroup.groupKey;
      this.groupFormData.id = dictGroup.id;
      this.flag.groupEditBtnFlag = true;
      this.flag.groupAddBtnFlag = false;
      this.flag.groupFlag = true;
    }

    // 跳转编辑字典项抽屉
    toEditDictItem(scope: RowCbParam): void {
      this.itemTitle = "修改字典项"
      let dictItem:DictsItemModel = scope.row
      this.checkself = dictItem.id
      this.itemFormData.name = dictItem.name;
      this.itemFormData.sort = dictItem.sort;
      this.itemFormData.description = dictItem.description;
      this.itemFormData.key = dictItem.itemKey;
      this.itemFormData.groupId = dictItem.groupId;
      this.itemFormData.value = dictItem.value;
      this.itemFormData.id = dictItem.id;
      this.itemFormData.pId = dictItem.pid||(scope.row as any).pId;
      this.flag.itemEditBtnFlag = true;
      this.flag.itemAddBtnFlag = false;
      this.flag.itemFlag = true;
    }

    // 删除字典组
    deleteDictGroup(scope: RowCbParam): void {
      this.$confirm('是否删除该字典组?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        HttpUtil.post({
          api: 'dicts/groups/' + (scope.row as DictsGroupModel).id + '/delete',
          gateway: Gateway.Uc
        }).then(() => {
          this.getGroup()
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '删除失败！'
          });
        })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
      console.log(scope)
    }

    // 删除字典项
    deleteDictItem(scope: RowCbParam): void {
      this.$confirm('是否删除该字典项?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        HttpUtil.post({
          api: 'dicts/groups/groups/' + this.groupFormData.id + '/items/' + (scope.row as DictsItemModel).id + '/delete',
          gateway: Gateway.Uc
        }).then(() => {
          DictsService.getDictItemTree((this.groupFormData as any).id)
          .then((data: any) => {
                this.tableConfig2.table.data = data;
                this.dictItems = data;
                this.itemFormData.groupId = this.groupFormData.id
              }
          )
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '删除失败！'
          });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
      console.log(scope)
    }

    isEdit = 1;
    // 选择字典组行事件
    chooseDictGroup(scope: RowCbParam): void {
      this.groupFormData.id = (scope as any).id
      this.isEdit = (scope as any).isEdit
      console.log(this.isEdit);
      DictsService.getDictItemTree((scope as any).id)
      .then((data: any) => {
            this.tableConfig2.table.data = data;
            this.itemFormData.groupId = this.groupFormData.id
          }
      )
      DictsService.getItemsByGroupKey((scope as any).groupKey)
      .then((data: any) => {
            this.dictItems = data;
          }
      )
      // this.getDictItems((scope as any).id);
    }

    // 跳转添加字典组抽屉
    showDictGroupDrawer(): void {
      this.groupTitle = "添加字典组"
      this.clearGroupFormData();
      this.flag.groupAddBtnFlag = true;
      this.flag.groupEditBtnFlag = false;
      this.flag.groupFlag = true;
    }

    // 跳转添加字典项抽屉
    showDictItemDrawer(): void {
      this.itemTitle = "添加字典项"
      if(this.groupFormData.id == null || this.groupFormData.id == undefined || this.groupFormData.id == ''){
        NoticeUtil.showAlert("请先选择字典组")
        return;
      }
      this.clearItemFormData();
      this.flag.itemAddBtnFlag = true;
      this.flag.itemEditBtnFlag = false;
      this.flag.itemFlag = true;
    }

    // 关闭抽屉
    closeDrawer(): void {
      this.flag.groupFlag = false
      this.flag.itemFlag = false
    }

    // 添加字典组
    addDictGroup(formName: any): void {
      (this.$refs[formName] as ElForm).validate((valid) => {
        if (valid) {
          HttpUtil.post({
            api: 'dicts/groups',
            gateway: Gateway.Uc,
            body: {
              "description": this.groupFormData.description,
              "groupKey": this.groupFormData.key,
              "isEdit": 1,
              "name": this.groupFormData.name,
              "orgId": this.$store.state.userInfo.topOrg.id,
              "sort": this.groupFormData.sort
            }
          }).then(data => {
            this.getGroup()
            this.flag.groupFlag = false
          }).catch(error => {
            console.log(error)
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });

    }

    // 添加字典项
    addDictItem(formName: any): void {
      (this.$refs[formName] as ElForm).validate((valid) => {
        if (valid) {
          HttpUtil.post({
            api: 'dicts/groups/' + this.itemFormData.groupId + '/items',
            gateway: Gateway.Uc,
            body: {
              "description": this.itemFormData.description,
              "enabled": 1,
              "groupId": this.itemFormData.groupId,
              "isEdit": 1,
              "itemKey": this.itemFormData.key,
              "name": this.itemFormData.name,
              "pid": this.itemFormData.pId,
              "sort": this.itemFormData.sort,
              "value": this.itemFormData.value
            }
          }).then(data => {
            this.flag.itemFlag = false
            DictsService.getDictItemTree((this.groupFormData as any).id)
            .then((data: any) => {
                  this.tableConfig2.table.data = data;
                  this.dictItems = data;
                  this.itemFormData.groupId = this.groupFormData.id
                }
            )
          }).catch(error => {
            console.log(error)
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }

    // 编辑字典组
    editDictGroup(formName: any): void {
      (this.$refs[formName] as ElForm).validate((valid) => {
        if (valid) {
          HttpUtil.post({
            api: 'dicts/groups/' + this.groupFormData.id,
            gateway: Gateway.Uc,
            body: {
              "description": this.groupFormData.description,
              "groupKey": this.groupFormData.key,
              "id": this.groupFormData.id,
              "isEdit": 1,
              "name": this.groupFormData.name,
              "orgId": 1,
              "sort": this.groupFormData.sort
            }
          }).then(data => {
            this.getGroup()
            this.flag.groupFlag = false
          }).catch(error => {
            console.log(error)
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });

    }

    // 编辑字典项
    editDictItem(formName: any): void {
      (this.$refs[formName] as ElForm).validate((valid) => {
        if (valid) {
          HttpUtil.post({
            api: 'dicts/groups/' + this.groupFormData.id + '/items/' + this.itemFormData.id,
            gateway: Gateway.Uc,
            body: {
              "description": this.itemFormData.description,
              "enabled": 1,
              "groupId": this.itemFormData.groupId,
              "id": this.itemFormData.id,
              "isEdit": 1,
              "itemKey": this.itemFormData.key,
              "name": this.itemFormData.name,
              "pid": this.itemFormData.pId,
              "sort": this.itemFormData.sort,
              "value": this.itemFormData.value
            }
          }).then(data => {
            DictsService.getDictItemTree((this.groupFormData as any).id)
            .then((data: any) => {
                  this.tableConfig2.table.data = data;
                  this.dictItems = data;
                  this.itemFormData.groupId = this.groupFormData.id
                }
            )
            this.flag.itemFlag = false
          }).catch(error => {
            console.log(error)
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }

    // 获取字典项列表
    getDictItems(id: any,name: String = ''): void {
      HttpUtil.get(
          {
            api: 'dicts/groups/'+id+'/items',
            // api: 'dicts/groups/'+id+'/items/tree',
            gateway: Gateway.Uc,
            query: {
              id: id,
              name: name
            }
          })
      .then(
          (data: any) => {
            console.log(data)
            this.tableConfig2.table.data = data
          }
      )
    }

    // 清空字典项表单
    clearItemFormData(): void{
      this.itemFormData.key = ''
      this.itemFormData.name = ''
      this.itemFormData.sort = ''
      this.itemFormData.value = ''
      this.itemFormData.description = ''
      this.itemFormData.pId = -1
    }

    // 清空字典组表单
    clearGroupFormData(): void{
      this.groupFormData.description = ''
      this.groupFormData.key = ''
      this.groupFormData.name = ''
      this.groupFormData.sort = ''
    }

    getGroup(): void{
      DictsService.getDictGroups()
      .then((data) =>{
            console.log(data)
            this.tableConfig1.table.data = data;
            this.dictGroups = data
          }
      )
    }

    // 生命周期--渲染
    mounted() {
      this.getGroup()
      this.tableConfig2.table.data = []
    }
  }
</script>

<style scoped lang="scss">
  .left-table {
    width: 25%;
    float: left;
  }
  .right-table {
    width: 74%;
    float: right;
    margin-top: 43px;
    position: relative;
  }
</style>
