var map = window.parent.map;//获取地图对象
var LayerID = "ybhw_Layer1";
var ybhw_LayerGraphicLayer = map.getLayer(LayerID);
if (ybhw_LayerGraphicLayer != null) {
    map.removeLayer(ybhw_LayerGraphicLayer);
}
ybhw_LayerGraphicLayer = CreateLayer(LayerID);

var labels = new Array();
var _globallevel = 5;
/*设置图层的最小可见度*/
//setMinLevel(ybll_LayerGraphicLayer, 8);
/*设置图层的飞行提示*/
setLayerToolTip(ybhw_LayerGraphicLayer, "STNM", "TM,DATA", "时间,数据@(mg/L)");

ybhw_LayerGraphicLayer.on("click", onSQClick);



function onSQClick(evt) { 
    var stcd = evt.graphic.attributes.STCD; 
    var stnm = evt.graphic.attributes.STNM; 
    var dm_id = evt.graphic.attributes.起始断面序; 
    Trans(stcd, stnm, dm_id);
}
function addMark(obj) { 
    ybhw_LayerGraphicLayer.clear();
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
    ],
        function (Point, Graphic, MapText, PictureMarkerSymbol, InfoTemplate, InfoWindow,
        GraphicsLayer, webMercatorUtils, TextSymbol) {
                var breakSymbol;
                var sureCount = 0;
                var warnCount = 0;
                var lackCount = 0;
                _destroy(); 
                for (var i = 0; i < obj.length; i++) {
                    var temp = "";
                    var state = 0; 
                    var z = parseFloat(obj[i].DATA); 
                    var wrz = parseFloat(obj[i].WRZ);
                    var grz = parseFloat(obj[i].GRZ);
                     
                    //if ((obj[i].DATA == null || obj[i].DATA == "")) {
                        breakSymbol = new PictureMarkerSymbol("/arcgis_js_api/myJs/images/sz/jinggai.png", 18, 18);
                    //} else if (z >= grz) {
                    //    sureCount++;
                    //    breakSymbol = new PictureMarkerSymbol("/arcgis_js_api/myJs/images/s_red_u.gif", 12, 15);
                    //    state = 2;

                    //} else if (z >= wrz) {
                    //    warnCount++;
                    //    breakSymbol = new PictureMarkerSymbol("/arcgis_js_api/myJs/images/s_yellow_u.gif", 12, 15);
                    //    state = 1; 
                    //} else { 
                    //    breakSymbol = new PictureMarkerSymbol("/arcgis_js_api/myJs/images/sz/beng-red.png", 18, 18); 
                    //    state = 0;
                    //} 
                    //var point = new Point({ "x": obj[i].LGTD, "y": obj[i].LTTD, "spatialReference": { "wkid": 4326} }); 
                    if (obj[i].LGTD == undefined && obj[i].LTTD == undefined) {
                        continue;
                    }
                    var point = new Point({ "x": obj[i].LGTD, "y": obj[i].LTTD, "spatialReference": { "wkid": 4326} });
                    //point = webMercatorUtils.geographicToWebMercator(point);
                    var cls = "waterText  waterText";
                    if (state == 2) {
                        cls = "grzText";
                    }
                    else if (state == 1) {
                        cls = "wrzText";
                    }

                    var tm = obj[i].TM;
                    if (tm == "") {
                        tm = obj[i].TM;
                    } else {
                        tm = new Date(convertToDate(tm)).format('MM-dd HH');
                    }

                    obj[i].TM = tm;

                    var upzText = obj[i].DATA == null ? "-" : obj[i].DATA + "mg/L";
                    var textStr = obj[i].STNM + ":" + upzText;
                    //textStr = obj[i].STNM;
                    //textStr += "<br/>时间：" + tm;

                    //if (upzText != "-") {
                    //    textStr += "<br/>数据：" + upzText;
                    //}
                    //if (upzText == "-") {
                    //    textStr = obj[i].STNM;
                    //}




                    var label = new MapText(map, point, obj[i], textStr, _globallevel, "right", cls, 12);
                    labels.push(label);
                    var graphic = new Graphic(point, breakSymbol, obj[i], null);
                    ybhw_LayerGraphicLayer.add(graphic);
                }
            });
        }