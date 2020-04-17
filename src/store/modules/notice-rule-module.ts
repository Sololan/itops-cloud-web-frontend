import DictsService from '@/providers/services/uc/dicts-service'
import {DictGroupKey} from '@/providers/models/enums'
import {DictItem} from '@/providers/models/uc/dicts-model'
import NoticeRuleService from '@/providers/services/bs/notice-rule-service'
import {PageQuery, PageResult} from '@/providers/models/common/http-model'
import {NoticeRuleModel} from '@/providers/models/bs/notice-rule-model'
import {NoticeUserModel} from '@/providers/models/bs/notice-user'

interface NoticeRuleState {
  /**
   * 选项
   */
  noticeWays: DictItem[]
  warnLevels: DictItem[]
  warnStages: DictItem[]
  postponementStrategies: DictItem[]
  noticeTimings: Map<number, string>
  /**
   * 通知方式显示信息
   */
  noticeWayInfos: any[]
  /**
   * 通知规则列表
   */
  noticeRulesPage: PageResult<NoticeRuleModel[]>

}

const state: NoticeRuleState = {
  noticeWays: [],
  warnLevels: [],
  warnStages: [],
  postponementStrategies: [],
  noticeTimings: new Map<number, string>([
    [ 1, "任何时间"],
    [ 2, "非工作时间"],
    [ 3, "工作时间"],
  ]),

  noticeWayInfos: [
    {},
    {
      icon: require('@/assets/images/phone-icon.png'),
      enabled: 0,
      quantity: '',   //(可用/已用)
    },
    {
      icon: require('@/assets/images/message-icon.png'),
      enabled: 0,
      quantity: '',
    },
    {
      icon: require('@/assets/images/wechat-icon.png'),
      enabled: 0,
      quantity: '(无限制)',
    },
    {
      icon: require('@/assets/images/email-icon.png'),
      enabled: 0,
      quantity: '(无限制)',
    },
  ],

  noticeRulesPage: {},

}

const getters = {
}

const actions = {
  getNoticeWays({ state, commit}: any) {
    DictsService.getItemsByGroupKey(DictGroupKey.NoticeWay)
    .then((response: any) => {
      commit('saveNoticeWays', response)
    }).catch((error: any) => {
      // console.log('getNoticeWays: ', error);
    });
  },

  getWarnLevels({ state, commit}: any) {
    DictsService.getItemsByGroupKey(DictGroupKey.WarningLevel)
    .then((response: any) => {
      commit('saveWarnLevels', response)
    }).catch((error: any) => {
      // console.log('getWarnLevels: ', error);
    });
  },

  getWarnStages({ state, commit}: any) {
    DictsService.getItemsByGroupKey(DictGroupKey.WarningStage)
    .then((response: any) => {
      commit('saveWarnStages', response)
    }).catch((error: any) => {
      // console.log('getWarnStages: ', error);
    });
  },

  getPostponementStrategies({ state, commit}: any) {
    DictsService.getItemsByGroupKey(DictGroupKey.PostponementStrategy)
    .then((response: any) => {
      commit('savePostponementStrategies', response)
    }).catch((error: any) => {
      // console.log('getPostponementStrategies: ', error);
    });
  },

  getNoticeWayQuantity({ state, commit}: any, orgId: number) {
    NoticeRuleService.getNoticeWayQuantity(orgId)
    .then((response: any) => {
      commit('saveNoticeWayQuantity', response)
    }).catch((error: any) => {
      // console.log('getNoticeWayQuantity: ', error);
    });
  },

  queryNoticeRules({ state, commit }: any, queryBody: PageQuery<NoticeRuleModel>) {
    NoticeRuleService.queryNoticeRules(queryBody)
    .then((response: PageResult<NoticeRuleModel[]>) => {
      commit('saveNoticeRulesPage', response);
    }).catch((error: any) => {
      // console.log(error);
    });
  },
}

const mutations = {
  saveNoticeWays(state: NoticeRuleState, noticeWays: DictItem[]) {
    state.noticeWays = noticeWays;
  },

  saveWarnLevels(state: NoticeRuleState, warnLevels: DictItem[]) {
    state.warnLevels = warnLevels;

  },

  saveWarnStages(state: NoticeRuleState, warnStages: DictItem[]) {
    state.warnStages = warnStages;
  },

  savePostponementStrategies(state: NoticeRuleState, postponementStrategies: DictItem[]) {
    state.postponementStrategies = postponementStrategies
  },

  saveNoticeWayQuantity(state: NoticeRuleState, response: any) {
    const iphoneInfo = (state.noticeWayInfos[1] as any);
    iphoneInfo.enabled = response.isPhone;
    if(response.isPhone == 1){
      iphoneInfo.quantity = `(${response.usedPhoneQuantity}/${response.phoneQuantity})`
    }

    const msgInfo = (state.noticeWayInfos[2] as any);
    msgInfo.enabled = response.isMsg;
    if(response.isMsg == 1){
      msgInfo.quantity = `(${response.usedMsgQuantity}/${response.msgQuantity})`
    }

    (state.noticeWayInfos[3] as any).enabled = response.isWx;
    (state.noticeWayInfos[4] as any).enabled = response.isEmail;
  },

  saveNoticeRulesPage(state: NoticeRuleState, noticeRulesPage: PageResult<NoticeRuleModel[]>){
    state.noticeRulesPage = noticeRulesPage;
  },


  // saveCheckedUsers(state: NoticeRuleState, users: NoticeUserModel[]){
  //   state.selectedNoticeUsers = users
  // },

}

// function toDelete() {
//   //args
//   const userIdsToDelete = new Set<number>()
//   const usersToAdd = new Map<number, string>()
//
//   const users = state.selectedNoticeUsers;
//   for (let index = 0; index < users.length; index++) {
//     if(userIdsToDelete.has(users[index].noticeUser)) {
//       users.splice(index, 1)
//     }
//   }
//   usersToAdd.forEach((value, key) => {
//     state.selectedNoticeUsers.push({
//       noticeUser: key,
//       fullName: value
//     });
//   })
// }

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}