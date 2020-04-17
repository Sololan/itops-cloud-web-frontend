import HttpUtil from '@/providers/utils/http-util'
import {Gateway} from '@/providers/models/enums'
import {DictUrl} from '@/providers/models/url'

function getItemsByGroupKey(key: string): Promise<any> {
  return HttpUtil.get({
    api: DictUrl.itemsByGroupKey(key),
    gateway: Gateway.Uc,
    query: {
      name
    }
  })
}
/**
  Author: liuzt
  Time: 2020/2/29 10:56
  Description: get dict group by dict key
*/
function getDictGroups(): Promise<any> {
  return HttpUtil.get({
      api: 'dicts/groups',
      gateway: Gateway.Uc,
      query: {
        orgId: 1,
        groupName: ''
    }
  })
}
/**
  Author: liuzt
  Time: 2020/2/29 11:11
  Description: get dict item tree by dict group's id and dict item's pid
*/
function getDictItemTree(id: number) {
  return HttpUtil.post({
    api: `dicts/groups/${id}/items/tree`,
    gateway: Gateway.Uc,
  })
}

const DictsService = {
  getItemsByGroupKey,getDictGroups,getDictItemTree
}
export default DictsService