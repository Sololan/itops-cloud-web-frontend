import {CreateElement, VNode} from 'vue'
import {ColumnAlign, ColumnType, FilterPlacement, FixedType, Sortable, SortOrder, TableSize, TooltipEffect} from '@/providers/models/enums'

/**
 * 表格行回调参数
 */
export interface RowCbParam {
  row: object;
  rowIndex: number;
}

/**
 * 表格单元格回调参数
 */
export interface CellCbParam {
  row: object,
  rowIndex: number,
  column: object,
  columnIndex: number
}

/**
 * 合计回调参数
 */
export interface SummaryCbParam {
  columns: object[],
  data: object
}

/**
 * 表格头回调参数
 */
export interface HeaderCbParam {
  column: object;
  $index: number;
}

/**
 * 默认排序
 */
export interface DefaultSort {
  prop?: string;
  order?: SortOrder
}

/**
 * 合并单元格
 */
export interface SpanMethod {
  rowspan?: number;
  colspan?: number;
}

/**
 * 树节点
 */
export interface TreeNode {
  rowKey?: string | number,
  isLeaf?: boolean,
  level?: number,
  expanded?: boolean,
  loaded?: boolean
}

/**
 * 表格列信息
 */
export interface ColumnInfo {
  label?: string;
  property?: string;
  type?: string;
  fixed?: boolean | string;
}

/**
 * 数据过滤的选项
 */
interface ColumnFilter {
  text?: string,
  value?: any
}

/**
 * UI框架表格配置
 */
export interface UiTableCfg {
  /**
   * 显示的数据
   */
  data?: object[];
  /**
   * Table 的高度，默认为自动高度。如果 height 为 number 类型，单位 px；
   * 如果 height 为 string 类型，则这个高度会设置为 Table 的 style.height 的值，
   * Table 的高度会受控于外部样式。
   */
  height?: string | number;
  /**
   * Table 的最大高度。合法的值为数字或者单位为 px 的高度。
   */
  maxHeight?: string | number;
  /**
   * 是否为斑马纹 table
   */
  stripe?: boolean;
  /**
   * 是否带有纵向边框
   */
  border?: boolean;
  /**
   * Table 的尺寸
   */
  size?: TableSize;
  /**
   * 列的宽度是否自撑开
   */
  fit?: boolean;
  /**
   * 是否显示表头
   */
  showHeader?: boolean;
  /**
   * 是否要高亮当前行
   */
  highlightCurrentRow?: boolean;
  /**
   * 当前行的 key，只写属性
   */
  currentRowKey?: string | number;
  /**
   * 行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className。
   * @param param
   */
  rowClassName?: string | ((param: RowCbParam) => string);
  /**
   * 行的 style 的回调方法，也可以使用一个固定的 Object 为所有行设置一样的 Style。
   * @param param
   */
  rowStyle?: object | ((param: RowCbParam) => object);
  /**
   * 单元格的 className 的回调方法，也可以使用字符串为所有单元格设置一个固定的 className。
   * @param param
   */
  cellClassName?: string | ((param: CellCbParam) => string);
  /**
   * 单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有单元格设置一样的 Style。
   * @param param
   */
  cellStyle?: object | ((param: CellCbParam) => object);
  /**
   * 表头行的 className 的回调方法，也可以使用字符串为所有表头行设置一个固定的 className。
   * @param param
   */
  headerRowClassName?: string | ((param: RowCbParam) => string);
  /**
   * 表头行的 style 的回调方法，也可以使用一个固定的 Object 为所有表头行设置一样的 Style。
   * @param param
   */
  headerRowStyle?: object | ((param: RowCbParam) => object);
  /**
   * 表头单元格的 className 的回调方法，也可以使用字符串为所有表头单元格设置一个固定的 className。
   * @param param
   */
  headerCellClassName?: string | ((param: CellCbParam) => string);
  /**
   * 表头单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有表头单元格设置一样的 Style。
   * @param param
   */
  headerCellStyle?: object | ((param: CellCbParam) => object);
  /**
   * 行数据的 Key，用来优化 Table 的渲染；
   * 在使用 reserve-selection 功能与显示树形数据时，该属性是必填的。
   * 类型为 String 时，支持多层访问：user.info.id，但不支持 user.info[0].id，此种情况请使用 Function。
   * @param row
   */
  rowKey?: string | ((row: object) => any);
  /**
   * 空数据时显示的文本内容，也可以通过 slot="empty" 设置
   */
  emptyText?: string;
  /**
   * 是否默认展开所有行，当 Table 包含展开行存在或者为树形表格时有效
   */
  defaultExpandAll?: boolean;
  /**
   * 可以通过该属性设置 Table 目前的展开行，需要设置 row-key 属性才能使用，该属性为展开行的 keys 数组。
   */
  expandRowKeys?: any[];
  /**
   * 默认的排序列的 prop 和顺序。它的prop属性指定默认的排序的列，order指定默认排序的顺序
   */
  defaultSort?: DefaultSort;
  /**
   * tooltip effect 属性
   */
  tooltipEffect?: TooltipEffect;
  /**
   * 是否在表尾显示合计行
   */
  showSummary?: boolean;
  /**
   * 合计行第一列的文本
   */
  sumText?: string;
  /**
   * 自定义的合计计算方法
   */
  summaryMethod?: (param: SummaryCbParam) => any[];
  /**
   * 合并行或列的计算方法
   */
  spanMethod?: (param: CellCbParam) => ([number, number] | SpanMethod);
  /**
   * 在多选表格中，当仅有部分行被选中时，点击表头的多选框时的行为。
   * 若为 true，则选中所有行；若为 false，则取消选择所有行
   */
  selectOnIndeterminate?: boolean;
  /**
   * 展示树形数据时，树节点的缩进
   */
  indent?: number;
  /**
   * 是否懒加载子节点数据
   */
  lazy?: boolean;
  /**
   * 加载子节点数据的函数，lazy 为 true 时生效，函数第二个参数包含了节点的层级信息
   * @param row
   * @param treeNode
   * @param resolve
   */
  load?: (row: object, treeNode: TreeNode, resolve: Function) => void;
  /**
   * 渲染嵌套数据的配置选项
   */
  treeProps?: object;
}

