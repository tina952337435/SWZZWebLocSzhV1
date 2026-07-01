var myData = [];
var WaterLayerGraphicLayer;
var GqLayerGraphicLayer;
//获取当前时间
function getNowFormatDate() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var Hour = date.getHours();       // 获取当前小时数(0-23)
    var Minute = date.getMinutes();     // 获取当前分钟数(0-59)
    var Second = date.getSeconds();     // 获取当前秒数(0-59)
    var show_day = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
    var day = date.getDay();
    if (Hour < 10) {
        Hour = "0" + Hour;
    }
    if (Minute < 10) {
        Minute = "0" + Minute;
    }
    if (Second < 10) {
        Second = "0" + Second;
    }
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = '<div><p style="width: 42px;height: 18px;font-size: 14px;font-family: Microsoft YaHei, Microsoft YaHei-Regular;font-weight: 400;text-align: LEFT;color: #ffffff;">' + show_day[day] + '</p><p style="width: 120px;height: 18px;font-size: 14px;font-family: Microsoft YaHei, Microsoft YaHei-Regular;font-weight: 400;text-align: LEFT;color: #ffffff;">' + year + '年' + month + '月' + strDate + '日</p></div>';
    var HMS = Hour + ':' + Minute + ':' + Second;
    var temp_time = year + '-' + month + '-' + strDate + ' ' + HMS;
    //$('.nowTime li:nth-child(1)').html(HMS);
    //$('.nowTime li:nth-child(2)').html(currentdate);
    //$('.topRec_List li div:nth-child(3)').html(temp_time);
    var strHtml = '<img src="./img/jinru.png" style="cursor:pointer;position: absolute;left: 65px;top: -11px;" onclick="javascript:window.location.href=\'/index.html?Menu=NO07\'" title="点击进入系统后台">';
    strHtml += '<span>' + HMS + '</span>' + show_day[day] + '<i>' + year + '.' + month + '.' + strDate + '</i>';
    $(".you").html(strHtml);
    setTimeout(getNowFormatDate, 1000);//每隔1秒重新调用一次该函数
}
//加载数据
function search() {
    getNowFormatDate();
    getWeater();
    loadYJ();
    loadFangList();
}


//方案列表
loadFangList = function () {
    //var strWhere = {DD_STATUS:"1"};
    //strWhere["ETIME"] = new Date().format("yyyy-MM-dd HH:mm:ss")
    //strWhere["STIME"] = addDateMonth(strWhere["ETIME"], -30) + " 00:00:00";
    //GetJosns("MODE_DD_SOLUTIONSel", strWhere, "MODE_DD_SOLUTIONSel");
	app.post("SWZZ_MODE_DD_SOLUTION/findByDD_IDandDD_status",{"dd_STATUS": "1"},(data)=>{
		JosnSel(data,"MODE_DD_SOLUTIONSel")
	})
}



onLoadData = function () {
    //GetJosns("MODE_ES_ZHANDIANSel", { }, "MODE_ES_ZHANDIANSel");
	// app.post("SWZZ_MODE_ES_ZHANDIAN/findResult",{},(data)=>{
	// 	JosnSel(data,"MODE_ES_ZHANDIANSel")
	// })
    app.post("SWZZ_MODE_ES_SLTONGJI/findResult",{pattem: "134"},(data)=>{
		JosnSel(data,"MODE_ES_ZHANDIANSel")
	});
    loadSW();
    loadTONGJI();
    loadSL();
    loadProgress();
    
}




//左边日雨量
function loadYL() {
    var DD_ID = $.data(myData, "DD_ID");
    var s_where = {
        solutionid: DD_ID,
        "startdate": $.data(myData, "STIME"),
        "enddate": $.data(myData, "ETIME"),
        "datatype": "0",
        "dayhour": "HOUR"
    };
    //GetJosns("FH_GetBind", s_where, "YLSel");
	app.post("SWZZ_MODE_ES_ZHANDIAN/FH_GetBindJY",s_where,(data)=>{
		JosnSel(data,"YLSel")
	})
}

//获取雨量时间
function getYLTM(day) {
    var stime = "", eitme = "";
    if (day == 0) {
        stime = new Date().format("yyyy-MM-dd 00:00:00");
        etime = new Date().format("yyyy-MM-dd HH:mm:ss");
    } else {
        var hour = Number(new Date().format("H"));
        etime = new Date().format("yyyy-MM-dd 08:00:00");
        if (hour < 8) {
            etime = addDayDate(etime, -1) + " 08:00:00";
        }
        stime = addDayDate(etime, -day) + " 08:00:00";
    }
    $.data(myData, "YLSTIME", stime);
    $.data(myData, "YLETIME", etime);
}

//左边水位监测
function loadSW() {
    var DD_ID = $.data(myData, "DD_ID");
    var strWhere = {
        "solutionid": DD_ID,
        "data_TYPE": "1"
    };
    //GetJosns("WJ_MODELSINGRESULT", strWhere, "SWSel");
	app.post("SWZZ_MODE_BDMS_PREDICT/WJ_MODELSINGRESULT",strWhere,(data)=>{
		JosnSel(data,"SWSel")
	})
}

function loadTONGJI() {
    var strParam = { "pattem": "1" };
    //GetJosns("MODE_ES_SLTONGJISel", strParam, "MODE_ES_SLTONGJISel");
	app.post("SWZZ_MODE_ES_SLTONGJI/findResult",strParam,(data)=>{
		JosnSel(data,"MODE_ES_SLTONGJISel")
	})
}

function BaseZhan() {
    var strParam = { "pattem": "1" };
    //GetJosns("MODE_ES_JISUANZHANSel", strParam, "MODE_ES_JISUANZHANSel");
	app.post("SWZZ_MODE_ES_JISUANZHAN/findResult",strParam,(data)=>{
		JosnSel(data,"MODE_ES_JISUANZHANSel")
	})
}

loadZhanList = function (data) {
    var tjData = $.data(myData, "TONGJIDATA");
    var tjDataTemp = tjData.filter(function (e) {
        return e.id == "a9bc40bb55680cec";//预报水位站
    });
    if (tjDataTemp.length > 0) {
        var STCDS = tjDataTemp[0].stcd;
        var dataTemp = data.filter(function (e) {
            return STCDS.indexOf(e.stcd)>-1;
        });
        var strMsg = "";
        if (dataTemp.length > 0) {
            for (num = 0; num < dataTemp.length; num++) {
                var item = dataTemp[num];
                strMsg += ' <li id="' + item["stcd"] + '">' + item["name"] + '</li>';
                if (num == 0) {
                    $("#SWDBZLIST").parent().find("label").html(item["name"]);
                    $.data(myData, "STCD", item["stcd"]);
                }
            }
        }
        $("#SWDBZLIST").html(strMsg);
        $("#SWDBZLIST li").click(function (res) {
            $("#SWDBZLIST").css("display", "none");
            var html = $(this).html();
            $.data(myData, "STCD", res.currentTarget.id);
            $("#SWDBZLIST").parent().find("label").html(html);
            $.data(myData, "SWTYPE", "SW");
            GetDBZWater();
        });
    }

    tjDataTemp = tjData.filter(function (e) {
        return e.id == "3907b92c8c69ee7a";//预报潮位站
    });
    if (tjDataTemp.length > 0) {
        var STCDS = tjDataTemp[0].stcd;
        var dataTemp = data.filter(function (e) {
            return STCDS.indexOf(e.stcd) > -1;
        });
        var strMsg = "";
        if (dataTemp.length > 0) {
            for (num = 0; num < dataTemp.length; num++) {
                var item = dataTemp[num];
                strMsg += ' <li id="' + item["stcd"] + '">' + item["name"] + '</li>';
                if (num==0) {
                    $("#CWDBZLIST").parent().find("label").html(item["name"]);
                    $.data(myData, "CWSTCD", item["stcd"]);
                }
            }
        }
        $("#CWDBZLIST").html(strMsg);
        $("#CWDBZLIST li").click(function (res) {
            $("#CWDBZLIST").css("display", "none");
            var html = $(this).html();
            $.data(myData, "CWSTCD", res.currentTarget.id);
            $("#CWDBZLIST").parent().find("label").html(html);
            $.data(myData, "SWTYPE", "CW");
            GetDBZWater();
        });
    }
    $.data(myData, "SWTYPE","all");
    GetDBZWater();
}



//预测水位过程
function GetDBZWater() {
    var strWhere = {};
    strWhere["startdate"] = $.data(myData, "STIME");
    strWhere["enddate"] = $.data(myData, "ETIME");
    strWhere["type"] = "1";
    strWhere["stcd"] = $.data(myData, "STCD") + ","+$.data(myData, "CWSTCD");
    strWhere["plan_n"] = $.data(myData, "DD_ID");
    //GetJosns("YBSHUIWEI", strWhere, "YBSHUIWEI");
	app.post("SWZZ_MODE_ES_ZHANDIANDATA/YBSHUIWEI",strWhere,(data)=>{
		JosnSel(data,"YBSHUIWEI")
	})
}

