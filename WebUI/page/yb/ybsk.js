var map = window.parent.map;//获取地图对象

var LayerID = "ybsk_Layer4";
var ybsk_LayerGraphicLayer = map.getLayer(LayerID);
if (ybsk_LayerGraphicLayer != null) {
    map.removeLayer(ybsk_LayerGraphicLayer);
}
ybsk_LayerGraphicLayer = CreateLayer(LayerID);

var labels = new Array();
var _globallevel = 5;
/*设置图层的最小可见度*/
//setMinLevel(ybsk_LayerGraphicLayer, 8);
/*设置图层的飞行提示*/
setLayerToolTip(ybsk_LayerGraphicLayer, "STNM", "TM,UPZ,CQ,XSL", "时间,水位@(m),流量@(m³/s),蓄水量@(亿方)");

ybsk_LayerGraphicLayer.on("click", onSQClick);

function onSQClick(evt) { 
    var stcd = evt.graphic.attributes.STCD; 
    var stnm = evt.graphic.attributes.STNM; 
    var _stcd = mini.get("STCD");
    var nodes = _stcd.getSelected(); 
    var PLAN_N = nodes.DD_ID;
    var stime = new Date(convertToDate(nodes.DD_TM)).format("yyyy-MM-dd HH:mm:ss");
    var etime = new Date(convertToDate(nodes.DD_CHECKBY)).format("yyyy-MM-dd HH:mm:ss");
    var url = "/Danzhan/YBSKLine.html?DD_ID=" + PLAN_N + "&STCD=" + stcd + "&STNM=" + stnm + "&stime=" + stime + "&etime=" + etime;;
    openChart(url, stnm, stcd, "");
}
function addMark(obj) { 
    ybsk_LayerGraphicLayer.clear();
    if (obj == null)
        return;
    require(["esri/geometry/Point",
                        "esri/graphic",
                        "myJs/MapText",
                        "esri/symbols/PictureMarkerSymbol",
                        "esri/InfoTemplate",
                        "esri/dijit/InfoWindow",
                        "esri/layers/GraphicsLayer",
                        "esri/geometry/webMercatorUtils", "esri/symbols/TextSymbol", "dojo/domReady!"
            ], function (Point, Graphic, MapText, PictureMarkerSymbol, InfoTemplate, InfoWindow, GraphicsLayer, webMercatorUtils, TextSymbol) {
                var breakSymbol;
                var sureCount = 0;
                var warnCount = 0;
                var lackCount = 0;
                _destroy(); 
                labels = new Array();
                for (var i = 0; i < obj.length; i++) {
                    if (obj[i].LGTD == undefined && obj[i].LTTD == undefined) {
                        continue;
                    }
                    var state = 0; 
                    var z = parseFloat(obj[i].UPZ); 
                    var wrz = parseFloat(obj[i].WRZ);
                    var grz = parseFloat(obj[i].GRZ);
                     
                    //if ((obj[i].UPZ == null || obj[i].UPZ == "")) {
                    //    breakSymbol = new PictureMarkerSymbol("/arcgis_js_api/myJs/images/gray_hd.gif", 18, 18);
                    //} else if (z >= grz && grz!=0) {
                    //    sureCount++;
                    //    breakSymbol = new PictureMarkerSymbol("/arcgis_js_api/myJs/images/s_red_u.gif", 18, 18);
                    //    state = 2;
                    //} else if (z >= wrz && wrz != 0) {
                    //    warnCount++;
                    //    breakSymbol = new PictureMarkerSymbol("/arcgis_js_api/myJs/images/s_yellow_u.gif", 18, 18);
                    //    state = 1; 
                    //} else { 
                        breakSymbol = new PictureMarkerSymbol("/arcgis_js_api/myJs/images/blue_hd.gif", 18, 18); 
                        state = 0;
                    //} 
                    var point = new Point({ "x": obj[i].LGTD, "y": obj[i].LTTD, "spatialReference": { "wkid": 4326} });
                    var cls = "waterText  waterText";
                    if (state == 2) {
                        cls = "grzText grzText";
                    }
                    else if (state == 1) {
                        cls = "wrzText wrzText";
                    }

                    var tm = obj[i].TM;
                    if (tm == "") {
                        tm = obj[i].TM;
                    } else {
                        tm = new Date(convertToDate(tm)).format('MM-dd HH:mm');
                    }

                    obj[i].TM = tm;

                    var upzText = obj[i].UPZ == null ? "-" : obj[i].UPZ;//+ "m";
                    var textStr = obj[i].STNM + ":" + upzText;
           
          
                    //textStr = obj[i].STNM;
                    //textStr += "<br/>时间：" + tm;

                    //if (upzText != "-") {
                    //    textStr += "<br/>水位：" + upzText;
                    //}
                    //if (upzText == "-") {
                    //    textStr = obj[i].STNM;
                    //}
                    
                    var label = new MapText(map, point, obj[i], textStr, _globallevel, "right", cls,12);
                    labels.push(label);
                    var graphic = new Graphic(point, breakSymbol, obj[i], null);
                    ybsk_LayerGraphicLayer.add(graphic);
                }
            });
}
