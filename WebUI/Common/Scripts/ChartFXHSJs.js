/* 过程线绘制 柱状图
 * objID显示图标ID
 * ChartName画图名称 
 * strNote数据说明，数据类型数组，数据格式strNote=['3月27日', '3月28日', '3月29日', '3月30日', '3月31日', '4月1日', '4月2日'];
 * MaxColor柱状图渐变上边颜色，MinColor柱状图渐变下边颜色
 * chartValue 格式说明 
 * chartValue=[20, 40, 80, 90, 50, 60, 110];
 */
function ChartAxis(objID, ChartName, YName, strNote, MaxColor, MinColor, chartValue) {
	var myChart = echarts.init(document.getElementById(objID));
	var option = {
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			data: [ChartName],
			textStyle: {
				color: '#FFF3F3',
				fontSize: '12'
			}
		},
		grid: {
			//			 grid: {
			//              x: 10,//zuo
			//              y: 3,//shang
			//              x2: 10,//you
			//              y2: 3//xia
			//          }//,
			left: '2%',
			right: '3%',
			bottom: '5%',
			containLabel: true
		},
		toolbox: {
			show: true,
			feature: {
				mark: {
					show: false
				},
				dataView: {
					show: false,
					readOnly: false
				},
				magicType: {
					show: false,
					type: ['line', 'bar']
				},
				restore: {
					show: false
				},
				saveAsImage: {
					show: false
				}
			}
		},
		calculable: true,
		xAxis: [{
			type: 'category',
			data: strNote,
			splitLine: {
				show: false
			},
			axisLabel: {
				formatter: '{value}'
			},
			axisLine: {
				lineStyle: {
					color: '#FFF3F3',
					width: 1 //这里是为了突出显示加上的
				},
				textStyle: {
					color: '#FFF3F3',
					fontSize: '12'
				}
			}
		}],
		yAxis: [{
			type: 'value',
			name: YName,
			splitLine: {
				show: true
			},
			axisLabel: {
				formatter: '{value}'
			},
			axisLine: {
				lineStyle: {
					color: '#FFF3F3',
					width: 1 //这里是为了突出显示加上的
				},
				textStyle: {
					color: '#FFF3F3',
					fontSize: '12'
				}
			}
		}],
		series: [{
			name: ChartName,
			type: 'bar',
			data: chartValue,
			itemStyle: {
				normal: {
					areaStyle: {
						type: 'default'
					},
					//颜色渐变设置
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
						offset: 0,
						color: MaxColor
					}, {
						offset: 1,
						color: MinColor
					}])
				}
			}
		}]
	};
	myChart.setOption(option);
}