//防汛应急响应、防台应急响应
function loadYJ() {
    //GetJosns("MODE_PRO_WARNINGINFONewSel", {}, "SelYJ");
	app.post("SWZZ_MODE_PRO_WarningInfo/findResult",{},(data)=>{
		JosnSel(data,"SelYJ")
	})
}
//进出水量
function loadSL() {
    //水量分布
    var s_where = { dd_id: $.data(myData, "DD_ID") };
    //GetJosns("AREASL", s_where, "SLSel");
	app.post("SWZZ_MODE_BDMS_PREDICT/AREASL",s_where,(data)=>{
		JosnSel(data,"SLSel")
	})
}

function SetSDEGC(time) {
    modeGetResultAllModelByTime(time, $.data(myData, "taskID"));
}
function loadYBList(time) {
    var s_where = { "solutionid": $.data(myData, "DD_ID"), "typeID": "1", tm: time };
    //GetJosns("YBList", s_where, "SelAll");
	app.post("SWZZ_MODE_BDMS_PREDICT/YBList",s_where,(data)=>{
		JosnSel(data,"SelAll")
	})
}

//查询接口返回结果
function JosnSel(data, typeID) {
    if (typeID == "MODE_DD_SOLUTIONSel") {
        if (data.data.length > 0) {
			// data.data.sort((a,b)=>{
			// 	return new Date(b.dd_TM).getTime() - new Date(a.dd_TM).getTime();
			// })
            $.data(myData, "DD_SOLUTIONList", data.data);
            var item = data.data[0];
            var strMsg = "";
            for (num = 0; num < data.data.length; num++) {
                var item = data.data[num];
                strMsg += ' <li id="' + item["dd_ID"] + '">' + item["dd_NAME"] + '</li>';
                if (num == 0) {
                    //$("#FANGANLIST").parent().find("label").html(item["DD_NAME"]);
                    var STIME = new Date(new Date(item.dd_TM)).format("yyyy-MM-dd HH:mm:ss");
                    var ETIME = new Date(new Date(item.dd_CHECKBY)).format("yyyy-MM-dd HH:mm:ss");
                    $.data(myData, "DD_ID", item.dd_ID);
                    $.data(myData, "taskID", item.dd_FOR);
                    $.data(myData, "STIME", STIME);
                    $.data(myData, "ETIME", ETIME);
                    $("#tmCenter").html(item.dd_NAME);
                }
            }
            onLoadData();
        }
        $("#FANGANLIST").html(strMsg);
        $("#FANGANLIST li").click(function (res) {
            $("#FANGANLIST").css("display", "none");
            var html = $(this).html();
            $.data(myData, "DD_ID", res.currentTarget.id);
            var dataList = $.data(myData, "DD_SOLUTIONList");
            var dataListTemp = dataList.filter(function (e) {
                return e.dd_ID == $.data(myData, "DD_ID");
            });
            if (dataListTemp.length > 0) {
                var item = dataListTemp[0];
                var STIME = new Date(new Date(item.dd_TM)).format("yyyy-MM-dd HH:mm:ss");
                var ETIME = new Date(new Date(item.dd_CHECKBY)).format("yyyy-MM-dd HH:mm:ss");
                $.data(myData, "STIME", STIME);
                $.data(myData, "ETIME", ETIME);
                $.data(myData, "taskID", item.dd_FOR);
                $("#tmCenter").html(item.dd_NAME);
            }
            //$("#FANGANLIST").parent().find("label").html(html);
            onLoadData();
        });
        
    }
    else if (typeID == "MODE_ES_ZHANDIANSel") {
        $.data(myData, "ES_ZHANDIAN", data.data);
        loadYL();
    }
    else if (typeID == "YLSel") {
        var dataResult = data.data;
		console.log(dataResult)
        ylHtml(dataResult, "echartYL");
    }
    else if (typeID == "SWSel") {
        if (data != undefined) {
            $.data(myData, "SWDATA", data.data);
            var chartTM = [], chartData = [];
            for (var num = 0; num < data.data.length; num++) {
                var STNM = data.data[num]["stnm"].trim();
                chartTM.push(STNM);
                if (STNM == "三角渡" || STNM == "泖港") {
                    continue;
                }
                //五分钟数据出力为小时
                var DURW = data.data[num].durw;
                chartData.push(DURW);
            }
            chartAreaCJCC('echart2', chartTM, chartData, "时长(H)");

            swHtml(data.data);
        }
    }
    else if (typeID == "MODE_ES_SLTONGJISel") {
        $.data(myData, "TONGJIDATA", data.data);
        BaseZhan();
    }
    else if (typeID == "MODE_ES_JISUANZHANSel") {
        loadZhanList(data.data);
    }
    else if (typeID == "YBSHUIWEI") {
        //预测水位
        var strJson = data.data.filter(function (e) {
            return e.STCD == $.data(myData, "STCD");
        });
        var strNote = [{
            "name": "时间",
            "codename": "TM",
            "tableV": "1",
            "isShow": true,
            "width": "20%"
        },
        {
            "name": "水位",
            "codename": "YBZ",
            "tableV": "1",
            "isShow": true,
            "width": "20%"
        },
        {
            "name": "警戒",
            "codename": "WRZ",
            "tableV": "1",
            "isShow": true,
            "width": "20%"
        },
        {
            "name": "保证",
            "codename": "GRZ",
            "tableV": "1",
            "isShow": true,
            "width": "20%"
        },
        ];
        var swType = $.data(myData, "SWTYPE");
        if (swType == "all") {
            var LineColor = ["orange", "red"];
            chartSW("tableGCSW", strJson, strNote, LineColor, "水位");

            strJson = data.data.filter(function (e) {
                return e.STCD == $.data(myData, "CWSTCD");
            });
            chartSW("echartSL", strJson, strNote, LineColor, "水位");
        }
        else if (swType == "SW") {
            var LineColor = ["orange", "red"];
            chartSW("tableGCSW", strJson, strNote, LineColor, "水位");
        } else if (swType == "CW") {
            var LineColor = ["orange", "red"];
            strJson = data.data.filter(function (e) {
                return e.STCD == $.data(myData, "CWSTCD");
            });
            chartSW("echartSL", strJson, strNote, LineColor, "水位");
        }
    }
    else if (typeID == "SLSel") {
        slHtml(data.data);
    }
    else if (typeID == "SelYJ") {
        yjHtml(data.data);
    }
    else if (typeID == "GetResultAllModelByTime") {
        if(data.info.success){            
            $.data(myData, "AllModelByTimeData", data.results);
            queryComplete();
        }
        else{
            console.error(data.info.msg);
        }
    }
    else if (typeID == "SelAll") {
        $.data(myData, "SWDATA", data.data);
        addSQMarker();
    }
}
//日雨量柱状图
function ylHtml(data, chartName) {
    var arrZhan = $.data(myData, "ES_ZHANDIAN");
    var arr = data;
    var chartTM = [], chartData = [];
    var totalDRP = 0;
    if (arr != null && arr != undefined) {
        for (var num = 0; num < arrZhan.length; num++) {
            var totalJY = 0;
            for (var h = 0; h < arr.length; h++) {
                totalJY += parseFloat(arr[h][arrZhan[num]["id"]]);
            }
            totalDRP += totalJY;
            chartTM.push(arrZhan[num]["title"]);
            chartData.push(totalJY);
        }
        chartAreaYL(chartName, chartTM, chartData, totalDRP);
    }

    //var chartTM = [], chartData = [];
    //var totalDRP = 0;
    //for (var num = 0; num < data.length; num++) {
    //    var DRP = data[num].DRP != undefined ? Number(data[num].DRP) : 0;
    //    chartTM.push(data[num].STNM);
    //    chartData.push(DRP.toFixed(1));
    //    totalDRP += DRP;
    //}
    //chartTM.push("平均");
    //chartData.push(Number((totalDRP / data.length).toFixed(1)));
    //chartAreaYL(chartName, chartTM, chartData, totalDRP);
}
//水位监测表格
var swFlag = true;
function swHtml(data) {
    var strHtml = '<table class="m-table" cellpadding="0" cellspacing="0">';
    strHtml += '<thead><tr>';
    strHtml += '<th style="width: 25%;">站名</th>';
    strHtml += '<th style="width: 25%;">最高水位</th>';
    strHtml += '<th style="width: 25%;">出现时间</th>';
    strHtml += '<th style="width: 25%;">历史最高</th>';
    strHtml += ' </tr></thead>';
    strHtml += '<tbody>';
    for (var num = 0; num < data.length; num++) {
        var item = data[num];
        var WRZ = item.wrz != undefined && item.wrz!=0 ? Number(item.wrz).toFixed(2) : "—";
        var GRZ = item.grz != undefined && item.grz != 0? Number(item.grz).toFixed(2) : "—";
        var UPZ = item.maxz != undefined ? Number(item.maxz).toFixed(2) : "—";
        var TM = "";
        if (item.tm != undefined) {
            TM = new Date(convertToDate(item.tm)).format("HH:mm");
        }
        var cls = "";
        if (WRZ != "-" && Number(UPZ) >= Number(WRZ) && Number(GRZ) != 0) {
            cls = "tableWRZ";
        }
        if (GRZ != "-" && Number(UPZ) >= Number(GRZ) && Number(GRZ)!=0) {
            cls = "tableGRZ";
        }
        var TM = "-";
        if (item.maxtm != undefined) {
            TM = new Date(convertToDate(item.maxtm)).format("M-d HH:mm");
        }
        var lsMax ='-';
        if(item.xzdz != undefined &&item.xzdz!="null"&&item.xzdz!=null){
            lsMax=Number(item.xzdz).toFixed(2);
        }
        // console.error('xzdz', item.xzdz);
        strHtml += '<tr>';
        strHtml += '<td class="' + cls + '">' + item.stnm + '</td>';
        strHtml += '<td class="' + cls + '">' + UPZ + '</td>';
        strHtml += '<td class="' + cls + '">' + TM + '</td>';
        strHtml += '<td class="' + cls + '">' + lsMax + '</td>';
        strHtml += '</tr > ';
    }
    strHtml += '</tbody>';
    strHtml += '</table>';
    $("#tableSW").html(strHtml);
    if (swFlag) {
        custom1 = new scrollbot(".gallery-top", 10).setStyle({
            //"background": "#00ffff",
			"background": "#02D1D7",
            "z-index": "2",
            "border-radius": "50%",
            "height": "10px"
        }, {
                "background": "rgba(0,0,0,0)"
            });
        //console.error(custom1);
        var psuedo = document.createElement("div");
        psuedo.style.cssText = "height:100%;width:2px;left:4px;background:#314A66;position:absolute;z-index:1";
        custom1.scrollBarHolder.appendChild(psuedo);
        document.onreadystatechange = function () {
            custom1.refresh();
        }
    }
    swFlag = false;
}
//防汛应急响应、防台应急响应
function yjHtml(data) {
    var count = 0;
    data=sortObjectArray(data, ['startdate'], 'desc');
    //防汛
    var dataTemp = data.filter(function (e) {
        return e.seasontype == "防汛防台" && e.enddate== undefined;
    });
    var ImgUrl = "./img/NoResponse.png";
    if (dataTemp.length > 0) {
        // console.error('防汛防台',dataTemp);
        var item = dataTemp[dataTemp.length-1];
        if (item.seasonlevel == "Ⅰ") {
            ImgUrl = "./img/flood_red.png";
        } else if (item.seasonlevel == "Ⅱ") {
            ImgUrl = "./img/flood_orange.png";
        } else if (item.seasonlevel == "Ⅲ") {
            ImgUrl = "./img/flood_yellow.png";
        } else if (item.seasonlevel == "Ⅳ") {
            ImgUrl = "./img/flood_blue.png";
        } else {
            count++;
        }
        var strHtml = '<img src="' + ImgUrl + '" style="cursor:pointer;"/>';
        $(".totalbkind_ul li:nth-child(3)").html(strHtml);
    }


    ImgUrl = "./img/NoResponse.png";
    //防台
    dataTemp = data.filter(function (e) {
        return e.seasontype == "台风预警" && e.enddate == undefined;
    });
    if (dataTemp.length > 0) {
        // console.error('台风预警',dataTemp);
        var item = dataTemp[dataTemp.length-1];
        var SEASONLEVEL = item.seasonlevel.trim();
        //console.error(item);
        if (SEASONLEVEL == "红色预警") {
            ImgUrl = "./img/typhoon_red.png";
        } else if (SEASONLEVEL == "橙色预警") {
            ImgUrl = "./img/typhoon_orange.png";
        } else if (SEASONLEVEL == "黄色预警") {
            ImgUrl = "./img/typhoon_yellow.png";
        } else if (SEASONLEVEL == "蓝色预警") {
            ImgUrl = "./img/typhoon_blue.png";
        } else {
            count++;
        }
    }
    strHtml = '<img src="' + ImgUrl + '" style="cursor:pointer;"/>';
    $(".totalbkind_ul li:nth-child(2)").html(strHtml);

    ImgUrl = "./img/NoResponse.png";
    //暴雨
    dataTemp = data.filter(function (e) {
        return e.seasontype == "暴雨预警" && e.enddate == undefined;
    });
    if (dataTemp.length > 0) {
        // console.error('暴雨预警',dataTemp);
        var item = dataTemp[dataTemp.length-1];
        var SEASONLEVEL = item.seasonlevel.trim();
        if (SEASONLEVEL == "红色预警") {
            ImgUrl = "./img/rainstorm_red.png";
        } else if (SEASONLEVEL == "橙色预警") {
            ImgUrl = "./img/rainstorm_orange.png";
        } else if (SEASONLEVEL == "黄色预警") {
            ImgUrl = "./img/rainstorm_yellow.png";
        } else if (SEASONLEVEL == "蓝色预警") {
            ImgUrl = "./img/rainstorm_blue.png";
        } else {
            count++;
        }
    }
    strHtml = '<img src="' + ImgUrl + '" style="cursor:pointer;"/>';
    $(".totalbkind_ul li:nth-child(1)").html(strHtml);
    if (count >= 3) {
        $(".totalbkind_ul").hide();
        $("#warningInfo").show();
    } else {
        $(".totalbkind_ul").show();
        $("#warningInfo").hide();
    }
}
function hrefNew(ID) {
    var url = "/html/Fhxsinformation.html?id=" + ID;
    window.open(url);
}
function slHtml(data) {
    var html = '';
    var chartTM = [],chartData=[];
    for (var num = 0; num < data.length; num++) {
        var h2Css = "u-blue";
        
        if (Number(data[num].rsl) > Number(data[num].csl))//进为绿色，出为红色
        {
            chartTM.push(data[num].stnm+"正");
            h2Css = "u-green";
        } else {
            chartTM.push(data[num].stnm + "负");
        }
        var JSL = Math.abs(Number(data[num].rsl) - Number(data[num].csl)).toFixed(1);
        html += '<div class="item display_flex align-items_center" style="width:100%;">';
        html += '<h2   style="width:40%;">' + data[num].stnm + '</h2 >';
        html += '<div class="' + h2Css + '" style="width:30%;text-align:center;color:white;height: 1.875rem;line-height: 1.875rem;">' + JSL + '</div>';
        //html += '<div class="u-green" style="width:30%;text-align:center;color:white;height: 1.875rem;line-height: 1.875rem;">' + data[num].CSL + '</div>';
        html += '</div>';

        
        chartData.push(JSL);
    }
    //$("#divDiaodu").html(html);

    chartAreaSLZF("divDiaodu", chartTM, chartData, 0);
    //custom1 = new scrollbot(".custom-scroll-1", 10).setStyle({
    //    "background": "#02D1D7",
    //    "z-index": "2",
    //    "border-radius": "50%",
    //    "height": "10px"
    //}, {
    //        "background": "rgba(0,0,0,0)"
    //    });
    //var psuedo = document.createElement("div");
    //psuedo.style.cssText = "height:100%;width:2px;left:4px;background:#314A66;position:absolute;z-index:1;padding-right:0px;";
    //custom1.scrollBarHolder.appendChild(psuedo);
    //document.onreadystatechange = function () {
    //    custom1.refresh();
    //}
}


