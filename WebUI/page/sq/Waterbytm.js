var map = window.parent.map; //获取地图对象
var LayerID = "WaterLayer";
var WaterLayerGraphicLayer = null;
try {
    WaterLayerGraphicLayer = map.getLayer(LayerID);
    if (WaterLayerGraphicLayer != null) {
        map.removeLayer(WaterLayerGraphicLayer);
    }
    WaterLayerGraphicLayer = CreateLayer(LayerID);
} catch (e) {
    window.location.reload();
}
var labels = new Array();
var _globallevel = 5;
/*设置图层的最小可见度*/
//setMinLevel(WaterLayerGraphicLayer, 8);
/*设置图层的飞行提示*/
setLayerToolTip(WaterLayerGraphicLayer, "stnm", "Z,TEMP,wrz,grz,ivhz", "最高水位@(m),发生时间,警戒@(m),保证@(m),历史最高@(m)");

WaterLayerGraphicLayer.on("click", onSQClick);

function onSQClick(evt) {
    var obj = evt.graphic.attributes;
    if (obj != null && obj != undefined) {
        var stcd = obj.stcd;
        var stnm = obj.stnm;
        Trans(stcd, stnm);
    }
}

function addMark(obj) {
    if (WaterLayerGraphicLayer != null) {
        WaterLayerGraphicLayer.clear();
        WaterLayerGraphicLayer.setVisibility(true);
    }

    if (obj == null)
        return;
    require(["esri/geometry/Point",
            "esri/graphic",
            "myJs/MapTextNew",
            "esri/symbols/PictureMarkerSymbol",
            "esri/InfoTemplate",
            "esri/dijit/InfoWindow",
            "esri/layers/GraphicsLayer",
            "esri/geometry/webMercatorUtils", "esri/symbols/TextSymbol", "dojo/domReady!"
        ], function (Point, Graphic, MapTextNew, PictureMarkerSymbol, InfoTemplate, InfoWindow, GraphicsLayer,
            webMercatorUtils,
            TextSymbol) {
            var breakSymbol;
            _destroy();
            for (var i = 0; i < obj.length; i++) {
                var item = obj[i];

                if (item.lgtd == undefined && item.lttd == undefined) {
                    continue;
                }
                var cls = " level_zc";
				console.error("state",item.state);
                breakSymbol = new PictureMarkerSymbol("././arcgis_js_api/myJs/images/blue_hd.gif", 15, 15);
				if(item.state=="0"){
					breakSymbol = new PictureMarkerSymbol("././arcgis_js_api/myJs/images/s_red_u11.png", 15, 15);
                    cls = " level_grz";
				}
				else if(item.state=="1"){
					breakSymbol = new PictureMarkerSymbol("././arcgis_js_api/myJs/images/s_yellow_u11.png", 15, 15);
                    cls = " level_wrz";
				}
				else if(item.state=="2"){
					breakSymbol = new PictureMarkerSymbol("././arcgis_js_api/myJs/images/blue_hd.gif", 15, 15);
				}
				else if(item.state=="3"){
					breakSymbol = new PictureMarkerSymbol("././arcgis_js_api/myJs/images/gray_hd.gif", 15, 15);
				}
                // if (item.tm != null && item.tm != undefined) {
                //     var tms = new Date(new Date(new Date(mini.get("end").getFormValue())).format("yyyy/MM/dd"));
                //     if (tms > new Date()) {
                //         tms = new Date(new Date().format("yyyy/MM/dd"));
                //     }
                //     if (item.grz != undefined && Number(item.grz) > 0) {
                //         if (Number(item.upz) >= Number(item.grz)) {
                //             breakSymbol = new PictureMarkerSymbol(
                //                 "././arcgis_js_api/myJs/images/s_red_u.gif", 15, 15);
                //             cls = " level_grz";
                //         }
                //     } 
				// 	else if (item.wrz != undefined && Number(item.wrz) > 0) {
						
                //         if (Number(item.upz) >= Number(item.wrz)) {
                //             breakSymbol = new PictureMarkerSymbol(
                //                 "././arcgis_js_api/myJs/images/s_yellow_u.gif", 15, 15);
                //             cls = " level_wrz";
                //         }
                //     }
                // } else {
                //     breakSymbol = new PictureMarkerSymbol("././arcgis_js_api/myJs/images/gray_hd.gif", 15, 15);
                // }



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
                if (item.upz != undefined) {
                    item.upz = Number(item.upz).toFixed(2);
                    if (item.upz != null) {
                        textStr += "" + item.upz;
                    } else {
                        if (item.dwz != undefined) {
                            item.dwz = Number(item.dwz).toFixed(2);
                            textStr += "" + item.dwz;
                        } else {
                            textStr += "—";
                        }
                    }
                    item.Z = item.upz;
                } else {
                    if (item.dwz != undefined) {
                        item.dwz = NumberData(item.dwz, "水情");
                        textStr += "" + item.dwz;
                    } else {
                        textStr += "—";
                    }

                }
                if (item.upz != undefined) {
                    item.upzS = Number(item.upz).toFixed(2);
                }
                if (item.dwz != undefined) {
                    item.dwzS = Number(item.dwz).toFixed(2);
                }
                if (item.wrz != undefined) {
                    item.wrz = Number(item.wrz).toFixed(2);
                }


                var tm = item.tm;
                if (tm == undefined) {
                    tm = "—";
                    item.TEMP = tm;
                } else {
                    item.TEMP = new Date(convertToDate(tm)).format('yyyy/MM/dd HH:mm');
                }

                //textStr += "<br/>时间：" + tm;
                var _align = "top";
                if ("63301200,63405290,63404510,63402600,63405000,63405100,63402300,63404700,63405150,62701710,63402500"
                    .lastIndexOf(item.stcd) > -1) {
                    _align = "bottom";
                }
                if ("63405200".lastIndexOf(item.stcd) > -1) {
                    _align = "right";
                }
                if ("63404710,63404770".lastIndexOf(item.stcd) > -1) {
                    _align = "left";
                }
                //console.error(window.parent.SpanBiaoZhu());
                if (!window.parent.SpanBiaoZhu()) {
                    cls += "@";
                }
                if (textStr == "") {
                    textStr = "—";
                }

                var _GlobalTab = window.parent.tabs.getActiveTab();
                var _url = _GlobalTab.url;
                if (_url.lastIndexOf("sq/waterbytm.html") > -1) {
                    var label = new MapTextNew(map, point, item, textStr, _globallevel, _align, cls, 12);
                    labels.push(label);
                    var graphic = new Graphic(point, breakSymbol, item, null);
                    WaterLayerGraphicLayer.add(graphic);
                }
            }
			// window.parent.setMapZoomNew(WaterLayerGraphicLayer, map.getLevel(), "SQ", "stcd",window.parent.SpanBiaoZhu());
        	// window.parent.mapZoomEnd(WaterLayerGraphicLayer, null, "SQ", "stcd",window.parent.SpanBiaoZhu());
        });
}


function MapRainfall(obj, flag, picUrl) {
    require([
        "esri/layers/MapImage",
    ], function (MapImage) {
        if (flag == true) {
            if (window.parent.strImageLayer != undefined) {
                window.parent.myMapImageLayer.removeImage(window.parent.strImageLayer);
            }
            var strImg = ClientIP + "UploadDoc/WaterLevel/" + picUrl;
            window.parent.strImageLayer = new MapImage({
                'extent': {
                    'xmin': obj.xmin,
                    'ymin': obj.ymin,
                    'xmax': obj.xmax,
                    'ymax': obj.ymax,
                    'spatialReference': {
                        'wkid': 4326
                    }
                },
                'href': strImg
            });
            window.parent.myMapImageLayer.addImage(window.parent.strImageLayer);
            window.parent.myMapImageLayer.setOpacity(0.8);
            window.parent.myMapImageLayer.setVisibility(true);
        } else {
            window.parent.myMapImageLayer.setVisibility(false);
        }
    });



}