function myData() {
	var myChart = echarts.init(document.getElementById('mymap'));
	var option = {
		title: {
			text: '' //数据网络示意图
		},
		tooltip: {
			formatter: '{b}:{c}'
			//			formatter: function(params) {
			//				alert(JSON.stringify(params));
			//				var res = '<div><p>' + params.data.name + '：' + params.data.note + '</p></div>'
			//				//				for(var i = 0; i < params.length; i++) {
			//				//					res += '<p>' + params[i].seriesName + ':' + params[i].data + '</p>'
			//				//				}
			//				return res;
			//			}
			//formatter: "{name} <br/>{b} : {c}%"
		},
		animationDurationUpdate: 800,
		animationEasingUpdate: 'quinticInOut',
		series: [{
			type: 'graph',
			layout: 'none',
			symbolSize: 80,
			roam: false, //显示放大 
			label: {
				normal: {
					show: true
				}
			},
			edgeSymbol: ['circle', 'arrow'],
			edgeSymbolSize: [4, 10],
			edgeLabel: {
				normal: {
					textStyle: {
						fontSize: 20
					}
				}
			},
			data: [{
				name: '环保',
				color: '#00FF00',
				value: '网络异常',
				x: 300,
				y: 300
			}, {
				name: '水利',
				value: '网络正常',
				x: 800,
				y: 300
			}, {
				name: '水文',
				value: '网络正常',
				x: 550,
				y: 100
			}, {
				name: '气象',
				value: '网络正常',
				x: 550,
				y: 500
			}, {
				name: '数据中心',
				value: '网络正常',
				x: 550,
				y: 300
			}],
			// links: [],
			links: [{
					source: '环保',
					target: '数据中心',
					value: '网络正常',
					symbolSize: [5, 20],
					label: {
						normal: {
							show: false
						}
					},

					lineStyle: {
						normal: {
							width: 5,
							curveness: 0.2
						}
					}
				}, {
					source: '水文',
					target: '数据中心',
					value: '网络正常',
					label: {
						normal: {
							show: false
						}
					},
					symbolSize: [5, 20],
					lineStyle: {
						normal: {
							width: 5,
							curveness: 0.2
						}
					}
				}, {
					source: '气象',
					target: '数据中心',
					value: '网络异常',
					symbolSize: [5, 20],
					lineStyle: {
						normal: {
							width: 5,
							color: '#ff0000',
							lineStyle: {
								color: '#FF0000'
							},
						}
					}

				}, {
					source: '水利',
					target: '数据中心',
					value: '网络正常',
					symbolSize: [5, 20],
					lineStyle: {
						normal: {
							width: 5
						}
					}
				}
				//			, {
				//				source: '数据中心',
				//				target: '水文'
				//			}, {
				//				source: '节点1',
				//				target: '节点4'
				//			}
			],
			lineStyle: {
				normal: {
					color: '#00FF00',
					lineStyle: {
						color: '#00FF00'
					},
					opacity: 0.9,
					width: 2,
					curveness: 0
				}
			}
		}]
	};
	myChart.setOption(option);
}

/* 过程线绘制 过程线 水位
 * ChartName画图控件名称
 * dataS数据对象，数据格式json
 * strNote数据说明，数据类型数组，数据格式
 * json 格式说明 name数据类型名称，codename数据表示，tableV 表格是否显示，isShow 是否显示过程线
 * [
 * {"name": "时间","codename": "TM","tableV":"1","isShow":true},
 * {"name": "上游水位","codename": "UPZ","tableV":"1","isShow":true},
 * {"name": "下游水位","codename": "DWZ","tableV":"1","isShow":true},
 * {"name": "警戒水位","codename": "WRZ","tableV":"0","isShow":false}
 * ]
 */