//查询结果换颜色
//查询结果换颜色
function queryComplete() {
    if ($.data(myData, "jsonfeatures") == undefined || $.data(myData, "jsonfeatures") == null || $.data(myData, "jsonfeatures") == "") {
        $.get(
            "../../Common/SHSWZZModeRiver2000.json",//json路径
            function (data, status) {
                if (status === "success") {
                    var features = data.features;
                    $.data(myData, "jsonfeatures", features);
                    queryCompleteDraw();
                }
            },
            "json"
        );
    } else {
        queryCompleteDraw();
    }
}
function queryCompleteDraw() {
    if (centerLineGraphicLayer != null) {
        centerLineGraphicLayer.clear();
    }

    var colors = ["#0000FF", "#FFA500", "#FF0000",];
    var colors2 = ["#0000FF", "#FFA500", "#FF0000"];
    var features = $.data(myData, "jsonfeatures");
    var result = $.data(myData, "AllModelByTimeData");
    //console.error("画河道之前："+new Date().format("yyyy-MM-dd HH:mm:ss"));
    require([
        "esri/graphic",
        "esri/symbols/SimpleFillSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/Color",
        "esri/geometry/Polygon"
    ], function (Graphic, SimpleFillSymbol, SimpleLineSymbol, Color, Polygon) {
        //console.error(layer_hw.graphics.length);
        var dataLJ = [];
        //读取json文件
        //console.error(features);
        features.forEach(function (feature) {
            var allrings = feature.geometry.coordinates;
            var polygon = new Polygon(allrings);
            var properties = feature.properties;
            var hd_id = properties.ID;
            var dm = parseInt(properties["起始断面序"]);
            // console.error(hd_id);
            var arr = result[hd_id].sections;
            var wrz = properties.WRZ;
            var grz = properties.GRZ;
            if (arr.length > 0) {
                var ZVALUE = Number(arr[dm].Z.toFixed(2));
                arr[dm].HDNAME=properties['名称'];
                arr[dm].ID=properties['ID'];
                arr[dm].DMNUM=arr[dm].index;
                // console.error(ZVALUE);
                var color = 0;
                if (wrz != undefined) {
                    //超警
                    if (ZVALUE >= wrz) {
                        color = 1;
                    }
                }
                if (grz != undefined) {
                    //超警
                    if (ZVALUE >= grz) {
                        color = 2;
                    }
                }
                var colorStr = colors[color];
                var fillColorStr = colors2[color];
                var fs = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                    new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
                        new Color(colorStr), 2), new Color(fillColorStr)
                );
                //var g3 = new Graphic(gra.geometry, fs);
                //g3.attributes = arr[dm];
                //ModerRiverLayerGraphicLayer.add(g3);

                var g3 = new Graphic(polygon, fs);
                g3.attributes = arr[dm];
                ModerRiverLayerGraphicLayer.add(g3);
                //console.error(g3);
            }
        }, this);

        var dataHtml = $(".onlyliHover").html();
        if (dataHtml == "流向") {
            readJosn();//读取json文件
        } else {
            //清除流动样式
            removeStyle();
        }
        //console.error("画河道之后：" + new Date().format("yyyy-MM-dd HH:mm:ss"));
    });
}

