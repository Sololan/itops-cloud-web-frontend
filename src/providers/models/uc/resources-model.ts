import {BaseModel} from '@/providers/models/base-model'
import {ResourceType} from '@/providers/models/enums'

/**
 * 资源信息
 */
export interface ResourceInfo extends BaseModel {
  id?: number; // 资源ID
  pid?: number;  // 父资源ID
  name?: string; // 资源名称
  type?: ResourceType; // 资源类型（1：菜单；2：操作）
  uri?: string;  // 资源路径
  icon?: string; // 资源图标
  permission?: string; // 资源权限字符串
  enabled?: number;  // 是否启用
  sort?: number; // 排序
  remarks?: string;  // 备注
  projectNo?: string;  // 项目编号
  children?: ResourceInfo[]; // 子资源
}
