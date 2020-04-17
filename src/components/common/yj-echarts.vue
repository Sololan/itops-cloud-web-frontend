<template>
  <div class="yj-echarts">
    <div ref="echartsRef" style="width: 100%; height: 100%;"></div>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Ref, Vue} from 'vue-property-decorator'
  import echarts from 'echarts'
  import ECharts = echarts.ECharts
  import EChartOption = echarts.EChartOption
  import EChartsResponsiveOption = echarts.EChartsResponsiveOption
  import EChartsOptionConfig = echarts.EChartsOptionConfig
  import EChartsResizeOption = echarts.EChartsResizeOption
  import EChartsConvertFinder = echarts.EChartsConvertFinder
  import EChartsLoadingOption = echarts.EChartsLoadingOption
  import TypedArray = echarts.TypedArray

  @Component
  export default class YjEcharts extends Vue {
    @Ref() readonly echartsRef: HTMLDivElement
    @Prop() disableResize?: boolean

    private echartsInstance: ECharts

    /**
     * 图表的分组，用于联动
     * @param group
     */
    setGroup(group: string): void {
      this.echartsInstance.group = group
    }

    /**
     * 设置图表实例的配置项以及数据，万能接口，所有参数和数据的修改都可以通过 setOption 完成，
     * ECharts 会合并新的参数和数据，然后刷新图表
     * @param option
     * @param notMerge
     * @param lazyUpdate
     */
    setOption(option: EChartOption | EChartsResponsiveOption, notMerge?: boolean, lazyUpdate?: boolean): void {
      this.echartsInstance.setOption(option, notMerge, lazyUpdate)
    }

    /**
     * 设置图表实例的配置项以及数据，万能接口，所有参数和数据的修改都可以通过 setOption 完成，
     * ECharts 会合并新的参数和数据，然后刷新图表。
     * @param option
     * @param opts
     */
    setOption2(option: EChartOption, opts?: EChartsOptionConfig): void {
      this.echartsInstance.setOption(option, opts)
    }

    /**
     * 获取 ECharts 实例容器的宽度。
     */
    getWidth(): number {
      return this.echartsInstance.getWidth()
    }

    /**
     * 获取 ECharts 实例容器的高度。
     */
    getHeight(): number {
      return this.echartsInstance.getHeight()
    }

    /**
     * 获取 ECharts 实例容器的 dom 节点。
     */
    getDom(): HTMLCanvasElement | HTMLDivElement {
      return this.echartsInstance.getDom()
    }

    /**
     * 获取当前实例中维护的 option 对象，返回的 option 对象中包含了用户多次 setOption 合并得到的配置项和数据，
     * 也记录了用户交互的状态，例如图例的开关，数据区域缩放选择的范围等等
     */
    getOption(): EChartOption {
      return this.echartsInstance.getOption()
    }

    /**
     * 改变图表尺寸，在容器大小发生改变时需要手动调用
     * @param opts
     */
    resize(opts?: EChartsResizeOption): void {
      this.echartsInstance.resize(opts)
    }

    /**
     * 触发图表行为，例如图例开关legendToggleSelect, 数据区域缩放dataZoom，显示提示框showTip等等
     * @param payload
     */
    dispatchAction(payload: object): void {
      this.echartsInstance.dispatchAction(payload)
    }

    /**
     * 绑定事件处理函数。
     * @param eventName
     * @param handler
     * @param context
     */
    on(eventName: string, handler: Function, context?: object): void {
      this.echartsInstance.on(eventName, handler, context)
    }

    /**
     * 可选，可以传入需要解绑的处理函数，不传的话解绑所有该类型的事件函数
     * @param eventName
     * @param handler
     */
    off(eventName: string, handler?: Function): void {
      this.echartsInstance.off(eventName, handler)
    }

    /**
     * 转换坐标系上的点到像素坐标值
     * @param finder
     * @param value
     */
    convertToPixel(finder: EChartsConvertFinder, value: string | any[]): string | any[] {
      return this.echartsInstance.convertToPixel(finder, value)
    }

    /**
     * 转换像素坐标值到逻辑坐标系上的点
     * @param finder
     * @param value
     */
    convertFromPixel(finder: EChartsConvertFinder, value: any[] | string): any[] | string {
      return this.echartsInstance.convertFromPixel(finder, value)
    }

    /**
     * 判断给定的点是否在指定的坐标系或者系列上
     * @param finder
     * @param value
     */
    containPixel(finder: EChartsConvertFinder, value: any[]): boolean {
      return this.echartsInstance.containPixel(finder, value)
    }

    /**
     * 显示加载动画效果。可以在加载数据前手动调用该接口显示加载动画，在数据加载完成后调用 hideLoading 隐藏加载动画
     * @param type
     * @param opts
     */
    showLoading(type?: string, opts?: EChartsLoadingOption): void {
      this.echartsInstance.showLoading(type, opts)
    }

    /**
     * 隐藏动画加载效果
     */
    hideLoading(): void {
      this.echartsInstance.hideLoading()
    }

    /**
     * 导出图表图片，返回一个 base64 的 URL，可以设置为Image的src
     * @param opts
     */
    getDataURL(opts: { type?: string, pixelRatio?: number, backgroundColor?: string, excludeComponents?: string[] }): string {
      return this.echartsInstance.getDataURL(opts)
    }

    /**
     * 导出联动的图表图片，返回一个 base64 的 url，可以设置为Image的src
     * @param opts
     */
    getConnectedDataURL(opts: { type: string, pixelRatio: number, backgroundColor: string, excludeComponents?: string[] }): string {
      return this.echartsInstance.getConnectedDataURL(opts)
    }

    /**
     * 此接口用于，在大数据量（百万以上）的渲染场景，分片加载数据和增量渲染。
     * 在大数据量的场景下（例如地理数的打点），就算数据使用二进制格式，也会有几十或上百兆，
     * 在互联网环境下，往往需要分片加载。appendData 接口提供了分片加载后增量渲染的能力，渲染新加入的数据块时不会清除原有已经渲染的部分
     * @param opts
     */
    appendData(opts: { seriesIndex?: string, data?: any[] | TypedArray, }): void {
      this.echartsInstance.appendData(opts)
    }

    /**
     * 清空当前实例，会移除实例中所有的组件和图表
     */
    clear(): void {
      this.echartsInstance.clear()
    }

    /**
     * 当前实例是否已经被释放
     */
    isDisposed(): boolean {
      return this.echartsInstance.isDisposed()
    }

    /**
     * 销毁实例，销毁后实例无法再被使用
     */
    dispose(): void {
      this.echartsInstance.dispose()
    }

    private handleWindowResize(): void {
      this.echartsInstance.resize()
    }

    mounted(): void {
      this.echartsInstance = echarts.init(this.echartsRef)
      if (!this.disableResize) {
        window.addEventListener('resize', this.handleWindowResize)
      }
    }
    destroyed(): void {
      window.removeEventListener('resize', this.handleWindowResize)
      !this.echartsInstance.isDisposed() ? this.echartsInstance.dispose() : null
    }
  }
</script>

<style scoped lang="scss">
  .yj-echarts {
    height: 100%;
  }
</style>
