import Vue from 'vue'
import Vuex from 'vuex'
import userModule from './store/modules/user-module'
import noticeRuleModule from './store/modules/notice-rule-module'
import {UserInfo} from '@/providers/models/uc/users-model'
import {Mutations} from '@/providers/models/enums'
import {ResourceInfo} from '@/providers/models/uc/resources-model'

Vue.use(Vuex)

interface StoreState {
  userInfo: UserInfo;
  menuHide: boolean;
  loadingShow: boolean;
  loadingFullScreen: boolean;
}

function getDefaultUserInfo(): UserInfo {
  return {
    menus: [],
    fullName: '',
    roleNameList: ''
  }
}

function getPathList(menus: ResourceInfo[], pathList: string[]): void {
  menus.forEach((menu, index) => {
    if (menu.children && menu.children.length) {
      getPathList(menu.children, pathList)
    } else {
      pathList.push(menu.uri)
    }
  })
}

export default new Vuex.Store<StoreState>({
  state: {
    userInfo: getDefaultUserInfo(),
    menuHide: false,
    loadingShow: false,
    loadingFullScreen: true
  },

  modules: {
    userModule: userModule,
    noticeRuleModule: noticeRuleModule,
  },

  mutations: {
    [Mutations.SetMenuHide](state, menuHide) {
      state.menuHide = menuHide
    },
    [Mutations.SetUserInfo](state, userInfo) {
      state.userInfo = userInfo ? userInfo : getDefaultUserInfo()
    },
    [Mutations.SetLoadingShow](state, loadingShow) {
      state.loadingShow = loadingShow
    },
    [Mutations.SetLoadingFullScreen](state, loadingFullScreen) {
      state.loadingFullScreen = loadingFullScreen
    },
    // 重置
    [Mutations.SetDefault](state) {
      state.menuHide = false
      state.userInfo = getDefaultUserInfo()
    }
  },
  actions: {},
  getters: {
    menus: (state) => state.userInfo.menus,
    fullName: (state) => state.userInfo.fullName,
    orgId: (state) => state.userInfo.topOrg.id,
    orgName: (state) => state.userInfo.topOrg.fullName,
    roleName: (state) => state.userInfo.roleNameList.split(',')[0],
    pathList: (state) => {
      const pathList: string[] = []
      getPathList(state.userInfo.menus, pathList)
      return pathList
    }
  }
})

