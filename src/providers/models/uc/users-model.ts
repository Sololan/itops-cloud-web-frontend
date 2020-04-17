import {BaseModel} from '@/providers/models/base-model'
import {ResourceInfo} from '@/providers/models/uc/resources-model'
import {OrgInfo} from '@/providers/models/uc/orgs-model'
import {RoleInfo} from '@/providers/models/uc/roles-model'

/**
 * 用户信息
 */
export interface UserInfo extends BaseModel {
  id?: number;  // 用户ID
  username?: string;  // 用户名
  password?: string;  // 登录密码
  salt?: string;  // 盐
  fullName?: string;  // 用户姓名
  birthday?: string; // 生日
  sex?: number; // 性别（1：男；2：女；3：其他；4：保密）
  icon?: string;  // 头像
  email?: string; // 邮箱
  phone?: string | number; // 联系电话
  address?: string; // 地址
  status?: number;  // 用户状态(0: 停用；1：启用)
  sort?: number;  // 排序
  userType?: number;  // 用户类型
  remarks?: string;  // 备注
  menus?: ResourceInfo[];  // 菜单信息
  resourceList?: ResourceInfo[]; // 资源信息
  params?: { [key: string]: any }; // 扩展字段
  topOrg?: OrgInfo;
  orgList?: OrgInfo[];
  roleList?: RoleInfo[];
  roleNameList?: string;

  roleId?: number;  //角色id
}
