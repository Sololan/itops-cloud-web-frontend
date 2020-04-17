import {BaseModel} from '@/providers/models/base-model';

export interface TenantParam extends BaseModel {
    id?: number  // 组织id
    lastConnectTime?: string  // 最后连接时间
    connectStatus?: number  // 连接状态
    fullName?: string  // 组织全名
    contact?: string  // 联系人
    phone?: string  // 电话号
    createTime?: string  // 创建时间
    email?: ''  // 邮箱
    address?: ''  // 地址
    pid?: number

    // 添加数据必需
    code?: string  // 告警编号

}
