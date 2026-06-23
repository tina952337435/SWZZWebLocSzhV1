
var circle12;
var circle10;
var circle7;

var arrayListMarker = []; 	//保存所有点对象。
var arrayListLine = [];	//保存所有线对象


var currentMarker;//用来保存当前显示infowindow的marker

function GetWebUrl() {
    return "http://218.1.102.99:8000/";
}


//上海中心点坐标
var wuxiCenter = [121.394615, 31.088122];


//台风警戒线
drawWarningLineLayer = function () {
    try {
        var yelloLine24 = [[105, 0], [113.0033, 4.4943], [119.0479, 10.8333], [119, 18], [127.0459, 21.9430], [127.0459, 33.9434]];
        var blueLine48 = [[105, 0], [120.0586, -0.0659], [132.0117, 14.9713], [132.0035, 34.0003]];
        var textStyle = {
            hour24: { text: '24小时警戒线', color: 'yellow', offsetY: 0 },
            hour48: { text: '48小时警戒线', color: 'blue', offsetY: 24 }
        }
        var yellowPoint = [127.0459, 30.003];
        var bluePoint = [132.0035, 30.0003];
        var polyline = new AMap.Polyline({
            path: yelloLine24,          //设置线覆盖物路径
            strokeColor: textStyle.hour24.color, //线颜色
            strokeWeight: 2,        //线宽
            strokeStyle: "solid",   //线样式
        });
        map.add(polyline);
        polyline = new AMap.Polyline({
            path: blueLine48,          //设置线覆盖物路径
            strokeColor: textStyle.hour48.color, //线颜色
            strokeWeight: 2,        //线宽
            strokeStyle: "solid",   //线样式
        });
        map.add(polyline);
        // 创建纯文本标记
        var text = new AMap.Text({
            text: textStyle.hour24.text,
            anchor: 'center', // 设置文本标记锚点
            draggable: false,
            cursor: 'pointer',
            angle: 90,
            offset: new AMap.Pixel(10, 0),
            style: {
                'padding': '.75rem 1.25rem',
                'margin-bottom': '1rem',
                'border-radius': '.25rem',
                'background-color': 'none !important',
                'width': '15rem',
                'border-width': 0,
                //'box-shadow': '0 2px 6px 0 rgba(114, 124, 245, .5)',
                'text-align': 'center',
                'font-size': '18',
                'color': textStyle.hour24.color
            },
            position: yellowPoint
        });
        text.setMap(map);
        text = new AMap.Text({
            text: textStyle.hour48.text,
            anchor: 'center', // 设置文本标记锚点
            draggable: false,
            cursor: 'pointer',
            angle: 90,
            offset: new AMap.Pixel(10, 0),
            style: {
                'padding': '.75rem 1.25rem',
                'margin-bottom': '1rem',
                'border-radius': '.25rem',
                'background-color': 'none !important',
                'width': '15rem',
                'border-width': 0,
                //'box-shadow': '0 2px 6px 0 rgba(114, 124, 245, .5)',
                'text-align': 'center',
                'font-size': '18',
                'color': textStyle.hour48.color
            },
            position: bluePoint
        });
        text.setMap(map);
    } catch (e) {

    }
    
}
selTyphoonByYear = function (strYear) {

    $.ajax({
        type: "GET",
        url: GetWebUrl() + "PDA/weather/GetTyphoonByYear.aspx?strYear=" + strYear,
        dataType: "jsonp",
        //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback) 
        jsonp: "callback",
        //自定义的jsonp回调函数名称"jsonpCallback"，返回的json也必须有这个函数名称
        jsonpCallback: "jsonpCallback",
        success: function (data) {
            jsondata = data;
            doTaffyYear();
            fm.load_d();
        },
        error: function (xhr, status, error) {
            alert("操作数据失败，请稍后再试!");
            fm.load_d();
        }
    });

}

function doTaffyYear() {
    var db = TAFFY(jsondata);
    var data = db("");

    GetTyphoonData(data);
}

//显示台风数据
GetTyphoonData = function (data) {
    var strResult = "";
    strResult += "<table id=\"mobile_typhoon_list_table\" class=\"mobile_typhoon_list_table\" style=\"width:100%; font-size: 14px;overflow-y:scroll;\">";
    strResult += "<thead>";
    strResult += "<tr class=\"mobile_typhoon_list_th\" style=\"height: 29px;\">";
    strResult += "<th style=\"width:33%;\" class=\"code_mobile_typhoon\">编号</th>";
    strResult += "<th style=\"width:33%;\" class=\"name_mobile_typhoon\">中文名</th>";
    strResult += "<th style=\"width:33%;\" class=\"ename_mobile_typhoon\">英文名</th>";
    strResult += "</tr><tbody>";
    strResult += "</thead>";
    var i = 0;
    var IsCurrent = 0;

    var strTitle = "";
    data.each(function (value) { //本地缓存遍历方法
        //	$.each(data, function(n, value) { 	//非缓存遍历方法

        strResult += "<tr onclick=\"selTyphoonByTFBH('" + value.ID + "','" + (value.CNAME == "null" || value.CNAME == "" ? " - " : value.CNAME) + "','" + (value.NAME == "null" || value.NAME == "" ? " - " : value.NAME) + "')\"> ";
        strResult += "	<td class=\"code_mobile_typhoon\" align=\"center\">" + (value.ID == "null" || value.ID == "" ? " - " : value.ID) + "</td> ";
        strResult += "	<td class=\"name_mobile_typhoon\" align=\"center\"> ";
        strResult += "		<span>" + (value.CNAME == "null" || value.CNAME == "" ? " - " : value.CNAME) + "</span> ";
        strResult += "	</td> ";
        strResult += "	<td class=\"ename_mobile_typhoon\" align=\"center\"> ";
        strResult += "		<span>" + (value.NAME == "null" || value.NAME == "" ? " - " : value.NAME) + "</span> ";
        strResult += "	</td> ";
        strResult += "</tr> ";

        if (value.FLAG == "True") {
            if (i > 0) {
                strTitle += ("</br>");
            }
            strTitle += (" - " != value.CNAME ? value.CNAME : "");
            strTitle += (" - " != value.NAME ? "(" + value.NAME + ")" : "");

            IsCurrent++;
        }
        i++;
    });

    if (IsCurrent < 1) {
        strTitle = "当前无台风";
        $(".typhoon-TitleName-mobile").html(strTitle);
    } else {
        //显示正在运行台风
        selTyphoonByTFBH_New();
        $(".typhoon-TitleName-mobile").html(strTitle);
    }

    //判断当前年份是否有台风
    if (i < 1) {
        strResult += "<tr> ";
        strResult += "	<td class=\"ename_mobile_typhoon\" colspan='3' align=\"center\"> ";
        strResult += "		<span> 暂无台风数据 </span> ";
        strResult += "	</td> ";
        strResult += "</tr> ";
    }
    strResult += "</tbody></table>";
    $("#mobile_list_div").html(strResult);
}

