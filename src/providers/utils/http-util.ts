import axios, {AxiosResponse} from 'axios'
import {Gateway, HttpMethod, Mutations, NoticeType, StorageKey} from '@/providers/models/enums'
import NoticeUtil from '@/providers/utils/notice-util'
import StorageUtil from '@/providers/utils/storage-util'
import {AUTHORIZATION, CODE_FORBIDDEN, CODE_NO_RESPONSE, CODE_NOT_FOUND, CODE_SETTING_ERR, CODE_UNAUTHORIZED, CONTENT_TYPE, CONTENT_TYPE_DEFAULT, ERROR_COMMON_ERR, ERROR_FORBIDDEN, ERROR_NO_RESPONSE, ERROR_NOT_FOUND, ERROR_SETTING_ERR, ERROR_UNAUTHORIZED, GATEWAY_SELF, SUCCESS, TITLE_ERROR} from '@/providers/models/consts'
import router from '@/router'
import {HttpConfig, HttpResult} from '@/providers/models/common/http-model'
import {LoginInfo} from '@/providers/models/base-model'
import store from '@/store'
import UsersService from '@/providers/services/uc/users-service'
import {UserInfo} from '@/providers/models/uc/users-model'

const GateWayMap: { [key: string]: string } = {}
const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_SITE_URL,
  timeout: 30000
})

/**
 * 初始化基础配置
 */
function initBaseConfig(): Promise<void> {
  return axios.get('/dynamicConfig.json').then((response) => {
    const config = response.data
    axiosInstance.defaults.baseURL = config.url
    Object.assign(GateWayMap, config.gateWay)
  })
}

/**
 * 检查认证情况
 * @param toFullPath
 */
function checkAuth(toFullPath: string): Promise<string> {
  const token = StorageUtil.getItem(StorageKey.Token)
  const userName = StorageUtil.getItem(StorageKey.UserName)
  if (!token || !userName) {  // 本地缓存找不到直接判定为认证失败
    StorageUtil.clear()
    return Promise.reject()
  }
  return get<void>({
    api: '/index',
    gateway: GATEWAY_SELF,
    disableLoading: true,
    disableBsErrorHandle: true,
    disableHttpErrorHandle: true
  })
  .then(() => {
    // 用户信息存在
    const userInfoCache: UserInfo = store.state.userInfo
    if (userInfoCache.id) {
      return _checkPathAuth(toFullPath)
    }
    // 用户信息不存在
    return UsersService.getUserInfoFromCache().then((userInfo: UserInfo) => {
      store.commit(Mutations.SetUserInfo, userInfo)
      return _checkPathAuth(toFullPath)
    })
  })
  .catch((error) => {
    StorageUtil.clear()
    throw error
  })
}

/**
 * 检查路径权限
 * @param toFullPath
 * @private
 */
function _checkPathAuth(toFullPath: string): string {
  const pathList: string[] = store.getters.pathList
  const authFlag = pathList.indexOf(toFullPath) > -1
  return authFlag ? toFullPath : (pathList.length ? pathList[0] : '/empty')
}

/**
 * 登录
 * @param loginInfo
 */
function login(loginInfo: LoginInfo): Promise<string> {
  return post<{ token: string }>({
    api: '/login',
    body: loginInfo,
    gateway: GATEWAY_SELF,
    disableLoading: true,
    disableBsErrorHandle: true,
    disableHttpErrorHandle: true
  })
  .then(({token}) => {
    StorageUtil.setItem(StorageKey.Token, token)
    StorageUtil.setItem(StorageKey.UserName, loginInfo.username)
    return token
  })
}

/**
 * 登出
 */
function logout(): Promise<void> {
  StorageUtil.clear()
  return post<void>({
    api: '/logout',
    gateway: GATEWAY_SELF,
    disableLoading: true,
    disableBsErrorHandle: true,
    disableHttpErrorHandle: true
  })
}

/**
 * GET请求
 * @param config
 */
function get<T>(config: HttpConfig): Promise<T> {
  // Get请求默认不加loading
  config.disableLoading = config.disableLoading !== false
  return _doRequest(config, HttpMethod.GET)
}

/**
 * POST请求
 * @param config
 */
function post<T>(config: HttpConfig): Promise<T> {
  // Post请求默认加loading
  return _doRequest(config, HttpMethod.POST)
}

/**
 * PUT请求
 * @param config
 */
function put<T>(config: HttpConfig): Promise<T> {
  // Post请求默认加loading
  return _doRequest(config, HttpMethod.PUT)
}

/**
 * DELETE请求
 * @param config
 */
function doDelete<T>(config: HttpConfig): Promise<T> {
  // Post请求默认加loading
  return _doRequest(config, HttpMethod.DELETE)
}

/**
 * 根据请求方法，发起请求
 * @param config
 * @param method
 * @private
 */
