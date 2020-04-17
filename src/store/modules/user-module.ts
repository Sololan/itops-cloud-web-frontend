import {UserInfo} from '@/providers/models/uc/users-model'
import {RoleInfo} from '@/providers/models/uc/roles-model'
import UsersService from '@/providers/services/uc/users-service'
import RolesService from '@/providers/services/uc/roles-service'
import {PageQuery, PageResult} from '@/providers/models/common/http-model'
import {UserQueryModel} from '@/providers/models/uc/user-query-model'
import {RoleCode} from '@/providers/models/enums'

interface UserState {
  usersPage: PageResult<UserInfo[]>;
  roles: RoleInfo[];
  roleUserId: number //普通用户id
}

const state: UserState = {
  usersPage: {},
  roles: [],
  roleUserId: null,
}

const getters = {}

const actions = {
  pagingQueryUsers({state, commit}: any, queryBody: PageQuery<UserQueryModel>) {
    UsersService.queryUsers(queryBody)
    .then((response: PageResult<UserInfo[]>) => {
      commit('saveUsersPage', response)
    }).catch((error: any) => {
      // console.log(error)
    })
  },

  getRoles({state, commit}: any, orgId: number) {
    RolesService.getRoles(orgId)
    .then((response: any) => {
      commit('saveRoles', response)
    }).catch((error: any) => {
      // console.log(error)
    })
  }
}

const mutations = {
  saveUsersPage(state: UserState, usersPage: PageResult<UserInfo[]>) {
    state.usersPage = usersPage
  },

  saveRoles(state: UserState, roles: RoleInfo[]) {
    state.roles = roles
    for (const role of roles) {
      if (role.code === RoleCode.User) {
        state.roleUserId = role.id
        break
      }
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}