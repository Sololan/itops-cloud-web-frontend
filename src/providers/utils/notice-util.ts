import {Loading, Message, MessageBox, Notification} from 'element-ui'
import {CLASS_ALERT, CLASS_CONFIRM, CLASS_LOADING, CLASS_MESSAGE, CLASS_NOTIFICATION, TEXT_LOADING, TITLE_INFO, TITLE_WARNING} from '@/providers/models/consts'
import {ElLoadingComponent} from 'element-ui/types/loading'
import {MessageBoxData} from 'element-ui/types/message-box'
import {Mutations, NoticeType} from '../models/enums'
import _ from 'lodash'
import store from '@/store'

let loadingCount = 0
let loadingInstance: ElLoadingComponent

/**
 * 显示全局loading
 */
function showLoading() {
  // 局部loading是否显示
  const loadingShow = store.state.loadingShow
  // 是否全屏
  const loadingFullScreen = store.state.loadingFullScreen

  if (loadingCount > 0) {
    if ((loadingFullScreen && !loadingInstance) || (!loadingFullScreen && !loadingShow)) {
      _endLoading(!loadingFullScreen)
      _startLoading(loadingFullScreen)
    }
    loadingCount++
    return
  }
  loadingCount = 1
  _startLoading(loadingFullScreen)
}

/**
 * 关闭全局loading
 */
function hideLoading(atOnce?: boolean) {
  if (loadingCount > 1 && !atOnce) {
    loadingCount--
    return
  }
  loadingCount = 0
  atOnce ? _debounceEndLoading() : _.debounce(_debounceEndLoading, 300)()
}

function _debounceEndLoading() {
  if (loadingCount < 1) {
    _endLoading(true)
    _endLoading(false)
  }
}

/**
 * 显示消息
 * @param message
 * @param type
 */
function showMsg(message: string, type: NoticeType = NoticeType.Success): Promise<void> {
  return new Promise<void>((resolve) => Message({
    message, type, customClass: CLASS_MESSAGE, onClose: () => resolve()
  }))
}

/**
 * 显示提示框
 * @param message
 * @param title
 * @param type
 */
function showAlert(message: string, title: string = TITLE_WARNING, type: NoticeType = NoticeType.Warning): Promise<MessageBoxData> {
  return MessageBox.alert(message, {title, type, customClass: CLASS_ALERT})
}

/**
 * 显示询问框
 * @param message
 * @param title
 * @param type
 */
function showConfirm(message: string, title: string = TITLE_WARNING, type: NoticeType = NoticeType.Warning): Promise<MessageBoxData> {
  return MessageBox.confirm(message, {title, type, customClass: CLASS_CONFIRM})
}

/**
 * 显示通知
 * @param message
 * @param title
 * @param type
 */
function showNotification(message: string, title: string = TITLE_INFO, type: NoticeType = NoticeType.Info): Promise<void> {
  return new Promise<void>((resolve, reject) => Notification({
    title, message, type, customClass: CLASS_NOTIFICATION, onClick: () => resolve(), onClose: () => reject()
  }))
}

/**
 * 显示loading
 * @private
 */
function _startLoading(fullScreen: boolean) {
  fullScreen
      ? (!loadingInstance ? loadingInstance = Loading.service({text: TEXT_LOADING, lock: true, customClass: CLASS_LOADING, background: 'rgba(0,0,0,.5)'}) : null)
      : (!store.state.loadingShow ? store.commit(Mutations.SetLoadingShow, true) : null)

}

/**
 * 隐藏loading
 * @private
 */
function _endLoading(fullScreen: boolean) {
  fullScreen
      ? (loadingInstance ? loadingInstance.close() : null)
      : (store.state.loadingShow ? store.commit(Mutations.SetLoadingShow, false) : null)
}

const NoticeUtil = {showLoading, hideLoading, showMsg, showAlert, showConfirm, showNotification}
export default NoticeUtil