//多台风记录信息
selTyphoonByTFBH_New = function () {
    $.ajax({
        type: "GET",
        url: GetWebUrl() + "PDA/weather/GetTyphoonInfoByIdNew.aspx",
        dataType: "jsonp",
        //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback) 
        jsonp: "callback",
        //自定义的jsonp回调函数名称"jsonpCallback"，返回的json也必须有这个函数名称
        jsonpCallback: "jsonpCallback",
        success: function (data) {
            GetTyphoonList(data, "");
        },
        error: function (xhr, status, error) {
        }
    });
}
var imgSize =1;
GetTyphoonList = function (data, typhoon_name) {
    imgSize = 1;
    try {
        if (TyphoonXSTFList.indexOf(data[0].tfbh)>-1) {
            imgSize = 0.2;
        }
    } catch (e) {
    }
    //console.error("相似台风列表",TyphoonXSTFList);
    var strHtml = "";
    $.each(data, function (n, value) {
        if (value.points != undefined) {
            var RQSJ2 = new Date(convertToDate(value.points[value.points.length - 1].RQSJ2)).format("yyyy-MM-dd HH:mm:ss");
            try {
                if (TyphoonXSTFList.indexOf(value.tfbh) == -1) {//不是点相似的台风
                    $.data(myData, "TyphoonYBTM", RQSJ2);
                    searchXSTFData(value.tfbh, "true");
                }
            } catch (e) {}
        }

        typhoon_name = value.name != "" ? (value.name) : typhoon_name;
        strHtml += GetTyphoonLSLJData(value.points, typhoon_name, value.forecast, value.tfbh);

        if (value.forecast != undefined) {
            //画（预报台）台风路线
            GetResultTFLX_YBS(value.forecast);
        }
    });
    
    $("#selectDataleftXS").html(strHtml);
}

//单个查询台风路径
selTyphoonByTFBH = function (tfbh, typhoon_name, typhoon_nickname) {
    $(".amap-info").css("display", "none");
    var strTitle = "";
    strTitle += (" - " != typhoon_name ? typhoon_name : "");
    strTitle += (" - " != typhoon_nickname ? "(" + typhoon_nickname + ")" : "");
    clearLine();
    clearCircle();
    GetTyphoonListLJ(tfbh);
}

//展示台风路径
GetTyphoonLSLJData = function (data, typhoon_names, forecast,tfbh=null) {
    try {
        var arrlist = []; //台风详细记录id号
        var arrlistIcon = []; //标注点颜色
        var flightPlanCoordinates = []; //经纬度List,每次画线时,清除上次记录
        j = data.length;
        var strHtml = "";
        $.each(data, function (n, value) {
            value.tfbh = tfbh;
            var mylatlng = new AMap.LngLat(value.JD, value.WD);
            flightPlanCoordinates.push([value.JD, value.WD]);
            var strIcon = GetIcon(value.COLOR);
            addMarker(mylatlng, n, j, strIcon, value, typhoon_names);

            if (imgSize == 1) {
                if (n == j - 1) {
                    //风圈点
                    strIcon = GetIconFQ(value.COLOR);
                    var labelOffset = new AMap.Pixel(0, 0);
                    var marker2 = new AMap.Marker({
                        position: new AMap.LngLat(value.JD, value.WD),
                        offset: labelOffset,
                        icon: strIcon,
                        id: "bigMarker" + value.ID,
                        //content: markerContent,
                        anchor: "center" // 设置锚点方位
                    });
                    map.add(marker2);// 将标注添加到地图中
                    arrayListMarker.push(marker2);


                    //if (value.ZJ_RADIUS7 != "" && value.ZJ_RADIUS7 != undefined && value.ZJ_RADIUS7 != null) {
                    //    addCircle7(mylatlng, value.ZJ_RADIUS7);
                    //}
                    //if (value.ZJ_RADIUS10 != "" && value.ZJ_RADIUS10 != undefined && value.ZJ_RADIUS10 != null) {
                    //    addCircle10(mylatlng, value.ZJ_RADIUS10);
                    //}
                    //if (value.ZJ_RADIUS12 != "" && value.ZJ_RADIUS12 != undefined && value.ZJ_RADIUS12 != null) {
                    //    addCircle12(mylatlng, value.ZJ_RADIUS12);
                    //}


                    map.setZoomAndCenter(5, [value.JD, value.WD]); //同时设置地图层级与中心点

                    //最新的台风路径点与上海相差距离
                    var wxLGTD = wuxiCenter[0], wxLTTD = wuxiCenter[1];
                    var LGTD = value.JD, LTTD = value.WD;
                    var dis = distanceOf({ "x": wxLGTD, "y": wxLTTD }, { "x": LGTD, "y": LTTD });
                    dis = GetDistance(wxLGTD, wxLTTD, LGTD, LTTD).toFixed(1);
                    strHtml += "<div class='juliDiv'>" + typhoon_names + "现离上海：<span>" + dis + "</span> 公里</div>"
                    return false;
                }
            }
        });
        //划线
        IsPolyline(data[0].ID, arrlist, arrlistIcon, flightPlanCoordinates);
        return strHtml;
    } catch (e) {
        return "";
    }
}


