var map = window.parent.map;
var LineGraphicLayer = CreateLayer("TrailLine_Layer222");
var breakGraphicLayer = CreateLayer("Trail_Layer");

var baoLayer = CreateLayer("baoLayer");
var labels = new Array();

/*设置图层的飞行提示*/
setLayerToolTip(breakGraphicLayer, "X_RIVERNAME", "STIME,ETIME,USERNAME", "开始时间,结束时间,巡河人员");


baoLayer.on("click", onClick);

function onClick(evt) {
    //alert(evt.graphic.attributes.STCD);
    //var id = evt.graphic.attributes.ID;
    //var name = evt.graphic.attributes.MT_NAME;
    //openChart("page/gj/ReportInfo.htm?id=" + id, id);
}

function addMark(arr) {
    //_destroy();
    breakGraphicLayer.clear();
    DateUtil(arr); //画线
    require(["esri/map", "esri/geometry/Point",
                     "esri/graphic",
                     "myJs/MapText",
                     "esri/symbols/PictureMarkerSymbol",
                     "esri/InfoTemplate",
                     "esri/dijit/InfoWindow", "esri/symbols/SimpleMarkerSymbol", "esri/Color",
                     "esri/layers/GraphicsLayer", "esri/SpatialReference", "esri/geometry/webMercatorUtils", "dojo/domReady!"
                ], function (Map, Point, Graphic, MapText, PictureMarkerSymbol, InfoTemplate, InfoWindow, SimpleMarkerSymbol, Color, GraphicsLayer, SpatialReference, webMercatorUtils) {
                    
                    var breakSymbol;
                    var startGra;
                    var endGra;
                    for (var i = 0; i < arr.length; i++) {
                        var point = new Point(Number(arr[i].LGTD), Number(arr[i].LTTD), new SpatialReference({ wkid: 4326 }));
                        if (i == 0) {
                            breakSymbol = new PictureMarkerSymbol("arcgis_js_api/myJs/images/dy/start.png", 20, 28);
                            breakSymbol.yoffset = 14;
                            startGra = new Graphic(point, breakSymbol, arr[i], null);
                        }
                        else if (i == arr.length - 1) {
                            breakSymbol = new PictureMarkerSymbol("arcgis_js_api/myJs/images/dy/end.png", 20, 28);
                            breakSymbol.yoffset = 14;
                            endGra = new Graphic(point, breakSymbol, arr[i], null);
                        }
                        else {
                            var breakSymbol2 = new PictureMarkerSymbol("arcgis_js_api/myJs/images/dy/point.png", 10, 10);
                            var pointgra = new Graphic(point, breakSymbol2, arr[i], null);
                            breakGraphicLayer.add(pointgra);
                        }
                    }
                    breakGraphicLayer.add(startGra);
                    breakGraphicLayer.add(endGra);
                });

            }


function addMark2(arr) {
    
    require(["esri/map", "esri/geometry/Point",
                     "esri/graphic",
                     "myJs/MapText",
                     "esri/symbols/PictureMarkerSymbol",
                     "esri/InfoTemplate",
                     "esri/dijit/InfoWindow", "esri/symbols/SimpleMarkerSymbol", "esri/Color",
                     "esri/layers/GraphicsLayer", "esri/SpatialReference", "esri/geometry/webMercatorUtils", "dojo/domReady!"
                ], function (Map, Point, Graphic, MapText, PictureMarkerSymbol, InfoTemplate, InfoWindow, SimpleMarkerSymbol, Color, GraphicsLayer, SpatialReference, webMercatorUtils) {
                    //_destroy();   
                    baoLayer.clear();            
                    for (var i = 0, len = arr.length; i < len; i++) {
                        var point = new Point(Number(arr[i].LGTD), Number(arr[i].LTTD), new SpatialReference({ wkid: 4326 }));
                        var symbol = new PictureMarkerSymbol("arcgis_js_api/myJs/images/dy/bao.gif", 20, 28);
                        symbol.yoffset = 14;
                        var gra = new Graphic(point, symbol, arr[i], null);
                        var label = new MapText(map, point, arr[i], arr[i].STNM + ":" + arr[i].FLOW + "m³/s", _globallevel, "bottom", "waterText", 12);
                        labels.push(label);
                        baoLayer.add(gra);
                    }
                    
                });
}

function DateUtil(dataList) {
    LineGraphicLayer.clear();
    window.parent.addGJLine(dataList, LineGraphicLayer);
}
