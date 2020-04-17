/**
 * 租户管理员参数
 */
import {BaseModel} from "@/providers/models/base-model";
import {OrgInfo} from "@/providers/models/uc/orgs-model";
import {RoleInfo} from "@/providers/models/uc/roles-model";

export interface TenantManagerModel extends BaseModel{
    id?: number //租户管理员id
    username?: string //用户名
    fullName?: string  // 用户姓名
    orgId?: number //组织id（冗余）
    roleId?: number //角色id（冗余）
    orgIdList?: number[] //所属租户idlist
    roleIdList?: number[] //用户角色idlist
    orgList?: OrgInfo[] //组织list
    roleList?: RoleInfo[] // 角色list
    phone?: number|string // 联系电话
    email?: string // 邮箱
}

/**
 * 租户管理员查询参数
 */
export interface TenantManagerQueryModel {
    username?: string //用户名
    fullName?: string //姓名
    startDate?: string //添加开始日期
    endDate?: string //添加结束日期
    orgId?: number //组织id
    roleCode?: string //角色code
}