function rad(d) {
    return d * Math.PI / 180.0;
}
function distanceOf(p1, p2) {
    var radLng1 = rad(p1.x);
    var radLng2 = rad(p2.x);
    var mdifference = radLng1 - radLng2;
    var difference = rad(p1.y) - rad(p2.y);
    var distance = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(difference / 2), 2)
        + Math.cos(radLng1) * Math.cos(radLng2) * Math.pow(Math.sin(mdifference / 2), 2)));
    distance = distance * 6378.137;
    distance = Math.abs(Math.round(distance * 10000) / 10);
    return distance;
}
// 方法定义 lat,lng 
function GetDistance(lat1, lng1, lat2, lng2) {
    var radLat1 = lat1 * Math.PI / 180.0;
    var radLat2 = lat2 * Math.PI / 180.0;
    var a = radLat1 - radLat2;
    var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
        Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137;// EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000;
    return s;
}

//画台风折线
IsPolyline = function (ID, arrlist, arrlistIcon, flightPlanCoordinates) {
    try {
        //alert(flightPlanCoordinates.length)
        //设置连接线样式
        var polyline = new AMap.Polyline({
            path: flightPlanCoordinates,          //设置线覆盖物路径
            strokeColor: "#29A6FA", //线颜色
            strokeOpacity: 0.8,       //线透明度
            strokeWeight: 3,        //线宽
            strokeStyle: "solid",   //线样式
            strokeDasharray: [10, 10], //补充线样式
            id: "Polyline" + ID
        });
        map.add(polyline);
        arrayListLine.push(polyline);
    } catch (e) {

    }
}

function markerClick(e) {
    try {
        currentMarker = e.target;
        var value = e.target.w;
        if (value != undefined) {
            var mylatlng = value.position;
            clearCircle();
            if (value.RADIUS7 != "" && value.RADIUS7 != undefined && value.RADIUS7 != null) {
                addCircle7(mylatlng, value.RADIUS7);
            }
            if (value.RADIUS10 != "" && value.RADIUS10 != undefined && value.RADIUS10 != null) {
                addCircle10(mylatlng, value.RADIUS10);
            }
            if (value.RADIUS12 != "" && value.RADIUS12 != undefined && value.RADIUS12 != null) {
                addCircle12(mylatlng, value.RADIUS12);
            }
            //console.error(value);
        }
        //$(".amap-info").show();
        $(".amap-info").css("display", "block");
        infoWindow.setContent(e.target.content);
        infoWindow.open(map, e.target.getPosition());

        //从点击的点画往后的预报路径
        try {
            if (e.originEvent != undefined) {
                var RQSJ2 = new Date(convertToDate(value.RQSJ2)).format("yyyy-MM-dd HH:mm:ss");
                //清除点击的预报路径
                clearLineClickYBLJ();
                GetZTResultTFLJ_YBS(RQSJ2);
                try {
                    if (TyphoonXSTFList.indexOf(value.tfbh) == -1) {//不是点相似的台风
                        //alert(value.tfbh);
                        $.data(myData, "TyphoonYBTM", RQSJ2);
                        searchXSTFData(value.tfbh, "true");
                    }
                } catch (e) {}
                //显示这个时间点的潮位、增水等信息
                var cwdata = $.data(myData, "SQCWDATA");
                var tipIndex = 0;
                var isCunzai = false;
                var cwdataTemp = cwdata.filter(function (e, index) {
                    //console.error(new Date(convertToDate(value.RQSJ2)) , new Date(convertToDate(e.TM)));
                    if (new Date(convertToDate(value.RQSJ2)).format("yyyy-MM-dd HH:mm:ss") == new Date(convertToDate(e.TM)).format("yyyy-MM-dd HH:mm:ss")) {
                        isCunzai = true;
                        tipIndex = index;
                    }
                    return new Date(convertToDate(value.RQSJ2)).format("yyyy-MM-dd HH:mm:ss") == new Date(convertToDate(e.TM)).format("yyyy-MM-dd HH:mm:ss");
                });
                //alert(tipIndex);
                if (isCunzai) {
                    addEchartsAction(tipIndex);
                }
            }
        } catch (e) { }
    } catch (e) {

    }
}

