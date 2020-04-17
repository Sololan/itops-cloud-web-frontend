import HttpUtil from '@/providers/utils/http-util'
import {Gateway} from '@/providers/models/enums'
import {WxInfo} from '@/providers/models/bs/wechat-model'

function bindId(wxInfo: WxInfo): Promise<any> {
  return HttpUtil.post({
    api: '/wechat/bind',
    body: wxInfo,
    gateway: Gateway.Bs
  })
}

const WechatUtil = {bindId}
export default WechatUtil
