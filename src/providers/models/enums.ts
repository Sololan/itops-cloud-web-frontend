/**
 * store中mutations的key
 */
export enum Mutations {
  SetMenuHide = 'setMenuHide',
  SetUserInfo = 'setUserInfo',
  SetLoadingShow = 'setLoadingShow',
  SetLoadingFullScreen = 'setLoadingFullScreen',
  SetDefault = 'setDefault',
}

/**
 * 常用日期格式化
 */
export enum DateFormat {
  Date = 'yyyy-MM-dd',
  DateTime = 'yyyy-MM-dd HH:mm'
}

/**
 * 常用日期格式化
 */
export enum Gateway {
  Bs = 'bs',
  Uc = 'uc',
}

/**
 * http请求方式
 */
export enum HttpMethod {
  GET,
  POST,
  PUT,
  DELETE
}

/**
 * storage的key
 */
export enum StorageKey {
  Token = 'token',
  UserName = 'userName',
  UserInfo = 'userInfo',
}

/**
 * 消息类型
 */
export enum NoticeType {
  Info = 'info',
  Error = 'error',
  Warning = 'warning',
  Success = 'success'
}

/**
 * Table 的尺寸
 */
export enum TableSize {
  Medium = 'medium',
  Small = 'small',
  Mini = 'mini',
}

/**
 * tooltip effect 属性
 */
export enum TooltipEffect {
  Dark = 'dark',
  Light = 'light'
}

/**
 * 排序命令
 */
export enum SortOrder {
  Asc = 'ascending',
  Desc = 'descending'
}

/**
 * 对应列的类型
 */
export enum ColumnType {
  Selection = 'selection',
  Index = 'index',
  Expand = 'expand',
}

/**
 * 固定列类型
 */
export enum FixedType {
  Left = 'left',
  Right = 'right'
}

/**
 * 列对齐方式
 */
export enum ColumnAlign {
  Left = 'left',
  Center = 'center',
  Right = 'right'
}

/**
 * 对应列是否可以排序
 */
export enum Sortable {
  Custom = 'custom'
}

/**
 * 过滤弹出框的定位
 */
export enum FilterPlacement {
  Top = 'top',
  TopStart = 'top-start',
  TopEnd = 'top-end',
  Bottom = 'bottom',
  BottomStart = 'bottom-start',
  BottomEnd = 'bottom-end',
  Left = 'left',
  LeftStart = 'left-start',
  LeftEnd = 'left-end',
  Right = 'right',
  RightStart = 'right-start',
  RightEnd = 'right-end'
}

/**
 * 组件布局，子组件名用逗号分隔
 */
export enum PageLayout {
  Sizes = 'sizes',
  Prev = 'prev',
  Pager = 'pager',
  Next = 'next',
  Jumper = 'jumper',
  Arrow = '->',
  Total = 'total',
  Slot = 'slot'
}

/**
 * 资源类型
 */
export enum ResourceType {
  Menu = '1', // 菜单
  Operate = '2' // 操作
}

/**
 * 菜单展示模式
 */
export enum MenuMode {
  Horizontal = 'horizontal',
  Vertical = 'vertical'
}

/**
 * 子菜单打开的触发方式
 */
export enum MenuTrigger {
  Hover = 'hover',
  Click = 'click',
}

/**
 * CRUD
 */
export enum CRUD {
  Create,
  Update
}

/**
 *  是否状态
 */
export enum YesOrNoStatus {
  No,  // 否
  Yes  // 是
}

/**
 *  字典组key
 */
export enum DictGroupKey {
  NoticeWay = 'NOTICE_WAY',
  WarningLevel = 'WARNING_LEVEL',
  WarningStage = 'WARNING_STAGE',
  PostponementStrategy = 'POSTPONEMENT_STRATEGY',

// NoticeWay = 2,
//     WarnLevel,
//     WarnStage,
//     PostponementStrategy
}

export enum RoleCode {
  Admin = 'ROLE_ADMIN',
  Manager = 'ROLE_MANAGER',
  User = 'ROLE_USER',
}