var infoWindow;
try {
    infoWindow = new AMap.InfoWindow({
        offset: new AMap.Pixel(0, -30)
    });
} catch (e) {

}
function addMarker(mylatlng, i, j, strIcon, value, typhoon_names) {
    try {

        var markerContent = "";
        if (i == 0) {
            markerContent = value.ID + typhoon_names;
        }
        var labelOffset = new AMap.Pixel(23, -5);
        var marker2 = new AMap.Marker({
            position: new AMap.LngLat(value.JD, value.WD),
            offset: new AMap.Pixel(0, 0),
            anchor: 'center', // 设置锚点方位
            //icon: strIcon,
            icon: new AMap.Icon({
                image: strIcon,
                size: new AMap.Size(14 * imgSize, 14 * imgSize),  //图标大小
                imageSize: new AMap.Size(14 * imgSize, 14 * imgSize)
            }),
            id: "Marker" + value.ID + i,
            RADIUS12: value.ZJ_RADIUS12,
            RADIUS10: value.ZJ_RADIUS10,
            RADIUS7: value.ZJ_RADIUS7,
            RQSJ2: value.RQSJ2,
            tfbh: value.tfbh,
            //content: markerContent,
            //anchor: "center" // 设置锚点方位
            label: {
                content: markerContent,
                offset: labelOffset
            }
        });
        map.add(marker2); // 将标注添加到地图中
        arrayListMarker.push(marker2);
        var strTime = value.RQSJ2;
        strTime = new Date(convertToDate(value.RQSJ2)).format("M月d日H时");
        var strTitle = "<b>" + typhoon_names + "</b> " + strTime;
        var strLngLat = "东经" + value.JD + "° 北纬" + value.WD + "°";
        var strFSFL =value.FS!=undefined?value.FS + "米/秒," + GetIconResult(value.COLOR):"-";
        var strQY =value.QY!=undefined?value.QY + "百帕":"-";
        var strMOVESD=value.MOVESD!=undefined?value.MOVESD+"公里/小时":"-";
        var strMOVEFX=value.MOVEFX!=undefined?value.MOVEFX:"-";
        var tfGradeHtml = "<span style='background:#" + value.COLOR + ";padding:2px;margin-left: 10px;'>" + GetIconResultType(value.COLOR) + "<span>";
        var strFS=value.FS!=undefined?value.FS + "米/秒" + tfGradeHtml:"-";
        var tfLabelList = [
            { name: "中心位置", value: strLngLat },
            { name: "最大风速", value: strFS },
            { name: "中心气压", value: strQY },
            { name: "移动方向", value: strMOVEFX },
            { name: "移动速度", value:strMOVESD },
        ];
        if (value.ZJ_RADIUS7 != "" && value.ZJ_RADIUS7 != undefined) {
            tfLabelList.push({ name: "风圈半径", value: "东北  东南  西北  西南" });
            var sarr = value.ZJ_RADIUS7.split("|");
            var svalue = sarr[0] + "  " + sarr[1] + "  " + sarr[2] + "  " + sarr[3] + "  (KM)";
            tfLabelList.push({ name: "七级", value: svalue });
        }
        if (value.ZJ_RADIUS10 != "" && value.ZJ_RADIUS10 != undefined) {
            var sarr = value.ZJ_RADIUS10.split("|");
            var svalue = sarr[0] + "  " + sarr[1] + "  " + sarr[2] + "  " + sarr[3] + "  (KM)";
            tfLabelList.push({ name: "十级", value: svalue });
        }
        if (value.ZJ_RADIUS12 != "" && value.ZJ_RADIUS12 != undefined) {
            var sarr = value.ZJ_RADIUS12.split("|");
            var svalue = sarr[0] + "  " + sarr[1] + "  " + sarr[2] + "  " + sarr[3] + "  (KM)";
            tfLabelList.push({ name: "十二级", value: svalue });
        }

        var strHtml = getPopupHtml(value.ID, i, strTitle, strLngLat, strFSFL, strQY, tfLabelList);
        marker2.content = strHtml;
        if (imgSize == 1) {
            marker2.on('click', markerClick);
            marker2.emit('click', { target: marker2 });
            //鼠标点击marker弹出自定义的信息窗体
            //AMap.event.addListener(marker2, 'click', markerClick);
        }
    } catch (e) {

    }
}
 //点击悬浮事件
function getPopupHtml(tfbh, i, strTitle, strLngLat, strFSFL, QY, tfLabelList) {
    var divId = tfbh.toString() + i.toString();
    var strHtml = '<div class="typhoonPopup" style="opacity: 1; width: 100%;"><em ></em>';
    strHtml += '<div id="typhoonPopupContont_' + divId+ '" class="typhoonPopupContont">';
    strHtml += '<div class="typhoonPopupTitle">';
    strHtml += '<span id="typhoonPopupTitle' + divId + '" style="float: left;">' + strTitle+'</span>';
    strHtml += '</div>';
    strHtml += '<div>';

    if (tfLabelList != undefined) {
        for (var num = 0; num < tfLabelList.length; num++) {
            var item = tfLabelList[num];
            strHtml += '<table><tbody>';
            strHtml += '<tr>';
            strHtml += '<td class="typhoonPopupLabel">' + item.name + '：</td>';
            strHtml += '<td class="typhoonPopupValue" id="typhoon_fsfl' + divId + '">' + item.value + '</td>';
            strHtml += '</tr>';
            strHtml += '</tbody></table>';
        }
    }
    strHtml += '</div>';
    strHtml += '</div>';
    strHtml += '</div>';
    return strHtml;
}

