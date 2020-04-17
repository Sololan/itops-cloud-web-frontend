<template>
  <div ref="chartDom"></div>
</template>

<script>
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
  import echarts from 'echarts'
  import debounce from 'lodash/debounce'
  import {addListener, removeListener} from 'resize-detector'

  @Component({
    components: {}
  })
  export default class Chart extends Vue {
    @Prop({
      default: (() => {})
    }) option

    @Watch('option')
    watchOption(val) {
      this.chart.setOption(this.option)
    }

    created() {
      this.resize = debounce(this.resize, 100)
    }

    mounted() {
      this.renderChart()
      addListener(this.$refs.chartDom, this.resize)
    }

    beforeDestroy() {
      removeListener(this.$refs.chartDom, this.resize)
      this.chart.dispose()
      this.chart = null
    }

    resize() {
      // console.log('resize')
      this.chart.resize()
    }

    renderChart() {
      // 基于准备好的dom，初始化echarts实例
      this.chart = echarts.init(this.$refs.chartDom)
      // 绘制图表
      this.chart.setOption(this.option)
    }
  }
</script>

<style scoped>

</style>