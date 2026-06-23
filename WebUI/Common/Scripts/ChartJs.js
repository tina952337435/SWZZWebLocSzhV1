/*
* obj  日期数据
* fmt  格式
* type 类型（1 年-月-日、2 年-月-日 时、3 年-月-日 时:分、4  年-月-日 时:分:秒
* */
function IsSubDate(obj, fmt, type) {
    //console.log(obj+":"+type);
    if ("" != obj && "undefined" != obj) {
        if (type == "1") {
            obj += " 00:00:00";
        } else if (type == "2") {
            obj += ":00:00";
        } else if (type == "3") {
            obj += ":00";
        } else {
        }
        try {
            var tm = new Date(obj.toString().replace(/-/g, '/'));
        } catch (e) {
            //TODO handle the exception
        }

        var o = {
            "M+": tm.getMonth() + 1, //月份 
            "d+": tm.getDate(), //日 
            "h+": tm.getHours(), //小时 
            "m+": tm.getMinutes(), //分 
            "s+": tm.getSeconds(), //秒 
            "q+": Math.floor((tm.getMonth() + 3) / 3), //季度 
            "S": tm.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (tm.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
    return "";

}

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
            showDelay: 0,
            hideDelay: 50,
            transitionDuration: 0,
            backgroundColor: 'rgba(255,255,255,0.9)',
            borderColor: '#4040FB',
            borderRadius: 8,
            borderWidth: 2,
            padding: 10, 
			textStyle: {
				color: '#FFF3F3',
				fontSize: '12'
			}
		},
		grid: { 
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
            showDelay: 0,
            hideDelay: 50,
            transitionDuration: 0,
            backgroundColor: 'rgba(255,255,255,0.9)',
            borderColor: '#4040FB',
            borderRadius: 8,
            borderWidth: 2,
            padding: 10,
            textStyle: {
                color: '#000000'
            },
			formatter: '{b}:{c}' 
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
function ChartFXHSLine(ChartName, ChartTitle, data, strNote, LineColor) {
    var myChart = echarts.init(document.getElementById(ChartName)); //获得控件对象
    //echarts.init(document.getElementById('quxian'), 'macarons');
    var chartName = []; //控件元素名称
    var chartTM = []; //时间序列
    var chartValue = []; //时间序列
    var liststr = ""; //拼装表格
    var LineSelect = "";
    var m = new Array();
    $.each(strNote, function (index, value, item) {
        chartName.push(value.name); //Echarts绘制标注名称加入
        LineSelect += "'" + value.name + "':" + value.isShow + ",";
    });
    if (LineSelect.length > 0) {
        LineSelect = LineSelect.substring(0, LineSelect.length - 1);
    }

    //循环数据，加入有效数据。
    $.each(data, function (index, value, item) {
        var charthan = []; //时间序列
        $.each(strNote, function (index1, value1, item1) {
            charthan.push(value[value1.codename]); //加入集合
            if (value1.name == "时间") {
                chartTM.push(new Date(value[value1.codename]).format("yyyy-MM-dd")); //加入时间集合
            } else if (value1.name == "名称") {
                chartTM.push(value[value1.codename]);
            } else {
                chartValue.push(value[value1.codename]);
            }
        });
        m.push(charthan); //加入集合
    });

    var option = {
        title: {
            text: '多站对比分析',
            showDelay: 0,
            hideDelay: 50,
            transitionDuration: 0,
            backgroundColor: 'rgba(255,255,255,0.9)',
            borderColor: '#4040FB',
            borderRadius: 8,
            borderWidth: 2,
            padding: 10,
            textStyle: {
                color: '#000000',
                fontWeight: 'normal', //标题颜色 
                fontSize: '14'
            },
            x: 'left'
        }, 
        tooltip: { //鼠标移上去显示
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        color: LineColor,
        calculable: true,
        legend: {
            data: chartName,
            itemWidth: 8,
            itemHeight: 8,
            textStyle: {
                color: '#FFFFFF',
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
            axisLabel: {
                textStyle: {
                    color: '#ffffff'
                }
            },
            axisLine: {
                lineStyle: {
                    color: '#324271',
                    width: 1 //这里是为了突出显示加上的 
                },
                textStyle: {
                    color: '#FFFFFF',
                    fontSize: '12'
                }
            }
        },
        yAxis: {
           // name: ChartTitle,
            axisLabel: {
                textStyle: {
                    color: '#ffffff'
                }
            },
            type: 'value',
            splitNumeber: 5,
            scale: true, //是否自动计算最大最小值。
            show: true,
            axisLine: {
                onZero: true
            },   
            axisLine: {
                lineStyle: {
                    type: 'solid',
                    color: '#324271', //左边线的颜色
                    width: '1' //坐标线的宽度
                },
                textStyle: {
                    color: '#FFFFFF',
                    fontSize: '12'
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#324271',
                    width: 1,
                }
            }
        },
        //		selected: {
        //			LineSelect
        //		},
        series: function () {
            var serie = [];
            for (var j = 0; j < chartName.length; j++) {
                if (chartName[j] == "名称" || chartName[j] == "时间") //调过时间字段
                {
                    continue;
                }
                var ChartValue = []; //声明过线value集合
                for (var i = 0; i < m.length; i++) {
                    ChartValue.push(changeTwoDecimal(m[i][j], 2)); //循环价值

                }

                if (ChartTitle != "" & ChartTitle == chartName[j]) {
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
                        areaStyle: {normal: {}},
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
    myChart.clear();
	//echarts.init(document.getElementById('quxian'), 'macarons');
	var chartName = []; //控件元素名称
	var chartTM = []; //时间序列
    var chartValue = []; //时间序列
    var ChartColor = [];
	var liststr = ""; //拼装表格
	var LineSelect = "";
	var m = new Array();
	$.each(strNote, function(index, value, item) {
        chartName.push(value.name); //Echarts绘制标注名称加入 
        if (value.MAXColor != null) {
            ChartColor.push({ MAXColor: value.MAXColor, MINColor: value.MINColor });
        }
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
				 //chartTM.push(value[value1.codename]); //加入时间集合
               chartTM.push(new Date(value[value1.codename]).format("MM-dd HH")); //加入时间集合
			} else if(value1.name == "名称") {
				chartTM.push(value[value1.codename]);
			} else {
				chartValue.push(value[value1.codename]);
			}
		});
		m.push(charthan); //加入集合
	});
    var max_min = GetSort(chartValue); 
	var option = {
		title: {
			//text: ChartTitle
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
            showDelay: 0,
            hideDelay: 50,
            transitionDuration: 0,
            backgroundColor: 'rgba(255,255,255,0.9)',
            borderColor: '#4040FB',
            borderRadius: 8,
            borderWidth: 2,
            padding: 10,
            textStyle: {
                color: '#000000'
            },
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
			left: '1%',
			right: '2%',
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
            //scale: true, //是否自动计算最大最小值。
           min:max_min.min, //动态设置最大值最小值。
           max:max_min.max,
			show: true,
			axisLine: {
				onZero: true
			},
			splitLine: {
				show: true,
				lineStyle: {
                    color: '#D6D5D5',
					width: 1,
					type: 'dashed'
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
					shadowOffsetX: 0
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
					ChartValue.push(m[i][j]); //循环价值

				}

				if(ChartTitle != "" && ChartTitle == chartName[j]) {
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
                        connectNulls: true,
						data: ChartValue,
						//						 symbolSize: 8,
                        //areaStyle: {
                        //    normal: {
                        //        color: new echarts.graphic.LinearGradient(
                        //            0, 0, 0, 1,
                        //            [
                        //                { offset: 0, color: ChartColor[j].MAXColor },
                        //                //{ offset: 0.5, color: 'pink' },
                        //                { offset: 1, color: ChartColor[j].MINColor }
                        //            ]
                        //        )

                        //    }
                        //},
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
			left: '1%',
			right: '2%',
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
    if (param.type == 'click') { 
        GetCSFH(param); 
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
        chartSTACK.push({ tableV: value["tableV"], MAXColor: value["MAXColor"], MINColor: value["MINColor"] });
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
            trigger: 'axis',
            itemWidth: 8,
            itemHeight: 8,
            showDelay: 0,
            hideDelay: 50,
            transitionDuration: 0,
            backgroundColor: 'rgba(255,255,255,0.9)',
            borderColor: '#4040FB',
            borderRadius: 8,
            borderWidth: 2,
            padding: 10,
            textStyle: {
                color: '#000',
                fontSize: 12
            }
		},
		legend: {
			data: chartName
		},
		//color: LineColor,
		grid: {
			left: '1%',
			right: '2%',
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
                    return v.toFixed(1);
				},
				textStyle: {
					color: '#999'
				}
            },
    //        min: function (value) {
    //            var jiange = (value.max - value.min).toFixed(2) * 100;
    //            var jiangenew = Number(Number((jiange - (jiange % 5)) / 5 + 1).toFixed(0) * 5);

    //            jiangenew = jiangenew + ((jiangenew / 100).toFixed(0) * 5);

    //            if ((jiangenew - jiange - 1) == 0) {
    //                jiangenew = jiangenew * 2;
    //            }

    //            if ((jiangenew - jiange) % 2 == 0) {
    //                return value.min - (jiangenew - jiange) / 200;
    //            }
    //            else {
    //                return value.min - (jiangenew - jiange - 1) / 200;
    //            }


    //        },
    //        max: function (value) {
    //            var jiange = (value.max - value.min).toFixed(2) * 100;
    //            var jiangenew = Number(Number((jiange - (jiange % 5)) / 5 + 1).toFixed(0) * 5);

    //            jiangenew = jiangenew + ((jiangenew / 100).toFixed(0) * 5)
    //            if ((jiangenew - jiange - 1) == 0) {
    //                jiangenew = jiangenew * 2;
    //            }
    //            if (jiangenew < 5) jiangenew = 5;
				//var valueyu=0;
    //            if ((jiangenew - jiange) % 2 == 0) {
    //                valueyu=value.max + (jiangenew - jiange) / 200;
    //            }
    //            else {
    //                valueyu=value.max + (jiangenew - jiange + 1) / 200;
    //            }
				//if(valueyu<5)
				//{
				//	valueyu=5;
				//}
				//return 5;
    //        },
			axisLine: {
				lineStyle: {
					color: '#918F8F',
					width: 1, //这里是为了突出显示加上的
					shadowBlur: 0,
					shadowOffsetX: 0
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
                //console.log(chartSTACK[j].tableV)
				var item = {
					name: chartName[j],
					type: 'bar',
                    stack: chartSTACK[j].tableV,
                    itemStyle: {
                        normal: {
                            areaStyle: {
                                type: 'default'
                            },
                            //颜色渐变设置
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: chartSTACK[j].MAXColor
                            }, {
                                    offset: 1,
                                    color: chartSTACK[j].MINColor
                            }])
                        }
                    },
					data: ChartValue
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
            showDelay: 0,
            hideDelay: 50,
            transitionDuration: 0,
            backgroundColor: 'rgba(255,255,255,0.9)',
            borderColor: '#4040FB',
            borderRadius: 8,
            borderWidth: 2,
            padding: 10,
            textStyle: {
                color: '#000000'
            },
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


function ChartFXHS(ChartName) {
    var option = {
        title: {
            text: '分区平均雨量',
            textStyle: {
                fontWeight: 'normal', //标题颜色
                color: '#ffffff',
                fontSize: '15'
            },
            x: 'left'
        },
        tooltip: {
            trigger: 'axis',
            showDelay: 0,
            hideDelay: 50,
            transitionDuration: 0,
            backgroundColor: 'rgba(255,255,255,0.9)',
            borderColor: '#4040FB',
            borderRadius: 8,
            borderWidth: 2,
            padding: 10,
            textStyle: {
                color: '#000000'
            },
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            data: ['雨量(mm)'],
            textStyle: {
                color: '#ffffff', //#ffffff
                fontSize: '12'
            },
            x: 'right',
            itemWidth: 8,
            itemHeight: 8
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '4%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            data: ['山北北圩', '西漳大联圩', '北大联圩', '北塘联圩', '广塘联圩'],
            axisLabel: {
                textStyle: {
                    color: '#ffffff'
                }
            },
            axisLine: {
                lineStyle: {
                    type: 'solid',
                    color: '#324271', //左边线的颜色
                    width: '1', //坐标线的宽度
                }
            }
        }],
        yAxis: [{
            type: 'value',
            axisLabel: {
                textStyle: {
                    color: '#ffffff'
                }
            },
            max: 250,
            min: 0,
            axisLine: {
                lineStyle: {
                    type: 'solid',
                    color: '#324271', //左边线的颜色
                    width: '1' //坐标线的宽度
                },
                textStyle: {
                    color: '#FFF3F3',
                    fontSize: '12'
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#324271',
                    width: 1,
                }
            }
        }],
        series: [
        {
                name: '雨量(mm)',
            type: 'bar',
            //			stack: '数据量',
            barWidth: 22,
            data: [120, 132, 101, 134, 90],
            itemStyle: {
                normal: {
                    areaStyle: {
                        type: 'default'
                    },
                    //颜色渐变设置
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: "#FACA06"
                    }, {
                        offset: 1,
                        color: "#3977F4"
                    }])
                }
            }
        }
        ]
    };

    var myChart = echarts.init(document.getElementById(ChartName)); //获得控件对象

    myChart.setOption(option);
}


function ChartFXHSGQ(ChartName) {
    var option = {
        title: {
            text: '引排水量',
            textStyle: {
                fontWeight: 'normal', //标题颜色
                color: '#ffffff',
                fontSize: '14'
            },
            x: 'left'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            data: ['引水', '排水'],
            textStyle: {
                color: '#ffffff', //#ffffff
                fontSize: '12'
            },
            x: 'right',
            itemWidth: 8,
            itemHeight: 8
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '4%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            data: ['犊山闸', '白屈港闸', '直湖港闸', '横山水库', '陈墅'],
            axisLabel: {
                textStyle: {
                    color: '#ffffff'
                }
            },
            axisLine: {
                lineStyle: {
                    type: 'solid',
                    color: '#324271', //左边线的颜色
                    width: '1', //坐标线的宽度
                }
            }
        }],
        yAxis: [{
            type: 'value',
            axisLabel: {
                textStyle: {
                    color: '#ffffff'
                }
            },
            max: 250,
            min: 0,
            axisLine: {
                lineStyle: {
                    type: 'solid',
                    color: '#324271', //左边线的颜色
                    width: '1' //坐标线的宽度
                },
                textStyle: {
                    color: '#FFF3F3',
                    fontSize: '12'
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#324271',
                    width: 1,
                }
            }
        }],
        series: [{
            name: '引水',
            type: 'bar',
            //			stack: '数据量',
            barWidth: 22,
            data: [90, 180, 60, 110, 50],
            itemStyle: {
                normal: {
                    areaStyle: {
                        type: 'default'
                    },
                    //颜色渐变设置
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: "#06B1C6"
                    }, {
                        offset: 1,
                        color: "#396EF9"
                    }])
                }
            }
        },
        {
            name: '排水',
            type: 'bar',
            //			stack: '数据量',
            barWidth: 22,
            data: [120, 132, 101, 134, 90],
            itemStyle: {
                normal: {
                    areaStyle: {
                        type: 'default'
                    },
                    //颜色渐变设置
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: "#FACA06"
                    }, {
                        offset: 1,
                        color: "#3977F4"
                    }])
                }
            }
        }
        ]
    };

    var myChart = echarts.init(document.getElementById(ChartName)); //获得控件对象

    myChart.setOption(option);
}


