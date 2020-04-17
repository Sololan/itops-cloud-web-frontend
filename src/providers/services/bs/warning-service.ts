import {PageQuery} from '@/providers/models/common/http-model'
import {WarningQueryParam} from '@/providers/models/bs/warning-query-model'
import {WarningParam} from '@/providers/models/bs/warning-model'
import HttpUtil from '@/providers/utils/http-util'
import {Gateway} from '@/providers/models/enums'
import {WarningUrl} from '@/providers/models/url'

/**
 * 获取告警信息分页
 * @param pageQuery
 */
function getWarningPage(pageQuery: PageQuery<WarningQueryParam>): Promise<any> {
    return HttpUtil.post({
        api: 'warning/page',
        gateway: Gateway.Bs,
        body: pageQuery
    })
}

/**
 * 根据告警id获取详细告警信息
 * @param id
 */
function getWarning(id: number): Promise<WarningParam> {
  return HttpUtil.get({
    api: `warning/warnings/${id}`,
    gateway: Gateway.Bs
  })
}

/**
 * 按照告警级别统计，一段时间内的告警数据
 */
function countLevel(queryParam: WarningQueryParam): Promise<any> {
  return HttpUtil.post({
    api: WarningUrl.countLevel,
    gateway: Gateway.Bs,
    body: queryParam
  })
}

/**
 * 按照告警状态统计，一段时间内的告警数据
 */
function countStatus(queryParam: WarningQueryParam): Promise<any> {
  return HttpUtil.post({
    api: WarningUrl.countStatus,
    gateway: Gateway.Bs,
    body: queryParam
  })
}

/**
 * 统计今日新增告警数、今日关闭告警数以及今日新增的告警按照级别统计的告警数量
 */
function countTodayWarning(): Promise<any> {
  return HttpUtil.get({
    api: WarningUrl.countTodayWarning,
    gateway: Gateway.Bs
  })
}

/**
 * Top告警内容分析（过去7天）
 */
function countInfoTop(queryParam: WarningQueryParam): Promise<any> {
  return HttpUtil.post({
    api: WarningUrl.countInfoTop,
    gateway: Gateway.Bs,
    body: queryParam
  })
}

const WarningService = {
  getWarningPage,
  getWarning,
  countLevel,
  countStatus,
  countTodayWarning,
  countInfoTop
}
export default WarningService
