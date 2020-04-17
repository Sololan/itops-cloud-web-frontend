<template>
  <div>
    <yj-drawer
        :title="title"
        size="middle"
        :value="value"
        @open="handleDrawerOpen"
        @closed="handleDrawerClosed"
        @input="(flag) => this.$emit('input', flag)">

      <el-form
          :model="formData"
          :rules="rules"
          class="notice-way-font"
          :label-width="formLabelWidth"
          ref="ruleForm">
        <el-form-item class="rule-form-item" label="告警级别：" prop="warningLevel">
          <el-radio-group v-model="formData.warningLevel">
            <!--              label:  Radio 的 value-->
            <el-row style="width: 378px">
              <el-col
                  :span="8"
                  v-for="warnLevel in warnLevels"
                  :key="warnLevel.id">
                <el-radio :label="warnLevel.id">
                  {{warnLevel.name}}
                </el-radio>
              </el-col>
            </el-row>
          </el-radio-group>
        </el-form-item>

        <el-form-item class="rule-form-item" label="告警阶段：" prop="warningStage">
          <el-radio-group v-model="formData.warningStage">
<!--            选中意味着变量的值为相应 Radio label属性的值-->
            <el-row style="width: 378px">
              <el-col
                  :span="8"
                  v-for="warnStage in warnStages"
                  :key="warnStage.id">
                <el-radio :label="warnStage.id">
                  {{warnStage.name}}
                </el-radio>
              </el-col>
            </el-row>

          </el-radio-group>
        </el-form-item>

        <el-form-item class="rule-form-item" label="通知时间：" prop="noticeTiming">
          <el-radio-group v-model="formData.noticeTiming">
            <el-row style="width: 378px">
              <el-col
                  :span="8"
                  v-for="noticeTiming of noticeTimings.entries()"
                  :key="noticeTiming[0]">
                <el-radio :label="noticeTiming[0]">
                  {{noticeTiming[1]}}
                </el-radio>
              </el-col>
            </el-row>

          </el-radio-group>
        </el-form-item>

        <el-form-item class="rule-form-item" label="延迟策略：" prop="postponementStrategy">
          <el-radio-group v-model="formData.postponementStrategy">
            <el-row style="width: 378px">
              <el-col
                  :span="8"
                  v-for="strategy in postponementStrategies"
                  :key="strategy.id">
                <el-radio
                    v-if="!(formData.warningStage === 9 && strategy.id !== 10)"
                    :label="strategy.id">
                  {{strategy.name}}
                </el-radio>
              </el-col>
            </el-row>
          </el-radio-group>
        </el-form-item>

        <el-form-item class="rule-form-item" style="margin-bottom: 10px" label="通知方式：" prop="noticeMethodIds">
          <!--label与数组中的元素值相对应，如果存在指定的值则为选中状态，否则为不选中 -->
          <el-checkbox-group class="notice-methods-checkbox" v-model="formData.noticeMethodIds">
            <!--        1. noticeWays: 字典项列表 2. noticeWayInfos: 通知方式可用信息 3. noticeMethodIds: 表单绑定的数据  -->
            <span v-for="noticeWay in noticeWays">
              <el-checkbox
                  :disabled="noticeWayInfos[noticeWay.id].enabled !== 1"
                  :key="noticeWay.id"
                  :label="noticeWay.id">
                <img :src="noticeWayInfos[noticeWay.id].icon" />
                <span style="margin-left: 10px">
                  {{noticeWay.name}} {{noticeWayInfos[noticeWay.id].quantity}}
                </span>
              </el-checkbox>
            </span>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item class="rule-form-item" style="margin-bottom: 0">
          <span class="notice-way-note">注: 微信需要通知人绑定微信公众号</span>
        </el-form-item>
        <el-form-item class="rule-form-item" label="通知人：" prop="noticeUserList">
          <div class="notice-user-box">
            <el-tag
                class="user-tag"
                v-for="(user, index) in formData.noticeUserList"
                :key="user.noticeUser"
                closable
                :disable-transitions="false"
                @close="handleCloseTag(index)">
              {{user.fullName}}
            </el-tag>
            </div>
            <el-button class="select-user-btn" type="primary" @click="openDialog">选择人员</el-button>
        </el-form-item>

      </el-form>

      <template #footer>
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button @click="closeDrawer">取消</el-button>
      </template>
    </yj-drawer>

    <notice-user
        v-model="dialogFlag"
        :selectedUsers="formData.noticeUserList"
        @selectedUsersChanged="handleUsersChange">
    </notice-user>

  </div>
</template>

