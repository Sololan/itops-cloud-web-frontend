import HttpUtil from "@/providers/utils/http-util";
import {NoticeRuleUrl} from "@/providers/models/url";
import {Gateway} from "@/providers/models/enums";
import {MonitorLicenseModel} from "@/providers/models/bs/monitor-license-model";
import {NoticeLicenseModel} from "@/providers/models/bs/notice-license-model";
import {PageQuery, PageResult} from "@/providers/models/common/http-model";
import {AuthQueryModel} from "@/providers/models/bs/auth-query-model";

function queryMonitorPage(queryBody:PageQuery<AuthQueryModel>): Promise<PageResult<MonitorLicenseModel>> {
    return HttpUtil.post({
        api:'monitorLicenses/page',
        gateway: Gateway.Bs,
        body: queryBody
    })
}

function queryNoticePage(queryBody:PageQuery<AuthQueryModel>): Promise<PageResult<NoticeLicenseModel>> {
    return HttpUtil.post({
        api: 'warningMsgLicense/warningMsgLicense/page',
        gateway: Gateway.Bs,
        body: queryBody
    })
}

const AuthService = {queryMonitorPage, queryNoticePage}
export default AuthService