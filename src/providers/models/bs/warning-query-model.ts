export interface WarningQueryParam {
  warningLevel?: number  // 告警级别
  warningInfo?: string  // 告警内容
  ipAddress?: string  // IP地址
  startTime?: string  // 开始时间
  endTime?: string  // 结束时间
  warningStatus?: string  // 告警状态
  orgId?: number //组织id
  topNumber?: number //top n
}