<script lang="ts">
  import {Component, Prop, Ref, Vue, Watch} from 'vue-property-decorator'
  import YjDrawer from '@/components/common/yj-drawer.vue'
  import {DictItem} from '@/providers/models/uc/dicts-model'
  import {namespace, State} from 'vuex-class'
  import NoticeRule from '@/views/notice-rule/notice-rule.vue'
  import NoticeUser from '@/views/notice-rule/notice-user.ts.vue'
  import {NoticeRuleModel} from '@/providers/models/bs/notice-rule-model'
  import {CRUD} from '@/providers/models/enums'
  import {UserInfo} from '@/providers/models/uc/users-model'
  import NoticeRuleService from '@/providers/services/bs/notice-rule-service'
  import NoticeUtil from '@/providers/utils/notice-util'
  import {ElForm} from 'element-ui/types/form'
  import {CATCH_ERROR} from '@/providers/models/consts'

  const NoticeRuleModule = namespace('noticeRuleModule')
  @Component({
    components: {NoticeUser, NoticeRule, YjDrawer}
  })
  export default class NoticeRuleDrawer extends Vue {
    @Prop() value: boolean

    @Prop() op: CRUD

    @Prop() data: NoticeRuleModel

    @Ref() readonly ruleForm: ElForm

    //Computed
    get title() {
      if (this.op === CRUD.Create) {
        return '添加规则'
      } else if (this.op === CRUD.Update) {
        return '修改规则'
      }
    }

    private readonly defaultData: NoticeRuleModel = {
      warningLevel: null,
      warningStage: null,
      noticeTiming: null,
      postponementStrategy: null,
      noticeMethodIds: [],
      noticeUserList: []
    }

    formData: NoticeRuleModel = {...this.defaultData}

    handleDrawerOpen(){
      if (this.op === CRUD.Update) {
        this.formData = this.data
        this.formData.noticeMethodIds = this.formData.noticeMethodIds.filter((methodId) => {
          return this.noticeWayInfos[methodId].enabled === 1
        })
      }
    }

    handleDrawerClosed() {
      this.formData = {...this.defaultData}
      this.ruleForm.resetFields()
    }

    @Watch('formData.warningStage')
    watchStage(val: number) {
      if (val === 9) {  //选择"告警关闭时", 只能且自动选择"立刻"
        this.formData.postponementStrategy = 10
      }
    }

    formLabelWidth = '18.3%' //label(92px) / form-item(504px)

    rules = {
      warningLevel: [
        {required: true, message: '请选择告警级别', trigger: 'change'}
      ],
      warningStage: [
        {required: true, message: '请选择告警阶段', trigger: 'change'}
      ],
      noticeTiming: [
        {required: true, message: '请选择通知时间', trigger: 'change'}
      ],
      postponementStrategy: [
        {required: true, message: '请选择延迟策略', trigger: 'change'}
      ],
      noticeMethodIds: [
        {required: true, message: '请选择通知方式', trigger: 'change'}
      ],
      noticeUserList: [
        {required: true, message: '请选择通知人', trigger: 'change'}
      ]
    }

    dialogFlag: boolean = false

    @State
    private userInfo: UserInfo
    @NoticeRuleModule.State
    private noticeWays: DictItem[]
    @NoticeRuleModule.State
    private warnLevels: DictItem[]
    @NoticeRuleModule.State
    private warnStages: DictItem[]
    @NoticeRuleModule.State
    private postponementStrategies: DictItem[]
    @NoticeRuleModule.State
    private noticeTimings: Map<number, string>
    @NoticeRuleModule.State
    private noticeWayInfos: any[]

    /** 删除通知人员tag */
    handleCloseTag(index: number) {
      this.formData.noticeUserList.splice(index, 1)
    }

    handleSave() {
      this.ruleForm.validate((valid: boolean) => {if (!valid) {
          return false
        }
        const request = {
          id: 0,
          orgId: this.userInfo.topOrg.id,
          warningLevel: this.formData.warningLevel,
          warningStage: this.formData.warningStage,
          postponementStrategy: this.formData.postponementStrategy,
          noticeTiming: this.formData.noticeTiming,
          noticeWayList: this.formData.noticeMethodIds.map(value => {
            return {noticeMethod: value}
          }),
          noticeUserList: this.formData.noticeUserList
        }
        if (this.op === CRUD.Create) {
          request.id = null
          this.addRule(request)
        } else if (this.op === CRUD.Update) {
          request.id = this.formData.id
          this.updateRule(request)
        }
      })
    }

    addRule(rule: NoticeRuleModel) {  // add 表格首页
      NoticeRuleService.add(rule)
      .then(() => {
        this.$emit('tableDataChange')
        this.closeDrawer()
        NoticeUtil.showMsg('添加成功')
      }).catch(CATCH_ERROR)
    }

    updateRule(rule: NoticeRuleModel) {
      NoticeRuleService.update(rule)
      .then(() => {
        this.$emit('tableDataChange')
        this.closeDrawer()
        NoticeUtil.showMsg('修改成功')
      }).catch(CATCH_ERROR)
    }

    closeDrawer() {
      this.$emit('input', false)
    }

    /// notice user dialog

    openDialog() {
      this.dialogFlag = true
    }

    /**
     *  选择人员页面点击保存后, 表格所有页勾选的人, 保存为选择的人
     */
    handleUsersChange(allPageChecked: Map<number, string>) {
      this.formData.noticeUserList = [] //一次赋值
      allPageChecked.forEach((value, key) => {
        this.formData.noticeUserList.push({
          noticeUser: key,
          fullName: value
        })
      })
    }

  }
</script>

<style scoped lang="scss">
  /deep/ .el-checkbox__label {
    display: inline-flex;
    align-items: center;
  }

  .notice-way-font {
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
  }

  .notice-way-note {
    font-size: 12px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #D80D19;
  }
  /deep/ .el-drawer {
    /*width: 41.7%*/
  }
  .rule-form-item {
    margin-left: 19.5%;
  }
  .notice-user-box {
    /*width: 49.2%;*/
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;

    box-sizing: border-box;
    width: 248px;
    min-height: 61px;
    padding: 5px 10px;

    border: 1px solid rgba(153, 153, 153, 1);

    .user-tag {
      height: 30px;
      margin-right: 10px;
      margin-bottom: 10px;

      background: rgba(235, 244, 254, 1);
      border: 1px solid rgba(199, 222, 254, 1);
      border-radius: 2px;

      font-size: 12px;
      font-family: PingFang SC;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
    }
  }
  .notice-methods-checkbox {
    display: flex;
    flex-direction: column;
  }
  .select-user-btn {
    position: absolute;
    /*(248+20)/504*/
    left: 53.5%;
    top: 0;
  }

</style>