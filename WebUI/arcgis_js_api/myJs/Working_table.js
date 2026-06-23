
var normalGraphicLayer = CreateLayer("sq_dyLayer4");
var labels = new Array();
var _globallevel = 10;
/*设置图层的最小可见度*/
//setMinLevel(normalGraphicLayer, 8);
/*设置图层的飞行提示*/
setLayerToolTip(normalGraphicLayer, "STNM", "UPZ,DWZ,TEMP,SWC", "上游水位,下游水位,时&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;间,超警幅度");

normalGraphicLayer.on("click", onSQClick);

function onSQClick(evt) { 
    var stcd = evt.graphic.attributes.STCD; 
    var stnm = evt.graphic.attributes.STNM;
    var tm = mini.get("end").getFormValue();
    var tempTM = new Date(tm + ":00");
    openChart("page/sq/WaterLineChart.htm?stcd=" + stcd + "&stnm=" + (stnm) + "&stime=" + tempTM.format("yyyy-MM-dd 00:00:00") + "&etime=" + tempTM.format("yyyy-MM-dd HH:mm:ss"), stnm+"水位过程线",stcd);
}
function addSQMark(obj) {
  
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
             
                for (var i = 0; i < obj.length; i++) {
                    var temp = "";
                    var state = 0;
                    var sttp = obj[i].STTP;
                    var z = parseFloat(obj[i].UPZ);
                    var dwz = parseFloat(obj[i].DWZ);
                    var wrz = parseFloat(obj[i].WRZ);
                    var grz = parseFloat(obj[i].GRZ);
                     
                    if ((obj[i].UPZ == null || obj[i].UPZ == "") && (obj[i].DWZ == null || obj[i].DWZ == "")) {
                        breakSymbol = new PictureMarkerSymbol("/arcgis_js_api/myJs/images/gray_hd.gif", 12, 15);
                    } else if (z >= grz || dwz >= grz) {
                        sureCount++;
                        breakSymbol = new PictureMarkerSymbol("/arcgis_js_api/myJs/images/s_red_u.gif", 12, 15);
                        state = 2;

                    } else if (z >= wrz || dwz >= wrz) {
                        warnCount++;
                        breakSymbol = new PictureMarkerSymbol("/arcgis_js_api/myJs/images/s_yellow_u.gif", 12, 15);
                        state = 1; 
                    } else { 
                            breakSymbol = new PictureMarkerSymbol("/arcgis_js_api/myJs/images/blue_hd.gif", 12, 15); 
                        state = 0;
                    } 
                    //var point = new Point({ "x": obj[i].LGTD, "y": obj[i].LTTD, "spatialReference": { "wkid": 4326} }); 
                    if (obj[i].LGTD == undefined && obj[i].LTTD == undefined) {
                        continue;
                    }
                    var point = new Point({ "x": obj[i].LGTD, "y": obj[i].LTTD, "spatialReference": { "wkid": 4214} });
                    //point = webMercatorUtils.geographicToWebMercator(point);
                    var cls = "waterText";
                    if (state == 2) {
                        cls = "grzText";
                    }
                    else if (state == 1) {
                        cls = "wrzText";
                    }
                    var upzText = obj[i].UPZ == null ? "-" : obj[i].UPZ + "m";
                    var dwzText = obj[i].DWZ == null ? "-" : obj[i].DWZ + "m";
                    var textStr = obj[i].STNM + ":" + upzText + "/" + dwzText;
                    textStr = obj[i].STNM;
                    if (upzText != "-") {
                        textStr += "<br/>" + upzText;
                    }
                    if (dwzText != "-") {
                        textStr += "<br/>" +dwzText;
                    }
                    if (upzText == "-" && dwzText == "-") {
                        textStr = obj[i].STNM;
                    }

                    var tm = obj[i].TM;
                    if (tm == "") {
                        tm = obj[i].TM;
                    } else {
                        tm = mini.formatDate(new Date(obj[i].TM), 'MM-dd HH:mm')
                    }

                    obj[i].TEMP = tm;


                    var label = new MapText(map, point, obj[i], textStr, _globallevel, "bottom", cls, 12);
                    labels.push(label);
                    var graphic = new Graphic(point, breakSymbol, obj[i], null);
                    normalGraphicLayer.add(graphic);
                }
            });
        }