//清理现有图层
var labels = new Array();
var layers = new Array();
var info;
var _globallevel = 5;
function _destroy() {
    for (var j = 0; j < layers.length; j++) {
        layers[j].clear();
    }
    if ("undefined" != typeof labels && labels != null) {
        for (var i = 0; i < labels.length; i++) {
            try {
                if (labels[i]._class == "level_zc") {
                    labels[i].clear();
                }
            } catch (ex) { }
        }
    }
    //labels = new Array();

    if (this.destroy != null) {
        if (typeof (destroy) == "function") {
            destroy();
        }
    }
    if (info != null) {
        info.clear();
    }
}

//水情：地图标注
function addSQMarker() {
    var data = $.data(myData, "SWDATA");
    var obj = data;
    if (WaterLayerGraphicLayer != null) {
        WaterLayerGraphicLayer.clear();
        WaterLayerGraphicLayer.setVisibility(true);
    }
    // console.error('addSQMarker',data);
    if (obj == null)
        return;
    require(["esri/geometry/Point",
        "esri/graphic",
        "myJs/MapTextPagehome",
        "esri/symbols/PictureMarkerSymbol",
        "esri/InfoTemplate",
        "esri/dijit/InfoWindow",
        "esri/layers/GraphicsLayer",
        "esri/geometry/webMercatorUtils", "esri/symbols/TextSymbol", "dojo/domReady!"
    ], function (Point, Graphic, MapTextPagehome, PictureMarkerSymbol, InfoTemplate, InfoWindow, GraphicsLayer, webMercatorUtils,
        TextSymbol) {
            var breakSymbol;
            _destroy();
            for (var i = 0; i < obj.length; i++) {
                var item = obj[i];
                if (item.lgtd == undefined && item.lttd == undefined) {
                    continue;
                }
                if (item.stnm == "夏字圩" || item.stnm == "河祝") {
                    continue;
                }
                var cls = "level_zc";
                breakSymbol = new PictureMarkerSymbol("./img/icon_51.png", 18, 37);
                if (item.tm != null && item.tm != undefined) {
                    if (item.wrz != undefined &&item.wrz>0 ) {
                        if (Number(item.data) >= Number(item.wrz) ) {
                            breakSymbol = new PictureMarkerSymbol("./img/icon_53.png", 22, 45);
                            cls = " level_wrz";
                        }
                    }

                    if (item.grz != undefined  && item.grz > 0 ) {
                        if (Number(item.data) >= Number(item.grz)) {
                            breakSymbol = new PictureMarkerSymbol("./img/icon_54.png", 22, 45);
                            cls = " level_grz";
                        }
                    }
                } else {
                    breakSymbol = new PictureMarkerSymbol("./img/icon_58.png", 22, 45);
                }



                var point = new Point({
                    "x": item.lgtd,
                    "y": item.lttd,
                    "spatialReference": {
                        "wkid": 4326
                    }
                });

                var textStr = "";

                if (item.stnm != undefined) {
                    textStr += item.stnm + "@";
                }
                if (item.data != undefined) {
                    item.data = Number(item.data).toFixed(2);
                    if (item.data != null) {
                        textStr += "" + item.data;
                    }
                    item.Z = item.data;
                }
                if (item.data != undefined) {
                    item.UPZS = Number(item.upz).toFixed(2);
                }
                if (item.wrz != undefined) {
                    item.WRZ = Number(item.wrz).toFixed(2);
                }


                var tm = item.tm;
                if (tm == undefined) {
                    tm = "—";
                    item.TEMP = tm;
                } else {
                    //item.TEMP = formatDate(convertToDate(tm)).format('yyyy/MM/dd HH:mm');
                }

                //textStr += "<br/>时间：" + tm;
                var _align = "bottom";
                if ("63301200,70103600,70103200,63301600".lastIndexOf(item.stcd) > -1) {
                    _align = "top";
                }
                if ("63306300".lastIndexOf(item.stcd) > -1) {
                    _align = "left";
                }
                if (textStr == "") {
                    textStr = "—";
                }
                if ("70103200,70103640,70103600".indexOf(item.stcd) > -1) {
                    breakSymbol = new PictureMarkerSymbol("./img/icon_26.png", 30, 30);
                }
                var label = new MapTextPagehome(map, point, item, textStr, _globallevel, _align, cls, 12);
                labels.push(label);
                var graphic = new Graphic(point, breakSymbol, item, null);
                WaterLayerGraphicLayer.add(graphic);
            }
        });
}
//工情：地图标注
function addGQMarker(data) {
    for (var num = 0; num < data.length; num++) {
        var cls = "";
        var item = data[num];
        var LGTD = data[num].LGTD, LTTD = data[num].LTTD;
        var omzs = Number(data[num].OMCNUM);
        var IINum = 0;
        var _ALLQ = 0;
        var tempMsg = "";
        var NumCountKQ = 0;
        var OMCN = item.OMCN;
        var tempFlag = false;
        if (omzs > 0) {
            for (index = 1; index <= omzs; index++) {
                var tempindex = "";
                var tempTM = new Date(new Date().format("yyyy/MM/dd 00:00:00"));
                var temAgg = item.ST_GATE_R.filter(function (e) {
                    return e.EQPTP == "泵站流量" && e.EXKEY == index && Number(e.GTQ) > 0.002 && new Date(convertToDate(e.TM)) >= tempTM;
                });
                if (temAgg.length > 0) {
                    OMCN = 1;
                    tempFlag = true;
                    NumCountKQ++;
                    if (temAgg[0].GTQ != undefined && temAgg[0].GTQ != null) {
                        _ALLQ += Number(temAgg[0].GTQ);
                    }
                    tempindex = '<span class="gqGreen" id="' + item.STCD + '_' + IINum + "' alt='" + (IINum + 1) + '#泵">&nbsp;&nbsp;</span>';
                    //tempindex = "<img id='" + item.STCD + "_" + IINum + "' alt='" + (IINum + 1) + "#泵' src='/arcgis_js_api/myJs/images/sz/beng-green.gif' class='IMGGQ' onclick='ImgClick(this)' style='cursor:pointer;  margin-top:0px;'/>&nbsp;";
                }
                else {
                    OMCN = 0;
                    tempindex = '<span class="gqRed" id="' + item.STCD + '_' + IINum + "' alt='" + (IINum + 1) + '#泵">&nbsp;&nbsp;</span>';
                    //tempindex = "<img id='" + item.STCD + "_" + IINum + "' alt='" + (IINum + 1) + "#泵' src='/arcgis_js_api/myJs/images/sz/beng-red.png' class='IMGGQ' onclick='ImgClick(this)' style='cursor:pointer; margin-top:0px;'/>&nbsp;";
                }
                tempMsg += tempindex;
            }
            item.SHIKUANG = "泵【" + NumCountKQ + "/" + item.OMCNUM + "】";
        }
        var gtNumCountKQ = 0;
        omzs = Number(item.GTOPNUM);
        if (omzs > 0) {
            for (index = 1; index <= omzs; index++) {
                var tempindex = "";
                var tempTM = new Date(new Date("2020-01-01 00:00:00").format("yyyy/MM/dd 00:00:00"));
                var temAgg = item.ST_GATE_R.filter(function (e) {
                    return e.EQPTP == "闸坝开度" && e.EXKEY == index && Number(e.GTQ) > 0.002 && new Date(convertToDate(e.TM)) > tempTM;
                });
                if (temAgg.length > 0) {
                    OMCN = 1;
                    tempFlag = true;
                    item.KD = Number(temAgg[0].GTQ).toFixed(2);
                    gtNumCountKQ++;
                    tempindex = '<span class="Grentsquare" id="' + item.STCD + '_' + IINum + "' alt='" + (IINum + 1) + '#闸">&nbsp;&nbsp;</span>';
                    //tempindex = "<img id='" + item.STCD + "_" + IINum + "' alt='" + (IINum + 1) + "#闸' src='/arcgis_js_api/myJs/images/sz/icon_gate_run.gif' class='IMGGQ' onclick='ImgClick(this)' style='cursor:pointer;  margin-top:0px;'/>&nbsp;";
                    pValue = "<div style='width:30px;float:left;'>" + Number(temAgg[0].GTQ).toFixed(2) + "</div>";
                }
                else {
                    OMCN = 0;
                    tempindex = '<span class="HUIsquare" id="' + item.STCD + '_' + IINum + "' alt='" + (IINum + 1) + '#闸">&nbsp;&nbsp;</span>';
                    //tempindex = "<img id='" + item.STCD + "_" + IINum + "' alt='" + (IINum + 1) + "#闸' src='/arcgis_js_api/myJs/images/sz/icon_gate.gif' class='IMGGQ' onclick='ImgClick(this)' style='cursor:pointer; margin-top:0px;'/>&nbsp;";
                    pValue = "<div style='width:30px;float:left;'>&nbsp;</div>";
                    item.KD = "—";

                }
                tempMsg += tempindex;
            }
            if (item.KD != "—") {
                if (item.SHIKUANG != undefined) {
                    item.SHIKUANG += "，闸【" + "(" + item.KD + ")" + gtNumCountKQ + "/" + omzs + "】";
                } else {
                    item.SHIKUANG = "";
                    item.SHIKUANG += "闸【" + "(" + item.KD + ")" + gtNumCountKQ + "/" + omzs + "】";
                }
            } else {
                if (item.SHIKUANG != undefined) {
                    item.SHIKUANG += "，闸【" + gtNumCountKQ + "/" + omzs + "】";
                } else {
                    item.SHIKUANG = "";
                    item.SHIKUANG += "闸【" + gtNumCountKQ + "/" + omzs + "】";
                }
            }
        }
        item.OMCN = OMCN;
        var breakSymbol = "";
        if (item.OMCN == 1) {
            if (item.STNM.indexOf("泵站") > -1) {
                breakSymbol = "./img/gqyxBeng.png";
            } else {
                breakSymbol = "./img/gqyx.png";
            }
        } else if (item.OMCN == 0) {
            if (item.STNM.indexOf("泵站") > -1) {
                breakSymbol = "./img/bzgb.png";
            } else {
                breakSymbol = "./img/gqgz.png";
            }
        } else {
            if (item.STNM.indexOf("泵站") > -1) {
                breakSymbol = "./img/gqqcBeng.png";
            } else {
                breakSymbol = "./img/gqqc.png";
            }
        }
        var angleContent = '<img src="' + breakSymbol + '" width="48" height="48">';
        var clsIcon = "";

        var labelOffset = new AMap.Pixel(0, 0);
        var markerOffset = new AMap.Pixel(0, 0);
        //if (item.STNM.indexOf("泵站") > -1) {
        //    markerOffset = new AMap.Pixel(20, 0);
        //}
        var lnglats = new AMap.LngLat(item.LGTD, item.LTTD);
        // 创建一个 Icon
        var startIcon = new AMap.Icon({
            // 图标尺寸
            size: new AMap.Size(30, 30),
            // 图标的取图地址
            image: breakSymbol,
            // 图标所用图片大小
            imageSize: new AMap.Size(30, 30),
            // 图标取图偏移量
            imageOffset: labelOffset
        });
        var marker = new AMap.Marker({
            id: item.STCD + "GQ",
            stnm: item.STNM,
            tempMsg: tempMsg,
            item: item,
            position: lnglats,
            offset: markerOffset,
            anchor: "center", // 设置锚点方位
            icon: startIcon
        });
        map.add(marker);

        //工情站点点开弹窗事件
        AMap.event.addListener(marker, 'click', function (e) {
            var value = e.target.w;
            //console.error(value);
            var stcd = value.id.replaceAll("GQ", "");
            var stnm = value.stnm;
            danZhanSQ(stcd, stnm, "运行状况");
        });
        //工情站点悬浮弹窗事件
        marker.on('mouseout', markerCloseClick);
        marker.on('mousemove', markerClick);
    }
}
//日雨量tab切换
function OnClickTitle(parentObj, objID, ParentName) {
    $("." + parentObj + " .swiper-slide").removeClass("swiper-slide-thumb-active");
    $("#" + objID).addClass("swiper-slide-thumb-active");
    if (ParentName == "水位") {
        if (objID == "2021092611583268027") {
            lgtd = 120.749270;
            lttd = 30.666829;
        } else if (objID == "2021092611584020483") {
            lgtd = 120.157382;
            lttd = 30.846730;
        } else if (objID == "2021092611585851908") {
            lgtd = 120.060565;
            lttd = 30.357152;
        } else if (objID == "2021092611590323261") {
            lgtd = 120.650393;
            lttd = 31.274510;
        }
        window.parent.dyCenter(lgtd, lttd);
        $.data(myData, "SWTREEID", objID);
        loadSW();
    } else if (ParentName == "雨量") {
        var day = Number(objID.replace("YL", ""));
        getYLTM(day);
        loadYL();
    } else if (ParentName == "水量") {
        var day = Number(objID.replace("SL", ""));
        var stime = "", eitme = "";
        if (day == 0) {
            stime = new Date().format("yyyy-MM-dd 00:00:00");
            etime = new Date().format("yyyy-MM-dd HH:mm:ss");
            $.data(myData, "SLDayHour", "HOUR");
        } else {
            var hour = Number(new Date().format("H"));
            etime = new Date().format("yyyy-MM-dd 08:00:00");
            if (hour < 8) {
                etime = addDayDate(etime, -1) + " 08:00:00";
            }
            stime = addDayDate(etime, -day) + " 08:00:00";
            $.data(myData, "SLDayHour", "DAY");
        }
        $.data(myData, "SLSTIME", stime);
        $.data(myData, "SLETIME", etime);
        loadSL();
    }
}

