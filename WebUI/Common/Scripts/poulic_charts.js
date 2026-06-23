var IsSubDate;/***gxc编写于2018年4月11日 16:45
过程线绘制
导入Echar画图包
***/
document.write('<script type="text/javascript" src="' + bootPATH + '/Scripts/echarts.min.js" ></script>');

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
function chartSW(ChartName, data, strNote, LineColor, max_min_Name) {
    var myChart = echarts.init(document.getElementById(ChartName));  //获得控件对象
    //清空绘画内容，清空后实例可用，因为并非释放示例的资源，释放资源我们需要dispose()
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
                //console.log(value[value1.codename]);
                //chartTM.push(new Date(value[value1.codename].replaceAll("-","/")).format("MM-dd HH:mm")); //加入时间集合
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
            //控制过程线默认是否显示
            //       ,
            //		 selected: {
            //          '警戒水位' : false
            //      }
        }, grid: {
            left: '2%',
            right: '2%',
            bottom: '3%',
            top: '15%',
            containLabel: true
        },
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
                name: "水位(m)",
                type: 'value',
                boundaryGap: false,
                splitNumeber: 5,
                scale: true, //是否自动计算最大最小值。
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#918F8F',
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
            left: '4%',
            right: '1%',
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
                name: "雨量（mm）",
                type: 'value',
                boundaryGap: false,
                splitNumeber: 5,
                //scale: true, //是否自动计算最大最小值。
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
                var chartValue = []; 	//声明过线value集合
                for (var i = 0; i < m.length; i++) {
                    chartValue.push(changeTwoDecimal(m[i][j], 1)); //循环价值
                }
                if (max_min_Name != "") {
                    var item = {
                        name: chartName[j],
                        type: 'bar',
                        data: chartValue,
                        barWidth:'40%',
                        label: {
                            normal: {
                                show: true,
                                position: 'top'
                            }
                        },
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

/* 过程性 流量
 * ChartName画图控件名称
 * dataS数据对象，数据格式json
 * strNote数据说明，数据类型数组，数据格式
 * json 格式说明 name数据类型名称，codename数据表示，tableV 表格是否显示，isShow 是否显示
 */
function chartLL(ChartName, data, strNote, LineColor, max_min_Name) {
    var myChart = echarts.init(document.getElementById(ChartName));  //获得控件对象
    //清空绘画内容，清空后实例可用，因为并非释放示例的资源，释放资源我们需要dispose()
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
            //控制过程线默认是否显示
            //       ,
            //		 selected: {
            //          '警戒水位' : false
            //      }
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
                name: "流量(m3/s)",
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
                        return v.toFixed(1);
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
                    chartValue.push(changeTwoDecimal(m[i][j], 1)); //循环价值
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
            ,
            selected: { LineSelect }
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



//将数据转化为数字类型，保留小数
function changeTwoDecimal(x, format) {
    var f_x = parseFloat(x);
    if (isNaN(f_x)) {
        return "-";
    }
    return f_x.toFixed(format);
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

    if (_min < 0) {
        _min = 0;
    }
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