function ChartFXHSGQS(ChartName) {
    var option = {
        title: {
            text: '圩区运行能力分析',
            textStyle: {
                fontWeight: 'normal', //标题颜色
                color: '#ffffff',
                fontSize: '14'
            },
            x: 'left'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            data: ['设计流量', '实际流量'],
            textStyle: {
                color: '#ffffff', //#ffffff
                fontSize: '12'
            },
            x: 'right',
            itemWidth: 8,
            itemHeight: 8
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '4%',
            containLabel: true
        },
        yAxis: [{
            type: 'category',
            data: ['荡北大联圩', '新解放圩', '洛西联圩', '山北南圩'],
            axisLabel: {
                textStyle: {
                    color: '#ffffff'
                }
            },
            axisLine: {
                lineStyle: {
                    type: 'solid',
                    color: '#324271', //左边线的颜色
                    width: '1', //坐标线的宽度
                }
            }
        }],
        xAxis: [{
            type: 'value',
            axisLabel: {
                textStyle: {
                    color: '#ffffff'
                }
            },
            max: 250,
            min: 0,
            axisLine: {
                lineStyle: {
                    type: 'solid',
                    color: '#324271', //左边线的颜色
                    width: '1' //坐标线的宽度
                },
                textStyle: {
                    color: '#FFF3F3',
                    fontSize: '12'
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#324271',
                    width: 1,
                }
            }
        }],
        series: [{
            name: '引水',
            type: 'bar',
            //			stack: '数据量',
            barWidth: 22,
            data: [90, 180, 60, 110],
            itemStyle: {
                normal: {
                    areaStyle: {
                        type: 'default'
                    },
                    //颜色渐变设置
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: "#06B1C6"
                    }, {
                        offset: 1,
                        color: "#396EF9"
                    }])
                }
            }
        },
        {
            name: '排水',
            type: 'bar',
            //			stack: '数据量',
            barWidth: 22,
            data: [120, 132, 101, 134],
            itemStyle: {
                normal: {
                    areaStyle: {
                        type: 'default'
                    },
                    //颜色渐变设置
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: "#FACA06"
                    }, {
                        offset: 1,
                        color: "#3977F4"
                    }])
                }
            }
        }
        ]
    };

    var myChart = echarts.init(document.getElementById(ChartName)); //获得控件对象

    myChart.setOption(option);
}



