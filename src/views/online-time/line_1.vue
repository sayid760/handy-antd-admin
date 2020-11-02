<template>
    <div class="content">
        <a-card>
            <time-bar @change="timeChange"
                        :disabledMinute="true"
                        :displayTypeItem="true"></time-bar>
        <div class="chart-wrapper" ref="lineChart"></div>

        </a-card>
    </div>
</template>

<script>
import echarts from "echarts";
import { onMounted, onBeforeUnmount, defineComponent, ref, watch } from "vue";
import TimeBar from '@/components/time-bar'

export default {
  name: "lineChart",
  components: {
    TimeBar
  },
  setup(props, rest) {
      console.log(props)
      console.log(rest)
    let lineChart = ref(null);
    let myChart = ref(null);
    const colors = ['#5793f3', '#d14a61', '#675bba'];
    //渲染echarts图
    const initEcharts = () => {
      
      myChart.value = echarts.init(lineChart.value);
    /* eslint-disable */
      myChart.value.setOption(
              {
	    backgroundColor: '#fff',
	    title: {
	        text: "告警数",
	        left: "18px",
	        top: "0",
	        textStyle: {
	            color: "#999",
	            fontSize: 12,
	            fontWeight: '400'
	        }
	    },
	    color: ['#73A0FA', '#73DEB3', '#FFB761'],
	    tooltip: {
	        // trigger: 'axis',
	        axisPointer: {
	            type: 'cross',
	            crossStyle: {
	                color: '#999'
	            },
	            lineStyle: {
	                type: 'dashed'
	            }
	        }
	    },
	    grid: {
	        left: '25',
	        right: '25',
	        bottom: '24',
	        top: '75',
	        containLabel: true
	    },
	    legend: {
	        data: [ '上周', '本周'],
	        orient: 'horizontal',
	        icon: "rect",
	        show: true,
	        left: 20,
	        top: 25,
	    },
	    xAxis: {
	        type: 'category',
	        data: ['爱立信端局', '中兴端局', '爱立信HSS', '中兴HSS', '华为HSS', '华为智能网', '中兴VIMS'],
	        splitLine: {
	            show: false
	        },
	        axisTick: {
	            show: false
	        },
	        axisLine: {
	            show: false
	        },
	    },
	    yAxis: {
	        type: 'value',
	        axisLabel: {
	            color: '#999',
	            textStyle: {
	                fontSize: 12
	            },
	        },
	        splitLine: {
	            show: true,
	            lineStyle: {
	                color: '#F3F4F4'
	            }
	        },
	        axisTick: {
	            show: false
	        },
	        axisLine: {
	            show: false
	        },
	    },
	    series: [{
	            name: '上周',
	            type: 'line',
                smooth: true,
                // z: 3,
                // showSymbol: false,
                // smoothMonotone: 'x',
                lineStyle: {
                    width: 3,
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: 'rgba(59,102,246)' // 0% 处的颜色
                        }, {
                            offset: 1, color: 'rgba(118,237,252)' // 100% 处的颜色
                        }]
                    },
                    shadowBlur: 4,
                    shadowColor: 'rgba(69,126,247,.2)',
                    shadowOffsetY: 4
                },
                areaStyle: {
                    normal: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: 'rgba(227,233,250,.9)' // 0% 处的颜色
                            }, {
                                offset: 1, color: 'rgba(248,251,252,.3)' // 100% 处的颜色
                            }]
                        }
                    }
                },
	            data: [1800,1000,2000,1000,500,100,1200]
	        },
	        {
	            name: '本周',
	            type: 'line',
                smooth: true,
                // showSymbol: false,
                // smoothMonotone: 'x',
                lineStyle: {
                        width: 3,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(255,84,108)'
                        }, {
                            offset: 1,
                            color: 'rgba(252,140,118)'
                        }], false),
                        shadowBlur: 4,
                        shadowColor: 'rgba(253,121,128,.2)',
                        shadowOffsetY: 4
                },
                areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(255,84,108,.15)'
                        }, {
                            offset: 1,
                            color: 'rgba(252,140,118,0)'
                        }], false),
                },
	            data: [1700,999,1100,899,199,99,1000]
	        }
	    ]
	},
        true
      );
    //   myChart.off("click");
    //   myChart.getZr().off("click");
    //   myChart.getZr().on("click", (params) => {
    //     const pointInPixel = [params.offsetX, params.offsetY];
    //     if (myChart.containPixel("grid", pointInPixel) || data.length === 0) {
    //       routerChange("/more");
    //     }
    //   });
    };
   
    onMounted(()=>{
        initEcharts()
    })

    const timeChange = (obj) =>{
    //   const {
    //     dateRange,
    //     filterBy
    //   } = obj
    //   const res = await getOnlineTime({
    //     filterBy,
    //     st: +moment(dateRange[0]),
    //     et: +moment(dateRange[1])
    //   })

    //   this.chartData = res.data
    }

    return {
      lineChart,
      timeChange
    };
  },
};
</script>


<style lang="scss" scoped>
.content{
    padding: 15px;
    .chart-wrapper{
        width: 90%;
        height: 500px;
    }
}

</style>