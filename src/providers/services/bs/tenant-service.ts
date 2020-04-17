
import {PageQuery} from '../../models/common/http-model';
import HttpUtil from '@/providers/utils/http-util';
import {Gateway} from '@/providers/models/enums';
import {TenantQueryParam} from '@/providers/models/bs/tenant-query-model';
import {TenantParam} from '@/providers/models/bs/tenant-model';

// 获取组织分页信息
function getTenantPage(pageQuery: PageQuery<TenantQueryParam>): Promise<any> {
   return  HttpUtil.post({
        api: 'tenant/tenantPage',
        body: pageQuery,
        gateway: Gateway.Bs
    })
}

// 插入组织信息
function addTenant(tenantParam: any): Promise<any> {
    return HttpUtil.post({
        api: '/tenant/orgs',
        body: tenantParam,
        gateway: Gateway.Bs
    })
}

// 修改组织信息
function updateTenant(id: number, tenantParam: TenantParam): Promise<any> {
    return HttpUtil.post({
        api: `/orgs/${id}`,
        body: tenantParam,
        gateway: Gateway.Uc
    })
}

// 删除组织信息
function deleteTenant(id: number): Promise<any> {
    return HttpUtil.post({
        api: `orgs/${id}/delete`,
        gateway: Gateway.Uc,
        disableLoading: true,
        disableBsErrorHandle: true
    })
}

// 查询组织信息
function getTenant(id: number): Promise<TenantParam> {
   return HttpUtil.get({
        api: `/orgs/${id}`,
        gateway: Gateway.Uc,
        disableLoading: true,
        disableBsErrorHandle: true
    })
}

const TenantService = {getTenantPage, addTenant, updateTenant, deleteTenant, getTenant}
export default TenantService