/* 柱状图 雨量
 * ChartName画图控件名称
 * dataS数据对象，数据格式json
 * strNote数据说明，数据类型数组，数据格式
 * json 格式说明 name数据类型名称，codename数据表示，tableV 表格是否显示，isShow 是否显示
 */
function chartLL(ChartName, data, strNote, LineColor, max_min_Name) {
    var myChart = echarts.init(document.getElementById(ChartName));  //获得控件对象
    //清空绘画内容，清空后实例可用，因为并非释放示例的资源，释放资源我们需要dispose()
    myChart.clear();  

    var chartName = []; 	//控件元素名称
    var chartTM = []; 	//时间序列
    var chartValue = []; //时间序列
    var liststr = ""; 	//拼装表格
    var m = new Array();

    $.each(strNote, function (index, value, item) {
        chartName.push(value.name);   //Echarts绘制标注名称加入
    });

    //循环数据，加入有效数据。
    $.each(data, function (index, value, item) {
        var charthan = []; 	//时间序列
        $.each(strNote, function (index1, value1, item1) {
            charthan.push(value[value1.codename]); //加入集合
            if (value1.name == "时间") {
                chartTM.push(value[value1.codename]); //加入时间集合
                //chartTM.push(IsSubDate(value[value1.codename], "MM-dd hh:mm", "4")); //加入时间集合
            }
            else {
                chartValue.push(value[value1.codename]);
            }
        });
        m.push(charthan); //加入集合
    }); 
     
    var option = { 
        tooltip: {
            showDelay: 0,
            hideDelay: 50,
            transitionDuration: 0,
            backgroundColor: 'rgba(255,255,255,0.9)',
            borderColor: '#4040FB',
            borderRadius: 8,
            borderWidth: 2,
            padding: 10,
            textStyle: {
                color: '#000000'
            },
            trigger: 'axis'
        },
        color: LineColor,
        legend: {
            data: chartName,
            itemWidth: 8,
            itemHeight: 8,
            textStyle: {
                color: '#000',
                fontSize: 12
            }
        },
        toolbox: {
            show: false,
            feature: {
                mark: { show: false },
                dataView: { show: false, readOnly: false },
                magicType: { show: false, type: ['line', 'bar'] },
                restore: { show: false },
                saveAsImage: { show: false }
            }
        },
        calculable: true,
        xAxis: [
            {
                type: 'category',
                data: chartTM,
                axisTick: {
                    alignWithLabel: false
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '水位(m)',
                scale: true, //是否自动计算最大最小值。
                interval: 5,
                axisLabel: {
                    formatter: function (v) {
                        return v.toFixed(2);
                    }
                }
            },
            {
                name: "流量（m³/s）",
                type: 'value', 
                splitNumeber: 5,
                scale: true, //是否自动计算最大最小值。
                axisLabel: {
                    formatter: function (v) {
                        return v.toFixed(2);
                    }
                }
            }
        ],
        series: function () {
            var serie = [];
            for (var j = 0; j < chartName.length; j++) { 
                if (chartName[j] == "时间") //调过时间字段
                {
                    continue;
                }
                var chartValue = []; 	//声明过线value集合
                for (var i = 0; i < m.length; i++) {
                    if (m[i][j] != "" && m[i][j] != null) {
                        chartValue.push(changeTwoDecimal(m[i][j], 2)); //循环价值
                    }
                }
               
                if (max_min_Name != "" & max_min_Name == chartName[j]) {
                    var item = {
                        name: chartName[j],
                        type: 'bar',
                        data: chartValue,
                        yAxisIndex: 1,
                        smooth: true 
                    }
                    serie.push(item);
                }
                else {
                    var item = {
                        name: chartName[j],
                        type: 'line',
                        data: chartValue,
                        smooth: true
                    }
                    serie.push(item);
                }
            };
            return serie;
        }()
    }; 
    myChart.setOption(option);
}


/* 柱状图 雨量
 * ChartName画图控件名称
 * dataS数据对象，数据格式json
 * strNote数据说明，数据类型数组，数据格式
 * json 格式说明 name数据类型名称，codename数据表示，tableV 表格是否显示，isShow 是否显示
 */
function chartSWYL(ChartName, data, strNote, LineColor, max_min_Name) {
    var myChart = echarts.init(document.getElementById(ChartName));  //获得控件对象
    //清空绘画内容，清空后实例可用，因为并非释放示例的资源，释放资源我们需要dispose()
    myChart.clear(); 
    var max_Name = "";
    if (max_min_Name != "降雨量") {
        max_Name = "雨量（mm）";
    } 
    var chartName = []; 	//控件元素名称
    var chartTM = []; 	//时间序列
    var chartValue = []; //时间序列
    var liststr = ""; 	//拼装表格
    var m = new Array();

    $.each(strNote, function (index, value, item) {
        chartName.push(value.name);   //Echarts绘制标注名称加入
    });

    //循环数据，加入有效数据。
    $.each(data, function (index, value, item) {
        var charthan = []; 	//时间序列
        $.each(strNote, function (index1, value1, item1) {
            charthan.push(value[value1.codename]); //加入集合
            if (value1.name == "时间") {  
                chartTM.push(value[value1.codename]); //加入时间集合
                //chartTM.push(IsSubDate(value[value1.codename], "MM-dd hh:mm", "4")); //加入时间集合
            }
            else {
                if (value[value1.codename] != undefined) {
                    chartValue.push(value[value1.codename]);
                }
            }
        });
        m.push(charthan); //加入集合
    }); 
    var option = { 
        tooltip: {
            showDelay: 0,
            hideDelay: 50,
            transitionDuration: 0,
            backgroundColor: 'rgba(255,255,255,0.9)',
            borderColor: '#4040FB',
            borderRadius: 8,
            borderWidth: 2,
            padding: 10,
            textStyle: {
                color: '#000000'
            },
            trigger: 'axis'
        },
        color: LineColor,
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
            right: '5%',
            bottom: '3%',
            top: '10%',
            containLabel: true
        }, 
        calculable: true,
        xAxis: [
            {
                type: 'category',
                data: chartTM,
                axisTick: {
                    alignWithLabel: false
                }, axisLine: {
                    lineStyle: {
                        color: '#918F8F',
                        width: 1,//这里是为了突出显示加上的
                        shadowBlur: 0,
                        shadowOffsetX: 0,
                    },
                    textStyle: {
                        color: '#000',
                        fontSize: '16'
                    },
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '水位(m)',
                boundaryGap: false,
                scale: true, //是否自动计算最大最小值。
                axisLine: {
                    lineStyle: {
                        color: '#918F8F',
                        width: 1,//这里是为了突出显示加上的
                        shadowBlur: 0,
                        shadowOffsetX: 0,
                    },
                    textStyle: {
                        color: '#000',
                        fontSize: '16'
                    },
                },
                axisLabel: {
                    formatter: function (v) {
                        return v.toFixed(2);
                    }
                }
            },
            {
                name: max_Name,
                type: 'value',
                splitNumeber: 5,
                scale: true, //是否自动计算最大最小值。
                axisLabel: {
                    formatter: function (v) {
                        return v.toFixed(1);
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#eee',
                        width: 1,
                        type: 'dashed',
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#918F8F',
                        width: 1,//这里是为了突出显示加上的
                        shadowBlur: 0,
                        shadowOffsetX: 0,
                    },
                    textStyle: {
                        color: '#000',
                        fontSize: '16'
                    },
                }
            }
        ],
        series: function () {
            var serie = [];
            for (var j = 0; j < chartName.length; j++) {
                if (chartName[j] == "时间") //调过时间字段
                {
                    continue;
                }
                var chartValue = []; 	//声明过线value集合
                for (var i = 0; i < m.length; i++) {
                    //chartValue.push(changeTwoDecimal(m[i][j], 2)); //循环价值
                    chartValue.push(m[i][j]); //循环价值
                }

                if (max_min_Name != "" & max_min_Name == chartName[j]) {
                    var item = {
                        name: chartName[j],
                        type: 'bar',
                        data: chartValue,
                        yAxisIndex: 1,
                        smooth: true 
                    }
                    serie.push(item);
                }
                else {
                    var item = {
                        name: chartName[j],
                        type: 'line',
                        data: chartValue,
                        smooth: true
                    }
                    serie.push(item);
                }
            };
            return serie;
        }()
    }; 
    myChart.setOption(option);
}

/* 柱状图 雨量
 * ChartName画图控件名称
 * dataS数据对象，数据格式json
 * strNote数据说明，数据类型数组，数据格式
 * json 格式说明 name数据类型名称，codename数据表示，tableV 表格是否显示，isShow 是否显示
 */
function chartYL(ChartName, data, strNote, LineColor, max_min_Name) {
    var myChart = echarts.init(document.getElementById(ChartName));  //获得控件对象
    //清空绘画内容，清空后实例可用，因为并非释放示例的资源，释放资源我们需要dispose()
    myChart.clear();
    if (max_min_Name == "雨量") {
        max_min_Name = "雨量（mm）";
    } 
    var chartName = []; 	//控件元素名称
    var chartTM = []; 	//时间序列
    var chartValue = []; //时间序列
    var liststr = ""; 	//拼装表格
    var m = new Array();

    $.each(strNote, function (index, value, item) {
        chartName.push(value.name);   //Echarts绘制标注名称加入
    });

    //循环数据，加入有效数据。
    $.each(data, function (index, value, item) {
        var charthan = []; 	//时间序列
        $.each(strNote, function (index1, value1, item1) {
            charthan.push(value[value1.codename]); //加入集合
            if (value1.name == "时间") {
                chartTM.push(value[value1.codename]); //加入时间集合
                //chartTM.push(IsSubDate(value[value1.codename], "MM-dd hh:mm", "4")); //加入时间集合
            } else if (value1.name == "名称") {
                chartTM.push(value[value1.codename]);
            }
            else {
                chartValue.push(value[value1.codename]);
            }
        });
        m.push(charthan); //加入集合
    });

    var option = {
        tooltip: {
            showDelay: 0,
            hideDelay: 50,
            transitionDuration: 0,
            backgroundColor: 'rgba(255,255,255,0.9)',
            borderColor: '#4040FB',
            borderRadius: 8,
            borderWidth: 2,
            padding: 10,
            textStyle: {
                color: '#000000'
            },
            trigger: 'axis'
        },
        color: LineColor,
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
            right: '5%',
            bottom: '3%',
            top: '15%',
            containLabel: true
        },
        calculable: true,
        xAxis: [
            {
                type: 'category',
                data: chartTM,
                axisTick: {
                    alignWithLabel: false
                }
            }
        ],
        yAxis: [
            {
                name: max_min_Name,
                type: 'value',
                boundaryGap: false,
                interval:0,
              //  splitNumeber: 5,
                //scale: true, //是否自动计算最大最小值。
                min:0,
                max: function(value) {
                   
                    return Number((value.max-(value.max%5))/5+1).toFixed(0)*5;
                    
                },
                axisLabel: {
                    formatter: function (v) {
                        return v.toFixed(1);
                    }
                }
            }
        ],
        series: function () {
            var serie = [];
            for (var j = 0; j < chartName.length; j++) {
                if (chartName[j] == "时间") //调过时间字段
                {
                    continue;
                }
                if (chartName[j] == "名称") //调过时间字段
                {
                    continue;
                }
                var chartValue = []; 	//声明过线value集合
                for (var i = 0; i < m.length; i++) {
                    chartValue.push(changeTwoDecimal(m[i][j], 1)); //循环价值
                }
                if (max_min_Name != "") {
                    var item = {
                        name: chartName[j],
                        type: 'bar',
                        data: chartValue,
                        barWidth: '60%',
                        label: {
                            normal: {
                                show: true,
                                position: 'top'
                            }
                        },
                        smooth: true
                        //		           itemStyle: {normal: {
                        //          	areaStyle: {type: 'default'},
                        //				//颜色渐变设置
                        //          	color:new echarts.graphic.LinearGradient(0,0,0,1,[{
                        //          		offset:0,
                        //          		color:'#050AE8'
                        //          	},{
                        //          		offset:1,
                        //          		color:'#8688F4'
                        //          	}])
                        //          }},	
                    }
                    serie.push(item);
                }
                else {
                    var item = {
                        name: chartName[j],
                        type: 'line',
                        data: chartValue,
                        smooth: true
                    }
                    serie.push(item);
                }
            };
            return serie;
        }()
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
function chartSW(ChartName, data, strNote, LineColor, max_min_Name) 
{
    if (max_min_Name == "") {
        max_min_Name = "水位(m)";
    }
    var myChart = echarts.init(document.getElementById(ChartName));  //获得控件对象
    myChart.clear();

    //echarts.init(document.getElementById('quxian'), 'macarons');
    var chartName= []; 	//控件元素名称
    var chartTM = []; 	//时间序列
    var chartValue= []; //时间序列
    var liststr = ""; 	//拼装表格
    var m = new Array();

    var ShowSelected = {};
    $.each(strNote, function(index, value, item) {
        chartName.push(value.name);   //Echarts绘制标注名称加入
        ShowSelected[value.name] = value.isShow;
    });
	
    //循环数据，加入有效数据。
    $.each(data, function(index, value, item) {
        var charthan = []; 	//时间序列
        $.each(strNote, function(index1, value1, item1) {
            charthan.push(value[value1.codename]); //加入集合
            if(value1.name=="时间")
            {
                chartTM.push(IsSubDate(value[value1.codename], "MM-dd hh:mm", "4")); //加入时间集合 
            } else if (value1.name == "名称") { 
                if (value[value1.codename] != undefined) {
                    chartTM.push(new Date(value[value1.codename]).format("MM-dd HH:mm"));
                }
            } else if (value1.name == "时间名称")
            {
                chartTM.push(value[value1.codename]); //加入时间集合 
            }
            else
            {
                chartValue.push(value[value1.codename]);
            }
        });
        m.push(charthan); //加入集合
    });
	
    //获得最大值最小值
    //var max_min=GetSort(chartValue);

    var option = {
        //backgroundColor: '#100E19',
        tooltip : {
            trigger: 'axis'
        },
        color:LineColor,
        legend: {
            data:chartName,
            itemWidth: 8,
            itemHeight: 8,
            textStyle:{    
                color:'#000',
                fontSize:12
            },
            selected: ShowSelected
        },
        grid: {
            left: '1%',
            right: '2%',
            bottom: '3%',
            top: '15%',
            containLabel: true
        },
        toolbox: {
            show : false,
            feature : {
                mark : {show: false},
                dataView : {show: false, readOnly: false},
                magicType : {show: false, type: ['line', 'bar']},
                restore : {show: false},
                saveAsImage : {show: false}
            }
        },
        calculable : true,
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : chartTM,
                axisLine:{
                    lineStyle:{
                        color:'#999',
                        width:1 //这里是为了突出显示加上的
                    },
                    textStyle: {
                        color: '#999',
                        fontSize:'16'
                    }
                }
            }
        ],
        yAxis : [
            {
                name: max_min_Name,
                type : 'value',
                boundaryGap : false,
               // splitNumeber:5,
                scale: true, //是否自动计算最大最小值。
                splitLine:{
                    show: true,
                    lineStyle: {
                        color: '#E5E5E5',
                        width: 1,
                        type: 'dashed'
                    }
                },
				
                //min:max_min.min, //动态设置最大值最小值。
                //max:max_min.max,
                min: function(value) {
                    var jiange=(value.max-value.min).toFixed(2)*100;
                    var jiangenew=Number(Number((jiange-(jiange%5))/5+1).toFixed(0)*5);
                    
                    jiangenew = jiangenew + ((jiangenew / 100).toFixed(0) * 5);

                    if((jiangenew-jiange-1)==0)
                    {
                        jiangenew=jiangenew*2;
                    }

                    if((jiangenew-jiange)%2==0)
                    {
                        return value.min-(jiangenew-jiange)/200;
                    }
                    else
                    {
                        return value.min-(jiangenew-jiange-1)/200;
                    }
                    

                },
                max: function(value) {
                    var jiange=(value.max-value.min).toFixed(2)*100;
                    var jiangenew=Number(Number((jiange-(jiange%5))/5+1).toFixed(0)*5);
                   
                    jiangenew=jiangenew+((jiangenew/100).toFixed(0)*5)
                    if((jiangenew-jiange-1)==0)
                    {
                        jiangenew=jiangenew*2;
                    }
                    if(jiangenew<5)jiangenew=5;

                    if((jiangenew-jiange)%2==0)
                    {
                        return value.max+(jiangenew-jiange)/200;
                    }
                    else
                    {
                        return value.max+(jiangenew-jiange+1)/200;
                    }
                    
                },
               
                axisLabel : {
                    formatter:function(v) {
                        return v.toFixed(2); 
                    },
					textStyle: {
					color: '#999'
					}
                },
                axisLine:{
                    lineStyle:{
                        color:'#999',
                        width:1,//这里是为了突出显示加上的
                        shadowBlur:0,
                        shadowOffsetX:0
                    },
                    textStyle: {
                        color: '#000',
                        fontSize:'16'
                    },
                }
            }
        ],
        series :function(){
            var serie=[];
		
            for(var j=0;j<chartName.length;j++)
            {
                if (chartName[j] == "时间" || chartName[j] == "名称" || chartName[j] =="时间名称") //调过时间字段
                {
                    continue;
                }
                var chartValue = []; 	//声明过线value集合
                for(var i=0;i<m.length;i++)
                {
                    if (isNaN(m[i][j]) == false) {
                        chartValue.push(changeTwoDecimal(m[i][j], 2)); //循环价值
                    }
                }
                if(max_min_Name!=""&max_min_Name==chartName[j])
                {
                    var item={
                        name: chartName[j],
                        type: 'line',
                        data: chartValue,
                        markPoint : {
                            data : [{type : 'max', name: '最大值'},{type : 'min', name: '最小值'}]
                        },
                        smooth:true,
                        itemStyle:{
                            normal:{
                                lineStyle:{
                                    width:1,
                                    type:'solid'  //'dotted'虚线 'solid'实线
                                }
                            }
                        }
		           
                        //		           ,itemStyle: {normal: {
                        //		            	areaStyle: {type: 'default'},
                        //						//颜色渐变设置
                        //		            	color:new echarts.graphic.LinearGradient(0,0,0,1,[{
                        //		            		offset:0,
                        //		            		color:'#050AE8'
                        //		            	},{
                        //		            		offset:1,
                        //		            		color:'#8688F4'
                        //		            	}])
                        //		            }}	
                    }
                    serie.push(item);
                }
                else if(chartName[j] == "警戒水位"){
                    var item={
                        name: chartName[j],
                        type: 'line',
                        data: chartValue,
                        connectNulls: true,
                        smooth:false,
                        itemStyle:{
                            normal:{
                                lineStyle:{
                                    width:1,
                                    type:'dotted'  //'dotted'虚线 'solid'实线
                                }
                            }
                        }
                    }
                    serie.push(item);
                }
                else
                {
                    var item={
                        name: chartName[j],
                        markPoint: {
                            data: [{ type: 'max', name: '最大值' },
                                { type: 'min', name: '最小值' }]
                        },
                        type: 'line',
                        connectNulls: true,
                        data: chartValue,
                        smooth:true
                    }
                    serie.push(item);
                }
            };
            return serie;
        }()
    };

    myChart.resize();
    myChart.setOption(option);
}

