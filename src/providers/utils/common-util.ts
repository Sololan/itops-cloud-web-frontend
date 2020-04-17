import {DateFormat} from '@/providers/models/enums'
import {ElForm} from 'element-ui/types/form'

/**
 * 时间日期格式化
 * 年(y)可以用 1-4 个占位符
 * 月(M)、日(d)、小时(H)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符
 * 毫秒(S)、周(E)只能用 1 个占位符
 * @param value
 * @param format
 */
function timeFormat(value: number | string | Date, format: DateFormat | string) {
  if (!value) {
    return ''
  }

  const dateValue = new Date(value)
  const weekArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const dateObj: { [key: string]: number } = {
    'M+': dateValue.getMonth() + 1,  // 月份
    'd+': dateValue.getDate(),       // 日
    'H+': dateValue.getHours(),      // 小时
    'm+': dateValue.getMinutes(),    // 分
    's+': dateValue.getSeconds(),    // 秒
    'q+': Math.floor((dateValue.getMonth() + 3) / 3),    // 季度
    'S': dateValue.getMilliseconds()    // 毫秒
  }

  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, String(dateValue.getFullYear()).substr(4 - RegExp.$1.length))
  }

  for (const k in dateObj) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, (RegExp.$1.length === 1)
          ? String(dateObj[k]) : ('00' + dateObj[k]).substr(String(dateObj[k]).length))
    }
  }

  if (/(E)/.test(format)) {
    format = format.replace(RegExp.$1, weekArr[dateValue.getDay()])
  }

  return format
}

/**
 * 加法
 * @param arg1
 * @param arg2
 */
function add(arg1: number | string, arg2: number | string) {
  let r1, r2, m
  try {
    r1 = String(arg1).split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = String(arg2).split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  return (multiply(arg1, m) + multiply(arg2, m)) / m
}

/**
 * 减法
 * @param arg1
 * @param arg2
 */
function subtract(arg1: number | string, arg2: number | string) {
  let r1, r2, m, n
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  n = (r1 >= r2) ? r1 : r2
  return parseFloat(((multiply(arg1, m) - multiply(arg2, m)) / m).toFixed(n))
}

/**
 * 乘法
 * @param arg1
 * @param arg2
 */
function multiply(arg1: number | string, arg2: number | string) {
  let m = 0
  const s1 = String(arg1), s2 = String(arg2)
  try {
    m += s1.split('.')[1].length
  } catch (e) {
  }
  try {
    m += s2.split('.')[1].length
  } catch (e) {
  }
  return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
}

/**
 * 除法
 * @param arg1
 * @param arg2
 */
function divide(arg1: number | string, arg2: number | string) {
  let t1 = 0, t2 = 0, r1, r2
  try {
    t1 = String(arg1).split('.')[1].length
  } catch (e) {
  }
  try {
    t2 = arg2.toString().split('.')[1].length
  } catch (e) {
  }

  r1 = Number((arg1 + '').replace('.', ''))
  r2 = Number((arg2 + '').replace('.', ''))
  return multiply((r1 / r2), Math.pow(10, t2 - t1))
}

/**
 * 校验form
 * @param form
 */
function formValidate(form: ElForm): Promise<void> {
  return new Promise<void>((resolve) => form.validate((valid: boolean) => {
    if (valid) {
      resolve()
    }
  }))
}

const CommonUtil = {timeFormat, add, subtract, multiply, divide, formValidate}
export default CommonUtil
