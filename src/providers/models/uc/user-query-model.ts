export interface UserQueryModel {
  fullName?: string,
  includeAllOrg?: boolean,
  orgId?: number,
  orgIdList?: number[],
  skipRoleCodeList?: string[],
  username?: string

  roleId?: number
  endDate?: string
  startDate?: string
  phone?: string
}