function chartSZ(ChartName, data, strNote, LineColor, max_min_Name) {
    var myChart = echarts.init(document.getElementById(ChartName));  //获得控件对象
    myChart.clear();
    //echarts.init(document.getElementById('quxian'), 'macarons');
    var chartName = []; 	//控件元素名称
    var chartTM = []; 	//时间序列
    var chartValue = []; //时间序列
    var liststr = ""; 	//拼装表格
    var m = new Array();
    //后期根据改为动态设置
    //var selectedstr={'PH' : false,'氨氮' : true,'总磷' : false,'溶解氧' : false,'高锰酸盐' : false};
    var LineSelect = "";
    $.each(strNote, function (index, value, item) {
        chartName.push(value.name);   //Echarts绘制标注名称加入
        LineSelect += "'" + value.name + "':" + value.isShow + ",";
    });
    if (LineSelect.length > 0) {
        LineSelect = LineSelect.substring(0, LineSelect.length - 1);
    }
    //循环数据，加入有效数据。
    $.each(data, function (index, value, item) {
        var charthan = []; 	//时间序列
        $.each(strNote, function (index1, value1, item1) {
            charthan.push(value[value1.codename]); //加入集合
            if (value1.name == "时间") {
                //console.log((convertToDate(value[value1.codename])))
                chartTM.push(new Date(convertToDate(value[value1.codename])).format("MM-dd HH")); //加入时间集合
            }
            else {
                chartValue.push(value[value1.codename]);
            }
        });
        m.push(charthan); //加入集合
    });

    //获得最大值最小值
    //var max_min=GetSort(chartValue);

    var option = {
        //backgroundColor: '#100E19',

        tooltip: {
            trigger: 'axis',
            showDelay: 0,
            hideDelay: 50,
            transitionDuration: 0,
            backgroundColor: 'rgba(255,255,255,0.9)',
            borderColor: '#4040FB',
            borderRadius: 8,
            borderWidth: 2,
            padding: 10,
            textStyle: {
                color: '#000000'
            },
            formatter: function (params) {
                var s = "";
                s += "时间：" + params[0].name;
                for (var i = 0; i < params.length; i++) {
                    s = s + '<br />' + getshuizhiChart(params[i].seriesName, params[i].value);
                }
                return s;
            }
        },
        color: LineColor,
        legend: {
            data: chartName,
            itemWidth: 8,
            itemHeight: 8,
            textStyle: {
                color: '#000',
                fontSize: 12
            }
            //控制过程线默认是否显示
            //,
            //selected: { LineSelect }
        },
        toolbox: {
            show: false,
            feature: {
                mark: { show: false },
                dataView: { show: false, readOnly: false },
                magicType: { show: false, type: ['line', 'bar'] },
                restore: { show: false },
                saveAsImage: { show: false }
            }
        },
        calculable: true,
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: chartTM,
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
            }
        ],
        yAxis: [
            {
                name: "水质(mg/L)",
                type: 'value',
                boundaryGap: false,
                splitNumeber: 5,
                scale: true, //是否自动计算最大最小值。
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#eee',
                        width: 1,
                        type: 'dashed',
                    }
                },
                //min:max_min.min, //动态设置最大值最小值。
                //max:max_min.max,
                axisLabel: {
                    formatter: function (v) {
                        return v.toFixed(2);
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#918F8F',
                        width: 1,//这里是为了突出显示加上的
                        shadowBlur: 0,
                        shadowOffsetX: 0,
                    },
                    textStyle: {
                        color: '#000',
                        fontSize: '16'
                    },
                }
            }
        ],
        series: function () {
            var serie = [];
            for (var j = 0; j < chartName.length; j++) {
                if (chartName[j] == "时间") //调过时间字段
                {
                    continue;
                }
                var chartValue = []; 	//声明过线value集合
                for (var i = 0; i < m.length; i++) {
                    chartValue.push(changeTwoDecimal(m[i][j], 2)); //循环价值
                }
                if (max_min_Name != "" & max_min_Name == chartName[j]) {
                    var item = {
                        name: chartName[j],
                        type: 'line',
                        data: chartValue,
                        markPoint: {
                            data: [{ type: 'max', name: '最大值' }, { type: 'min', name: '最小值' }]
                        },
                        smooth: true
                        //		           itemStyle: {normal: {
                        //          	areaStyle: {type: 'default'},
                        //				//颜色渐变设置
                        //          	color:new echarts.graphic.LinearGradient(0,0,0,1,[{
                        //          		offset:0,
                        //          		color:'#050AE8'
                        //          	},{
                        //          		offset:1,
                        //          		color:'#8688F4'
                        //          	}])
                        //          }},	
                    }
                    serie.push(item);
                }
                else {
                    var item = {
                        name: chartName[j],
                        type: 'line',
                        data: chartValue,
                        smooth: true
                    }
                    serie.push(item);
                }
            };
            return serie;
        }()
    };
    myChart.setOption(option);
}

