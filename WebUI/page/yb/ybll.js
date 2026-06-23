var map = window.parent.map;//获取地图对象

var LayerID = "ybll_Layer4";
var ybll_LayerGraphicLayer = map.getLayer(LayerID);
if (ybll_LayerGraphicLayer != null) {
    map.removeLayer(ybll_LayerGraphicLayer);
}
ybll_LayerGraphicLayer = CreateLayer(LayerID);

var labels = new Array();
var _globallevel = 5;

/*设置图层的最小可见度*/
//setMinLevel(ybll_LayerGraphicLayer, 8);
/*设置图层的飞行提示*/
setLayerToolTip(ybll_LayerGraphicLayer, "STNM", "TM,DATA", "时间,流量@(m³/s)");

ybll_LayerGraphicLayer.on("click", onSQClick);

function onSQClick(evt) { 
    var stcd = evt.graphic.attributes.STCD; 
    var stnm = evt.graphic.attributes.STNM;
    var datatype = evt.graphic.attributes.DATATYPE;
    Trans(stcd, stnm, datatype);
}
var SQnormalGraphicLayer_LX;
SQnormalGraphicLayer_LX = CreateLayer("SQnormalGraphicLayer_LX");
function addMark(obj) { 
    ybll_LayerGraphicLayer.clear();
    SQnormalGraphicLayer_LX.clear();
    SQnormalGraphicLayer_LX.setVisibility(true);
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
                var breakSymbol_lx;//方向
                _destroy();
                for (var i = 0; i < obj.length; i++) {
                    if (obj[i].LGTD == undefined && obj[i].LTTD == undefined) {
                        continue;
                    }
                    breakSymbol_lx = new PictureMarkerSymbol("/arcgis_js_api/myJs/images/red.gif", 25, 15);
                    breakSymbol = new PictureMarkerSymbol("/arcgis_js_api/myJs/images/tzIco/tz_blue.png", 14, 14);
                    var point = new Point({ "x": obj[i].LGTD, "y": obj[i].LTTD, "spatialReference": { "wkid": 4326} });
                    var cls = " waterText";

                    var tm = obj[i].TM;
                    if (tm == "") {
                        tm = obj[i].TM;
                    } else {
                        tm = new Date(convertToDate(tm)).format('yyyy-MM-dd HH');
                    }
                    obj[i].TM = tm;
                    var _align = "right";
                    var upzText = obj[i].DATA == null ? "-" : obj[i].DATA + "m³/s"; 
                    var textStr = obj[i].STNM + ":" + upzText ;
                    var label = new MapText(map, point, obj[i], textStr, _globallevel, _align, cls, 12);
                    labels.push(label);
                    
                    var strTitle2 = "";
                    cls = cls.replaceAll(' ', '');
                    if (_align == "bottom") {
                        strTitle2 = "▴";
                    } else if (_align == "top") {
                        strTitle2 = "▾";
                    } else if (_align == "left") {
                        strTitle2 = "▸";
                    } else if (_align == "right") {
                        strTitle2 = "◂";
                    }
                    label = new MapText(map, point, obj[i], strTitle2, _globallevel, _align, cls, 12);
                    labels.push(label);
                    
                    var graphic = new Graphic(point, breakSymbol, obj[i], null);
                    ybll_LayerGraphicLayer.add(graphic);


                    var angle = obj[i].ANGLE - 90;//图片是横向的
                    var ll = obj[i].DATA == undefined ? "—" : Number(obj[i].DATA);
                  
                    //if (ll != 0) {
                    //    point = new Point({ "x": obj[i].LGTD + 0.001, "y": obj[i].LTTD + 0.001, "spatialReference": { "wkid": 4326 } });
                    //    var graphic_lx = new Graphic(point, breakSymbol_lx, obj[i], null);
                    //    breakSymbol_lx.angle = angle;
                    //    SQnormalGraphicLayer_LX.add(graphic_lx);
                    //}
                }
            });
        }