//图表
//天气
function getWeater() {
    $.ajax({
        type: "post",
        url: "https://www.tianqiapi.com/api/?version=v1&cityid=101020100&appid=57757346&appsecret=kUKkUM2s",
        dataType: 'JSONP',
        jsonp: "callback",
        jsonpCallback: 'jsonpCallback',
        success: function (res) {
            var resHtml = "";
            //console.log(" res = " + JSON.stringify(res));
            if (res.data.length > 0) {
                $(res.data).each(function (index, item) {
                    if (index < 1) {
                        //$('.nowWeather li:nth-child(1)').html('<img src="/Common/images//LargeScreen/cloud-' + item.wea_img + '.png" />');
                        //$('.nowWeather li:nth-child(2) div p:nth-child(2)').html(item.wea);
                        var strHtml = '<img src="img/cloud-' + item.wea_img + '.png" style="position:absolute;display:inline-block;" />';
                        strHtml += '<div  style="padding-left:55px;padding-top:5px;" >今天<br>' + item.wea + '</div>';
                        $('.weather').html(strHtml);
                    }
                    //console.error(item.wea);
                    //console.error(item.wea_img);
                });
            }
            if (resHtml != "") {
                $("#weatherNew").html(resHtml);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //alert(errorThrown);
        }
    });
}
function chartAreaYL(chartName, chartTM, chartData, totalDRP) {
    var myChart = echarts.init(document.getElementById(chartName));
    option = {
        color: ['#7de494', '#7fd7b1', '#5578cf', '#5ebbeb', '#d16ad8', '#f8e19a', '#00b7ee', '#81dabe', '#5fc5ce'],
        tooltip: {
            backgroundColor: 'rgba(2,19,27,0.60)',
            borderColor: 'rgba(2,19,27,0.60)',
            trigger: 'axis',
            textStyle: {
                color: '#ffffff'
            },
        },
        // 日降雨量
        grid: {
            left: 40,
            right: 20,
            bottom: 50,
            top: 30
        },
        toolbox: {
            show: false
        },
        xAxis: {
            type: 'category',
            axisLine: {
                lineStyle: {
                    color: '#00FFFF'
                }
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255,255,255,01)'
                },
                show: false
            },
            axisLabel: {
                color: "#00FFFF",
                interval: 0,
                //rotate: 30,
                show: true,
                splitNumber: 15,
                fontSize: 11,
                formatter: function (value) {
                    return value.split("").join("\n");
                }
            },
            axisTick: {
                show: false
            },
            data: chartTM,
        },
        yAxis: [{
            name: "雨量(mm)",
            type: 'value',
            nameTextStyle: {
                color: '#00FFFF'
            },
            axisLine: {
                lineStyle: {
                    color: '#00FFFF'
                }
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(0,255,255,.2)'
                },
                show: true
            },
            max: function (e) {
                var cha = 50;
                if (e.max <= 10) {
                    cha = 10;
                }
                if (e.max > 10 && e.max<=20) {
                    cha = 30;
                }
                return e.max + cha;
            },
            axisLabel: {
                color: "#00FFFF",
                formatter: function (v) {
                    return v.toFixed(0);
                },
            },
            axisTick: {
                show: false
            }
        }
        ],
        series: [
            {
                name: '雨量',
                type: 'bar',
                // 相邻柱状之间的空隙
                // barGap: '0%',
                barWidth: 13,
                data: chartData,
                itemStyle: {
                    normal: {
                        show: true,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#0099FF'
                        }, {
                            offset: 1,
                            color: '#00FFFF'
                        }]),
                        borderWidth: 0,
                        barBorderRadius: [15, 15, 0, 0],
                        label: {
                            show: true,  //开启显示
                            formatter: '{c}',  //显示数值
                            position: 'top',
                            textStyle: { //数值样式
                                fontSize: 10,
                                color: '#00FFFF'
                            },
                            formatter: function (e) {
                                var value = e.value;
                                if (value == 0) {
                                    return "";
                                } else {
                                    return Number(value).toFixed(1);
                                }
                            }
                        }
                    },
                    emphasis: {
                        shadowBlur: 15,
                        shadowColor: 'rgba(105,123, 214, 0.7)'
                    }
                },
            },
        ]
    };
    myChart.setOption(option);


    if (totalDRP == 0) {
        var $li = "";
        $li = "<div id='" + chartName + "DIVHIDE' class='" + chartName +
            "DIVHIDE'>\ <span class='b threefont' style='letter-spacing:2px;position: absolute;top: 31%;left: 40%;font-size: 22px;color:#afb5b5;font-family: 微软雅黑; -webkit-transform: rotate(0deg);-moz-transform: rotate(0deg);-ms-transform: rotate(0deg);-o-transform: rotate(0deg);'>" +
            "无降雨</span>\ </div>";
        if ($.data(myData, chartName) == undefined) {
            $('#' + chartName).append($li);
        } else {
            $("." + $.data(myData, chartName)).show();
        }
        $.data(myData, chartName, chartName + "DIVHIDE");

    } else {
        if ($.data(myData, chartName) != null) {
            $("." + $.data(myData, chartName)).hide();
        }
    }
}

