<template>
  <div id="column2"></div>
</template>

<script>
import { ref, reactive, toRefs, onMounted, onUnmounted } from 'vue';
import useECharts from '/@/hooks/useECharts'
import echarts from "echarts";

export default {
    setup() {
        const data = reactive(
            {
                option: {
					backgroundColor: '#ffffff',
					title: {
						text: 'ETC交易成功率',
						left: 'center',
						top: 15,
						textStyle:{
							color:"#35598d",
							fontSize:16,
							fontWeight:'normal'
						}
					},
					color: ['#ffc555','#73deb3'],
					tooltip: {
						trigger: 'axis',
						axisPointer: { // 坐标轴指示器，坐标轴触发有效
							type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '10%',
						containLabel: true
					},
					legend: {
						left: 'center',
						bottom: '2%',
						data: ['去年', '今年', ]
					},
					xAxis: [{
						type: 'category',
						data: ['09-22', '09-22', '09-22', '09-22', '09-22', '09-22', '09-22'],
						axisTick: {
							alignWithLabel: true
						}
					}],
					yAxis: [{
						type: 'value'
					}],
					barMaxWidth: '30',
					label:{
						show:true,
						position:'top',
						formatter:function(params){
							return params.value+'%'
						}
					},
					series: [
				
						{
							name: '去年',
							type: 'bar',
							data: [90, 52, 90, 80, 90, 70, 90]
						},
						{
							name: '今年',
							type: 'bar',
							data: [10, 52, 90, 70, 90, 70, 90]
						},
					]
				}
            }
        );
        const { manipulateChart } = useECharts(data, 'column2');
		onMounted(()=>{
			window.addEventListener('resize', ()=>{
				manipulateChart('resize')
			})
		})

		onUnmounted(()=>{
			window.removeEventListener('resize',()=>{
				manipulateChart('resize')
			})
		})
        
        return {
            data
        }
    }
}
</script>

<style>
#column2 {
    width: 100%;
    height: 50vh;
    margin: 0 auto;
}
</style>