function addCircle7(mylatlng, radiusLength) {
    try {

        var circleHtml = "七级风圈";
        if (radiusLength.indexOf("|") > -1) {
            var radiusArr = radiusLength.split('|');
            var maxNum = Math.max.apply(null, radiusArr);//最大值。
            radiusLength = parseInt(maxNum);
            circleHtml += '（东北' + radiusArr[0] + 'km，';
            circleHtml += '东南' + radiusArr[1] + 'km，';
            circleHtml += '西南' + radiusArr[2] + 'km，';
            circleHtml += '西北' + radiusArr[3] + 'km';
            circleHtml += '）';
        } else {
            circleHtml += '（半径' + radiusLength + 'km）';
            radiusLength = parseInt(radiusLength);
        }
        // 构造矢量圆形
        circle7 = new AMap.Circle({
            center: mylatlng, // 圆心位置
            radius: radiusLength * 1000,  //半径
            strokeColor: "#00B00F",  //线颜色
            strokeOpacity: 0.5,  //线透明度
            strokeWeight: 1,  //线粗细度
            fillColor: "#00B00F",  //填充颜色
            fillOpacity: 0.2, //填充透明度
            strokeStyle: "solid",
            circleStr: circleHtml,
        });
        //向地图上添加圆
        map.add(circle7);

        circle7.on('mouseout', circleLabelCloseClick);
        circle7.on('mouseover', circleLabelClick);
    } catch (e) {

    }
}
function addCircle10(mylatlng, radiusLength) {
    try {
        var circleHtml = "十级风圈";
        if (radiusLength.indexOf("|") > -1) {
            var radiusArr = radiusLength.split('|');
            var maxNum = Math.max.apply(null, radiusArr);//最大值。
            radiusLength = parseInt(maxNum);
            circleHtml += '（东北' + radiusArr[0] + 'km，';
            circleHtml += '东南' + radiusArr[1] + 'km，';
            circleHtml += '西南' + radiusArr[2] + 'km，';
            circleHtml += '西北' + radiusArr[3] + 'km';
            circleHtml += '）';
        } else {
            circleHtml += '（半径' + radiusLength + 'km）';
            radiusLength = parseInt(radiusLength);
        }
        circle10 = new AMap.Circle({
            center: mylatlng, // 圆心位置
            radius: radiusLength * 1000,  //半径
            strokeColor: "#ff0",  //线颜色
            strokeOpacity: 0.5,  //线透明度
            strokeWeight: 1,  //线粗细度
            fillColor: "#ff0",  //填充颜色
            fillOpacity: 0.3, //填充透明度
            strokeStyle: "solid",
            circleStr: circleHtml,
        });
        //向地图上添加圆
        map.add(circle10);
        circle10.on('mouseout', circleLabelCloseClick);
        circle10.on('mouseover', circleLabelClick);
    } catch (e) {

    }
}
function addCircle12(mylatlng, radiusLength) {
    try {
        var circleHtml = "十二级风圈";
        if (radiusLength.indexOf("|") > -1) {
            var radiusArr = radiusLength.split('|');
            var maxNum = Math.max.apply(null, radiusArr);//最大值。
            radiusLength = parseInt(maxNum);
            circleHtml += '（东北' + radiusArr[0] + 'km，';
            circleHtml += '东南' + radiusArr[1] + 'km，';
            circleHtml += '西南' + radiusArr[2] + 'km，';
            circleHtml += '西北' + radiusArr[3] + 'km';
            circleHtml += '）';
        } else {
            circleHtml += '（半径' + radiusLength + 'km）';
            radiusLength = parseInt(radiusLength);
        }
        circle12 = new AMap.Circle({
            center: mylatlng, // 圆心位置
            radius: radiusLength * 1000,  //半径
            strokeColor: "#f00",  //线颜色
            strokeOpacity: 0.5,  //线透明度
            strokeWeight: 1,  //线粗细度
            fillColor: "#f00",  //填充颜色
            fillOpacity: 0.3, //填充透明度
            strokeStyle: "solid",
            circleStr: circleHtml,
        });
        //向地图上添加圆
        map.add(circle12);
        circle12.on('mouseout', circleLabelCloseClick);
        circle12.on('mouseover', circleLabelClick);

    } catch (e) {
        console.error("addCircle12:");
    }
}



function circleLabelCloseClick(e) {
    if (map) {
        map.remove(normalMarker);
    }
}
function circleLabelClick(e) {
    try {
        map.remove(normalMarker);
        var opt = e.target.w;
        if (opt != null) {
            if (opt.circleStr != undefined) {
                var circleStr = opt.circleStr;
                var markerContent = '<div style="width:400px;background:white;height:30px;line-height: 30px;border-radius: 5px;">' + circleStr + '</div>';
                var Position = e.lnglat;
                normalMarker.setContent(markerContent);
                normalMarker.setPosition(Position);
                map.add(normalMarker);
            }
        }
    } catch (e) {

    }
}

var center = [120.342546, 31.630305];
var obj10 = { level: 10, EN: 280, ES: 280, WS: 250, WN: 220 };
var obj7 = { level: 10, EN: 130, ES: 120, WS: 80, WN: 80 };
//台风风圈
function getAirRing(c, center, index) {//风圈;level风力级数，center原点
    var arColor;
    switch (c.level) {
        case 7: arColor = "#E1A846"; break;//7级风圈
        case 10: arColor = "#E1A846"; break;
        case 12: arColor = "#E1A846"; break;
        default: arColor = "#E1A846"; break;
    }

    //算出所有的点
    var points =[];
    getPoints(center, c.EN, 0);//东北方向
    getPoints(center, c.ES, 90);
    getPoints(center, c.WS, 180);
    getPoints(center, c.WN, 270);
    points[points.length] = points[0];//首尾连接

    //设置填充symbol
    var bColor = arColor;// bColor.push(0.5);//透明度
    let polygon = new AMap.Polygon({
        path: points,
        fillColor: bColor,
        strokeOpacity:0.5,
        fillOpacity: 0.2,
        strokeColor: bColor,
        strokeWeight: 1,
        strokeStyle: 'solid',
        strokeDasharray: [5, 5],
    });
    map.add(polygon);

    

    //此方法1度1个点
    function getPoints(center, cradius, startAngle) {
        var radius = cradius / 100;
        var pointNum =90;
        var endAngle = startAngle + 90;

        var sin;
        var cos;
        var x;
        var y;
        var angle;
        for (var i = 0; i <= pointNum; i++) {
            angle = startAngle + (endAngle - startAngle) * i
                / pointNum;
            sin = Math.sin(angle * Math.PI / 180);
            cos = Math.cos(angle * Math.PI / 180);
            x = center[0] + radius * sin;
            y = center[1] + radius * cos;
            points.push([x, y]);
        }
    }
}


