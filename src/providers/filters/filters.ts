import Vue from 'vue'
import CommonUtil from '@/providers/utils/common-util'

/**
 * 时间日期格式化
 * 年(y)可以用 1-4 个占位符
 * 月(M)、日(d)、小时(H)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符
 * 毫秒(S)、周(E)只能用 1 个占位符
 * @param value
 * @param format
 */
Vue.filter('timeFormat', (value: number | string | Date, format: string) => CommonUtil.timeFormat(value, format))

/**
 * 加法
 */
Vue.filter('add', (arg1: number | string, arg2: number | string) => CommonUtil.add(arg1, arg2))

/**
 * 减法
 */
Vue.filter('subtract', (arg1: number | string, arg2: number | string) => CommonUtil.subtract(arg1, arg2))

/**
 * 减法
 */
Vue.filter('multiply', (arg1: number | string, arg2: number | string) => CommonUtil.multiply(arg1, arg2))

/**
 * 减法
 */
Vue.filter('divide', (arg1: number | string, arg2: number | string) => CommonUtil.divide(arg1, arg2))
