export const UserUrl = {
  users: 'users/search/page',
  add: 'users',

  roles(orgId: number) {
    return `roles/orgs/${orgId}`
  },

  getByUsername(username: string) {
    // /uc/users/username/{username}
    return `/users/username/${username}`
  },

  update(id: number) {
    //"POST /site/uc/users/:id"
    return `users/${id}`
  },

  deleteUser(id: number) {
    // "POST /site/uc/users/:id/delete"
    return `users/${id}/delete`
  },

  resetPwd(id: number) {
    return `users/${id}/resetPwd`
  },

  changePwd(id: number) {
    return `users/${id}/changePwd`
  },

  getUserInfoById(id:number) {
    return `users/${id}`
  }
}

export const DictUrl = {
  // uc/dicts/groups/keys/{key}/items
  itemsByGroupKey(key: string) {
    return `dicts/groups/keys/${key}/items`
  }
}

export const NoticeRuleUrl = {
  noticeRules: 'notice/noticeRules/pages',

  //web-cloud/notice/noticeRules/counts/{orgId}
  noticeWayQuantity(orgId: number) {
    return `notice/noticeRules/counts/${orgId}`
  },

  // web-cloud/notice/noticeRules/{id}
  getById(id: number) {
    return `notice/noticeRules/${id}`
  },

  // web-cloud/notice/noticeRules
  add: 'notice/noticeRules',

  // web-cloud/notice/noticeRules/{id}
  update(id: number) {
    return `notice/noticeRules/${id}`
  },

  //web-cloud/notice/noticeRules/{id}/delete
  deleteById(id: number) {
    return `notice/noticeRules/${id}/delete`
  }
}

export const WorkTimeUrl = {
  default: 'work/worktimes'
}

export const WarningUrl = {
  countLevel: 'warning/statistics',
  countStatus: 'warning/closed/count',
  countTodayWarning: 'warning/count/today',
  countInfoTop: 'warning/info/top'
}