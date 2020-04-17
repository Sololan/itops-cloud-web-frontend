export interface WarningStatisticsModel {
  id?: number //PK
  orgId?: number //根机构(T_BASE_ORG.ID)
  ipAddress?: string //IP地址
  warningDay?: string  //告警日期
  warningInfo?: string	//告警内容
  warningLevel?: number  //告警级别（字典项）
  warningSum?: number  //告警数量
}