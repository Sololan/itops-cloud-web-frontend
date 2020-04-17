import {BaseModel} from '@/providers/models/base-model'

//t_ops_notice_user
export interface NoticeUserModel extends BaseModel{
  id?: number,
  noticeRuleId?: number,
  noticeUser?: number, //user id
  fullName?: string
}