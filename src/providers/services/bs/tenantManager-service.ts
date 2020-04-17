import HttpUtil from '@/providers/utils/http-util'
import {Gateway} from '@/providers/models/enums'
import {UserInfo} from '@/providers/models/uc/users-model'
import {PageQuery, PageResult} from '@/providers/models/common/http-model'
import {TenantManagerModel, TenantManagerQueryModel} from '@/providers/models/bs/tenantManager-model'

function getTenantList(): Promise<UserInfo> {
    return HttpUtil.get({
        api: 'orgs/allTop',
        gateway: Gateway.Uc
    })
}

function getTenantManagerPage(queryBody: PageQuery<TenantManagerQueryModel>): Promise<PageResult<UserInfo[]>> {
    return HttpUtil.post({
        api: 'users/search/page',
        gateway: Gateway.Uc,
        body: queryBody
    })
}

function getRolesList(orgId: number): Promise<UserInfo> {
    return HttpUtil.get({
        api: 'roles/code/' + 'ROLE_MANAGER' + '/orgId/' + orgId,
        gateway: Gateway.Uc,
        disableLoading: true
    })
}

function addTenantManager(tenantManagerParam: TenantManagerModel): Promise<UserInfo> {
    return HttpUtil.post({
        api: 'users',
        gateway: Gateway.Uc,
        body: tenantManagerParam
    })
}

function updateTenantManager(tenantManagerParam: TenantManagerModel): Promise<UserInfo> {
    return HttpUtil.post({
        api: 'users/' + tenantManagerParam.id,
        gateway: Gateway.Uc,
        body: tenantManagerParam
    })
}

function deleteTenantManager(id: number): Promise<UserInfo> {
    return HttpUtil.post({
        api: 'users/' + id + '/delete',
        gateway: Gateway.Uc
    })
}

function restPwd(id: number): Promise<UserInfo> {
    return HttpUtil.post({
        api: 'users/' + id + '/resetPwd',
        gateway: Gateway.Uc
    })
}

function getTenantMangerById(id: number): Promise<UserInfo> {
    return HttpUtil.get({
        api: 'users/' + id,
        gateway: Gateway.Uc
    })
}


const TentantManagerService = {getTenantList, getTenantManagerPage, getRolesList, addTenantManager,updateTenantManager, deleteTenantManager, restPwd, getTenantMangerById}
export default TentantManagerService