/*胎心监护 echarts画图 js */
var resultdata = "";
var dom = document.getElementById("container");
var myChart = echarts.init(dom);
var data = testdata;
var app = {};
var autodata = [];
var autodata2 = [];
var option;
var play;
var initxAxis = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60];
$(function() {
	fetalHeart();
});

function fetalHeart() {
	option = {
		id: 'main',
		title: {
			padding: [5, 0, 0, 5],

			textStyle: {
				fontWeight: 'normal',
				fontSize: 16
			}

		},
		tooltip: {
			trigger: 'axis'
		},
		axisPointer: {
			link: {
				xAxisIndex: 'all'
			}
		},
		grid: [{
			top: 30,
			left: 35,
			right: 35,
			height: '55%'
		}, {
			left: 35,
			right: 35,
			top: '68%',
			height: '19%'
		}],
		xAxis: [{

				type: 'category',
				boundaryGap: false,
				axisLine: {
					onZero: true
				},
				data: initxAxis.map(function(item) {
					return item + "秒";
				})
			},
			{
				show: false,
				gridIndex: 1,
				type: 'category',
				boundaryGap: false,
				axisLine: {
					onZero: true
				},
				position: 'top',
				data: initxAxis.map(function(item) {
					return item + "秒";
				})

			}
		],
		yAxis: [{
				name: '胎心率(bpm)',
				nameTextStyle: {
					fontSize: 12
				},
				nameGap: 15,
				type: 'value',
				max: 220,
				min: 40,
				axisLabel: {
					formatter: '{value}',
					textStyle: {
						color: "#555555"
					}
				}
			},
			{
				gridIndex: 1,
				name: '宫缩(mmHg)',
				nameLocation: 'start',
				nameGap: 8,
				type: 'value',
				max: 100,
				min: 0,
				axisLabel: {
					formatter: '{value}',
					textStyle: {
						color: "#555555"
					}
				},
				//inverse: true    //反转y轴坐标
			}
		],
		toolbox: {
			left: 'right',
			feature: {
				dataZoom: {
					yAxisIndex: 'none'
				},
				restore: {},
				saveAsImage: {}
			}
		},

		//X轴下方小图比例大小
		dataZoom: [{
			show: true,
			start: 0,
			end: 10,
			xAxisIndex: [0, 1]
		}, {

			type: 'inside',
			realtime: true,
			start: 0,
			end: 10,
			xAxisIndex: [0, 1]

		}],
		/*visualMap: {
		    top: 10,
		    right: 10,
		    pieces: [{
		        gt: 0,
		        lte: 120,
		        color: 'orange'
		    }, {
		        gt: 160,
		        color: 'orange'
		    }],
		    outOfRange: {
		        color: '#999'
		    }
		},*/
		series: [{
				name: '胎心',
				type: 'line',
				data: autodata,
				//          data: data, 
				smooth: true,
				//标记点
				markPoint: {
					symbol: 'pin',
					silent: true, //不响应鼠标事件
					label: {
						normal: {
							color: 'orange',
							formatter: function(param) {
								return param != null ? Math.round(param.value) : '';
							}
						}
					},
					itemStyle: {
						normal: {
							color: 'orange'
						}
					},
					data: [{
							name: '最大值',
							type: 'max'
						},
						{
							name: '最小值',
							type: 'min'
						}
					],
					tooltip: {
						formatter: function(param) {
							return param.name + '<br>' + (param.data.coord || '');
						}
					}
				},
				//标线（绿色虚线）
				markLine: {
					silent: true,
					lineStyle: {
						normal: {
							color: 'green'
						}
					},
					data: [{
						yAxis: 100
					}, {
						yAxis: 120
					}, {
						yAxis: 160
					}, {
						yAxis: 200
					}]
				},
				//标记区域（颜色区域）
				markArea: {
					silent: true,
					itemStyle: {
						normal: {
							color: {
								type: 'linear',
								colorStops: [{
									offset: 0.5,
									color: '#EDFCF9' // 0% 处的颜色
								}],
								globalCoord: false // 缺省为 false
							}
							// 径向渐变，前三个参数分别是圆心 x, y 和半径，取值同线性渐变
						}
					},
					data: [
						[{
							yAxis: 120
						}, {
							yAxis: 160
						}]
					]
				}
			},
			{
				name: '宫缩',
				type: 'line',
				xAxisIndex: 1,
				yAxisIndex: 1,
				symbolSize: 8,
				itemStyle: {
					normal: {
						lineStyle: {
							color: '#AEB1B1',
						}
					}
				},
				hoverAnimation: false,
				data: autodata2
			}, { //用于曲线标记（未确认最终需求）
				id: 'a',
				type: 'line',
				data: []
			}, {
				type: 'line', //用于记录胎动（测试）
				symbol: 'circle',
				symbolSize: 10,
				data: [
					[33, 90]
				]
			}
		],
		color: ['#999', '#3388FF', '#4EE2C0'] //自定义各个series颜色
	};
	myChart.setOption(option);
	if(option && typeof option === "object") {
		myChart.setOption(option, true);
	}

	//循环划线
	play = setInterval(getpoint, 0.1);
}

