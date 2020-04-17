export const GATEWAY_SELF: 'GatewaySelf' = 'GatewaySelf'

export const CONTENT_TYPE = 'Content-Type'
export const AUTHORIZATION = 'Authorization'
export const CONTENT_TYPE_DEFAULT = 'application/json;charset=UTF-8'
// export const CONTENT_TYPE_DEFAULT = 'application/x-www-form-urlencoded'

export const TITLE_SUCCESS = '成功'
export const TITLE_INFO = '消息'
export const TITLE_WARNING = '警告'
export const TITLE_ERROR = '错误'
export const TEXT_LOADING = '正在加载...'
export const CLASS_ALERT = 'yj-alert'
export const CLASS_MESSAGE = 'yj-message'
export const CLASS_CONFIRM = 'yj-confirm'
export const CLASS_LOADING = 'yj-loading'
export const CLASS_NOTIFICATION = 'yj-notification'

export const FAIL = -1
export const SUCCESS = 0
export const ERROR_COMMON_ERR = '当前请求出现异常'
export const CODE_UNAUTHORIZED = 401
export const ERROR_UNAUTHORIZED = '当前请求认证失败'
export const CODE_FORBIDDEN = 403
export const ERROR_FORBIDDEN = '当前请求已被禁止'
export const CODE_NOT_FOUND = 404
export const ERROR_NOT_FOUND = '当前请求没有找到'
export const CODE_NO_RESPONSE = -11
export const ERROR_NO_RESPONSE = '当前请求未响应'
export const CODE_SETTING_ERR = -12
export const ERROR_SETTING_ERR = '当前请求设置有误'

export const CATCH_ERROR = (error: any) => console.log(error ? (error.message || error) : '未知错误')

export const EVENT_INPUT = 'input'

export const ROOT_PATH = '/'

export const LOGIN_ERROR = '用户名或密码错误'
export const CLOSE_CONFIRM = '关闭后未保存的数据将会丢失，确认关闭？'
