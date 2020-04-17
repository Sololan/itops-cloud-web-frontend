import {StorageKey} from '@/providers/models/enums'

/**
 * 查询（默认sessionStorage）
 * @param itemKey
 * @param isLocal
 */
function getItem<T>(itemKey: StorageKey, isLocal?: boolean): T {
  const valueStr = _getStorage(isLocal).getItem(itemKey)
  return valueStr ? JSON.parse(valueStr) : null
}

/**
 * 增加、修改（默认sessionStorage）
 * @param itemKey
 * @param itemValue
 * @param isLocal
 */
function setItem(itemKey: StorageKey, itemValue: any, isLocal?: boolean) {
  const valueStr = itemValue !== 0 && !itemValue ? '' : JSON.stringify(itemValue)
  _getStorage(isLocal).setItem(itemKey, valueStr)
}

/**
 * 移除（默认sessionStorage）
 * @param itemKey
 * @param isLocal
 */
function removeItem(itemKey: StorageKey, isLocal?: boolean) {
  _getStorage(isLocal).removeItem(itemKey)
}

/**
 * 移除所有（默认sessionStorage）
 * @param isLocal
 */
function clear(isLocal?: boolean) {
  _getStorage(isLocal).clear()
}

/**
 * n = index + 1，返回第n个的key，如果n超过键值对个数，返回null
 * @param index
 * @param isLocal
 */
function key(index: number, isLocal?: boolean): string | null {
  return _getStorage(isLocal).key(index)
}

/**
 * 获取Storage（默认sessionStorage）
 * @param isLocal
 * @private
 */
function _getStorage(isLocal: boolean): Storage {
  return isLocal ? window.localStorage : window.sessionStorage
}

const StorageUtil = {getItem, setItem, removeItem, clear, key}
export default StorageUtil