//数组排序，获取最大值、最小值。
function GetSort(arr) {
    arr.sort(compare);
    var _min = arr[0];
    var _max = arr[arr.length - 1];

    var i_min = _min * 10;
    var i_max = _max * 10;
    var i_deta = (i_max - i_min) / 7.0;
    var d_tmp;
    i_min = Number(i_min) - Number(i_deta);
    i_max = Number(i_max) + Number(i_deta);
    d_tmp = i_max - i_min;

    i_deta = 5 - (d_tmp % 5);

    _min = (i_min - (i_deta / 2)) / 10.0;
    _max = (i_max + i_deta - (i_deta / 2)) / 10.0;

    //if (_min < 0) {
       // _min = 0;
    //}
    return { min: _min, max: _max };
}
//方法按照升序排列数组项
function compare(val1, val2) {
    return val1 - val2;
}


function getshuizhiChart(field, value) {
    if (value == "-" || value == "") {
        value = "0";
    }
    value = Number(value);
    var str = "";
    if (field == "ph") {
        if (value > 9 || value < 6) {
            str = "<span style='color:#FD5508;'>" + field + ": " + value.toFixed(2) + "</span>(Ⅰ)";
        }
        else {
            str = "<span style='color:#FEC307;'>" + field + ": " + value.toFixed(2) + "</span>(劣Ⅴ)";
        }
    }
    if (field == "溶解氧") {
        if (value >= 7.5) {
            str = "<span style='color:#56D4FD;'>" + field + ": " + value.toFixed(2) + "</span>(Ⅰ)";
        }
        else if (value >= 6) {
            str = "<span style='color:#1AA9F1;'>" + field + ": " + value.toFixed(2) + "</span>(Ⅱ)";
        }
        else if (value >= 5) {
            str = "<span style='color:#5ED624;'>" + field + ": " + value.toFixed(2) + "</span>(Ⅲ)";
        }
        else if (value >= 3) {
            str = "<span style='color:#25B464;'>" + field + ": " + value.toFixed(2) + "</span>(Ⅳ)";
        }
        else if (value >= 2) {
            str = "<span style='color:#FEC307;'>" + field + ": " + value.toFixed(2) + "</span>(Ⅴ)";
        }
        else {
            str = "<span style='color:#FD5508;'>" + field + ": " + value.toFixed(2) + "</span>(劣Ⅴ)";
        }
    }
    if (field == "化学需氧量") {
        if (value <= 15) {
            str = "<span style='color:#56D4FD;'>" + field + ": " + value.toFixed(2) + "</span>(Ⅰ)";
        }
        else if (value <= 15) {
            str = "<span style='color:#1AA9F1;'>" + field + ": " + value.toFixed(2) + "</span>(Ⅱ)";
        }
        else if (value <= 20) {
            str = "<span style='color:#5ED624;'>" + field + ": " + value.toFixed(2) + "</span>(Ⅲ)";
        }
        else if (value <= 30) {
            str = "<span style='color:#25B464;'>" + field + ": " + value.toFixed(2) + "</span>(Ⅳ)";
        }
        else if (value <= 40) {
            str = "<span style='color:#FEC307;'>" + field + ": " + value.toFixed(2) + "</span>(Ⅴ)";
        }
        else {
            str = "<span style='color:#FD5508;'>" + field + ": " + value.toFixed(2) + "</span>(劣Ⅴ)";
        }
    }
    if (field == "氨氮") {
        if (value <= 0.15) {
            str = "<span style='color:#56D4FD;'>" + field + ": " + value.toFixed(2) + "</span>(Ⅰ)";
        }
        else if (value <= 0.5) {
            str = "<span style='color:#1AA9F1;'>" + field + ": " + value.toFixed(2) + "</span>(Ⅱ)";
        }
        else if (value <= 1.0) {
            str = "<span style='color:#5ED624;'>" + field + ": " + value.toFixed(2) + "</span>(Ⅲ)";
        }
        else if (value <= 1.5) {
            str = "<span style='color:#25B464;'>" + field + ": " + value.toFixed(2) + "</span>(Ⅳ)";
        }
        else if (value <= 2.0) {
            str = "<span style='color:#FEC307;'>" + field + ": " + value.toFixed(2) + "</span>(Ⅴ)";
        }
        else {
            str = "<span style='color:#FD5508;'>" + field + ": " + value.toFixed(2) + "</span>(劣Ⅴ)";
        }
    }
    if (field == "总磷") {
        if (value <= 0.02) {
            str = "<span style='color:#56D4FD;'>" + field + ": " + value.toFixed(2) + "</span>(Ⅰ)";
        }
        else if (value <= 0.1) {
            str = "<span style='color:#1AA9F1;'>" + field + ": " + value.toFixed(2) + "</span>(Ⅱ)";
        }
        else if (value <= 0.2) {
            str = "<span style='color:#5ED624;'>" + field + ": " + value.toFixed(2) + "</span>(Ⅲ)";
        }
        else if (value <= 0.3) {
            str = "<span style='color:#25B464;'>" + field + ": " + value.toFixed(2) + "</span>(Ⅳ)";
        }
        else if (value <= 0.4) {
            str = "<span style='color:#FEC307;'>" + field + ": " + value.toFixed(2) + "</span>(Ⅴ)";
        }
        else {
            str = "<span style='color:#FD5508;'>" + field + ": " + value.toFixed(2) + "</span>(劣Ⅴ)";
        }
    }
    if (field == "总氮") {
        if (value <= 0.2) {
            str = "<span style='color:#56D4FD;'>" + field + ": " + value.toFixed(2) + "</span>(Ⅰ)";
        }
        else if (value <= 0.5) {
            str = "<span style='color:#1AA9F1;'>" + field + ": " + value.toFixed(2) + "</span>(Ⅱ)";
        }
        else if (value <= 1.0) {
            str = "<span style='color:#5ED624;'>" + field + ": " + value.toFixed(2) + "</span>(Ⅲ)";
        }
        else if (value <= 1.5) {
            str = "<span style='color:#25B464;'>" + field + ": " + value.toFixed(2) + "</span>(Ⅳ)";
        }
        else if (value <= 2.0) {
            str = "<span style='color:#FEC307;'>" + field + ": " + value.toFixed(2) + "</span>(Ⅴ)";
        }
        else {
            str = "<span style='color:#FD5508;'>" + field + ": " + value.toFixed(2) + "</span>(劣Ⅴ)";
        }
    }
    if (field == "高锰酸盐") {
        if (value <= 2) {
            str = "<span style='color:#56D4FD;'>" + field + ": " + value.toFixed(2) + "</span>(Ⅰ)";
        }
        else if (value <= 4) {
            str = "<span style='color:#1AA9F1;'>" + field + ": " + value.toFixed(2) + "</span>(Ⅱ)";
        }
        else if (value <= 6) {
            str = "<span style='color:#5ED624;'>" + field + ": " + value.toFixed(2) + "</span>(Ⅲ)";
        }
        else if (value <= 10) {
            str = "<span style='color:#25B464;'>" + field + ": " + value.toFixed(2) + "</span>(Ⅳ)";
        }
        else if (value <= 15) {
            str = "<span style='color:#FEC307;'>" + field + ": " + value.toFixed(2) + "</span>(Ⅴ)";
        }
        else {
            str = "<span style='color:#FD5508;'>" + field + ": " + value.toFixed(2) + "</span>(劣Ⅴ)";
        }
    }
    if (field == "流量") {
        str = "<span style='color:#FD5508;'>" + field + ": " + value.toFixed(2) + "</span>m3/s";
    }
    return str;
}
/* 水位、流量
 * ChartName画图控件名称
 * dataS数据对象，数据格式json
 * strNote数据说明，数据类型数组，数据格式
 * json 格式说明 name数据类型名称，codename数据表示，tableV 表格是否显示，isShow 是否显示
 */
