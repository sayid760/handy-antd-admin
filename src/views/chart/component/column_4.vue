<template>
  <div id="column4"></div>
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
					backgroundColor:'#fff',
					title:{
						text:"描边柱状图",
						top:10,
						left:15,
						textStyle:{
							color:"#35598d",
							fontSize:16,
							fontWeight:'normal'
						}
					},
					tooltip: {
						trigger: 'axis',
						formatter:'{b}：{c}',
					},
					grid: {
						left: '5%',
						right: '6%',
						bottom: '3%',
						top: '20%',
						containLabel: true
					},
					xAxis :{
						type : 'category',
						data : ['策略1','策略2','策略3','策略4','策略5','策略6','策略7','策略8','策略9'],
						axisLabel:{          //坐标轴字体颜色
							textStyle:{
								color: '#9eaaba'
							}
						},
						axisLine:{
							lineStyle:{
								color:"#e5e5e5"
							}
						}, 
						axisTick:{       //y轴刻度线
						show:false
						},
						splitLine:{    //网格
							show: false,

						}
					},
					yAxis :{
						type : 'value',
						axisLabel:{        //坐标轴字体颜色
							textStyle:{
								color: '#9eaaba'
							}
						},
						axisLine:{
							show:false,
						},
						axisTick:{       //y轴刻度线
						show:false
						},
						splitLine:{    //网格
							show: true,
							lineStyle:{
								color:'#dadde4',
								type:"dashed" //坐标网线类型
							}
						}
					},
					series:{
						name:'',
						type:'bar',
						barWidth : '40%',  //柱子宽度
						itemStyle:{  //柱子颜色
							normal:{
								borderWidth: 2,
								borderColor: 'rgba(79, 116, 223, .5)',
								// color:'rgba(79, 116, 223, .3)',
								color: '#00bcff'
							}
						},
						data:[320, 332, 301, 334, 390, 330, 320, 230, 156]
					}
				}
            }
        );
        const { manipulateChart } = useECharts(data, 'column4');
        
        return {
            data
        }
    }
}
</script>

<style>
#column4 {
    width: 100%;
    height: 50vh;
    margin: 0 auto;
}
</style>