function ChartLine(ChartName, ChartTitle, data, strNote, LineColor) {
	var myChart = echarts.init(document.getElementById(ChartName)); //获得控件对象
	//echarts.init(document.getElementById('quxian'), 'macarons');
	var chartName = []; //控件元素名称
	var chartTM = []; //时间序列
	var chartValue = []; //时间序列
	var liststr = ""; //拼装表格
	var LineSelect = "";
	var m = new Array();
	$.each(strNote, function(index, value, item) {
		chartName.push(value.name); //Echarts绘制标注名称加入
		LineSelect += "'" + value.name + "':" + value.isShow + ",";
	});
	if(LineSelect.length > 0) {
		LineSelect = LineSelect.substring(0, LineSelect.length - 1);
	}

	//循环数据，加入有效数据。
	$.each(data, function(index, value, item) {
		var charthan = []; //时间序列
		$.each(strNote, function(index1, value1, item1) {
			charthan.push(value[value1.codename]); //加入集合
			if(value1.name == "时间") {
				chartTM.push(new Date(value[value1.codename]).format("yyyy-MM-dd")); //加入时间集合
			} else if(value1.name == "名称") {
				chartTM.push(value[value1.codename]);
			} else {
				chartValue.push(value[value1.codename]);
			}
		});
		m.push(charthan); //加入集合
	});

	var option = {
		title: {
			//			text: ChartTitle
		},
		toolbox: {
			show: false,
			feature: {
				mark: {
					show: false
				},
				dataView: {
					show: false,
					readOnly: false
				},
				magicType: {
					show: false,
					type: ['line', 'bar']
				},
				restore: {
					show: false
				},
				saveAsImage: {
					show: false
				}
			}
		},
		tooltip: { //鼠标移上去显示
			trigger: 'axis'
		},
		color: LineColor,
		calculable: true,
		legend: {
			data: chartName,
			itemWidth: 8,
			itemHeight: 8,
			textStyle: {
				color: '#000',
				fontSize: 12
			}
		},
		grid: {
			left: '2%',
			right: '8%',
			bottom: '3%',
			top: '25%',
			containLabel: true
		},
		xAxis: {
			type: 'category',
			boundaryGap: true,
			data: chartTM,
			axisLine: {
				lineStyle: {
					color: '#918F8F',
					width: 1, //这里是为了突出显示加上的
					shadowBlur: 0,
					shadowOffsetX: 0,
				},
				textStyle: {
					color: '#000',
					fontSize: '16'
				},
				show: true
			}
		},
		yAxis: {
			name: ChartTitle,
			type: 'value',
			splitNumeber: 5,
			scale: true, //是否自动计算最大最小值。
			show: true,
			axisLine: {
				onZero: true
			},
			splitLine: {
				show: true,
				lineStyle: {
					color: '#eee',
					width: 1,
					type: 'dashed',
				}
			},
			axisLabel: {
				formatter: function(v) {
					return v.toFixed(2);
				}
			},
			axisLine: {
				lineStyle: {
					color: '#918F8F',
					width: 1, //这里是为了突出显示加上的
					shadowBlur: 0,
					shadowOffsetX: 0,
				},
				textStyle: {
					color: '#000',
					fontSize: '16'
				},
				show: true
			}
		},
		//		selected: {
		//			LineSelect
		//		},
		series: function() {
			var serie = [];
			for(var j = 0; j < chartName.length; j++) {
				if(chartName[j] == "名称" || chartName[j] == "时间") //调过时间字段
				{
					continue;
				}
				var ChartValue = []; //声明过线value集合
				for(var i = 0; i < m.length; i++) {
					ChartValue.push(changeTwoDecimal(m[i][j], 2)); //循环价值

				}

				if(ChartTitle != "" & ChartTitle == chartName[j]) {
					var item = {
						name: chartName[j],
						type: 'line',
						data: ChartValue,
						//						 symbolSize: 10,
						//areaStyle: {normal: {}},
						markPoint: {
							data: [{
								type: 'max',
								name: '最大值'
							}, {
								type: 'min',
								name: '最小值'
							}]
						},
						smooth: true
					}
					serie.push(item);
				} else {
					var item = {
						name: chartName[j],
						type: 'line',
						show: false,
						data: ChartValue,
						//						 symbolSize: 8,
						//areaStyle: {normal: {}},
						smooth: true
					}
					serie.push(item);
				}

			}
			return serie;
		}()
	};

	myChart.setOption(option);
}

//将数据转化为数字类型，保留小数
function changeTwoDecimal(x, format) {
	var f_x = parseFloat(x);
	if(isNaN(f_x)) {
		return "-";
	}
	return f_x.toFixed(format);
}

