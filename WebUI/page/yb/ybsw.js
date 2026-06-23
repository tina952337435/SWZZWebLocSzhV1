var map = window.parent.map;//获取地图对象
var LayerID = "ybsw_Layer4";
var ybsw_LayerGraphicLayer = null;
try {
    ybsw_LayerGraphicLaye= map.getLayer(LayerID);
} catch (e) {
    window.location.reload();
}
if (ybsw_LayerGraphicLayer != null) {
    map.removeLayer(ybsw_LayerGraphicLayer);
}
 ybsw_LayerGraphicLayer = CreateLayer(LayerID);

/*设置图层的最小可见度*/
/*设置图层的飞行提示*/
setLayerToolTip(ybsw_LayerGraphicLayer, "STNM", "TM,DATA", "时间,水位@(m)");

ybsw_LayerGraphicLayer.on("click", onSQClick);
var labels = new Array();
var _globallevel = 5;
function onSQClick(evt) { 
    var stcd = evt.graphic.attributes.STCD; 
    var stnm = evt.graphic.attributes.STNM; 
    var _stcd = mini.get("STCD");
    var nodes = _stcd.getSelected(); 
    var PLAN_N = nodes.DD_ID;
    var ZU_ID = nodes.DD_MIND;
    var stime = $.data(myData, "STM");
    var etime = $.data(myData, "ETM"); 
    openChart("/DanZhan/DanZHanSel.html?stcd=" + stcd + "&stnm=" + (stnm) + "&stime=" + stime + "&etime=" + etime + "&PLAN_N=" + PLAN_N + "&ZU_ID=" + ZU_ID, stnm + "预测水位过程线","1200@660");
}
function addMark(obj) { 
    if (ybsw_LayerGraphicLayer != null) {
        ybsw_LayerGraphicLayer.clear();
    }
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
                _destroy(); 
                for (var i = 0; i < obj.length; i++) {
                    if (obj[i].LGTD == undefined && obj[i].LTTD == undefined) {
                        continue;
                    }
                    var temp = "";
                    var state = 0; 
                    var z = parseFloat(obj[i].DATA); 
                    var wrz = parseFloat(obj[i].WRZ);
                    var grz = parseFloat(obj[i].GRZ);
                    if ((obj[i].DATA == null || obj[i].DATA == "")) {
                        breakSymbol = new PictureMarkerSymbol("/arcgis_js_api/myJs/images/gray_hd.gif", 18, 18);
                    } else if (z >= grz && grz!=0) {
                        breakSymbol = new PictureMarkerSymbol("/arcgis_js_api/myJs/images/tzIco/tz_red.png", 14, 14);
                        state = 2;
                    } else if (z >= wrz && wrz != 0) {
                        breakSymbol = new PictureMarkerSymbol("/arcgis_js_api/myJs/images/tzIco/tz_yellow.png", 14, 14);
                        state = 1; 
                    } else { 
                        breakSymbol = new PictureMarkerSymbol("/arcgis_js_api/myJs/images/tzIco/tz_blue.png", 14, 14); 
                        state = 0;
                    } 
                    var point = new Point({ "x": obj[i].LGTD, "y": obj[i].LTTD, "spatialReference": { "wkid": 4326} });
                    var objID = "gqColor" + obj[i].STCD;

                    var cls = "  waterText";
                    if (state == 2) {
                        cls = "  grzText";
                    }
                    else if (state== 1) {
                        cls = "  wrzText";
                    }
                    var tm = obj[i].TM;
                    var dh = "";
                    if (tm == "") {
                        tm = obj[i].TM;
                    } else {
                        tm = new Date(convertToDate(tm)).format('MM-dd HH:mm');
                        dh=new Date(convertToDate(tm)).format('d日H时');
                    }
                    obj[i].TM = tm;
                    var upzText = obj[i].DATA == null ? "-" : obj[i].DATA;//+ "m";
                    var upzMax = obj[i].MAXDATA == null ? "-" : obj[i].MAXDATA;//+ "m";
                    var textStr = obj[i].STNM + "(当前：" + upzText+")";
                    textStr += "<br>最高：" + upzMax + "(" + dh+ ")";
                    
                    var _align = "right";
                    var stcd = obj[i].STCD;
                    if (stcd == "70424050" || stcd == "70400600" || stcd =="70402960") {
                        _align = "bottom";
                    } else if (stcd == "70426550" || stcd =="70402950") {
                        _align = "left";
                    }
                    //_align ="bottom";

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
                    ybsw_LayerGraphicLayer.add(graphic);
                }
            });
}
function MapRainfall(flag, picUrl) {
    var obj = {
        xmin: "119.657702", ymin: "27.509467", xmax: "122.106167", ymax: "29.415415" };
    require(["esri/geometry/Point",
        "esri/graphic",
        "myJs/MapText",
        "esri/symbols/PictureMarkerSymbol",
        "esri/layers/MapImage",
        "esri/InfoTemplate",
        "esri/dijit/InfoWindow",
        "esri/layers/GraphicsLayer",
        "esri/geometry/webMercatorUtils", "esri/symbols/TextSymbol", "dojo/domReady!"
    ], function (Point, Graphic, MapText, PictureMarkerSymbol, MapImage, InfoTemplate, InfoWindow, GraphicsLayer, webMercatorUtils, TextSymbol) {
        if (flag == true) {
            var tempLayer = window.parent.strImageLayer;
         
            var strImg = ClientIP + "NC/" + picUrl;
            window.parent.waterYBSWSST = picUrl;
            //alert(window.parent.strImageLayer)
            window.parent.strImageLayer = new MapImage({
                'extent': {
                    'xmin': obj.xmin,
                    'ymin': obj.ymin,
                    'xmax': obj.xmax,
                    'ymax': obj.ymax,
                    'spatialReference': { 'wkid': 4326 }
                }, 'href': strImg
            });
            window.parent.myMapImageLayer.addImage(window.parent.strImageLayer);
            //判断首页tab是不是当前页面，如果不是就不用叠加
            var _GlobalTab = window.parent.tabs.getActiveTab();
            var _url = _GlobalTab.url;
            if (_url.lastIndexOf("ybsw.html") > -1) {
                window.parent.myMapImageLayer.setOpacity(0.8);
                window.parent.myMapImageLayer.setVisibility(true);
            } else {
                window.parent.myMapImageLayer.setVisibility(false);
            }
        } else {
            window.parent.myMapImageLayer.setVisibility(false);
        }
    });

}