function _doRequest<T>(config: HttpConfig, method: HttpMethod): Promise<T> {
  const apiPath = _assembleApi(config.api, config.gateway)
  const httpConfig = _assembleConfig(config)

  let doRequest: Promise<AxiosResponse<HttpResult<T>>>
  switch (method) {
    case HttpMethod.POST:
      doRequest = axiosInstance.post<HttpResult<T>>(apiPath, config.body, httpConfig)
      break
    case HttpMethod.PUT:
      doRequest = axiosInstance.put<HttpResult<T>>(apiPath, config.body, httpConfig)
      break
    case HttpMethod.DELETE:
      doRequest = axiosInstance.delete<HttpResult<T>>(apiPath, httpConfig)
      break
    case HttpMethod.GET:
    default:
      doRequest = axiosInstance.get<HttpResult<T>>(apiPath, httpConfig)
      break
  }

  if (!config.disableLoading) {
    NoticeUtil.showLoading()
  }
  return new Promise<T>((resolve, reject) => doRequest.then(
      (axiosResponse) => _handleSuccess<T>(axiosResponse, resolve, reject, config),
      (error) => _handleError(error, reject, config)
  ))
}

/**
 * 请求成功处理
 * @param axiosResponse
 * @param resolve
 * @param reject
 * @param config
 * @private
 */
function _handleSuccess<T>(axiosResponse: AxiosResponse<HttpResult<T>>, resolve: (value?: T) => void, reject: (reason?: any) => void, config: HttpConfig): void {
  if (!config.disableLoading) {
    NoticeUtil.hideLoading()
  }
  const response = axiosResponse.data
  // 业务成功
  if (response.code === SUCCESS) {
    resolve(response.data)
    return
  }
  // 业务失败
  const httpError: HttpResult<T> = {...response, hasBsError: true}
  if (config.disableBsErrorHandle) { // 禁用错误处理
    reject(httpError)
    return
  }
  NoticeUtil.showAlert(response.message, TITLE_ERROR, NoticeType.Error)
  .then(() => reject(httpError))
  .catch(() => reject(httpError))
}

/**
 * 请求失败处理
 * @param error
 * @param reject
 * @param config
 * @private
 */
function _handleError(error: any, reject: (reason?: any) => void, config: HttpConfig): void {
  if (!config.disableLoading) {
    NoticeUtil.hideLoading()
  }
  const httpError = _assembleError(error)
  if (config.disableHttpErrorHandle) {  // 禁用错误处理
    reject(httpError)
    return
  }
  if (httpError.code === CODE_UNAUTHORIZED) {
    reject(httpError)
    router.push({name: '/login', query: {redirect: router.currentRoute.fullPath}})
    return
  }
  NoticeUtil.showAlert(httpError.message, TITLE_ERROR, NoticeType.Error)
  .then(() => reject(httpError))
  .catch(() => reject(httpError))
}

/**
 * 组装Http请求错误信息
 * @param error
 * @private
 */
function _assembleError(error: any): HttpResult<any> {
  const httpError: HttpResult<any> = {hasBsError: false}
  if (error.response) {
    const httpStatus = error.response.status
    httpError.code = httpStatus
    if (httpStatus === CODE_UNAUTHORIZED) {  // 401
      httpError.message = ERROR_UNAUTHORIZED
    } else if (httpStatus === CODE_FORBIDDEN) { // 403
      httpError.message = ERROR_FORBIDDEN
    } else if (httpStatus === CODE_NOT_FOUND) { // 404
      httpError.message = ERROR_NOT_FOUND
    } else {  // Other
      httpError.message = ERROR_COMMON_ERR
    }
  } else if (error.request) {
    httpError.code = CODE_NO_RESPONSE
    httpError.message = ERROR_NO_RESPONSE
  } else {
    httpError.code = CODE_SETTING_ERR
    httpError.message = ERROR_SETTING_ERR
  }
  return httpError
}

/**
 * 组装请求Path
 * @param api
 * @param gateway
 * @private
 */
function _assembleApi(api: string, gateway: Gateway | 'GatewaySelf'): string {
  // 统一api格式
  if (api.indexOf('/') !== 0) {
    api = `/${api}`
  }
  // 调用网关本身服务
  if (gateway === GATEWAY_SELF) {
    return api
  }
  gateway = gateway || Gateway.Bs
  // 通过网关调用服务（默认使用业务服务）
  return `${GateWayMap[gateway] || ''}${api}`
}

/**
 * 组装请求头
 * @param headers
 * @private
 */
function _assembleHeaders(headers: { [key: string]: any } = {}) {
  const token = StorageUtil.getItem(StorageKey.Token)
  if (!headers[AUTHORIZATION] && token) {
    headers[AUTHORIZATION] = `Bearer ${token}`
  }
  return {[CONTENT_TYPE]: CONTENT_TYPE_DEFAULT, ...headers}
}

/**
 * 组装请求的config
 * @param config
 * @private
 */
function _assembleConfig(config: HttpConfig) {
  return {headers: _assembleHeaders(config.headers), params: config.query}
}

const HttpUtil = {initBaseConfig, checkAuth, login, logout, get, post, put, delete: doDelete}
export default HttpUtil