function chartAreaSLZF(chartName, chartTM, chartData) {
    var myChart = echarts.init(document.getElementById(chartName));
    option = {
        color: ['#7de494', '#7fd7b1', '#5578cf', '#5ebbeb', '#d16ad8', '#f8e19a', '#00b7ee', '#81dabe', '#5fc5ce'],
        tooltip: {
            backgroundColor: 'rgba(2,19,27,0.60)',
            borderColor: 'rgba(2,19,27,0.60)',
            trigger: 'axis',
            textStyle: {
                color: '#ffffff'
            },
            formatter(params) {
                for (x in params) {
                    return params[x].name.replace("正", "").replace("负","") + ":" + params[x].data;
                }
            }
        },
        // 日降雨量
        grid: {
            left:40,
            right: 20,
            bottom: 50,
            top:30
        },
        toolbox: {
            show: false
        },
        xAxis: {
            type: 'category',
            axisLine: {
                lineStyle: {
                    color: '#00FFFF'
                }
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255,255,255,01)'
                },
                show: false
            },
            axisLabel: {
                color: "#00FFFF",
                interval: 0,
                //rotate: 30,
                show: true,
                splitNumber: 15,
                fontSize: 11,
                formatter: function (value) {
                    return value.replace("负", "").replace("正", "").split("").join("\n");
                }
            },
            axisTick: {
                show: false
            },
            data: chartTM,
        },
        yAxis: [{
            name: "水量(万方)",
            type: 'value',
            nameTextStyle: {
                color: '#00FFFF'
            },
            axisLine: {
                lineStyle: {
                    color: '#00FFFF'
                }
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(0,255,255,.2)'
                },
                show: true
            },
            max: function (e) {
                return e.max + 100;
            },
            axisLabel: {
                color: "#00FFFF",
                formatter: function (v) {
                    return v.toFixed(0);
                },
            },
            axisTick: {
                show: false
            }
        }
        ],
        series: [
            {
                name: '水量',
                type: 'bar',
                label: {
                    show: false,
                    position: 'top',
                    // textStyle: {
                    //     textDecoration: undeline,
                    // }
                },
                // 相邻柱状之间的空隙
                // barGap: '0%',
                barWidth: 15,
                data: chartData,
                itemStyle: {
                    normal: {
                        show: true,
                        color: function (e) {
                            if (e.name.indexOf("正")>-1) {
                                return new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                                    {
                                        offset: 1,
                                        color: "rgba(48, 236, 166, 1)"
                                    },
                                    {
                                        offset: 0,
                                        color: "rgba(48, 236, 166, 0.5)"
                                    }
                                ]);
                            } else {
                                return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: '#0099FF'
                                }, {
                                    offset: 1,
                                    color: '#00FFFF'
                                }]);
                            }
                        },
                        borderWidth: 0,
                        barBorderRadius: [15, 15, 0, 0],
                        label: {
                            show: true,  //开启显示
                            //formatter: '{c}',  //显示数值
                            formatter: function (params) {
                                if (Number(params.value) > 0) {
                                    return Number(params.value).toFixed(1);
                                } else {
                                    return "";
                                }
                            },
                            position: 'top',
                            textStyle: { //数值样式
                                fontSize: 10,
                                color: '#00FFFF'
                            }
                        }
                    },
                    emphasis: {
                        shadowBlur: 15,
                        shadowColor: 'rgba(105,123, 214, 0.7)'
                    }
                },
            },
        ]
    };
    myChart.setOption(option);
}


function chartAreaSL(chartName, chartData, lineColor, title, totalSL) {
    var myChart = echarts.init(document.getElementById(chartName));
    var centerTop = "50%";
    var color = [
        '#0CD2E6',
        '#3751E6',
        '#FFC722',
        '#886EFF',
        '#008DEC',
        '#114C90',
        '#00BFA5',
    ];
    color = lineColor;
    var legend = [
        '北部线',
        '南排线',
        '西部线',
        '东排线'
    ];

    var seriesData = chartData;
    //    [
    //    { "name": "北部线", "value": 30 },
    //    { "name": "南排线", "value": 10 },
    //    { "name": "西部线", "value": 15 },
    //    { "name": "东排线", "value": 23 },
    //]

    var option = {
        //backgroundColor: '#050e31',
        color: color,
        title: {
            text: title,
            subtext: totalSL,
            textStyle: {
                fontSize: 14,
                color: "white"
            },
            subtextStyle: {
                fontSize: 16,
                color: 'white'
            },
            // 饼图中间的文字
            textAlign: "center",
            x: '29%',
            y: '38%',
        },
        grid: {
            // x:25,
            // y:60,
            // x2: 25,
            // y2: 0,
            top: '5%',
            //left: '90%',
            right: '1%',
            bottom: 50,
            containLabel: true,
        },
        legend: {
            icon: "circle",
            itemWidth: 14,  // 设置宽度class
            itemHeight: 14, // 设置高度im
            orient: 'vertical',
            top: 'center',
            // 调整进出数量的图例
            right: 20,
            textStyle: {
                align: 'left',
                verticalAlign: 'middle',
                rich: {
                    name: {
                        color: 'rgba(255,255,255,0.5)',
                        fontSize: 14,
                    },
                    value: {
                        color: 'rgba(255,255,255,0.5)',
                        fontSize: 14,
                    },
                    rate: {
                        color: 'rgba(255,255,255,0.9)',
                        fontSize: 14,
                    },
                },
            },
            data: legend,
            formatter: (name) => {
                if (seriesData.length) {
                    const item = seriesData.filter((item) => item.name === name)[0];
                    const baifen = Number(((item.value / totalSL) * 100).toFixed(0));
                    return `{name|${name}：}{value| ${item.value}} {rate| ${baifen}%}`;
                }
            },
        },
        series: [{
            name: '需求类型占比',
            type: 'pie',
            // 饼图的位置
            center: ['30%', centerTop],
            radius: ['35%', '70%'],
            label: {
                normal: {
                    show: false,
                    position: 'center',
                    formatter: '{value|{c}}\n{label|{b}}',
                    rich: {
                        value: {
                            padding: 5,
                            align: 'center',
                            verticalAlign: 'middle',
                            fontSize: 14,
                            color: "#fff"
                        },
                        label: {
                            align: 'center',
                            verticalAlign: 'middle',
                            fontSize: 16,
                        },
                    },
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '14',
                    },
                },
            },
            labelLine: {
                show: false,
                length: 0,
                length2: 0,
            },
            data: seriesData,
        }],
    };

    myChart.setOption(option);

    //getDefaultSelected(myChart)

    function getDefaultSelected(myChart) {
        let index = 0;
        myChart.dispatchAction({
            type: 'highlight',
            seriesIndex: 0,
            dataIndex: 0,
        });
        myChart.on('mouseover', (e) => {
            if (e.dataIndex !== index) {
                myChart.dispatchAction({
                    type: 'downplay',
                    seriesIndex: 0,
                    dataIndex: index,
                });
            }
        });
        myChart.on('mouseout', (e) => {
            index = e.dataIndex;
            myChart.dispatchAction({
                type: 'highlight',
                seriesIndex: 0,
                dataIndex: e.dataIndex,
            });
        });
    }
    myChart.setOption(option);
}