var zoomstart = 0,
	zoomend = 10;
//setInterval(function (){
// axisData = (new Date()).toLocaleTimeString().replace(/^\D*/,'');

/*var data0 = option.series[0].data;
    data0.shift();
    data0.push(Math.round(Math.random() * 1000));

    option.xAxis.data.shift();
    option.xAxis.data.push(axisData);
    option.dataZoom[0].start = zoomstart;
	option.dataZoom[0].end = zoomend;
    myChart.setOption(option);
}, 2000);*/
//获取鼠标表格的X，Y坐标
var temp_X;
var temp_Y;
//转成Zr对象
var zr = myChart.getZr();
//初始化图标点击事件（第一次点击获取第一个点，第二次点击生成一条线，双击清空线与点）
var zr_on_click = zr.on('click', function(params) {
	var pointInPixel = [params.offsetX, params.offsetY];
	var pointInGrid = myChart.convertFromPixel('grid', pointInPixel);
	if(myChart.containPixel('grid', pointInPixel)) {
		if(option.series[1].data.length < 1) {
			option.series[1].data.push(pointInGrid);
		} else if(option.series[1].data.length == 1) {
			option.series[1].data[1] = pointInGrid;
			var tempdata = option.series[0].data;
		}
		myChart.setOption({
			series: [{
				id: 'a',
				data: option.series[1].data
			}]
		});
		if(option.series[1].data.length == 2) {
			var count = 0,
				all = 0,
				arraydata = [];
			for(i = 0; i < tempdata.length; i++) {
				if(getxandy(tempdata[i])[0] >= getxandy(option.series[1].data[0])[0] && getxandy(tempdata[i])[0] <= getxandy(option.series[1].data[1])[0]) {
					all = parseInt(all) + parseInt(getxandy(tempdata[i])[1]);
					arraydata[count] = getxandy(tempdata[i])[1];
					count++;
				}
			}
			resultdata = "";
			resultdata += '平均值: ' + all / count + '<br \/>';
			resultdata += '最大值: ' + Math.max.apply(Math, arraydata) + '<br \/>';
			resultdata += '最小值: ' + Math.min.apply(Math, arraydata);
			$("#div_result").html(resultdata);
		}
	}
});
var zr_on_dbclick = zr.on('dblclick', function(params) {
	var pointInPixel = [params.offsetX, params.offsetY];
	var pointInGrid = myChart.convertFromPixel('grid', pointInPixel);
	if(option.series[1].data.length == 2) {
		option.series[1].data = [];
		myChart.setOption({
			series: [{
				id: 'a',
				data: option.series[1].data
			}]
		});
	}
});
zr_on_click;
zr_on_dbclick;
//变更缩略图大小的同时记录变更的大小
myChart.on('datazoom', function(params) {
	zoomstart = params.start;
	zoomend = params.end;
});
//获取坐标值
var getxandy = function(points) {
	return points.toString().split(",");
}
/*$('#container').click(function() {
	option.series[1].data.shift();
    option.series[1].data.push([2,4]);
    myChart.setOption(option);
});*/
//自动画线
var index = 0;
var second = 1;

var getpoint = function() {
	axisData = (new Date()).toLocaleTimeString().replace(/^\D*/, '');
	//增加胎心纵坐标值
	var data0 = option.series[0].data;
	data0.push(testdata[index]);
	//增加宫缩纵坐标值
	var data1 = option.series[1].data;
	data1.push(ucdata[index]);
	//增加横坐标值
	var xAxis = option.xAxis[0].data;
	if(second > 60) {
		option.xAxis[0].data.push(toTime(second));
		option.xAxis[1].data.push(toTime(second));
	}
	option.dataZoom[0].start = zoomstart;
	option.dataZoom[0].end = zoomend;
	myChart.setOption(option);
	index++;
	second++;
}

