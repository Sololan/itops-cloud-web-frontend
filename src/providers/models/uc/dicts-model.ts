import {BaseModel} from '@/providers/models/base-model'

/**
 * 字典项
 */
export interface DictItem extends BaseModel {
  id?: number  //PK
  group_id?:  number  //字典组id
  item_key?: string  //字典项key
  name?: string  //字典项名
  value?: string //数据值（不关心值时存：N/A）
  pid?: number //父ID(无父级时存-1）
  description?: string //描述
  sort?: number  //排序
  is_edit?: number //是否可编辑（0：不可编辑 1：可编辑）
  enabled?: number //是否启用 (0: 否；1：是)
}