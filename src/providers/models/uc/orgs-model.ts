import {BaseModel} from '@/providers/models/base-model'

/**
 * 组织信息
 */
export interface OrgInfo extends BaseModel {
  id?: number; // 组织ID
  fullName?: string; // 组织全程
  simpleName?: string; // 组织简称
  pid?: number;  // 父组织ID
  pfullname?: string;  // 父组织名称
  code?: string; // 组织编码
  phone?: string;  // 联系电话
  buildDate?: string;  // 成立时间
  sort?: number; // 排序
  remarks?: string;  // 备注
  type?: number; // 类型
  logoId?: number; // 存放学校logo附件id
  contact?: string;  // 组织联系人
  email?: string;  // 组织邮箱
  address?: string;  // 组织地址

}
