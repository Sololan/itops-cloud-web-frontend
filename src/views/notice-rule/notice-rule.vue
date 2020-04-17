<template>
  <yj-container>
    <notice-rule-drawer
        v-model="drawerFlag"
        :op="op"
        :data="fromData"
        @tableDataChange="loadTable">
    </notice-rule-drawer>

    <yj-table
        :config="tableConfig"
        @pagination-change="handlePaginationChange"
        @size-change="handleSizeChange">
      <!--列表-查询-->
      <template #search>
        <yj-table-search>
          <el-form-item label="告警级别">
            <el-select v-model="queryParam.warningLevel" clearable placeholder="请选择">
              <el-option
                  v-for="warnLevel in warnLevels"
                  :key="warnLevel.id"
                  :label="warnLevel.name"
                  :value="warnLevel.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="告警阶段">
            <el-select v-model="queryParam.warningStage" clearable placeholder="请选择">
              <el-option
                  v-for="warnStage in warnStages"
                  :key="warnStage.id"
                  :label="warnStage.name"
                  :value="warnStage.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="通知时间">
            <el-select v-model="queryParam.noticeTiming" clearable placeholder="请选择">
              <el-option
                  v-for="noticeTiming of noticeTimings.entries()"
                  :key="noticeTiming[0]"
                  :label="noticeTiming[1]"
                  :value="noticeTiming[0]">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="通知方式">
            <el-select v-model="queryParam.noticeWay" clearable placeholder="请选择">
              <el-option
                  v-for="noticeWay in noticeWays"
                  :key="noticeWay.id"
                  :label="noticeWay.name"
                  :value="noticeWay.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="通知人">
            <el-input v-model="queryParam.noticeUser" clearable placeholder="请输入" />
          </el-form-item>

          <el-form-item>
            <el-button
                v-if="isManager"
                type="primary"
                @click="handleQuery">查询
            </el-button>
          </el-form-item>
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

          <template #right>
            <span class="vertical-box">
              <span class="notice-way-label">可选择通知方式: </span>
              <span v-for="noticeWay in noticeWays">
                <span v-if="noticeWayInfos[noticeWay.id].enabled === 1" class="vertical-box">
                  <img :src="noticeWayInfos[noticeWay.id].icon" class="notice-way-img" />
                  <span class="notice-way-quantity">{{noticeWayInfos[noticeWay.id].quantity}}</span>
                </span>
              </span>
            </span>
          </template>
        </yj-table-operate>
      </template>

      <!--      告警级别col, id-5=index -->
      <template #warningLevelCol="scope">
        <span class="warning-level-font" :style="{'color':levelColors[scope.row.warningLevel - 5]}">
          {{scope.row.warningLevelNAME}}
        </span>
      </template>

      <!--      通知时间列-->
      <template #noticeTimingCol="scope">
        {{scope.row.noticeTimingName}}
        <span v-if="scope.row.noticeTiming === 3">
            {{workTime}}
        </span>
      </template>

      <!-- 通知方式icons列-->
      <template #noticeWaysCol="scope">
        <span v-if="scope.row.noticeMethod != null" class="vertical-box notice-way-col">
          <span v-for="methodId in scope.row.noticeMethod.split(',')">
            <!--                v-if="noticeWayInfos[methodId].enabled === 1"-->
            <img
                :src="noticeWayInfos[methodId].icon"
                class="notice-way-img" />
          </span>
        </span>
      </template>

      <!--op-col-->
      <template #noticeRuleOp="scope">
        <span v-if="isManager">
          <el-link class="text-underline" type="primary" @click="handleUpdate(scope)">修改</el-link>
          <el-link class="text-underline" type="danger" @click="handleDelete(scope)">删除</el-link>
        </span>
      </template>

    </yj-table>
  </yj-container>
</template>