function chartSWLL(ChartName, data, strNote, LineColor, max_min_Name) {
    var myChart = echarts.init(document.getElementById(ChartName));  //获得控件对象
    //清空绘画内容，清空后实例可用，因为并非释放示例的资源，释放资源我们需要dispose()
    myChart.clear();
    var max_Name = "";
    if (max_min_Name != "降雨量") {
        max_Name = "流量（m³/s）";
    }
    var chartName = []; 	//控件元素名称
    var chartTM = []; 	//时间序列
    var chartValue = []; //时间序列
    var liststr = ""; 	//拼装表格
    var m = new Array();

    $.each(strNote, function (index, value, item) {
        chartName.push(value.name);   //Echarts绘制标注名称加入
    });

    //循环数据，加入有效数据。
    $.each(data, function (index, value, item) {
        var charthan = []; 	//时间序列
        $.each(strNote, function (index1, value1, item1) {
            charthan.push(value[value1.codename]); //加入集合
            if (value1.name == "时间") {
                chartTM.push(value[value1.codename]); //加入时间集合
                //chartTM.push(IsSubDate(value[value1.codename], "MM-dd hh:mm", "4")); //加入时间集合
            }
            else {
                if (value[value1.codename] != undefined) {
                    chartValue.push(value[value1.codename]);
                }
            }
        });
        m.push(charthan); //加入集合
    });
    var option = {
        tooltip: {
            showDelay: 0,
            hideDelay: 50,
            transitionDuration: 0,
            backgroundColor: 'rgba(255,255,255,0.9)',
            borderColor: '#4040FB',
            borderRadius: 8,
            borderWidth: 2,
            padding: 10,
            textStyle: {
                color: '#000000'
            },
            trigger: 'axis'
        },
        color: LineColor,
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
            right: '5%',
            bottom: '3%',
            top: '10%',
            containLabel: true
        },
        calculable: true,
        xAxis: [
            {
                type: 'category',
                data: chartTM,
                axisTick: {
                    alignWithLabel: false
                }, axisLine: {
                    lineStyle: {
                        color: '#918F8F',
                        width: 1,//这里是为了突出显示加上的
                        shadowBlur: 0,
                        shadowOffsetX: 0,
                    },
                    textStyle: {
                        color: '#000',
                        fontSize: '16'
                    },
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '水位(m)',
                boundaryGap: false,
                scale: true, //是否自动计算最大最小值。
                axisLine: {
                    lineStyle: {
                        color: '#918F8F',
                        width: 1,//这里是为了突出显示加上的
                        shadowBlur: 0,
                        shadowOffsetX: 0,
                    },
                    textStyle: {
                        color: '#000',
                        fontSize: '16'
                    },
                },
                axisLabel: {
                    formatter: function (v) {
                        return v.toFixed(2);
                    }
                }
            },
            {
                name: max_Name,
                type: 'value',
                splitNumeber: 5,
                scale: true, //是否自动计算最大最小值。
                axisLabel: {
                    formatter: function (v) {
                        return v.toFixed(1);
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#eee',
                        width: 1,
                        type: 'dashed',
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#918F8F',
                        width: 1,//这里是为了突出显示加上的
                        shadowBlur: 0,
                        shadowOffsetX: 0,
                    },
                    textStyle: {
                        color: '#000',
                        fontSize: '16'
                    },
                }
            }
        ],
        series: function () {
            var serie = [];
            for (var j = 0; j < chartName.length; j++) {
                if (chartName[j] == "时间") //调过时间字段
                {
                    continue;
                }
                var chartValue = []; 	//声明过线value集合
                for (var i = 0; i < m.length; i++) {
                    //chartValue.push(changeTwoDecimal(m[i][j], 2)); //循环价值
                    chartValue.push(m[i][j]); //循环价值
                }

                if (max_min_Name != "" & max_min_Name == chartName[j]) {
                    var item = {
                        name: chartName[j],
                        type: 'line',
                        data: chartValue,
                        yAxisIndex: 1,
                        smooth: true
                    }
                    serie.push(item);
                }
                else {
                    var item = {
                        name: chartName[j],
                        type: 'line',
                        data: chartValue,
                        smooth: true
                    }
                    serie.push(item);
                }
            };
            return serie;
        }()
    };
    myChart.setOption(option);
}

