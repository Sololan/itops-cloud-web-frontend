<template>
  <div>
    <yj-drawer
      :title="title"
      :value="value"
      @input="(flag) => this.$emit('input', flag)"
      @open="handleDrawerOpen"
      @closed="handleDrawerClosed">

      <el-form
          :model="formData"
          :rules="rules"
          label-width="205px" class="p-t-10 p-b-10"
          ref="userForm">
        <el-form-item label="用户名" prop="username">
          <el-input
              style="width: 190px"
              v-model="formData.username"
              :disabled="disableUsername">
          </el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="fullName">
          <el-input style="width: 190px" v-model="formData.fullName"></el-input>
        </el-form-item>
        <el-form-item label="用户角色" prop="roleId">
          <el-select style="width: 190px" v-model="formData.roleId" disabled placeholder="请选择">
            <el-option
                v-for="role in roles"
                :key="role.id"
                :label="role.name"
                :value="role.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="联系电话" prop="phone">
          <el-input style="width: 190px" v-model.number="formData.phone"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input style="width: 190px" v-model="formData.email"></el-input>
        </el-form-item>

      </el-form>

      <template #footer>
        <el-button type="primary" :disabled="disableSaveBtn" @click="handleSave">保存</el-button>
        <el-button @click="closeDrawer">取消</el-button>
      </template>
    </yj-drawer>