//点经纬度
var mapPoints = [
    [120.342546, 31.630305, 0, 280, "我是A", "老大"],
    [120.342546, 31.630305, 90, 280, "我是B", "老二"],
    [120.342546, 31.630305, 180,250, "我是C", "老三"],
    [120.342546, 31.630305, 270, 220, "我是D", "老三"],
];

//以画多边形区域的方法画扇形区域 画出以point2点为圆心，半径为radius，夹角从sDegree到eDegree的扇形
//Sector1(point,300,10,60,"hello")
function Sector1(point2, radius, sDegree, eDegree, opts) {
    var points = []; //创建构成多边形的点数组  
    var step = ((eDegree - sDegree) / 100) || 100; //根据扇形的总夹角确定每步夹角度数，最大为10  
    points.push([point2.lng, point2.lat]);
    for (var i = sDegree; i < eDegree + 0.001; i += step) { //循环获取每步的圆弧上点的坐标，存入点数组 
        var point = EOffsetBearing(point2, radius, i);
        points.push(point);
    }
    points.push([point2.lng, point2.lat]);
    return points;
}

//使用数学的方法计算需要画扇形的圆弧上的点坐标
function EOffsetBearing(point3, dist, bearing) {
    var lngConv = Math.round(point3.distance(new AMap.LngLat(point3.lng + 0.1, point3.lat))) * 10;
    var latConv = Math.round(point3.distance(new AMap.LngLat(point3.lng, point3.lat + 0.1))) * 10;
    //var lngConv = map.getDistance(point3, new AMap.LngLat(point3.lng + 0.1, point3.lat)) * 10; //计算1经度与原点的距离
    //var latConv = map.getDistance(point3, new AMap.LngLat(point3.lng, point3.lat + 0.1)) * 10; //计算1纬度与原点的距离
    var lat = dist * Math.sin(bearing * Math.PI / 180) / latConv; //正弦计算待获取的点的纬度与原点纬度差
    var lng = dist * Math.cos(bearing * Math.PI / 180) / lngConv; //余弦计算待获取的点的经度与原点经度差
    //return new AMap.LngLat(point3.lng + lng, point3.lat + lat);
    return [point3.lng + lng, point3.lat + lat];
}

// 创建扇形
function makesectors(mapPoints) {
    try {
        for (var i = 0; i < mapPoints.length; i++) {
            var point = new AMap.LngLat(mapPoints[i][0], mapPoints[i][1]);
            var azimuth1 = mapPoints[i][2]
            var azimuth2 = mapPoints[i][2] + 90;
            var points = Sector1(point, mapPoints[i][3], azimuth1, azimuth2, "hello");
            console.error(points);
            var bColor = "blue";
            let polygon = new AMap.Polygon({
                path: points,
                fillColor: bColor,
                strokeOpacity: 0.5,
                fillOpacity: 0.2,
                strokeColor: bColor,
                strokeWeight: 1,
                strokeStyle: 'solid',
                strokeDasharray: [5, 5],
            });
            map.add(polygon);
        }
    } catch (e) {

    }
}



GetIconFQ = function (color) {
    var strIcon = "";
    if (color == "0062FE") {
        strIcon = "./images/typhoon/tf2.gif";
    } else if (color == "FDFA00") {
        strIcon = "./images/typhoon/tf3.gif";
    } else if (color == "FDAC03") {
        strIcon = "./images/typhoon/tf4.gif";
    } else if (color == "F072F6") {
        strIcon = "./images/typhoon/tf5.gif";
    } else if (color == "FD0002") {
        strIcon = "./images/typhoon/tf6.gif";
    } else {
        strIcon = "./images/typhoon/tf1.gif";
    }
    return strIcon;
}

GetIcon = function (color) {
    var strIcon = "";
    if (color == "0062FE") {
        strIcon = "./images/typhoon/2.png";
    } else if (color == "FDFA00") {
        strIcon = "./images/typhoon/3.png";
    } else if (color == "FDAC03") {
        strIcon = "./images/typhoon/4.png";
    } else if (color == "F072F6") {
        strIcon = "./images/typhoon/5.png";
    } else if (color == "FD0002") {
        strIcon = "./images/typhoon/6.png";
    } else {
        strIcon = "./images/typhoon/1.png";
    }
    return strIcon;
}

GetIconResult = function (color) {
    var strIconResult = "";
    if (color == "0062FE") {
        strIconResult = "8-9 级(热带风暴)";
    } else if (color == "FDFA00") {
        strIconResult = "10-11 级(强热带风暴)";
    } else if (color == "FDAC03") {
        strIconResult = "12-13 级(台风)";
    } else if (color == "F072F6") {
        strIconResult = "14-15 级(强台风)";
    } else if (color == "FD0002") {
        strIconResult = "16级以上(超强台风)";
    } else {
        strIconResult = "6-7级(热带低压)";
    }
    return strIconResult;
}

GetIconResultType = function (color) {
    var strIconResult = "";
    if (color == "0062FE") {
        strIconResult = "热带风暴";
    } else if (color == "FDFA00") {
        strIconResult = "强热带风暴";
    } else if (color == "FDAC03") {
        strIconResult = "台风";
    } else if (color == "F072F6") {
        strIconResult = "强台风";
    } else if (color == "FD0002") {
        strIconResult = "超强台风";
    } else {
        strIconResult = "热带低压";
    }
    return strIconResult;
}