function ChartBarTran(ChartName, ChartTitle, data, strNote, LineColor) {
	var myChart = echarts.init(document.getElementById(ChartName));

	var chartName = []; //控件元素名称
	var chartSTACK = []; //控件元素名称
	var chartTM = []; //时间序列
	var chartValue = []; //时间序列
	var liststr = ""; //拼装表格
	var LineSelect = "";
	var m = new Array();
	$.each(strNote, function(index, value, item) {
		chartName.push(value.name); //Echarts绘制标注名称加入
		chartSTACK.push(value["tableV"]);
		LineSelect += "'" + value.name + "':" + value.isShow + ",";
	});
	if(LineSelect.length > 0) {
		LineSelect = LineSelect.substring(0, LineSelect.length - 1);
	}
	//循环数据，加入有效数据。
	$.each(data, function(index, value, item) {
		var charthan = []; //时间序列
		$.each(strNote, function(index1, value1, item1) {
			charthan.push(value[value1.codename]); //加入集合
			if(value1.name == "时间") {
				chartTM.push(new Date(value[value1.codename]).format("yyyy-MM-dd")); //加入时间集合 
			} else if(value1.name == "名称") {
				chartTM.push(value[value1.codename]);

			} else {
				chartValue.push(value[value1.codename]);
			}
		});
		m.push(charthan); //加入集合
	});
	var option = {
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			data: chartName,
			itemWidth: 8,
			itemHeight: 8,
			textStyle: {
				color: '#000',
				fontSize: 12
			}
		},
		color: LineColor,
		grid: {
			//			x: 70, //zuo
			//			y: 30, //shang
			//			x2: 60, //you
			//			y2: 30 //xia
			left: '2%',
			right: '10%',
			bottom: '3%',
			top: '20%',
			containLabel: true
		},

		calculable: true,

		xAxis: [{
			type: 'value',
			name: ChartTitle,
			boundaryGap: false,
			splitLine: {
				show: false
			},
			axisLabel: {
				formatter: function(v) {
					return v.toFixed(1);
				},
				textStyle: {
					color: '#999'
				}
			},
			axisLine: {
				lineStyle: {
					color: '#918F8F',
					width: 1, //这里是为了突出显示加上的
				},
				textStyle: {
					color: '#000',
					fontSize: '16'
				}
			}
		}],
		yAxis: [{
			type: 'category',
			data: chartTM,
			scale: true, //是否自动计算最大最小值。
			splitLine: {
				show: false
			},
			axisLabel: {
				formatter: '{value}',
				textStyle: {
					color: '#999'
				}
			}
		}],
		series: function() {
			var serie = [];
			for(var j = 0; j < chartName.length; j++) {
				if(chartName[j] == "名称" || chartName[j] == "时间") //调过时间字段
				{
					continue;
				}
				var ChartValue = []; //声明过线value集合
				for(var i = 0; i < m.length; i++) {
					//ChartValue.push(changeTwoDecimal(m[i][j], 2)); //循环价值
					ChartValue.push(m[i][j]); //循环价值
				}

				var item = {
					name: chartName[j],
					type: 'bar',
					stack: chartSTACK[j],
					data: ChartValue,
				}
				serie.push(item);
			}
			return serie;
		}()

	};
	myChart.on('click', WQChart);
	myChart.setOption(option);
}

function WQChart(param) {
	if(typeof param.seriesIndex == 'undefined') {
		return;
	}
	if(param.type == 'click') {
		if(param.name.toString().lastIndexOf('圩') > -1) {
			GetCSFH();
		}
	}
}

