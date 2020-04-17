import {BaseModel} from '@/providers/models/base-model'
import {NoticeWayModel} from '@/providers/models/bs/notice-way'
import {NoticeUserModel} from '@/providers/models/bs/notice-user'

export interface NoticeRuleModel extends BaseModel{
  /**
   * t_ops_notice_rule表中的
   */
  id?: number   //PK
  orgId?: number    //根机构(T_BASE_ORG.ID)
  warningLevel?: number   //告警级别（字典项）
  warningStage?: number   //告警阶段（字典项）
  noticeTiming?: number   //通知时间（1：任何时间 2：非工作时间 3：工作时间，周一到周五8：30-17：30）
  postponementStrategy?: number   //延迟策略（1：立刻 2：延迟5分钟 3：延迟10分钟）
  /**
   * 响应中的
   */
  warningLevelNAME?: string
  warningsTageNAME?: string
  postPoneMentStrategyNAME?: string

  noticeWay?: number    //通知方式id query用
  noticeMethod?: string   //通知方式(多个以逗号拼接)
  noticeUser?: string  //通知人

  noticeWayList?: NoticeWayModel[]
  noticeUserList?: NoticeUserModel[]
  /**
   * 构造的
   */
  noticeTimingName?: string
  noticeMethodIds?: number[] // 1.表格: noticeMethod.split(') 2.drawer:  noticeWayList对象的noticeMethod
}