/**
 * UI框架列配置
 */
export interface UiColumnCfg {
  /**
   * 多行表头时的子列
   */
  children?: UiColumnCfg[];
  /**
   * 插槽名（用于自定义列）
   */
  template?: string;
  /**
   * 对应列的类型。
   * 如果设置了 selection 则显示多选框；
   * 如果设置了 index 则显示该行的索引（从 1 开始计算）；
   * 如果设置了 expand 则显示为一个可展开的按钮
   */
  type?: ColumnType;
  /**
   * 如果设置了 type=index，可以通过传递 index 属性来自定义索引
   * @param index
   */
  index?: number | ((index: number) => number);
  /**
   * column 的 key，如果需要使用 filter-change 事件，
   * 则需要此属性标识是哪个 column 的筛选条件
   */
  columnKey?: string;
  /**
   * 显示的标题
   */
  label?: string;
  /**
   * 对应列内容的字段名，也可以使用 property 属性
   */
  prop?: string;
  /**
   * 对应列的宽度
   */
  width?: string;
  /**
   * 对应列的最小宽度，与 width 的区别是 width 是固定的，
   * min-width 会把剩余宽度按比例分配给设置了 min-width 的列
   */
  minWidth?: string;
  /**
   * 列是否固定在左侧或者右侧，true 表示固定在左侧
   */
  fixed?: FixedType | boolean;
  /**
   * 列标题 Label 区域渲染使用的 Function
   * @param h
   * @param param
   */
  renderHeader?: (h: CreateElement, param: HeaderCbParam) => VNode | string;
  /**
   * 对应列是否可以排序，
   * 如果设置为 'custom'，则代表用户希望远程排序，
   * 需要监听 Table 的 sort-change 事件
   */
  sortable?: Sortable | boolean;
  /**
   * 对数据进行排序的时候使用的方法，
   * 仅当 sortable 设置为 true 的时候有效，
   * 需返回一个数字，和 Array.sort 表现一致
   * @param a
   * @param b
   */
  sortMethod?: (a: any, b: any) => number;
  /**
   * 指定数据按照哪个属性进行排序，仅当 sortable 设置为 true 且没有设置 sort-method 的时候有效。
   * 如果 sort-by 为数组，则先按照第 1 个属性排序，如果第 1 个相等，再按照第 2 个排序，以此类推
   */
  sortBy?: Function | string | string[];
  /**
   * 数据在排序时所使用排序策略的轮转顺序，仅当 sortable 为 true 时有效。
   * 需传入一个数组，随着用户点击表头，该列依次按照数组中元素的顺序进行排序
   */
  sortOrders?: Array<SortOrder | null>;
  /**
   * 对应列是否可以通过拖动改变宽度（需要在 el-table 上设置 border 属性为真）
   */
  resizable?: boolean;
  /**
   * 用来格式化内容
   */
  formatter?: (row: any, column: ColumnInfo) => any;
  /**
   * 当内容过长被隐藏时显示 tooltip
   */
  showOverflowTooltip?: boolean;
  /**
   * 对齐方式
   */
  align?: ColumnAlign;
  /**
   * 表头对齐方式，若不设置该项，则使用表格的对齐方式
   */
  headerAlign?: ColumnAlign;
  /**
   * 列的 className
   */
  className?: string;
  /**
   * 当前列标题的自定义类名
   */
  labelClassName?: string;
  /**
   * 仅对 type=selection 的列有效，类型为 Function，
   * Function 的返回值用来决定这一行的 CheckBox 是否可以勾选
   * @param row
   * @param index
   */
  selectable?: (row: object, index: number) => boolean;
  /**
   * 仅对 type=selection 的列有效，类型为 Boolean，
   * 为 true 则会在数据更新之后保留之前选中的数据（需指定 row-key）
   */
  reserveSelection?: boolean;
  /**
   * 数据过滤的选项，数组格式，数组中的元素需要有 text 和 value 属性。
   */
  filters?: ColumnFilter[];
  /**
   * 过滤弹出框的定位
   */
  filterPlacement?: FilterPlacement;
  /**
   * 数据过滤的选项是否多选
   */
  filterMultiple?: boolean;
  /**
   * 数据过滤使用的方法，如果是多选的筛选项，对每一条数据会执行多次，任意一次返回 true 就会显示。
   * @param value
   * @param row
   * @param column
   */
  filterMethod?: (value: any, row: object, column: object) => boolean;
  /**
   * 选中的数据过滤项，如果需要自定义表头过滤的渲染方式，可能会需要此属性。
   */
  filteredValue?: ColumnFilter[];
}