function ChartBarVerTran(ChartName, ChartTitle, data, strNote, LineColor) {
	var myChart = echarts.init(document.getElementById(ChartName));

	var chartName = []; //控件元素名称
	var chartSTACK = []; //控件元素名称
	var chartTM = []; //时间序列
	var chartValue = []; //时间序列
	var liststr = ""; //拼装表格
	var LineSelect = "";
	var m = new Array();
	$.each(strNote, function(index, value, item) {
		chartName.push(value.name); //Echarts绘制标注名称加入
		chartSTACK.push(value["tableV"]);
		LineSelect += "'" + value.name + "':" + value.isShow + ",";
	});
	if(LineSelect.length > 0) {
		LineSelect = LineSelect.substring(0, LineSelect.length - 1);
	}
	//循环数据，加入有效数据。
	$.each(data, function(index, value, item) {
		var charthan = []; //时间序列
		$.each(strNote, function(index1, value1, item1) {
			charthan.push(value[value1.codename]); //加入集合
			if(value1.name == "时间") {
				chartTM.push(new Date(value[value1.codename]).format("yyyy-MM-dd")); //加入时间集合 
			} else if(value1.name == "名称") {
				chartTM.push(value[value1.codename]);

			} else {
				chartValue.push(value[value1.codename]);
			}
		});
		m.push(charthan); //加入集合
	});

	var option = {
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			data: chartName,
			itemWidth: 8,
			itemHeight: 8,
			textStyle: {
				color: '#000',
				fontSize: 12
			}
		},
		color: LineColor,
		grid: {
			left: '3%',
			right: '10%',
			bottom: '3%',
			top: '20%',
			containLabel: true
		},
		xAxis: [{
			type: 'category',
			data: chartTM,
					splitNumeber: 5,
			scale: true, //是否自动计算最大最小值。
			axisLine: {
				lineStyle: {
					color: '#918F8F',
					width: 1, //这里是为了突出显示加上的
				},
				textStyle: {
					color: '#000',
					fontSize: '16'
				}
			}
		}],
		yAxis: [{
			type: 'value',
			name: ChartTitle,
	
			splitLine: {
				show: true,
				lineStyle: {
					color: '#eee',
					width: 1,
					type: 'dashed',
				}
			},
			axisLabel: {
				formatter: function(v) {
					return v.toFixed(2);
				}
			},

			axisLabel: {
				formatter: function(v) {
					return v;
				},
				textStyle: {
					color: '#999'
				}
			},
			axisLine: {
				lineStyle: {
					color: '#918F8F',
					width: 1, //这里是为了突出显示加上的
					shadowBlur: 0,
					shadowOffsetX: 0,
				},
				textStyle: {
					color: '#000',
					fontSize: '16'
				}
			}
		}],
		series: function() {
			var serie = [];
			for(var j = 0; j < chartName.length; j++) {
				if(chartName[j] == "名称" || chartName[j] == "时间") //调过时间字段
				{
					continue;
				}
				var ChartValue = []; //声明过线value集合
				for(var i = 0; i < m.length; i++) {
					//ChartValue.push(changeTwoDecimal(m[i][j], 2)); //循环价值
					ChartValue.push(m[i][j]); //循环价值

				}

				var item = {
					name: chartName[j],
					type: 'bar',
					stack: chartSTACK[j],
					data: ChartValue,
				}
				serie.push(item);
			}
			return serie;
		}()

	};
	myChart.on('click', eConsole);
	myChart.setOption(option);
}

function eConsole(param) {
	if(typeof param.seriesIndex == 'undefined') {
		return;
	}
	if(param.type == 'click') {
		if(param.name.toString().lastIndexOf('区') > -1) {
			GetQY();
		}
	}
}

function ChartPie(ChartName, StrName, data) {

	var myChart = echarts.init(document.getElementById(ChartName)); //获得控件对象

	var option = {
		tooltip: {
			trigger: 'item',
			formatter: "{a} <br/>{b}: {c} ({d}%)"
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		legend: {
			orient: 'vertical',
			x: 'left',
			data: ['系统资源服务', '公共基础服务', '业务服务', '应用支撑服务'],
			textStyle: {
				color: '#FFF3F3',
				fontSize: '12'
			}
		},
		series: [{
			name: '服务',
			type: 'pie',
			radius: ['50%', '80%'],
			center: ['70%', '50%'],
			avoidLabelOverlap: false,
			label: {
				normal: {
					show: false,
					position: 'center'
				},
				emphasis: {
					show: true,
					textStyle: {
						fontSize: '18',
						fontWeight: 'bold'
					}
				}
			},
			labelLine: {
				right: 0,
				normal: {
					show: false
				}
			},
			data: [{
					value: 335,
					name: '系统资源服务'
				},
				{
					value: 310,
					name: '公共基础服务'
				},
				{
					value: 1548,
					name: '业务服务'
				},
				{
					value: 234,
					name: '应用支撑服务'
				}
			]
		}]
	};
	myChart.setOption(option);

}