<template>
  <div id="column1"></div>
</template>

<script>
import { ref, reactive, toRefs, onMounted, onUnmounted } from 'vue';
import useECharts from '/@/hooks/useECharts'
import echarts from "echarts";

export default {
    setup() {
		const colorList = ["#9E87FF", '#73DDFF', '#fe9a8b', '#F56948', '#9E87FF']
        const data = reactive(
            {
                option: {
					tooltip: {
						trigger: 'axis',
						axisPointer: { 
							type: 'shadow' ,
							textStyle: {
								color: '#fff',
								fontSize: '26'
							},
						}
					},
					legend: {
						top:'5%',
						right:'10%',
						data: ['猕猴桃', '香蕉'],
						textStyle:{
							fontSize:12,
							color:'#808080'
						},
						icon:'rect'
					},
					grid: {
						top:60,
						left:50,
						bottom:60,
						right:60
					},
					xAxis: [{
						type: 'category',
						axisTick:{
							show:false
						},
						axisLine:{
							show:false
						},
						axisLabel:{
							color:'#4D4D4D',
							fontSize:14,
							margin:21,
							fontWeight:'bold'
						},
						data: ['第一周', '第二周', '第三周', '第四周'],
					
					}],
					yAxis: [{
						name:'单位：万',
						nameTextStyle:{
							color:'#808080',
							fontSize:12,
							padding:[0, 0, 0, -5]
						},
						max: function(value) {
							if(value.max<5){
								return 5
							}else{
								return value.max
							}
						},
						type: 'value',
						axisLine:{
							show:false
						},
						axisLabel:{
							color:'#808080',
							fontSize:12,
							margin:5
						},
						splitLine:{
							show:false
						},
						axisTick:{
							show:false
						}
					}],
					series: [
						{
							name: '猕猴桃',
							type: 'bar',
							label:{
								show:true,
								position:'top',
								fontSize:14,
								color:'#3DC3F0',
								fontWeight:'bold'
							},
							barMaxWidth:28,
							itemStyle:{
								color: {
									type: 'linear',
									x: 0,
									y: 0,
									x2: 0,
									y2: 1,
									colorStops: [{
										offset: 0, color: '#ffe38d' // 0% 处的颜色
									}, {
										offset: 1, color: '#ffc616' // 100% 处的颜色
									}]
								}
							},
							data: [60, 110, 180, 100]
						}, 
						{
							name: '香蕉',
							type: 'bar',
										label:{
								show:true,
								position:'top',
								fontSize:14,
								color:'#3D8BF0',
								fontWeight:'bold'
							},
							barMaxWidth:28,
							itemStyle:{
								color: {
									type: 'linear',
									x: 0,
									y: 0,
									x2: 0,
									y2: 1,
									colorStops: [{
										offset: 0, color: '#2ecffd' // 0% 处的颜色
									}, {
										offset: 1, color: '#3fa2fe' // 100% 处的颜色
									}]
								}
							},
							data: [90, 130, 170, 130]
						}
					]
				}
            }
        );
        const { manipulateChart } = useECharts(data, 'column1');
        
        return {
            data
        }
    }
}
</script>

<style>
#column1 {
    width: 100%;
    height: 50vh;
    margin: 0 auto;
	background: #fff;
}
</style>