/**
 * UI框架分页配置
 */
export interface UiPageCfg {
  /**
   * 是否使用小型分页样式
   */
  small?: boolean;
  /**
   * 是否为分页按钮添加背景色
   */
  background?: boolean;
  /**
   * 每页显示条目个数
   */
  pageSize?: number;
  /**
   * 总条目数
   */
  total?: number;
  /**
   * 总页数，total 和 page-count 设置任意一个就可以达到显示页码的功能；
   * 如果要支持 page-sizes 的更改，则需要使用 total 属性
   */
  pageCount?: number;
  /**
   * 页码按钮的数量，当总页数超过该值时会折叠
   */
  pagerCount?: number;
  /**
   * 当前页数
   */
  currentPage?: number;
  /**
   * 组件布局，子组件名用逗号分隔
   */
  layout?: string;
  /**
   * 每页显示个数选择器的选项设置
   */
  pageSizes?: number[];
  /**
   * 每页显示个数选择器的选项设置
   */
  popperClass?: string;
  /**
   * 替代图标显示的上一页文字
   */
  prevText?: string;
  /**
   * 替代图标显示的下一页文字
   */
  nextText?: string;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 只有一页时是否隐藏
   */
  hideOnSinglePage?: boolean;
}

/**
 * 表格配置
 */
export interface TableConfig {
  table?: UiTableCfg;
  page?: UiPageCfg;
  columns?: UiColumnCfg[];
}

/**
 * 分页改变参数
 */
export interface PageChangeParam {
  currentPage: number;
  pageSize: number;
}