//暂停划线
var pause = function() {
	clearInterval(play);
}
play;
//通过按钮开始
$('#button_start').click(function() {
	play = setInterval(getpoint, 1);
	play;
});
//标记按钮，点击后在图表上任意点击弹出输入框，点确定后在图标上生成对应的标注
$('#input_mark').select(function() {
	zr.off('click'); //取消zr对象的单击事件
	zr.off('dblclick'); //取消zr对象的双击事件
	zr.on('click', function(params) { //重新定义zr对象单击事件
		var pointInPixel = [params.offsetX, params.offsetY];
		var pointInGrid = myChart.convertFromPixel('grid', pointInPixel);
		temp_X = pointInGrid[0];
		temp_Y = pointInGrid[1];
		$('#div_mark').show();
	});
	//定义鼠标指针
	zr.on('mousemove', function(params) {
		var pointInPixel = [params.offsetX, params.offsetY];
		zr.setCursorStyle(myChart.containPixel('grid', pointInPixel) ? 'copy' : 'default');
	});
});

$('#button_sure_mark').click(function() {
	zr.off('click');
	zr.off('mousemove');
	var coutnum = 0;
	var mk_data = option.series[0].markPoint.data;
	var new_data = {
		coord: [temp_X, temp_Y],
		value: $("#input_mark").val()
	};

	console.log(new_data);
	mk_data.push(new_data);
	myChart.setOption({
		series: [{
			id: 'main',
			type: 'line',

			silent: true, //不响应鼠标事件（鼠标焦点 标签不显示纵坐标值）
			markPoint: {
				symbol: 'roundRect',

				symbolOffset: [10, '-50%'],

				label: {
					normal: {

						formatter: function(param) {
							return param != null ? param.value : '';
						}
					}
				},
				data: mk_data
			}
		}]
	});

	console.log('leng ' + mk_data.length);
	zr.on('click', function(params) {
		var pointInPixel = [params.offsetX, params.offsetY];
		var pointInGrid = myChart.convertFromPixel('grid', pointInPixel);
		if(myChart.containPixel('grid', pointInPixel)) {
			if(option.series[1].data.length < 1) {
				option.series[1].data.push(pointInGrid);
			} else if(option.series[1].data.length == 1) {
				option.series[1].data[1] = pointInGrid;
				var tempdata = option.series[0].data;
			} else if(option.series[1].data.length == 2) {
				var count = 0,
					all = 0,
					arraydata = [];
				for(i = 0; i < tempdata.length; i++) {
					if(getxandy(tempdata[i])[0] >= getxandy(option.series[1].data[0])[0] && getxandy(tempdata[i])[0] <= getxandy(option.series[1].data[1])[0]) {
						all = parseInt(all) + parseInt(getxandy(tempdata[i])[1]);
						arraydata[count] = getxandy(tempdata[i])[1];
						count++;
					}
				}
				resultdata = "";
				resultdata += '平均值: ' + all / count + '<br \/>';
				resultdata += '最大值: ' + Math.max.apply(Math, arraydata) + '<br \/>';
				resultdata += '最小值: ' + Math.min.apply(Math, arraydata);
				$("#div_result").html(resultdata);
			}
			myChart.setOption({
				series: [{
					id: 'a',
					data: option.series[1].data
				}]
			});
		}
	});
	zr.on('dblclick', function(params) {
		var pointInPixel = [params.offsetX, params.offsetY];
		var pointInGrid = myChart.convertFromPixel('grid', pointInPixel);
		if(option.series[1].data.length == 2) {
			option.series[1].data = [];
			myChart.setOption({
				series: [{
					id: 'a',
					data: option.series[1].data
				}]
			});
		}
	});
	$('#div_mark').hide();
});
$('#button_set_mark').click(function() {
	$("#input_mark").trigger("select");
});
//X轴数值换成时间
var toTime = function(item) {
	var minute = parseInt(item / 60);
	var second = item % 60;
	if(minute < 1) {
		return second + "秒";
	} else {
		return minute + "分钟" + second + "秒";
	}
}