<!--    <el-drawer-->
<!--        :append-to-body="true"-->
<!--        :before-close="closeDrawer"-->
<!--        :title="title"-->
<!--        :visible="userDrawerFlag"-->
<!--        @open="handleOpen"-->
<!--        size="29%">-->
<!--      -->
<!--      <div class="footer">-->
<!--      </div>-->
<!--    </el-drawer>-->
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Ref, Vue} from 'vue-property-decorator'
  import {UserInfo} from '@/providers/models/uc/users-model'
  import {namespace, State} from 'vuex-class'
  import {RoleInfo} from '@/providers/models/uc/roles-model'
  import UsersService from '@/providers/services/uc/users-service'
  import NoticeUtil from '@/providers/utils/notice-util'
  import {ElForm} from 'element-ui/types/form'
  import YjDrawer from '@/components/common/yj-drawer.vue'
  import {CRUD} from '@/providers/models/enums'
  import {CATCH_ERROR} from '@/providers/models/consts'

  const UserModule = namespace('userModule')

  @Component({
    components: {YjDrawer}
  })
  export default class UserDrawer extends Vue {
    @Prop() value: boolean

    @Prop() op: CRUD

    @Prop() data: UserInfo

    @Ref() readonly userForm: ElForm

    @State
    private userInfo: UserInfo

    @UserModule.State
    private roles: RoleInfo[]

    @UserModule.State
    private roleUserId: number

    @UserModule.Action
    public pagingQueryUsers: Function

    formLabelWidth = '36.7%'

    //Computed
    get title() {
      if (this.op === CRUD.Create) {
        return '添加用户'
      } else if (this.op === CRUD.Update) {
        return '修改用户'
      }
    }

    get disableUsername() {
      return this.op === CRUD.Update
    }

    private readonly defaultData: UserInfo = {
      username: null,
      fullName: null,
      roleId: null,
      phone: null,
      email: null,
    }

    formData: UserInfo = {...this.defaultData}

    handleDrawerOpen(){
      if (this.op === CRUD.Update) {
        this.formData = {...this.data}; //深拷贝对象值, 传引用会修改这一行原始值
        this.formData.roleId = this.formData.roleList[0].id
        if(this.formData.phone){
          this.formData.phone = parseInt(''+ this.formData.phone)
        }
      } else if (this.op === CRUD.Create) {
        this.formData.roleId = this.roleUserId
      }
    }

    handleDrawerClosed(){
      this.formData = {...this.defaultData}
      this.userForm.clearValidate()
    }

    checkPhone = (rule: any, value: any, callback: Function) => {
      // setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('联系电话只能输入数字'))
        } else {
          if (!(/^1[3456789]\d{9}$/.test('' + value))) {
            callback(new Error('联系电话格式错误'))
          } else {
            callback()
          }
        }
      // }, 100)
    }

    checkUsername = (rule: any, value: any, callback: Function) => {
      if (!(/^[0-9a-zA-Z]*$/g.test(value))) {
        return callback(new Error('用户名只能包含字母和数字'))
      }

      UsersService.getByUsername(value.trim())
      .then((user: UserInfo) => {
        if (this.op == CRUD.Update && user.id === this.data.id) { //和原来的username
          return callback()
        }
        callback(new Error('用户名在云平台已经存在'))
      }).catch((error) => {  //无重名
        callback()  //自定义校验 callback 必须被调用
      })
    }

    rules = {
      username: [
        {required: true, message: '请输入用户名', trigger: 'blur'},
        {max: 25, message: '最大长度为50个字节', trigger: 'blur'},
        {validator: this.checkUsername, trigger: 'blur'}
      ],
      fullName: [
        {required: true, message: '请输入姓名', trigger: 'blur'},
        {max: 50, message: '最大长度为100个字节', trigger: 'blur'}
      ],
      roleId: [
        {required: true, message: '请选择用户角色', trigger: 'blur'}
      ],
      phone: [
        {required: true, message: '联系电话不能为空', trigger: 'blur'},
        {validator: this.checkPhone, trigger: 'blur'}
      ],
      email: [
        {required: true, message: '请填写邮箱', trigger: 'blur'},
        {max: 100, message: '最大长度为200个字节', trigger: 'blur'},
        {type: 'email', message: '邮箱格式错误', trigger: 'blur'}
      ]
    }

    disableSaveBtn: boolean = false

    handleSave() {
      this.disableSaveBtn = true
      const request = {
        id: this.formData.id,
        orgIdList: [this.userInfo.topOrg.id],
        username: this.formData.username,
        fullName: this.formData.fullName,
        roleIdList: [this.formData.roleId],
        phone: this.formData.phone,
        email: this.formData.email
      }
      this.userForm.validate((valid: boolean) => {
        if (!valid) {
          this.disableSaveBtn = false
          return false
        }
        if (this.op === CRUD.Create) {
          request.id = null
          this.addUser(request)
        } else if (this.op === CRUD.Update) {
          this.updateUser(request)
        }
        setTimeout(() => {
          this.disableSaveBtn = false
        }, 2000)
      })
    }

    addUser(user: UserInfo) {
      UsersService.addUser(user)
      .then((response: any) => {
        this.$emit('tableDataChange')
        this.closeDrawer()
        NoticeUtil.showMsg('添加成功')
      }).catch(CATCH_ERROR)
    }

    updateUser(user: UserInfo) {
      UsersService.updateUser(user)
      .then((response: any) => {
        this.$emit('tableDataChange')
        this.closeDrawer()
        NoticeUtil.showMsg('修改成功')
      }).catch(CATCH_ERROR)
    }

    closeDrawer() {
      this.$emit('input', false)
    }
  }
</script>

<style scoped lang="scss">
  /*/deep/ .el-form{*/
  /*  width: 300px;*/
  /*  margin: 32px auto;*/
  /*}*/
  /deep/ .el-form-item__label {
    font-size:14px;
    font-family:PingFang SC;
    font-weight:500;
    color: #333333;
  }

  /*/deep/ #el-drawer__title {*/
  /*  height:1.5%;*/
  /*  font-size:16px;*/
  /*  font-family:Microsoft YaHei;*/
  /*  font-weight:bold;*/
  /*  color:rgba(51,51,51,1);*/
  /*  margin: 0% 5.5%;*/
  /*  padding-bottom: 3.1%;*/
  /*  border-bottom: solid 1px #999999*/
  /*}*/

  /*.footer {*/
  /*  margin: 0 5.5%;*/
  /*  border-top: solid 1px #999999;*/
  /*  height: 5.2%;*/
  /*  padding-bottom: 1.1%;*/
  /*  padding-top: 1.1%;*/
  /*  text-align: center;*/
  /*  width: 89%;*/
  /*  position: absolute;*/
  /*  bottom: 0;*/
  /*}*/

</style>