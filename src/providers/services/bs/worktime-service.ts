import {WorkTimeParam} from '@/providers/models/bs/worktime-model';
import HttpUtil from '@/providers/utils/http-util';
import {Gateway} from '@/providers/models/enums';

/**
 * 获取工作时间设置
 */
function getWorkTime(): Promise<WorkTimeParam>{
    return HttpUtil.get({
        api: 'work/worktimes',
        gateway: Gateway.Bs
    })
}

/**
 * 第一次登陆设置初始化工作时间
 * @param workTimeParam
 */
function initWorkTime(workTimeParam: WorkTimeParam): Promise<any> {
    return HttpUtil.post({
        api: 'work/workTimes',
        gateway: Gateway.Bs,
        body: workTimeParam
    })
}

/**
 * 更新
 * @param workTimeParam
 */
function updateWorkTime(workTimeParam: WorkTimeParam): Promise<any> {
    return HttpUtil.post({
        api: `work/worktimes/${workTimeParam.id}`,
        gateway: Gateway.Bs,
        body: workTimeParam,
        disableLoading: true,
        disableBsErrorHandle: true
    })
}

const WorkTimeService = {getWorkTime, initWorkTime, updateWorkTime}
export default WorkTimeService