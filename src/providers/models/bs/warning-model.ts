import {BaseModel} from '@/providers/models/base-model';

export interface WarningParam extends BaseModel{
    id?: number  // 告警id
    orgId?: number  // 根机构id
    warningCode?: string  // 告警编号
    warningLevel?: number  // 告警级别
    warningInfo?: string  // 告警内容
    ipAddress?: string  // IP地址
    warningTime?: string  // 告警时间
    warningStatus?: string // 告警状态
    closeTime?: string  // 关闭时间
    equipmentId?: number // 设备id
    monitorId?: number  // 监控id
    users?: string  // 通知用户列表
    warningLevelName?: string  // 告警级别名称
}
