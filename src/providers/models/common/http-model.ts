import {Gateway} from '@/providers/models/enums'

/**
 * 请求参数
 */
export interface HttpConfig {
  api: string;
  query?: { [key: string]: any }; // url参数
  body?: { [key: string]: any };  // body参数
  headers?: { [key: string]: any };
  gateway?: Gateway | 'GatewaySelf';
  disableLoading?: boolean; // 禁用loading，默认存在loading
  disableBsErrorHandle?: boolean; // 禁用业务错误预处理，默认预处理错误
  disableHttpErrorHandle?: boolean; // 禁用http错误预处理，默认预处理错误
}

/**
 * 请求结果
 */
export interface HttpResult<T> {
  code?: number;
  data?: T;
  message?: string;
  /**
   * 扩展字段，是否存在业务error
   * true代表响应中code不为0的业务错误
   * false代表其他错误
   */
  hasBsError?: boolean;
}

/**
 * 分页查询对象
 */
export interface PageQuery<T> {
  limit?: number;
  offset?: number;
  query?: T;
}

/**
 * 分页查询结果
 */
export interface PageResult<T> {
  totalCount?: number;
  result?: T;
}