<script lang="ts">
  import {Component, Vue, Watch} from 'vue-property-decorator'
  import {RowCbParam, TableConfig} from '@/providers/models/common/table-model'
  import YjTable from '@/components/common/yj-table.vue'
  import YjContainer from '@/components/common/yj-container.vue'
  import YjTableSearch from '@/components/common/yj-table-search.vue'
  import YjTableOperate from '@/components/common/yj-table-operate.vue'
  import {ColumnAlign, ColumnType, CRUD, RoleCode} from '@/providers/models/enums'
  import NoticeRuleDrawer from '@/views/notice-rule/notice-rule-drawer.vue'
  import {namespace, State} from 'vuex-class'
  import {DictItem} from '@/providers/models/uc/dicts-model'
  import {PageResult} from '@/providers/models/common/http-model'
  import {NoticeRuleModel} from '@/providers/models/bs/notice-rule-model'
  import {UserInfo} from '@/providers/models/uc/users-model'
  import NoticeUtil from '@/providers/utils/notice-util'
  import NoticeRuleService from '@/providers/services/bs/notice-rule-service'
  import {CATCH_ERROR} from '@/providers/models/consts'
  import WorkTimeService from '@/providers/services/bs/worktime-service'
  import {WorkTimeParam} from '@/providers/models/bs/worktime-model'
  import moment from 'moment'

  const NoticeRuleModule = namespace('noticeRuleModule')
  @Component({components: {NoticeRuleDrawer, YjTable, YjContainer, YjTableSearch, YjTableOperate}})
  export default class NoticeRule extends Vue {
    queryParam: NoticeRuleModel = {
      orgId: 0,
      warningLevel: null,
      warningStage: null,
      noticeTiming: null,
      noticeWay: null,
      noticeUser: null
    }

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
    private noticeWayInfos: object[]
    @NoticeRuleModule.State
    private noticeRulesPage: PageResult<NoticeRuleModel[]>

    @NoticeRuleModule.Action
    public getNoticeWays: Function
    @NoticeRuleModule.Action
    public getWarnLevels: Function
    @NoticeRuleModule.Action
    public getWarnStages: Function
    @NoticeRuleModule.Action
    public getPostponementStrategies: Function
    @NoticeRuleModule.Action
    public getNoticeWayQuantity: Function
    @NoticeRuleModule.Action
    public queryNoticeRules: Function

    tableConfig: TableConfig = {
      table: {data: []},
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 10
      },
      columns: [
        {label: '序号', type: ColumnType.Index, width: '70', align: ColumnAlign.Center},
        {label: '告警级别', template: 'warningLevelCol', minWidth: '70'},
        {label: '告警阶段', prop: 'warningsTageNAME', minWidth: '70'},
        {label: '通知时间', template: 'noticeTimingCol', width: '300', showOverflowTooltip: true},
        {label: '延迟策略', prop: 'postPoneMentStrategyNAME', minWidth: '70'},
        {label: '通知方式', template: 'noticeWaysCol', width: '200'},
        {label: '通知人', prop: 'noticeUser', minWidth: '70', showOverflowTooltip: true},
        {label: '操作', template: 'noticeRuleOp', width: '200'}
      ]
    }

    table = this.tableConfig.table
    page = this.tableConfig.page

    get isManager() {
      return this.userInfo.roleList.length > 0 && this.userInfo.roleList[0].code === RoleCode.Manager
    }

    levelColors: string[] = [
      'rgba(4, 255, 253, 1)',
      'rgba(255, 221, 0, 1)',
      'rgba(231, 0, 18, 1)'
    ]

    /// user drawer

    drawerFlag: boolean = false

    op: CRUD = CRUD.Create

    fromData: NoticeRuleModel = {}

    mounted() {
      this.getWorkTime()
      this.getNoticeWays()
      this.getWarnLevels()
      this.getWarnStages()
      this.getPostponementStrategies()
      this.getNoticeWayQuantity(this.userInfo.topOrg.id)
      this.queryParam.orgId = this.userInfo.topOrg.id

      this.loadTable()
    }

    loadTable() {
      this.queryNoticeRules({
        offset: (this.page.currentPage - 1) * this.page.pageSize,
        limit: this.page.pageSize,
        query: this.queryParam
      })
    }

    @Watch('noticeRulesPage')
    watchItem(newPage: PageResult<NoticeRuleModel[]>, oldPage: PageResult<NoticeRuleModel[]>): void {
      this.page.total = newPage.totalCount
      this.table.data = newPage.result.map((value: NoticeRuleModel, index, array) => {
        return {
          ...value,
          noticeTimingName: this.noticeTimings.get(value.noticeTiming)
        }
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


    handleDelete(scope: RowCbParam) {
      NoticeUtil.showConfirm('您确定要删除吗？')  //cancel catch
      .then(() => {
        NoticeRuleService.deleteById((scope.row as any).id)
        .then(() => {
          this.loadTable()
          NoticeUtil.showMsg('删除成功')
        }).catch(CATCH_ERROR)
      })
    }

    getWorkTime() {
      WorkTimeService.getWorkTime()
      .then((time: WorkTimeParam) => {
        this.constructWorkTime(time)
      }).catch(CATCH_ERROR)
    }

    workTime: string = ''
    weekMap: Map<string, number> = new Map([
      ['周一', 11],
      ['周二', 21],
      ['周三', 31],
      ['周四', 41],
      ['周五', 51],
      ['周六', 61],
      ['周日', 71]
    ])

    private constructWorkTime(time: WorkTimeParam) {
      this.workTime = ' ('
      this.workTime += this.convertWeek(time.week) + ' '
      this.workTime += moment(time.startTime).format('HH:mm') + '至'
      this.workTime += moment(time.endTime).format('HH:mm') + ')'
    }

    private convertWeek(week: string): string {
      const weekStrs: string[] = []
      let weekSum = 0
      for (let item of week.split(',')) {
        if (this.weekMap.has(item)) {
          weekStrs.push(item)
          weekSum += this.weekMap.get(item)
        }
      }
      if (weekStrs.length === 7) {
        return '周一至周日'
      } else {
        if (weekStrs.length === 5 && weekSum === 155) {
          return '周一至周五'
        } else if (weekStrs.length === 6 && weekSum === 216) {
          return '周一至周六'
        } else {  //week不连续, 则排序后返回
          let result: string = ''
          const sortedWeekStrs = weekStrs.sort((a, b) => this.weekMap.get(a) - this.weekMap.get(b))
          for (let i = 0; i < sortedWeekStrs.length; i++) {
            if (i !== 0) {
              result += ','
            }
            result += sortedWeekStrs[i]
          }
          return result
        }
      }
    }

    /// rule drawer

    handleAdd() {
      this.openDrawer(CRUD.Create)
    }

    handleUpdate(scope: RowCbParam) {
      NoticeRuleService.getById((scope.row as any).id)
      .then((response: NoticeRuleModel) => {
        this.openDrawer(CRUD.Update, {
          ...response,
          noticeMethodIds: response.noticeWayList.map((value) => {
            return value.noticeMethod
          })
        })
      }).catch(CATCH_ERROR)
    }

    openDrawer(op: CRUD, formData?: NoticeRuleModel) {
      this.op = op
      if(formData) {
        this.fromData = formData
      }
      this.drawerFlag = true
    }

  }
</script>

<style scoped lang="scss">
  .text-underline {
    text-decoration: underline
  }

  .vertical-box {
    display: flex;
    align-items: center;
  }

  .notice-way-col {
    justify-content: center;
  }

  .warning-level-font {
    width: 29px;
    height: 15px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
  }

  .notice-way-label {
    height: 17px;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
  }
  .notice-way-img {
    margin-left: 10px;
    margin-right: 7px;
  }
  .notice-way-quantity {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
  }
</style>
