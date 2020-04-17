import HttpUtil from '@/providers/utils/http-util'
import {Gateway} from '@/providers/models/enums'
import {NoticeRuleUrl} from '@/providers/models/url'
import {PageQuery, PageResult} from '@/providers/models/common/http-model'
import {NoticeRuleModel} from '@/providers/models/bs/notice-rule-model'

function getNoticeWayQuantity(orgId: number): Promise<any> {
  return HttpUtil.get({
    api: NoticeRuleUrl.noticeWayQuantity(orgId),
    gateway: Gateway.Bs,
  })
}

function queryNoticeRules(queryBody: PageQuery<NoticeRuleModel>): Promise<PageResult<NoticeRuleModel[]>>{
  return HttpUtil.post({
    api: NoticeRuleUrl.noticeRules,
    gateway: Gateway.Bs,
    body: queryBody
  })
}

function getById(id: number): Promise<NoticeRuleModel> {
  return HttpUtil.get({
    api: NoticeRuleUrl.getById(id),
    gateway: Gateway.Bs,
  })
}

function add(rule: NoticeRuleModel): Promise<any> {
  return HttpUtil.post({
    api:NoticeRuleUrl.add,
    gateway: Gateway.Bs,
    body: rule,
  })
}

function update(rule: NoticeRuleModel): Promise<any> {
  return HttpUtil.post({
    api: NoticeRuleUrl.update(rule.id),
    gateway: Gateway.Bs,
    body: rule,
  })
}

function deleteById(id: number): Promise<any> {
  return HttpUtil.post({
    api: NoticeRuleUrl.deleteById(id),
    gateway: Gateway.Bs
  });
}

const NoticeRuleService = {
  getNoticeWayQuantity,
  queryNoticeRules,
  getById,
  add,
  update,
  deleteById,
}
export default NoticeRuleService