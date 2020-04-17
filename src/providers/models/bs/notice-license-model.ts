import {BaseModel} from "@/providers/models/base-model";

export interface NoticeLicenseModel extends BaseModel{
    orgId: number,
    licenseCode: string,
    startDate: string,
    endDate: string,
    expireTime: string,
    isWx: number,
    isEmail: number,
    isMsg: number,
    msgQuantity: number,
    isPhone: number,
    phoneQuantity: number,
    usedMsgQuantity: number,
    usedPhoneQuantity: number,
}