GetIconResultFL = function (color) {
    var strIconResult = "";
    if (color == "0062FE") {
        strIconResult = "8-9 级";
    } else if (color == "FDFA00") {
        strIconResult = "10-11";
    } else if (color == "FDAC03") {
        strIconResult = "12-13";
    } else if (color == "F072F6") {
        strIconResult = "14-15";
    } else if (color == "FD0002") {
        strIconResult = "16级以上";
    } else {
        strIconResult = "6-7级"
    }
    return strIconResult;
}
/**************预报台风路径begin**************/
GetResultTFLX_YBS = function (param,ybtype="") {

    var arrlist = []; //台风详细记录id号
    var arrlistIcon = []; //标注点颜色

    //clearLine_YB(); //清除预报台 上一次线路

    //装载地图 经度+纬度
    //  var list = param.toString().split("+");
    $.each(param, function (n, value) {
        var flightPlanCoordinates_YB = [];
        var items = value.point;  //预报路径 json
        var yb_color = value.COLOR; //预报台线路 颜色
        var yb_ftm = value.FTM;
        j = items.length;
        $.each(items, function (m, infoCol) {
            var mylatlng = new AMap.LngLat(infoCol.JD, infoCol.WD); //经纬度
            flightPlanCoordinates_YB.push(mylatlng);
            //经纬度 第一条数据是画线的（颜色），去掉
            arrlist[m] = infoCol.ID;
            arrlistIcon[m] = GetIcon(infoCol.COLOR);
            var strIcon = GetIcon(infoCol.COLOR);
            addMarker_YB_List(mylatlng, n, j, strIcon, yb_ftm, infoCol, ybtype);
        });
        IsPolyline_YB(items[0].ID + ybtype, arrlist, yb_color, arrlistIcon, flightPlanCoordinates_YB);
    });
}
function addMarker_YB_List(mylatlng, i, j, strIcon, yb_ftm, value, ybtype = "") {
    try {
        var markerContent = "";
        var labelOffset = new AMap.Pixel(23, -5);
        var marker2 = new AMap.Marker({
            position: mylatlng,
            offset: new AMap.Pixel(0, 0),
            anchor: 'center', // 设置锚点方位
            //icon: strIcon,
            icon: new AMap.Icon({
                image: strIcon,
                size: new AMap.Size(14 * imgSize, 14 * imgSize),  //图标大小
                imageSize: new AMap.Size(14 * imgSize, 14 * imgSize)
            }),
            id: "MarkerYB" + ybtype+ value.TFBH + i,
            RADIUS10: value.ZJ_RADIUS10,
            RADIUS7: value.ZJ_RADIUS7,
            //content: markerContent,
            //anchor: "center" // 设置锚点方位
            label: {
                content: markerContent,
                offset: labelOffset
            }
        });
        map.add(marker2); // 将标注添加到地图中
        arrayListMarker.push(marker2);
        //console.error(value);
        var strTime = value.RQSJ;
        var strTitle = "<b>" + value.TFNM + "</b> " + strTime;
        var strLngLat = "东经" + value.JD + "° 北纬" + value.WD + "°";
        var strFSFL = value.FS + "米/秒," + GetIconResult(value.COLOR);
        var strQY = value.QY + "百帕";
        var tfGradeHtml = "<span style='background:#" + value.COLOR + ";padding:2px;margin-left: 10px;'>" + GetIconResultType(value.COLOR) + "<span>";
        var tfLabelList = [
            { name: "中心位置", value: strLngLat },
            { name: "最大风速", value: value.FS + "米/秒" + tfGradeHtml },
            { name: "中心气压", value: strQY }
        ];

        if (value.YDFX != "" && value.YDFX != undefined) {
            tfLabelList.push({ name: "移动方向", value: value.YDFX });
        }
        if (value.YDSD != "" && value.YDSD != undefined) {
            tfLabelList.push({ name: "移动速度", value: value.YDSD + "公里/小时" });
        }
        if (value.RADIUS7 != "" && value.RADIUS7 != undefined) {
            tfLabelList.push({ name: "风圈半径", value: "东北  东南  西北  西南" });
            var sarr = value.ZJ_RADIUS7.split("|");
            var svalue = sarr[0] + "  " + sarr[1] + "  " + sarr[2] + "  " + sarr[3] + "  (KM)";
            tfLabelList.push({ name: "七级", value: svalue });
        }
        if (value.RADIUS10 != "" && value.RADIUS10 != undefined) {
            var sarr = value.ZJ_RADIUS10.split("|");
            var svalue = sarr[0] + "  " + sarr[1] + "  " + sarr[2] + "  " + sarr[3] + "  (KM)";
            tfLabelList.push({ name: "十级", value: svalue });
        }
        if (value.RADIUS12 != "" && value.RADIUS12 != undefined) {
            var sarr = value.ZJ_RADIUS12.split("|");
            var svalue = sarr[0] + "  " + sarr[1] + "  " + sarr[2] + "  " + sarr[3] + "  (KM)";
            tfLabelList.push({ name: "十二级", value: svalue });
        }

        var strHtml = getPopupHtml(value.ID, i, strTitle, strLngLat, strFSFL, strQY, tfLabelList);
        marker2.content = strHtml;
        if (imgSize == 1) {
            marker2.on('click', markerClick);
            //marker2.emit('click', { target: marker2 });
        }
    } catch (e) {

    }
}
IsPolyline_YB = function (ID,arlist, color, arrlistIcon, flightPlanCoordinates_YB) {
    //画台风"预报"折线
    //flightPath_YB = new AMap.Polyline(flightPlanCoordinates_YB,
    //    {
    //        strokeColor: "#" + color,
    //        strokeWeight: 2,
    //        strokeOpacity: 0.8,
    //        strokeStyle: "dashed"
    //    });
    //map.addOverlay(flightPath_YB);

    ////正式预报路径对象，一个对象相当于一条完整台风路径
    //arrayListPath_YB[arrayListPath_YB.length] = flightPath_YB;
    try {
        var polyline = new AMap.Polyline({
            path: flightPlanCoordinates_YB,          //设置线覆盖物路径
            strokeColor: "#" + color, //线颜色
            strokeOpacity: 0.8,       //线透明度
            strokeWeight: 2,        //线宽
            strokeStyle: "dashed",   //线样式
            //strokeDasharray: [10, 10], //补充线样式
            id: "PolylineYB" + ID
        });
        map.add(polyline);
        arrayListLine.push(polyline);
    } catch (e) {

    }
}
/**************预报台风路径end**************/