function chartSW_dataZoom(ChartName, data, strNote, LineColor, max_min_Name) {
    if (max_min_Name == "") {
        max_min_Name = "水位(m)";
    }
    var myChart = echarts.init(document.getElementById(ChartName));  //获得控件对象
    myChart.clear();

    //echarts.init(document.getElementById('quxian'), 'macarons');
    var chartName = []; 	//控件元素名称
    var chartTM = []; 	//时间序列
    var chartValue = []; //时间序列
    var liststr = ""; 	//拼装表格
    var m = new Array();

    $.each(strNote, function (index, value, item) {
        chartName.push(value.name);   //Echarts绘制标注名称加入
    });

    //循环数据，加入有效数据。
    $.each(data, function (index, value, item) {
        var charthan = []; 	//时间序列
        $.each(strNote, function (index1, value1, item1) {
            charthan.push(value[value1.codename]); //加入集合
            if (value1.name == "时间") {
                chartTM.push(IsSubDate(value[value1.codename], "MM-dd hh:mm", "4")); //加入时间集合 
            } else if (value1.name == "名称") {
                if (value[value1.codename] != undefined) {
                    chartTM.push(new Date(value[value1.codename]).format("MM-dd HH:mm"));
                }
            } else if (value1.name == "时间名称") {
                chartTM.push(value[value1.codename]); //加入时间集合 
            }
            else {
                chartValue.push(value[value1.codename]);
            }
        });
        m.push(charthan); //加入集合
    });

    //获得最大值最小值
    //var max_min=GetSort(chartValue);

    var option = {
        //backgroundColor: '#100E19',
        tooltip: {
            trigger: 'axis'
        },
        color: LineColor,
        legend: {
            data: chartName,
            itemWidth: 8,
            itemHeight: 8,
            textStyle: {
                color: '#000',
                fontSize: 12
            }
            //控制过程线默认是否显示
            //       ,
            //		 selected: {
            //          '警戒水位' : false
            //      }
        },
        grid: {
            left: '1%',
            right: '2%',
            bottom: 80,
            top: '15%',
            containLabel: true
        },
        toolbox: {
            show: false,
            feature: {
                mark: { show: false },
                dataView: { show: false, readOnly: false },
                magicType: { show: false, type: ['line', 'bar'] },
                restore: { show: false },
                saveAsImage: { show: false }
            }
        },
        calculable: true,
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: chartTM,
                axisLine: {
                    lineStyle: {
                        color: '#999',
                        width: 1 //这里是为了突出显示加上的
                    },
                    textStyle: {
                        color: '#999',
                        fontSize: '16'
                    }
                }
            }
        ],
        yAxis: [
            {
                name: max_min_Name,
                type: 'value',
                boundaryGap: false,
                // splitNumeber:5,
                scale: true, //是否自动计算最大最小值。
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#E5E5E5',
                        width: 1,
                        type: 'dashed'
                    }
                },

                //min:max_min.min, //动态设置最大值最小值。
                //max:max_min.max,
                min: function (value) {
                    var jiange = (value.max - value.min).toFixed(2) * 100;
                    var jiangenew = Number(Number((jiange - (jiange % 5)) / 5 + 1).toFixed(0) * 5);

                    jiangenew = jiangenew + ((jiangenew / 100).toFixed(0) * 5);

                    if ((jiangenew - jiange - 1) == 0) {
                        jiangenew = jiangenew * 2;
                    }

                    if ((jiangenew - jiange) % 2 == 0) {
                        return value.min - (jiangenew - jiange) / 200;
                    }
                    else {
                        return value.min - (jiangenew - jiange - 1) / 200;
                    }


                },
                max: function (value) {
                    var jiange = (value.max - value.min).toFixed(2) * 100;
                    var jiangenew = Number(Number((jiange - (jiange % 5)) / 5 + 1).toFixed(0) * 5);

                    jiangenew = jiangenew + ((jiangenew / 100).toFixed(0) * 5)
                    if ((jiangenew - jiange - 1) == 0) {
                        jiangenew = jiangenew * 2;
                    }
                    if (jiangenew < 5) jiangenew = 5;

                    if ((jiangenew - jiange) % 2 == 0) {
                        return value.max + (jiangenew - jiange) / 200;
                    }
                    else {
                        return value.max + (jiangenew - jiange + 1) / 200;
                    }

                },

                axisLabel: {
                    formatter: function (v) {
                        return v.toFixed(2);
                    },
                    textStyle: {
                        color: '#999'
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#999',
                        width: 1,//这里是为了突出显示加上的
                        shadowBlur: 0,
                        shadowOffsetX: 0
                    },
                    textStyle: {
                        color: '#000',
                        fontSize: '16'
                    }
                }
            }
        ], 
        dataZoom: [{
            textStyle: {
                color: '#8392A5'
            },
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            dataBackground: {
                areaStyle: {
                    color: '#8392A5'
                },
                lineStyle: {
                    opacity: 0.8,
                    color: '#8392A5'
                }
            },
            handleStyle: {
                color: '#fff',
                shadowBlur: 3,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOffsetX: 2,
                shadowOffsetY: 2
            }
        }, {
            type: 'inside'
        }],
        series: function () {
            var serie = [];

            for (var j = 0; j < chartName.length; j++) {
                if (chartName[j] == "时间" || chartName[j] == "名称" || chartName[j] == "时间名称") //调过时间字段
                {
                    continue;
                }
                var chartValue = []; 	//声明过线value集合
                for (var i = 0; i < m.length; i++) {
                    if (isNaN(m[i][j]) == false) {
                        chartValue.push(changeTwoDecimal(m[i][j], 2)); //循环价值
                    }
                }
                if (max_min_Name != "" & max_min_Name == chartName[j]) {
                    var item = {
                        name: chartName[j],
                        type: 'line',
                        data: chartValue,
                        markPoint: {
                            data: [{ type: 'max', name: '最大值' }, { type: 'min', name: '最小值' }]
                        },
                        smooth: true,
                        itemStyle: {
                            normal: {
                                lineStyle: {
                                    width: 1,
                                    type: 'solid'  //'dotted'虚线 'solid'实线
                                }
                            }
                        } 
                    }
                    serie.push(item);
                }
                else if (chartName[j] == "警戒水位") {
                    var item = {
                        name: chartName[j],
                        type: 'line',
                        data: chartValue,
                        connectNulls: true,
                        smooth: false,
                        itemStyle: {
                            normal: {
                                lineStyle: {
                                    width: 1,
                                    type: 'dotted'  //'dotted'虚线 'solid'实线
                                }
                            }
                        }
                    }
                    serie.push(item);
                }
                else {
                    var item = {
                        name: chartName[j],
                        type: 'line',
                        connectNulls: true,
                        data: chartValue,
                        smooth: true
                    }
                    serie.push(item);
                }
            };
            return serie;
        }()
    };

    myChart.resize();
    myChart.setOption(option);
}

