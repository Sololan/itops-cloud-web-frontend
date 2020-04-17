import {BaseModel} from '@/providers/models/base-model'

/**
 * 字典项Model
 */
export interface DictsItemModel extends BaseModel {
  id?: number;  // 字典项ID
  name?: string;  // 字典项名
  sort?: string;  // 排序
  description?: string;  // 描述
  itemKey?: string;  // key
  groupId?: string;  // groupId
  value?: string;  // 值
  pid?: number;  // 父id
}
