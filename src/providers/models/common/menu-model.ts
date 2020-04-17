import {MenuMode, MenuTrigger} from '@/providers/models/enums'

/**
 * UI框架菜单配置
 */
export interface UiMenuCfg {
  /**
   * 模式
   */
  mode?: MenuMode;
  /**
   * 是否水平折叠收起菜单（仅在 mode 为 vertical 时可用）
   */
  collapse?: boolean;
  /**
   * 菜单的背景色（仅支持 hex 格式）
   */
  backgroundColor?: string;
  /**
   * 菜单的文字颜色（仅支持 hex 格式）
   */
  textColor?: string;
  /**
   * 当前激活菜单的文字颜色（仅支持 hex 格式）
   */
  activeTextColor?: string;
  /**
   * 当前激活菜单的 index
   */
  defaultActive?: string;
  /**
   * 当前打开的 sub-menu 的 index 的数组
   */
  defaultOpeneds?: any[];
  /**
   * 是否只保持一个子菜单的展开
   */
  uniqueOpened?: boolean;
  /**
   * 子菜单打开的触发方式(只在 mode 为 horizontal 时有效)
   */
  menuTrigger?: MenuTrigger;
  /**
   * 是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转
   */
  router?: boolean;
  /**
   * 是否开启折叠动画
   */
  collapseTransition?: boolean;
}

/**
 * UI子菜单配置
 */
export interface UiSubMenuCfg {
  /**
   * 唯一标志
   */
  index?: string;
  /**
   * 弹出菜单的自定义类名
   */
  popperClass?: string;
  /**
   * 展开 sub-menu 的延时
   */
  showTimeout?: number;
  /**
   * 收起 sub-menu 的延时
   */
  hideTimeout?: number;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 是否将弹出菜单插入至 body 元素。在菜单的定位出现问题时，可尝试修改该属性
   */
  popperAppendToBody?: boolean;
}

/**
 * UI菜单项配置
 */
export interface UiMenuItemCfg {
  /**
   * 唯一标志
   */
  index?: string;
  /**
   * Vue Router 路径对象
   */
  route?: object;
  /**
   * 是否禁用
   */
  disabled?: boolean;
}

/**
 * 菜单组配置
 */
export interface UiMenuGroupCfg {
  title?: string;
}

