import {BaseModel} from '@/providers/models/base-model'

//t_ops_notice_way
export interface NoticeWayModel extends BaseModel{
  id?: number,
  noticeRuleId?: number,
  noticeMethod?: number
}