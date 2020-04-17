<template>
  <div class="yj-table">
    <!--列表-查询-->
    <div class="yj-search-area" v-if="$scopedSlots.search">
      <slot name="search" />
    </div>
    <!--列表-操作-->
    <div class="yj-operate-area" v-if="$scopedSlots.operate">
      <slot name="operate" />
    </div>
    <!--列表-表格-->
    <div class="yj-body-area">
      <el-table :class="{'yj-disable-radius': disableRadius}" v-bind="tableConfig.table" ref="yjTable"
                @select="(selection, row) => $emit('select', selection, row)"
                @select-all="(selection) => $emit('select-all', selection)"
                @selection-change="(selection) => $emit('selection-change', selection)"
                @cell-mouse-enter="(row, column, cell, event) => $emit('cell-mouse-enter', row, column, cell, event)"
                @cell-mouse-leave="(row, column, cell, event) => $emit('cell-mouse-leave', row, column, cell, event)"
                @cell-click="(row, column, cell, event) => $emit('cell-click', row, column, cell, event)"
                @cell-dblclick="(row, column, cell, event) => $emit('cell-dblclick', row, column, cell, event)"
                @row-click="(row, column, event) => $emit('row-click', row, column, event)"
                @row-contextmenu="(row, column, event) => $emit('row-contextmenu', row, column, event)"
                @row-dblclick="(row, column, event) => $emit('row-dblclick', row, column, event)"
                @header-click="(column, event) => $emit('header-click', column, event)"
                @header-contextmenu="(column, event) => $emit('header-contextmenu', column, event)"
                @sort-change="({ column, prop, order }) => $emit('sort-change', { column, prop, order })"
                @filter-change="(filters) => $emit('filter-change', filters)"
                @current-change="(currentRow, oldCurrentRow) => $emit('table-change', currentRow, oldCurrentRow)"
                @header-dragend="(newWidth, oldWidth, column, event) => $emit('header-dragend', newWidth, oldWidth, column, event)"
                @expand-change="(row, expanded) => $emit('expand-change', row, expanded)">
        <!--第一级-->
        <el-table-column v-for="(column, index) in tableConfig.columns" :key="index" v-bind="column">
          <template v-if="column.template" v-slot="scope">
            <slot :name="column.template" :row="scope.row" :rowIndex="scope.$index" />
          </template>
          <!--第二级-->
          <template v-if="!column.template && column.children && column.children.length">
            <el-table-column v-for="(column2, index2) in column.children" :key="index2" v-bind="column2">
              <template v-if="column2.template" v-slot="scope2">
                <slot :name="column2.template" :row="scope2.row" :rowIndex="scope2.$index" />
              </template>
              <!--第三级-->
              <template v-if="!column2.template && column2.children && column2.children.length">
                <el-table-column v-for="(column3, index3) in column2.children" :key="index3" v-bind="column3">
                  <template v-if="column3.template" v-slot="scope3">
                    <slot :name="column3.template" :row="scope3.row" :rowIndex="scope3.$index" />
                  </template>
                  <!--第四级-->
                  <template v-if="!column3.template && column3.children && column3.children.length">
                    <el-table-column v-for="(column4, index4) in column3.children" :key="index4" v-bind="column4">
                      <template v-if="column4.template" v-slot="scope4">
                        <slot :name="column4.template" :row="scope4.row" :rowIndex="scope4.$index" />
                      </template>
                      <!--第五级-->
                      <template v-if="!column4.template && column4.children && column4.children.length">
                        <el-table-column v-for="(column5, index5) in column4.children" :key="index5" v-bind="column5">
                          <template v-if="column5.template" v-slot="scope5">
                            <slot :name="column5.template" :row="scope5.row" :rowIndex="scope5.$index" />
                          </template>
                          <!--下一级待扩展-->
                        </el-table-column>
                      </template>
                    </el-table-column>
                  </template>
                </el-table-column>
              </template>
            </el-table-column>
          </template>
        </el-table-column>

        <template #append>
          <slot name="append" />
        </template>
      </el-table>
    </div>
    <!--列表-分页器-->
    <div class="yj-page-area">
      <el-pagination v-bind="tableConfig.page"
                     @size-change="(pageSize) => handlePageSizeChange(pageSize)"
                     @current-change="(currentPage) => handlePageNumChange(currentPage)"
                     @prev-click="(currentPage) => $emit('prev-click', currentPage)"
                     @next-click="(currentPage) => $emit('next-click', currentPage)">
        <slot name="pagination" />
      </el-pagination>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'
  import {PageChangeParam, TableConfig} from '@/providers/models/common/table-model'
  import {ColumnAlign} from '@/providers/models/enums'

  @Component
  export default class YjTable extends Vue {
    @Prop() config!: TableConfig
    @Prop() disableRadius?: boolean

    private readonly defaultConfig: TableConfig = {
      table: {
        stripe: true,
        height: '100%',
        border: true,
        headerCellStyle: {'text-align': 'center'}
      },
      page: {
        background: true,
        pagerCount: 5,
        layout: '->,total,prev,pager,next,sizes',
        prevText: '上一页',
        nextText: '下一页'
      },
      columns: [{ // 这边配置的作为默认列配置
        showOverflowTooltip: true,
        align: ColumnAlign.Center
      }]
    }
    private pageChangeParam: PageChangeParam = {pageSize: null, currentPage: null}
    get tableConfig(): TableConfig {
      const config: TableConfig = {
        table: {...this.defaultConfig.table, ...this.config.table},
        page: {...this.defaultConfig.page, ...this.config.page},
        columns: this.config.columns.map((column) => ({...this.defaultConfig.columns[0], ...column}))
      }
      this.pageChangeParam.pageSize = config.page.pageSize
      this.pageChangeParam.currentPage = config.page.currentPage
      return config
    }

    /**
     * 用于多选表格，清空用户的选择
     */
    clearSelection(): void {
      (this.$refs.yjTable as any).clearSelection()
    }

    /**
     * 用于多选表格，切换某一行的选中状态，
     * 如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）
     * @param row
     * @param selected
     */
    toggleRowSelection(row: object, selected?: boolean): void {
      (this.$refs.yjTable as any).toggleRowSelection(row, selected)
    }

    /**
     * 用于多选表格，切换所有行的选中状态
     */
    toggleAllSelection(): void {
      (this.$refs.yjTable as any).toggleAllSelection()
    }

    /**
     * 用于可展开表格与树形表格，切换某一行的展开状态，
     * 如果使用了第二个参数，则是设置这一行展开与否（expanded 为 true 则展开）
     * @param row
     * @param expanded
     */
    toggleRowExpansion(row: object, expanded?: boolean): void {
      (this.$refs.yjTable as any).toggleRowExpansion(row, expanded)
    }

    /**
     * 用于单选表格，设定某一行为选中行，
     * 如果调用时不加参数，则会取消目前高亮行的选中状态。
     * @param row
     */
    setCurrentRow(row?: object): void {
      (this.$refs.yjTable as any).setCurrentRow(row)
    }

    /**
     * 用于清空排序条件，数据会恢复成未排序的状态
     */
    clearSort(): void {
      (this.$refs.yjTable as any).clearSort()
    }

    /**
     * 不传入参数时用于清空所有过滤条件，数据会恢复成未过滤的状态，
     * 也可传入由columnKey组成的数组以清除指定列的过滤条件
     */
    clearFilter(columnKey: string[]): void {
      (this.$refs.yjTable as any).clearFilter(columnKey)
    }

    /**
     * 对 Table 进行重新布局。
     * 当 Table 或其祖先元素由隐藏切换为显示时，可能需要调用此方法
     */
    doLayout(): void {
      (this.$refs.yjTable as any).doLayout()
    }

    /**
     * 手动对 Table 进行排序。
     * 参数prop属性指定排序列，order指定排序顺序。
     * @param prop
     * @param order
     */
    sort(prop: string, order: string): void {
      (this.$refs.yjTable as any).sort(prop, order)
    }

    /**
     * 分页组件size-change事件
     * @param pageSize
     */
    handlePageSizeChange(pageSize: number): void {
      this.$emit('size-change', pageSize)
      this.pageChangeParam.pageSize = pageSize
      this.$emit('page-search', this.pageChangeParam)
    }

    /**
     * 分页组件current-change事件
     * @param currentPage
     */
    handlePageNumChange(currentPage: number): void {
      this.$emit('pagination-change', currentPage)
      this.pageChangeParam.currentPage = currentPage
      this.$emit('page-search', this.pageChangeParam)
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/styles/variable";

  .yj-table {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .yj-search-area, .yj-operate-area, .yj-page-area {
      flex: none;
    }

    .yj-search-area {
      margin-bottom: 10px;
    }

    .yj-operate-area {
      margin-bottom: 3px;
    }

    .yj-search-area + .yj-body-area {
      margin-top: 5px;
    }

    .yj-body-area {
      flex: auto;
      height: 0;
      min-height: 143px;
    }

    .yj-page-area {
      margin-top: 8px;
    }

    .el-table:not(.yj-disable-radius) {
      border-radius: 10px;

      &::before {
        left: -1px;
        right: 0;
        width: auto;
        height: 20px;
        border-radius: 10px;
        border-bottom: 1px solid $-table-border-color;
        background-color: transparent;
      }

      &::after {
        top: -1px;
        bottom: 0;
        width: 20px;
        height: auto;
        border-radius: 10px;
        border-right: 1px solid $-table-border-color;
        background-color: transparent;
      }
    }

    .el-pagination.is-background /deep/ {
      .btn-prev, .btn-next, .el-pager li:not(.active) {
        background-color: transparent;
      }
    }
  }
</style>