function chartSW_dataZoom2(ChartName, data, strNote, LineColor, max_min_Name) {
    var Name1 = "水位(m)", Name2 = "水位(m)";
    if (max_min_Name == "") {
        max_min_Name = "水位(m)";
    } else {
        var temp = max_min_Name.split(',');
        Name1 = temp[0];
        if (temp.length > 1) {
            Name2 = temp[1];
        }
    } 
    var myChart = echarts.init(document.getElementById(ChartName));  //获得控件对象
    myChart.clear();

    //echarts.init(document.getElementById('quxian'), 'macarons');
    var chartName = []; 	//控件元素名称
    var chartTableV = []; 	//控件元素名称
    var chartTM = []; 	//时间序列
    var chartValue = []; //时间序列
    var liststr = ""; 	//拼装表格
    var m = new Array();

    $.each(strNote, function (index, value, item) {
        chartName.push(value.name);   //Echarts绘制标注名称加入
        chartTableV.push(value.tableV);
    });

    //循环数据，加入有效数据。
    $.each(data, function (index, value, item) {
        var charthan = []; 	//时间序列
        $.each(strNote, function (index1, value1, item1) {
            charthan.push(value[value1.codename]); //加入集合
            if (value1.name == "时间") {
                chartTM.push(IsSubDate(value[value1.codename], "MM-dd hh:mm", "4")); //加入时间集合 
            } else if (value1.name == "名称") {
                if (value[value1.codename] != undefined) {
                    chartTM.push(new Date(value[value1.codename]).format("MM-dd HH:mm"));
                }
            } else if (value1.name == "时间名称") {
                chartTM.push(value[value1.codename]); //加入时间集合 
            }
            else {
                chartValue.push(value[value1.codename]);
            }
        });
        m.push(charthan); //加入集合
    });

    //获得最大值最小值
    //var max_min=GetSort(chartValue);

    var option = {
        //backgroundColor: '#100E19',
        tooltip: {
            trigger: 'axis'
        },
        color: LineColor,
        legend: {
            data: chartName,
            itemWidth: 8,
            itemHeight: 8,
            textStyle: {
                color: '#000',
                fontSize: 12
            }
            //控制过程线默认是否显示
            //       ,
            //		 selected: {
            //          '警戒水位' : false
            //      }
        },
        grid: {
            left: '1%',
            right: '2%',
            bottom: 80,
            top: '15%',
            containLabel: true
        },
        toolbox: {
            show: false,
            feature: {
                mark: { show: false },
                dataView: { show: false, readOnly: false },
                magicType: { show: false, type: ['line', 'bar'] },
                restore: { show: false },
                saveAsImage: { show: false }
            }
        },
        calculable: true,
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: chartTM,
                axisLine: {
                    lineStyle: {
                        color: '#999',
                        width: 1 //这里是为了突出显示加上的
                    },
                    textStyle: {
                        color: '#999',
                        fontSize: '16'
                    }
                }
            }
        ],
        yAxis: [
            {
                name: Name1,
                type: 'value',
                boundaryGap: false,
                // splitNumeber:5,
                scale: true, //是否自动计算最大最小值。
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#E5E5E5',
                        width: 1,
                        type: 'dashed'
                    }
                },

                //min:max_min.min, //动态设置最大值最小值。
                //max:max_min.max,
                min: function (value) {
                    var jiange = (value.max - value.min).toFixed(2) * 100;
                    var jiangenew = Number(Number((jiange - (jiange % 5)) / 5 + 1).toFixed(0) * 5);

                    jiangenew = jiangenew + ((jiangenew / 100).toFixed(0) * 5);

                    if ((jiangenew - jiange - 1) == 0) {
                        jiangenew = jiangenew * 2;
                    }

                    if ((jiangenew - jiange) % 2 == 0) {
                        return value.min - (jiangenew - jiange) / 200;
                    }
                    else {
                        return value.min - (jiangenew - jiange - 1) / 200;
                    }
                },
                max: function (value) {
                    var jiange = (value.max - value.min).toFixed(2) * 100;
                    var jiangenew = Number(Number((jiange - (jiange % 5)) / 5 + 1).toFixed(0) * 5);

                    jiangenew = jiangenew + ((jiangenew / 100).toFixed(0) * 5)
                    if ((jiangenew - jiange - 1) == 0) {
                        jiangenew = jiangenew * 2;
                    }
                    if (jiangenew < 5) jiangenew = 5;

                    if ((jiangenew - jiange) % 2 == 0) {
                        return value.max + (jiangenew - jiange) / 200;
                    }
                    else {
                        return value.max + (jiangenew - jiange + 1) / 200;
                    }

                },

                axisLabel: {
                    formatter: function (v) {
                        return v.toFixed(2);
                    },
                    textStyle: {
                        color: '#999'
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#999',
                        width: 1,//这里是为了突出显示加上的
                        shadowBlur: 0,
                        shadowOffsetX: 0
                    },
                    textStyle: {
                        color: '#000',
                        fontSize: '16'
                    }
                }
            }, {
                name: Name2,
                type: 'value',
                boundaryGap: false,
                // splitNumeber:5,
                scale: true, //是否自动计算最大最小值。
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#E5E5E5',
                        width: 1,
                        type: 'dashed'
                    }
                },

                //min:max_min.min, //动态设置最大值最小值。
                //max:max_min.max,
                min: function (value) {
                    var jiange = (value.max - value.min).toFixed(2) * 100;
                    var jiangenew = Number(Number((jiange - (jiange % 5)) / 5 + 1).toFixed(0) * 5);

                    jiangenew = jiangenew + ((jiangenew / 100).toFixed(0) * 5);

                    if ((jiangenew - jiange - 1) == 0) {
                        jiangenew = jiangenew * 2;
                    }

                    if ((jiangenew - jiange) % 2 == 0) {
                        return value.min - (jiangenew - jiange) / 200;
                    }
                    else {
                        return value.min - (jiangenew - jiange - 1) / 200;
                    }


                },
                max: function (value) {
                    var jiange = (value.max - value.min).toFixed(2) * 100;
                    var jiangenew = Number(Number((jiange - (jiange % 5)) / 5 + 1).toFixed(0) * 5);

                    jiangenew = jiangenew + ((jiangenew / 100).toFixed(0) * 5)
                    if ((jiangenew - jiange - 1) == 0) {
                        jiangenew = jiangenew * 2;
                    }
                    if (jiangenew < 5) jiangenew = 5;

                    if ((jiangenew - jiange) % 2 == 0) {
                        return value.max + (jiangenew - jiange) / 200;
                    }
                    else {
                        return value.max + (jiangenew - jiange + 1) / 200;
                    }

                },

                axisLabel: {
                    formatter: function (v) {
                        return v.toFixed(2);
                    },
                    textStyle: {
                        color: '#999'
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#999',
                        width: 1,//这里是为了突出显示加上的
                        shadowBlur: 0,
                        shadowOffsetX: 0
                    },
                    textStyle: {
                        color: '#000',
                        fontSize: '16'
                    }
                }
            }
        ],
        dataZoom: [{
            textStyle: {
                color: '#8392A5'
            },
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            dataBackground: {
                areaStyle: {
                    color: '#8392A5'
                },
                lineStyle: {
                    opacity: 0.8,
                    color: '#8392A5'
                }
            },
            handleStyle: {
                color: '#fff',
                shadowBlur: 3,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOffsetX: 2,
                shadowOffsetY: 2
            }
        }, {
            type: 'inside'
        }],
        series: function () {
            var serie = [];

            for (var j = 0; j < chartName.length; j++) {
                if (chartName[j] == "时间" || chartName[j] == "名称" || chartName[j] == "时间名称") //调过时间字段
                {
                    continue;
                }
                var chartValue = []; 	//声明过线value集合
                for (var i = 0; i < m.length; i++) {
                    if (isNaN(m[i][j]) == false) {
                        chartValue.push(changeTwoDecimal(m[i][j], 2)); //循环价值
                    }
                } 
                if (Name1 != "" && (Name1 == chartName[j] || Name2 == chartName[j])) {
                    var item = {
                        name: chartName[j],
                        yAxisIndex: chartTableV[j],
                        type: 'line',
                        data: chartValue,
                        markPoint: {
                            data: [{ type: 'max', name: '最大值' }, { type: 'min', name: '最小值' }]
                        },
                        smooth: true,
                        itemStyle: {
                            normal: {
                                lineStyle: {
                                    width: 1,
                                    type: 'solid'  //'dotted'虚线 'solid'实线
                                }
                            }
                        }
                    }
                    serie.push(item);
                }
                else if (chartName[j] == "警戒水位") {
                    var item = {
                        name: chartName[j],
                        yAxisIndex: chartTableV[j],
                        type: 'line',
                        data: chartValue,
                        connectNulls: true,
                        smooth: false,
                        itemStyle: {
                            normal: {
                                lineStyle: {
                                    width: 1,
                                    type: 'dotted'  //'dotted'虚线 'solid'实线
                                }
                            }
                        }
                    }
                    serie.push(item);
                }
                else {
                    var item = {
                        name: chartName[j],
                        yAxisIndex: Number(chartTableV[j]),
                        type: 'line',
                        connectNulls: true,
                        data: chartValue,
                        smooth: true
                    }
                    serie.push(item);
                }
            };
            return serie;
        }()
    };

    myChart.resize();
    myChart.setOption(option);
}
