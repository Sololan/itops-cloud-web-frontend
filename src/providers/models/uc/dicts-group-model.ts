import {BaseModel} from '@/providers/models/base-model'

/**
 * 字典组Model
 */
export interface DictsGroupModel extends BaseModel {
  id?: string;  // 字典组ID
  name?: string;  // 字典组名
  groupKey?: string;  // 字典组key
  sort?: string;  // 排序
  description?: string;  // 描述
}