/*******************************  清除正式台风路径 折线 标注点 Start   ***************************************************/
//清除折线
clearLine = function () {
    try {
        var tfbh = $.data(myData, "TFBH");
        //清除标注
        if (arrayListMarker) {
            for (var i = 0; i < arrayListMarker.length; i++) {
                //if (tfbh != undefined) {
                //    var id = arrayListMarker[i].w.id;
                //    if (id.indexOf(tfbh) > -1) {
                //        map.remove(arrayListMarker[i]);
                //    }
                //} else {
                    map.remove(arrayListMarker[i]);
                //}
            }
            //arrayListMarker.length = 0;
        }
        //清除折线
        if (arrayListLine) {
            for (var i = 0; i < arrayListLine.length; i++) {
                //if (tfbh != undefined) {
                //    var id = arrayListLine[i].w.id;
                //    if (id.indexOf(tfbh) > -1) {
                //        map.remove(arrayListLine[i]);
                //    }
                //}
                //else {
                    map.remove(arrayListLine[i]);
                //}
            }
            //arrayListLine.length = 0;
        }
    } catch (e) {

    }
}

//清除圆
function clearCircle() { //移除当前圆
    if (circle12) {
        map.remove(circle12);	//风圈 
        circle12 = null;
    }
    if (circle10) {
        map.remove(circle10);	//风圈 
        circle10 = null;
    }
    if (circle7) {
        map.remove(circle7);		//风圈 
        circle7 = null;
    }
}

//清除信息框
function clearInfoWindow() {
    if (infoWindow != null) {
        infoWindow.close();
    }
}

//清除所有：包括折线、园、信息框
function clearMapAllObj() {
    //去掉路径
    clearLine();
    //去掉风圈
    clearCircle();
    //清除弹出信息框
    clearInfoWindow();
}

//清除点击的预报路径
clearLineClickYBLJ = function () {
    try {
        //清除标注
        if (arrayListMarker) {
            for (var i = 0; i < arrayListMarker.length; i++) {
                var id = arrayListMarker[i].w.id;
                if (id.indexOf('clickyblj') > -1) {
                    map.remove(arrayListMarker[i]);
                }
            }
        }
        //清除折线
        if (arrayListLine) {
            for (var i = 0; i < arrayListLine.length; i++) {
                var id = arrayListLine[i].w.id;
                if (id.indexOf('clickyblj') > -1) {
                    map.remove(arrayListLine[i]);
                }
            }
        }
    } catch (e) {

    }
}


//上海边界
function addPolyline() {
    try {
        var strIcon = "./images/datouzhen.png";
        var value = { JD: wuxiCenter[0], WD: wuxiCenter[1] };
        var marker2 = new AMap.Marker({
            position: new AMap.LngLat(value.JD, value.WD),
            offset: new AMap.Pixel(0, 0),
            anchor: 'center', // 设置锚点方位
            icon: strIcon,
        });
        map.add(marker2); // 将标注添加到地图中
        var allrings = [];
        var arr = SHBJ.split('|');
        for (var num = 0; num < arr.length; num++) {
            var item = arr[num].split(',');
            allrings.push([item[0], item[1]]);
        }
        var polyline = new AMap.Polyline({
            path: allrings,          //设置线覆盖物路径
            strokeColor: "#00e4ff", //线颜色
            strokeWeight: 2,        //线宽
            strokeStyle: "dashed",   //线样式
        });
        map.add(polyline);
    } catch (e) {
    }
}

//头部时间
function setTime() {
    var dates = new Date();
    var day = dates.getDate() < 10 ? '0' + dates.getDate() : dates.getDate();
    var end = dates.format("yyyy年MM月dd日");
    var xq = '';
    if (dates.getDay() == 0) {
        xq = '星期日';
    } else if (dates.getDay() == 1) {
        xq = '星期一';
    } else if (dates.getDay() == 2) {
        xq = '星期二';
    } else if (dates.getDay() == 3) {
        xq = '星期三';
    } else if (dates.getDay() == 4) {
        xq = '星期四';
    } else if (dates.getDay() == 5) {
        xq = '星期五';
    } else {
        xq = '星期六';
    }
    $('.rightDay').html(end);
    $('.rightWeek').html(xq);
    var end_tm = dates.format("HH:mm:ss");
    $('.leftDate').html(end_tm);
};


//计算台风路径每个点到上海的距离
function getEveryPointDistance() {
    var distance = 150;//公里
    var lgtd = wuxiCenter[0];
    var lttd = wuxiCenter[1];
    var data = $.data(myData, "TyphoonLJData");
    var dataResult = [];
    for (var num = 0; num < data[0].points.length; num++) {
        var lgtd2 = data[0].points[num].JD;
        var lttd2 = data[0].points[num].WD;
        var dis = GetDistance(lgtd, lttd, lgtd2, lttd2).toFixed(1);
        //console.error(dis);
        if (dis <= distance) {
            dataResult.push(data[0].points[num]);
        }
    }
    if (dataResult.length > 0) {
        var strTime = new Date(convertToDate(dataResult[0].RQSJ2)).format("yyyy-MM-dd H:mm:ss");
        //console.error("开始时间：", strTime);
        strTime = new Date(convertToDate(dataResult[dataResult.length-1].RQSJ2)).format("yyyy-MM-dd H:mm:ss");
        //console.error("结束时间：", strTime);
    }
    //console.error(dataResult);
}