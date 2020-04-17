import {BaseModel} from '@/providers/models/base-model'
import {UserInfo} from '@/providers/models/uc/users-model'
import {ResourceInfo} from '@/providers/models/uc/resources-model'

/**
 * 角色信息
 */
export interface RoleInfo extends BaseModel {
  id?: number; // 角色ID
  name?: string; // 角色名称
  code?: string; // 角色编码
  enabled?: number; // 是否启用 (0: 否；1：是)
  orgId?: number;  // 角色所属组织
  sort?: number; // 排序
  remarks?: string;  // 备注
  userList?: UserInfo[];
  resourceList?: ResourceInfo[];
}