function chartAreaCJCC(chartName, chartTM, chartData, TitleName) {
    var myChart = echarts.init(document.getElementById(chartName));
    myChart.clear()

    option = {
        color: ['#7de494', '#7fd7b1', '#5578cf', '#5ebbeb', '#d16ad8', '#f8e19a', '#00b7ee', '#81dabe',
            '#5fc5ce'
        ],
        tooltip: {
            backgroundColor: 'rgba(2,19,27,0.60)',
            borderColor: 'rgba(2,19,27,0.60)',
            trigger: 'axis',
            textStyle: {
                color: '#ffffff'
            },
        },
        grid: {
            left: 40,
            right: 20,
            bottom: 60,
            top: '16%'
        },
        toolbox: {
            show: false
        },
        xAxis: {
            type: 'category',
            axisLine: {
                lineStyle: {
                    color: '#00FFFF'
                }
            },
            splitLine: {
                lineStyle: {
                    color: '#00FFFF'
                },
                show: false
            },
            // axisLabel: {
            //     color: "rgba(255,255,255,.7)",
            //     interval: 0,
            //     // rotate: 30,
            //     show: true,
            //     splitNumber: 15
            // },
            axisLabel: {
                interval: 0,
                //rotate: 45,
                formatter: function (value) {
                    return value.split("").join("\n");
                }
            },

            data: chartTM,
        },
        yAxis: [{
            name: TitleName,
            type: 'value',
            nameTextStyle: {
                color: '#00FFFF'
            },
            axisLine: {
                lineStyle: {
                    color: '#00FFFF'
                }
            },
            max: function (e) {
                return e.max + 5;
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(0,255,255,.2)'
                },
                show: true
            },
            axisLabel: {
                color: "#00FFFF"
            }
        }],
        series: [
            {
                name: '时长',
                type: 'bar',
                label: {
                    show: false,
                    position: 'top',
                    // textStyle: {
                    //     textDecoration: undeline,
                    // }
                },
                // 相邻柱状之间的空隙
                // barGap: '0%',
                barWidth: 13,
                data: chartData,
                itemStyle: {
                    normal: {
                        show: true,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#0099FF'
                        }, {
                            offset: 1,
                            color: '#00FFFF'
                        }]),
                        borderWidth: 0,
                        barBorderRadius: [15, 15, 0, 0],
                        label: {
                            show: true,  //开启显示
                            formatter: '{c}',  //显示数值
                            position: 'top',
                            textStyle: { //数值样式
                                fontSize: 10,
                                color: '#00FFFF'
                            },
                            formatter: function (e) {
                                var value = e.value;
                                if (value == 0) {
                                    return "";
                                } else {
                                    return Number(value).toFixed(0);
                                }
                            }
                        }
                    },
                    emphasis: {
                        shadowBlur: 15,
                        shadowColor: 'rgba(105,123, 214, 0.7)'
                    }
                },
            },
        ]
    };
    myChart.setOption(option);
    myChart.off('click')
    if (TitleName == "圩区") {
        myChart.on('click', function (params) {
            // var stime = DD_TM;
            // var etime = DD_ETM;
            if (chartName == "echart3") {
                var url = "danzhanWQ.html?stnm=" + (params.name) + "&rowNum=" + params.data + "&SOLUTION=" + DD_ID;
                // $(".danzhanPopup", window.parent.document).css("display", "block");
                // $("#popupIframe", window.parent.document).attr("src", url);
                // $(".popupContentTitleText", window.parent.document).html(params.name);
                // $(".danzhanPopup", window.parent.document).show();
                var strJson = {};
                strJson["ViewData"] = $.data(myData, params.name);
                strJson["STIME"] = DD_TM;
                strJson["ETIME"] = DD_ETM;
                viewData(strJson, url, params.name + "圩区险情统计", 1000, 600, true);
                try {
                    event.cancelBubble = true;
                } catch (ex) { }
            }

        });
    }
    var tt = chartData.filter(function (ex) {
        return ex != undefined && ex > 0;
    })
    if (tt.length == 0) {
        var $li = "";
        $li = "<div id='" + chartName + "DIVHIDE' class='" + chartName +
            "DIVHIDE'>\ <span class='b threefont' style='letter-spacing:2px;position: absolute;top: 31%;left: 40%;font-size: 22px;color:#afb5b5;font-family: 微软雅黑; -webkit-transform: rotate(0deg);-moz-transform: rotate(0deg);-ms-transform: rotate(0deg);-o-transform: rotate(0deg);'>" +
            "无超警</span>\ </div>";
        if ($.data(myData, chartName) == undefined) {
            $('#' + chartName).append($li);
        } else {
            $("." + $.data(myData, chartName)).show();
        }
        $.data(myData, chartName, chartName + "DIVHIDE");

    } else {
        if ($.data(myData, chartName) != null) {
            $("." + $.data(myData, chartName)).hide();
        }
    }

}

//读取线图层begin
function queryLine(server) {
    queryCompleteLine();
}
function queryCompleteLine(results) {
    require(["esri/geometry/Point",
        "esri/geometry/Polyline",
        "esri/geometry/Extent",
        "esri/graphic",
        "esri/Color",
        "esri/layers/GraphicsLayer",
        "esri/symbols/CartographicLineSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/geometry/Polygon",
        "esri/symbols/SimpleFillSymbol",
    ], function (Point, Polyline, Extent, Graphic, Color, GraphicsLayer, CartographicLineSymbol,
        SimpleLineSymbol, Polygon, SimpleFillSymbol) {
        var url = "/Common/SHSWZZModeRiver2000.json";
        $.get(
            url,//json路径
            function (data, status) {
                if (status === "success") {
                    var features = data.features;
                    features.forEach(function (feature) {
                        var geometry = feature.geometry;
                        var coordinates = geometry.coordinates;
                        var area = new Polyline(coordinates);


                        var symbol = SimpleFillSymbol(
                            SimpleFillSymbol.STYLE_SOLID,
                            new SimpleLineSymbol(
                                SimpleLineSymbol.STYLE_SOLID,
                                new Color([52, 210, 255, 1]), //rgb155, 153, 153
                                2
                            ),
                            new Color([52, 210, 255, 1]) //rgba
                        );
                        var gra = new Graphic(area, symbol);
                        ModerRiverLayerGraphicLayer.add(gra);
                    });
                }
            },
            "json"
        );
        });
}
//读取线图层end

function onSQClick(evt) {
    var obj = evt.graphic.attributes;
    if (obj != null && obj != undefined) {
        var stcd = obj.stcd;
        var stnm = obj.stnm;
        Trans(stcd, stnm);
    }
}
function Trans(stcd, stnm) {
    var stime = $.data(myData, "STIME");
    etime = $.data(myData, "ETIME");
    var title = stnm + "预报水位过程线";
    var url = "../danzhanYBSQLine.html?stcd=" + stcd + "&stnm=" + (stnm) + "&stime=" + stime + "&etime=" + etime + "&TYPENAME=水位过程" + "&SOLUTION=" + $.data(myData, "DD_ID");
    WindowOpen(url, title, "1200px", "650px");
    try {
        event.cancelBubble = true;
    } catch (ex) { }
}

function WindowOpen(url, title, width = null, height = null) {
    if (width != null) {
        $(".danzhanPopup .popupContent").css("width", width);
    }
    if (height != null) {
        $(".danzhanPopup .popupContent").css("height", height);
    }
    $(".danzhanPopup", window.document).css("display", "block");
    $("#popupIframe", window.document).attr("src", url);
    $(".popupContentTitleText", window.document).html(title);
    $(".danzhanPopup", window.document).show();
}
$(".popupContentTitleClose").click(function (e) {
    $(".danzhanPopup").hide();
});

