var map = window.parent.map;
var LayerID = "RainLayer";
var RainLayerGraphicLayer = null;
try {
	RainLayerGraphicLayer = map.getLayer(LayerID);
	if (RainLayerGraphicLayer != null) {
		map.removeLayer(RainLayerGraphicLayer);
	}
	RainLayerGraphicLayer = CreateLayer(LayerID);
} catch (e) {
	window.location.reload();
}

var labels = new Array();
var _globallevel = 5;
/*设置图层的飞行提示*/
setLayerToolTip(RainLayerGraphicLayer, "stnm", "drp", "累计雨量@(mm)");

RainLayerGraphicLayer.on("click", onYQClick);

function onYQClick(evt) {
    if (evt.graphic.attributes != null) {
        var stcd = evt.graphic.attributes.stcd;
        var stnm = evt.graphic.attributes.stnm;
        var stime = formatDate(mini.get("start").getFormValue().replaceAll("-", "/") + ":00");
        var etime = formatDate(mini.get("end").getFormValue().replaceAll("-", "/") + ":00");
        Trans(stcd,stnm);
    }
}

function addMark(arr) {
    if (RainLayerGraphicLayer != null) {
        RainLayerGraphicLayer.clear();
        RainLayerGraphicLayer.setVisibility(true);
    }
    require(["esri/map", "esri/geometry/Point",
		"esri/graphic",
		"myJs/MapTextNew",
		"esri/symbols/PictureMarkerSymbol",
		"esri/InfoTemplate",
		"esri/dijit/InfoWindow", "esri/symbols/SimpleMarkerSymbol", "esri/Color",
		"esri/layers/GraphicsLayer", "esri/SpatialReference", "esri/geometry/webMercatorUtils", "dojo/domReady!"
	], function(Map, Point, Graphic, MapTextNew, PictureMarkerSymbol, InfoTemplate, InfoWindow, SimpleMarkerSymbol, Color,
		GraphicsLayer, SpatialReference, webMercatorUtils) {
	    var v = 0;
	    _destroy();


	    if (arr.length > 0) {
	        for (var i = 0; i < arr.length; i++) {
	            var item = arr[i];
	            var f = parseFloat(item.drp);
				var cls = "rainText";
				var pUrl="././arcgis_js_api//myJs/images/";
				var imgUrl="";
	            if (f >= 250.0) {
	                imgUrl="d_black.png";
	                cls = "rainText200";
	            }
	            else if (f >= 100.0) {
	                imgUrl="d_red.png";
	                cls = "rainText199";
	            }
	            else if (f >= 50.0) {
	                imgUrl="d_yellow.png";
	                cls = "rainText99";
	            }
	            else if (f >= 25.0) {
	                imgUrl="d_blue.png";
	                cls = "rainText49";
	            }
	            else if (f >= 10.0) {
	                imgUrl="d_sky.png";
	                cls = " rainText24";
	            }
	            else if (f > 0.0) {
	                imgUrl="d_grey.png";
	                cls = "rainText9";
	            }
	            else {
	                imgUrl="d_white.png";
				}
				breakSymbol = new PictureMarkerSymbol(pUrl+imgUrl, 14, 18);

	            if (breakSymbol == "") continue;
	            if (item.lgtd == undefined && item.lttd == undefined) {
	                continue;
	            } else {
	                var point = new Point(arr[i].lgtd, arr[i].lttd, new SpatialReference({
	                    wkid: 4326
	                }));
	                var graphic = new Graphic(point, breakSymbol, arr[i], null);

	                if (window.parent.SpanBiaoZhu() == false) {
	                    cls += "@";
	                }
	                var _align = "top";
	                if ("63301200".lastIndexOf(arr[i].stcd) > -1) {
	                    _align = "bottom";
	                }
	                var textStr = arr[i].stnm + "@" + arr[i].drp + "mm";
	                // if (f > 0) {
	                // textStr += "<br/>" + arr[i].drp + "mm";
	                // }
	                var label = new MapTextNew(map, point, arr[i], textStr, _globallevel, _align, cls,
						12);
	                labels.push(label);

	                // var strTitle2 = "";
	                // cls = cls.replaceAll(' ', '');
	                // if (_align == "bottom") {
	                // strTitle2 = "▴";
	                // } else if (_align == "top") {
	                // strTitle2 = "▾";
	                // } else if (_align == "left") {
	                // strTitle2 = "▸";
	                // } else if (_align == "right") {
	                // strTitle2 = "◂";
	                // }
	                // label = new MapTextNew(map, point, arr[i], strTitle2, _globallevel, _align, cls, 12);
	                // labels.push(label);
	                RainLayerGraphicLayer.add(graphic);
	            }
	        }
	    }

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
            var strImg = ClientIP + "UploadDoc/Rainfall/" + picUrl;
            //strImg = "http://127.0.0.1:8200/Common/Images/嘉兴风险图.png";
            //alert(strImg);
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
    }
    );
}