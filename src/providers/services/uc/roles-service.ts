import HttpUtil from '@/providers/utils/http-util'
import {UserUrl} from '@/providers/models/url'
import {Gateway} from '@/providers/models/enums'
import {RoleInfo} from '@/providers/models/uc/roles-model'

function getRoles(orgId: number): Promise<RoleInfo[]> {
  return HttpUtil.get({
    api: UserUrl.roles(orgId),
    gateway: Gateway.Uc,
  });
}

const RolesService = {
  getRoles,
}
export default RolesService