$("#onlytab li").click(function (e) {
    var html = $(this).html();
    $("#onlytab li").removeClass('onlyliHover');
    $(this).addClass('onlyliHover');
    var data = $.data(myData, "HWDATA");
    queryComplete(data);
});

function showItem(id) {
    if (id == "FANGANLIST") {
        $("#CITYNAMEUL").css("display", "none");
    }
    if (id == "CITYNAMEUL") {
        $("#FANGANLIST").css("display", "none");
    }
    var obj = $("#" + id);
    var dis = obj.css("display");
    if (dis == "block") {
        obj.css("display", "none");
    } else {
        obj.css("display", "block");
    }
}

//=============播放条
function loadProgress() {
    var startTime=$.data(myData, "STIME");
    var endTime=$.data(myData, "ETIME");
    $("#progressTime").show();
    $("#progressTime").html("");
    var hourTimestamp = 3600 * 1000;
    var dayTimestamp = hourTimestamp * 24;
    $("#progressTime").ProgressTime({
        container: "progressTime",
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        currentTime: new Date(startTime),
        interval: 300,
        delay: 2000,
        callback: function (config) {
            $.data(myData, "gcTime", config.time);
            SetSDEGC(config.time);
            loadYBList(config.time);
            //$("#tmCenter").html("预报时间："+new Date(config.time).format("yyyy年M月d日H时"));
        },
        animateCallback: function (config) {
            // 假如动画完成之后请求数据需要两秒
            var timer = setTimeout(function () {
                //console.error(progressTime);
                progressTime.options.toPlay = true; // 两秒之后再继续走播放条
                clearTimeout(timer);
            }, 0);
        }
    });
}
        //=============播放条

/* 过程线绘制 过程线 水位
* ChartName画图控件名称
* dataS数据对象，数据格式json
* strNote数据说明，数据类型数组，数据格式
* json 格式说明 name数据类型名称，codename数据表示，tableV 表格是否显示，isShow 是否显示过程线
* [
* {"name": "时间","codename": "TM","tableV":"1","isShow":true},
* {"name": "上游水位","codename": "UPZ","tableV":"1","isShow":true},
* {"name": "下游水位","codename": "DWZ","tableV":"1","isShow":true},
* {"name": "控制水位","codename": "WRZ","tableV":"0","isShow":false}

* ]
*/
function chartSW(ChartName, data, strNote, LineColor, max_min_Name) {
    var showed = data.length > 0 ? false : true;
    showed = false;
    if (max_min_Name == "") {
        max_min_Name = "水位(m)";
    }
    var myChart = echarts.init(document.getElementById(ChartName)); //获得控件对象
    myChart.clear();

    //echarts.init(document.getElementById('quxian'), 'macarons');
    var chartName = []; //控件元素名称
    var chartTM = []; //时间序列
    var chartValue = []; //时间序列
    var liststr = ""; //拼装表格
    var m = new Array();
    var LineSelect = {};
    $.each(strNote, function (index, value, item) {
        chartName.push(value.name); //Echarts绘制标注名称加入
        LineSelect[value.name] = value.isShow;
    });
    $.each(strNote, function (index, value, item) {
        chartName.push(value.name); //Echarts绘制标注名称加入
    });

    //循环数据，加入有效数据。
    $.each(data, function (index, value, item) {
        var charthan = []; //时间序列
        $.each(strNote, function (index1, value1, item1) {
            charthan.push(value[value1.codename]); //加入集合
            if (value1.name == "时间") {
                chartTM.push(new Date(convertToDate(value[value1.codename])).format("d日H时")); //加入时间集合
            } else if (value1.name == "名称") {
                if (value[value1.codename] != undefined) {
                    chartTM.push(new Date(value[value1.codename]).format("MM-dd HH:mm"));
                }
            } else {
                chartValue.push(value[value1.codename]);
            }
        });
        m.push(charthan); //加入集合
    });

    //获得最大值最小值
    //var max_min=GetSort(chartValue);

    var option = {
        title: {
            show: showed, // 是否显示title
            text: '暂无数据',
            left: 'center',
            top: 'center',
            textStyle: {
                color: 'rgba(255,255,255,0.50)',
                fontSize: 18,
                fontWeight: 400
            }
        },
        //backgroundColor: '#100E19',
        tooltip: {
            backgroundColor: 'rgba(2,19,27,0.60)',
            borderColor: 'rgba(2,19,27,0.60)',
            trigger: 'axis',
            textStyle: {
                color: '#ffffff'
            },
        },
        color: LineColor,
        legend: {
            data: chartName,
            itemWidth: 8,
            itemHeight: 8,
            textStyle: {
                color: '#fff',
                fontSize: 12
            },
            selected: LineSelect,
        },
        grid: {
            left: '8%',
            right: '5%',
            bottom: '3%',
            top: 30,
            containLabel: true
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
        calculable: true,
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            data: chartTM,
            axisLine: {
                lineStyle: {
                    color: '#00FFFF',
                    width: 1 //这里是为了突出显示加上的
                },
                textStyle: {
                    color: '#00FFFF',
                    fontSize: '16'
                }
            }
        }],
        yAxis: [{
            name: '水位(m)',
            type: 'value',
            boundaryGap: false,
            // splitNumeber:5,
            scale: true, //是否自动计算最大最小值。
            splitLine: {
                lineStyle: {
                    color: 'rgba(0,255,255,.2)'
                },
                show: true
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
                } else {
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
                    return value.max + (jiangenew - jiange) / 30;
                } else {
                    return value.max + (jiangenew - jiange + 1) / 30;
                }

            },
            axisLabel: {
                formatter: function (v) {
                    return v.toFixed(2);
                },
                textStyle: {
                    color: '#00FFFF'
                }
            },
            axisLine: {
                lineStyle: {
                    color: '#00FFFF',
                    width: 1, //这里是为了突出显示加上的
                    shadowBlur: 0,
                    shadowOffsetX: 0
                },
                textStyle: {
                    color: '#00FFFF',
                    fontSize: '16'
                }
            },
            axisTick: {
                show: false
            }
        }],
        series: function () {
            var serie = [];
            for (var j = 0; j < chartName.length; j++) {
                if (chartName[j] == "时间" || chartName[j] == "名称") //调过时间字段
                {
                    continue;
                }
                var chartValue = []; //声明过线value集合
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
                            data: [{
                                type: 'max',
                                name: '最大值',
                                label: {
                                    formatter: function (e) {
                                        return Number(e.value).toFixed(2);
                                    }
                                }
                            }, {
                                type: 'min', name: '最小值', label: {
                                    formatter: function (e) {
                                        return Number(e.value).toFixed(2);
                                    }
                                    }
                                }],
                            animationDelay: 2000,
                            animationDuration: 1000
                        },
                        symbol: 'circle', // 默认是空心圆（中间是白色的），改成实心圆
                        showAllSymbol: true,
                        symbolSize: 0,
                        smooth: true,
                        itemStyle: {
                            color: "rgba(25,163,223,1)",
                            //borderColor: "#646ace",
                            borderWidth: 1

                        },
                        areaStyle: { //区域填充样式
                            normal: {
                                //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: '#0099FF'
                                    // color: "rgba(25,163,223,.3)"
                                }, {
                                    offset: 1,
                                    color: '#6AC6EE'
                                    // color: "rgba(25,163,223,.7)"
                                }]),
                                shadowColor: 'rgba(25,163,223, 0.5)', //阴影颜色
                                shadowBlur: 20 //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
                            }
                        },
                    }
                    serie.push(item);
                } else {
                    var item = {
                        name: chartName[j],
                        type: 'line',
                        symbol: "none",
                        connectNulls: true,
                        data: chartValue,
                        smooth: true,
                        lineStyle: {
                            width: 1,
                            type: 'dashed'
                        }
                    };
                    serie.push(item);
                }
            };
            return serie;
        }()
    };
    myChart.resize();
    myChart.setOption(option);

    var tt = chartValue.filter(function (ex) {
        return ex != undefined && ex > 0;
    })
    if (tt.length == 0) {
        var $li = "";
        $li = "<div id='" + ChartName + "DIVHIDE' class='" + ChartName +
            "DIVHIDE'>\ <span class='b threefont' style='letter-spacing:-2px;position: absolute;top: 30%;font-size: 22px;left: 35%;color:#7b7b7b;    -webkit-transform: rotate(-25deg);-moz-transform: rotate(-25deg);-ms-transform: rotate(-25deg);-o-transform: rotate(-25deg);'>无预报水位</span>\ </div>";
        if ($.data(myData, ChartName) == undefined) {
            $('#' + ChartName).append($li);
        } else {
            $("." + $.data(myData, ChartName)).show();
        }
        $.data(myData, ChartName, ChartName + "DIVHIDE");

    } else {
        if ($.data(myData, ChartName) != null) {
            $("." + $.data(myData, ChartName)).hide();
        }
    }

}