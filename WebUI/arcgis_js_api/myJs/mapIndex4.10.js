var map, gl, cycleMap3, bjLayer;
var layer1, layer2, layer3, layer4, layer5, layer6, layer7, layer8, layer9, layer10, layer11, layer12, layer13, layer14, myMapImageLayer, strImageLayer;
var BinData = [];
var areaOverallLayer;//行政分区图层
var swzzModerRiverUrl = "http://58.221.238.192:6080/arcgis/rest/services/SHSWZZModeRiver/MapServer";
var swzzAreaUrl = "http://36.155.90.4:6080/arcgis/rest/services/SHSWZZArea/MapServer";
var swzzModerRiverCenterLine = "http://36.155.90.4:6080/arcgis/rest/services/swzzModerRiverCenterLine/MapServer";
var swzzWaterAreaUrl = "http://36.155.90.4:6080/arcgis/rest/services/SHSWZZWATERAREA/MapServer";//水利片区
require(["esri/config", "esri/tasks/GeometryService"], function (esriConfig, GeometryService) {
    esriConfig.defaults.geometryService = new GeometryService("https://sampleserver6.arcgisonline.com/arcgis/rest/services/Geometry/GeometryServer");
    //esriConfig.defaults.io.alwaysUseProxy = true;
});
require([
    "esri/map",
    "esri/geometry/Extent",
    "esri/layers/MapImageLayer",
    "esri/layers/MapImage",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/layers/ArcGISTiledMapServiceLayer",
    "esri/layers/WebTiledLayer",
    "esri/layers/TileInfo",
      "esri/layers/WMTSLayer",
    "esri/layers/WMTSLayerInfo",
    "esri/layers/GraphicsLayer",
    "esri/toolbars/draw",
    "esri/InfoTemplate",
    "esri/tasks/QueryTask",
    "esri/graphic",
    "esri/layers/FeatureLayer",
    "myJs/MapText",
    "esri/geometry/webMercatorUtils",
    "esri/geometry/Point", "esri/SpatialReference",
    "esri/dijit/Measurement", "dojo/dom", "esri/units", "myJs/TDTMercatorLayer",
    "myJs/TDTLayer", "myJs/TDTImgLayer", "myJs/TDTNoteLayer", "myJs/TDTDXTLayer", "myJs/TDTRiverLayer",
    "myJs/GoogleImgLayer", "myJs/GoogleDxtLayer", "myJs/GoogleVecLayer",
    "dojo/domReady!"
], function (Map, Extent, MapImageLayer, MapImage, ArcGISDynamicMapServiceLayer, ArcGISTiledMapServiceLayer,
    WebTiledLayer,TileInfo,WMTSLayer,WMTSLayerInfo, GraphicsLayer, Draw, InfoTemplate, QueryTask, Graphic, FeatureLayer, MapText, webMercatorUtils, Point,
    SpatialReference, Measurement, dom, Units, TDTMercatorLayer, TDTLayer, TDTImgLayer, TDTNoteLayer, TDTDXTLayer, TDTRiverLayer,
    GoogleImgLayer, GoogleDxtLayer, GoogleVecLayer, ImageParameters) {
    map = new Map("myMap", {
        logo: false,
        slider: false, //放大缩小按钮 
        zoom: 8,
        maxZoom: 18,
        //minZoom: 5
        showLabels: true,
        center: [121.394615, 31.088122]
    });

    var url = "http://218.94.6.92:6080/arcgis/rest/services/jssl_vector_L3_L17/MapServer"; //水系图 
    var token = "kAiTBjERZMWBITLdsXqHR9b6eswMtXgGt2lSI9FCA3q1qs1WyYk9BwJHpZCZSoAbXolbKHwYgOVHHXl0IKeHvS3ZMZkMsQvF5gjr67dmlXX7KK1984gagg%3D%3D";
    
    var dynamicMapServiceLayer = new ArcGISDynamicMapServiceLayer(url, { id: "sxt", visible: false });
    url = "http://36.155.90.4:6080/arcgis/rest/services/SHHW/MapServer/";
    var dynamicMapServiceLayerNew = new ArcGISDynamicMapServiceLayer(url, { id: "SHHW", visible: false });


    //url = "http://10.32.36.161/arcgis15/rest/services/jssl_vector_with_water_2019/MapServer";
    //var ybRainLayer5 = new ArcGISDynamicMapServiceLayer(url, { id: "set_lx", useMapImage: true, visible: true });
    //map.addLayer(ybRainLayer5);

    //url = "http://10.32.36.161/arcgis15/rest/services/jssl_vector_with_water_anno_2019/MapServer";
    //var YBRainLayer3 = new ArcGISDynamicMapServiceLayer(url, { useMapImage: true, id: "tdt_ybnote", visible: true });
    //map.addLayer(YBRainLayer3);

   
     var SHZZUrl='http://31.16.1.101/arcgis/rest/services/shsw_JCDXT/MapServer';  
    var hedaoLayer = new ArcGISDynamicMapServiceLayer(SHZZUrl, { useMapImage: true, id: "hedaoLayer" ,visible: true}); 
    //地形图
//    var tdt = new TDTLayer("vec", { visible: false });
var tdtimg = new TDTImgLayer("img", { visible:true });
//    var tdtnote = new TDTNoteLayer("vec_img_note", { visible: false });
//    var tdtdx = new TDTDXTLayer("dxt", { visible: false });
//    //var tdtdxrv = new TDTRiverLayer("sxt", { visible: false });
//    map.addLayer(tdt);
  map.addLayer(tdtimg,1);
//    map.addLayer(tdtnote);
//    map.addLayer(tdtdx);
    //map.addLayer(tdtdxrv);
    //map.addLayer(dynamicMapServiceLayer);
    hedaoLayer.setVisibility(true);
 map.addLayer(hedaoLayer,999);
    
    var tileInfo = new TileInfo({
                 "dpi": 96,
    "format": "format/png",
    "compressionQuality": 0,
    "spatialReference": new SpatialReference({"EPSG":4490 }),
    "rows": 256,
    "cols": 256,
                origin: {
                    x: -9640000.0,
                    y: 1.0E7
                },
                spatialReference: {
                    wkid: 4326
                },
                lods: [
                    { level: 0, levelValue: 0, resolution: 1322.9193125052918, scale: 5000000 },
                    { level: 1, levelValue: 1, resolution: 529.1677250021168, scale: 2000000 },
                    { level: 2, levelValue: 2, resolution: 264.5838625010584, scale: 1000000 },
                    { level: 3, levelValue: 3, resolution: 132.2919312505292, scale: 500000 },
                    { level: 4, levelValue: 4, resolution: 52.91677250021167, scale: 200000},
                    { level: 5, levelValue: 5, resolution: 26.458386250105836, scale: 100000 },
                    { level: 6, levelValue: 6, resolution: 13.229193125052918, scale:50000 },
                    { level: 7, levelValue: 7, resolution:  5.291677250021167, scale: 20000 },
                    { level: 8, levelValue: 8, resolution: 2.6458386250105836, scale: 10000 },
                    { level: 9, levelValue: 9, resolution: 1.3229193125052918, scale: 5000 },
                    { level: 10, levelValue: 10, resolution: 0.5291677250021167, scale: 2000 },
                    { level: 11, levelValue: 11, resolution: 0.26458386250105836, scale: 1000},
                    { level: 12, levelValue: 12, resolution: 0.13229193125052918, scale: 500}
                ]
            })
              var tileExtent = new Extent(117,20,123,59, new  SpatialReference({"wkid": 4326}));
 var layerInfo = new WMTSLayerInfo({
    tileInfo: tileInfo,
    fullExtent: tileExtent,
    initialExtent: tileExtent,
    identifier: "*",
    tileMatrixSet: "TileMatrixSet0",
    format: "png",
    style: "default"

    });

    var resourceInfo = {
    version: "1.0.0",
    layerInfos: [layerInfo],
    copyright: "天地图"
    };

    var options = {
    serviceMode: "KVP",
    resourceInfo: resourceInfo,
    layerInfo: layerInfo
    };

    wmtsLayer = new WMTSLayer("http://31.16.1.101/arcgis/rest/services/shsw_JCDXT/MapServer", options);
    map.addLayer(wmtsLayer);
             //总站内网图层
      SHZZUrl='http://31.16.1.101/arcgis/rest/services/shsw_JCDXT/MapServer?T=cva_c&x={col}&y={row}&l={level}';  
               var vecLayer = WebTiledLayer(SHZZUrl, { 
                tileInfo: tileInfo
            })
             map.addLayers([vecLayer])
 
    
    
    
    
    

    var layer_hw = new FeatureLayer(swzzAreaUrl + "/0", {
        //注意这里的mode一定要指定MODE_SNAPSHOT，否则每次放大或缩小或者是平移都会执行FeatureLayer的update-end操作
        mode: esri.layers.FeatureLayer.MODE_ONDEMAND,//esri.layers.FeatureLayer.MODE_SNAPSHOT,
        //输出所有属性
        outFields: ["*"],
        //visible: false,
        id: "swzzAreaMode"
    });


    
    var layer_hwWater = new FeatureLayer(swzzWaterAreaUrl + "/0", {
        //注意这里的mode一定要指定MODE_SNAPSHOT，否则每次放大或缩小或者是平移都会执行FeatureLayer的update-end操作
        mode: esri.layers.FeatureLayer.MODE_ONDEMAND,//esri.layers.FeatureLayer.MODE_SNAPSHOT,
        //输出所有属性
        outFields: ["*"],
        visible: false,
        id: "swzzWaterArea"
    });
    map.addLayer(layer_hwWater);
    map.addLayer(dynamicMapServiceLayerNew);
    //dynamicMapServiceLayerNew.setVisibleLayers([8, 12]);

    var pathname = window.location.pathname;
    if (pathname.indexOf("ybRiversw") == -1
        && pathname.indexOf("ybRiverll") == -1
        && pathname.indexOf("ybAreaSL") == -1
        && pathname.indexOf("daibiaozhanPolygonCounty") == -1
        && pathname.indexOf("areaPolygonStation") == -1
        && pathname.indexOf("frequencyDiagramLeft") == -1
        && pathname.indexOf("frequencyDiagramRight") == -1
        && pathname.indexOf("danzhanchangcichaxun.html")==-1) {
        //添加图层
        map.addLayer(layer_hw);
    } else {
        map.setZoom(9);
    }
    
    //var tdt = new TDTMercatorLayer("vec_w", { visible: false });//电子图
    //var tdtimg = new TDTMercatorLayer("img_w", { visible: false });//卫星图
    //var tdtnote = new TDTMercatorLayer("ter_w", { visible: false });//地形图
    //map.addLayer(tdt);
    //map.addLayer(tdtimg);
    //map.addLayer(tdtnote);
    //setDtLayer("tzsxt");


    //图片图层
    myMapImageLayer = CreateImageLayer("MapImageLayer");

    //行政区划边界,水系图,大中型水库,河道
    var AggLayer = [0,1,2,3,4,5,6,7,8,9,10,11,12,13];
    var AggSort = [];
    
    areaOverallLayer = CreateLayer("areaOverallLayer");

    //GetTooltip(AggLayer, AggSort);
    //TZSetMapLayer();
     bjLayer = new GraphicsLayer({ id: "bj",visible:true });
    map.addLayer(bjLayer);
    if (pathname.indexOf("daibiaozhanPolygonCounty") == -1
        && pathname.indexOf("frequencyDiagramLeft") == -1
        && pathname.indexOf("frequencyDiagramRight") == -1
        && pathname.indexOf("danzhanchangcichaxun") == -1) {
        addLine(SHBJ, bjLayer);
    }
    //mouse-move
    map.on("mouse-move", Location);
    function Location(evt) {
        var mp = evt.mapPoint;
        $("#locationSpan").html(mp.x.toFixed(6) + "," + mp.y.toFixed(6));
        //alert(mp.x.toFixed(6) + "," + mp.y.toFixed(6));
    };
    //鼠标点击显示图层信息 
});

// 经纬度转墨卡托 object 传入：{con:xxxx,lat:xxxx}
convertWGS84ToMercator = function (object) {
    var con = object.con;
    var lat = object.lat;
    var merX = con * 20037508.34 / 180;
    var merY = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
    merY = merY * 20037508.34 / 180;
    return {
        x: merX,
        y: merY
    }
}
//* 墨卡托转经纬度 object 传入：{merX:xxxx,merY:xxxx}
convertMercatorToWGS84 = function (object) {
    var merX = object.merX;
    var merY = object.merY;
    var con = merX / 20037508.34 * 180;
    var lat = merY / 20037508.34 * 180;
    lat = 180 / Math.PI
        * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
    return {
        x: con,
        y: lat
    }
}
/***设置地图****/
var setDtLayerWX = false;
function setDtLayer(str) {
    //var dtlayers = ["vec_w", "img_w", "ter_w"];
    //var dtlayers = ["vec", "img", "ter"];
    //for (var i = 0; i < dtlayers.length; i++) {
    //    var lysStr = dtlayers[i];
    //    if (lysStr == str) {
    //        map.getLayer(lysStr).setVisibility(true);
    //    }
    //    else {
    //        map.getLayer(lysStr).setVisibility(false);
    //    }
    //}
    var dtlayers = ["vec", "img", "dxt", "sxt", "vec_img_note","tzsxt"];//, "wapian"
    for (var i = 0; i < dtlayers.length; i++) {
        var lysStr = dtlayers[i];
        try {
            if (lysStr == str) {
                map.getLayer(lysStr).setVisibility(true);
            }
            else {
                map.getLayer(lysStr).setVisibility(false);
            }
        } catch (ex) {

        }
    }
}
function clearGraphicsLayer() {
    var layers = map.getLayersVisibleAtScale();
    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        if (layer.declaredClass.indexOf("GraphicsLayer") > -1) {
            layer.setVisibility(false);
        }
    }
}
function clearEvent() {
    ShowYT("", "");
}
/*
地图首页需要引用的JS文件
*/
function LoadJS(id, fileUrl) {
    var scriptTag = document.getElementById(id);
    var oHead = document.getElementsByTagName('head').item(0);
    var oScript = document.createElement("script");
    if (scriptTag) {
        //alert("has");
    }
    else {
        oScript.id = id;
        oScript.type = "text/javascript";
        oScript.src = fileUrl;
        oHead.appendChild(oScript);
    }
}
function openTL(url) {
    if (url != "" && document.getElementById("TLFrame").src != url) {
        var tl = document.getElementById("TLFrame");
        document.getElementById("TLDiv").style.display = "block";
        document.getElementById("TLFrame").contentWindow.ShowTL(url);
    }
    else {
        closeTL();
    }
}
function closeTL() {
    document.getElementById("TLDiv").style.display = "none";
}
function tlChecked() {
    getTabEl().tlChecked();
}
function getTabEl() {
    var tabs = mini.get("mainTabs");
    var frame = tabs.getTabIFrameEl(tabs.getActiveTab());
    var el = frame.contentWindow;
    return el;
}
function getTLObj(tag) {
    var el;
    if (document.getElementById("TLFrame")) {
        el = document.getElementById("TLFrame").contentWindow.document.getElementById(tag);
    }
    return el;
}
function getTabObj(str) {
    var tabs = mini.get("mainTabs");
    var frame = tabs.getTabIFrameEl(tabs.getActiveTab());
    var el;
    if (frame) {
        el = frame.contentWindow.document.getElementById(str);
    }
    return el;
}
function setZOOM(objNum) {
    map.zoom = Number(objNum);
}
function dyCenter(lgtd, lttd) {
    require(["myJs/DyCenter"], function (DyCenter) {
        var dy = new DyCenter(map, lgtd, lttd);
    });
}
function CreateLayer(str) {
    var layer;
    if (map.getLayer(str)) {
        layer = map.getLayer(str);
    }
    else {
        layer = map.addLayer(new esri.layers.GraphicsLayer({ id: str }));
    }
    return layer;
}
function CreateLayerID(str, LayerID) {
    var layer;
    if (map.getLayer(str)) {
        layer = map.getLayer(str);
    } else {
        layer = map.addLayer(new esri.layers.GraphicsLayer({
            id: str
        }), LayerID);
    }
    return layer;
}
function CreateImageLayer(str) {
    var layer;
    if (map.getLayer(str)) {
        layer = map.getLayer(str);
    }
    else {

        layer = map.addLayer(new esri.layers.MapImageLayer({ id: str }));
    }
    return layer;
}

function removeLayerID(objID) {
    try {
        var layerID = map.getLayer(objID);
        if (layerID != null) {
            map.removeLayer(layerID);
        }
    } catch (ex) { }

}

function showTipPoint(lgtd, lttd, LayerGraphicLayer) {
    require([
        "esri/geometry/Point",
        "esri/symbols/PictureMarkerSymbol",
        "esri/graphic",
        "dojo/domReady!"
    ], function (Point, PictureMarkerSymbol, Graphic) {
        var point = new Point({
            "x": lgtd,
            "y": lttd,
            "spatialReference": {
                "wkid": 4490
            }
        });
        var breakSymbol = new PictureMarkerSymbol("images/RedPin1LargeB.png", 64, 64);
        var graphic = new Graphic(point, breakSymbol, null, null);
        LayerGraphicLayer.add(graphic);
    })

}

function ShowYT(str, type) {
    try {
        $(".tclidiv").parent(".tcli").siblings("li").children(".tcliul").slideUp();
        $(".caozuo").animate({ "width": "0px" }, 500);
        $(".caozuo").css({ "padding": "8px 0px", "border": "none" });
    } catch (ex) { }
    
    var url = PicUrl +"UploadDoc/";
    if (str != "") {
        if (str.indexOf("LDTP_") > -1) {
            url = PicUrlNT+type+"/";
        }
        str = url + str;
        $("#YTDiv").css("visibility", "visible");
        $("#YTImg").attr("src", str);
    }
    else {
        $("#YTDiv").css("visibility", "hidden");
    }
}
function addLine(str, layer) {
    var arr = str.split("|");
    var path = new Array();
    var p;
    var s;
    for (var i = 0; i < arr.length; i++) {
        p = arr[i].split(",");
        //var tempP = Convert_BD09_To_GCJ02(p[1], p[0]);
        //var NumPs = tempP.split(":");
        s = [Number(p[0]), Number(p[1])];
        path.push(s);
    }
    require(["esri/geometry/Point",
        "esri/geometry/Polyline",
        "esri/geometry/Extent",
        "esri/graphic",
        "esri/Color",
        "esri/layers/GraphicsLayer",
        "esri/symbols/CartographicLineSymbol", "esri/symbols/SimpleLineSymbol"
    ], function (Point, Polyline, Extent, Graphic, Color, GraphicsLayer, CartographicLineSymbol, SimpleLineSymbol) {
        var taihujuXY = [path];
        var line = new esri.geometry.Polyline({
            "paths": taihujuXY,
            "spatialReference": { "wkid": 4326 }
        });
        var lineSymbol = new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_DASH,
            new Color([49, 50, 249, 1]),
            2);
        var polyline = new esri.Graphic(line, lineSymbol);
        layer.add(polyline);
        //map.setExtent(line.getExtent().expand(1.2));
    });
}
function addGJLine(str, layer) {
    var arr = str;
    var path = new Array();
    var s;
    var ColorGRP = "#FF0000";
    for (var i = 0; i < arr.length; i++) {
        s = [Number(arr[i].LGTD), Number(arr[i].LTTD)];
        path.push(s);
        if (arr[i].Color != undefined) {
            ColorGRP = arr[i].Color;
        }
    }
    require([
        "esri/geometry/Polyline",
        "esri/geometry/Extent",
        "esri/graphic",
        "esri/Color",
        "esri/layers/GraphicsLayer", "esri/SpatialReference",
        "esri/symbols/CartographicLineSymbol", "esri/symbols/SimpleLineSymbol", "esri/symbols/PictureMarkerSymbol"
    ], function (Polyline, Extent, Graphic, Color, GraphicsLayer, SpatialReference, CartographicLineSymbol, SimpleLineSymbol, PictureMarkerSymbol) {
        var taihujuXY = [path];
        var line = new esri.geometry.Polyline({
            "paths": taihujuXY,
            "spatialReference": { "wkid": 4326 }
        });
        //var lineSymbol = new SimpleLineSymbol(
        //    SimpleLineSymbol.STYLE_SOLID,
        //    new Color([76, 145, 249, 1]),
        //    3);
        //var lineSymbol = new SimpleLineSymbol("solid", new dojo.Color([255, 0, 0]), 3);
        var lineSymbol = new SimpleLineSymbol("solid", new dojo.Color(ColorGRP), 3);
        var polyline = new esri.Graphic(line, lineSymbol);
        layer.add(polyline);
        map.setExtent(line.getExtent().expand(1.2));
    });
}
function addAREALine(str, layer) {
    var arr = str;
    var path = new Array();
    var s;
    for (var i = 0; i < arr.length; i++) {
        s = [Number(arr[i].LGTD), Number(arr[i].LTTD)];
        path.push(s);
    }
    require(["esri/geometry/Polyline",
        "esri/geometry/Extent",
        "esri/graphic",
        "esri/Color",
        "esri/layers/GraphicsLayer", "esri/SpatialReference",
        "esri/symbols/CartographicLineSymbol", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol", "esri/symbols/PictureMarkerSymbol"
    ], function (Polyline, Extent, Graphic, Color, GraphicsLayer, SpatialReference, CartographicLineSymbol, SimpleLineSymbol, SimpleFillSymbol, PictureMarkerSymbol) {
        var taihujuXY = [path];
        var line = new esri.geometry.Polyline({
            "paths": taihujuXY,
            "spatialReference": { "wkid": 4326 }
        });
        //var lineSymbol = new SimpleLineSymbol(
        //    SimpleLineSymbol.STYLE_SOLID,
        //    new Color([76, 145, 249, 1]),
        //    3);
        //var lineSymbol = new SimpleFillSymbol("solid", new dojo.Color([255, 0, 0]), 3);
        var lineSymbol = new SimpleFillSymbol("solid", new SimpleLineSymbol("solid", new dojo.Color([255, 0, 0]), 2),
            new dojo.Color([255, 0, 0, 0.25]));
        var polyline = new esri.Graphic(line, lineSymbol);
        layer.add(polyline);
        map.setExtent(line.getExtent().expand(1.2));
    });
}
function addHDSZLine(str, szcolor, layer) {
    var arr = str.split(":");
    var path = new Array();
    var p;
    var s;
    for (var i = 0; i < arr.length; i++) {
        p = arr[i].split(",");
        s = [Number(p[0]), Number(p[1])];
        path.push(s);
    }
    require(["esri/geometry/Point",
        "esri/geometry/Polyline",
        "esri/geometry/Extent",
        "esri/graphic",
        "esri/Color",
        "esri/layers/GraphicsLayer", "esri/SpatialReference",
        "esri/symbols/CartographicLineSymbol", "esri/symbols/SimpleLineSymbol", "esri/symbols/PictureMarkerSymbol"
    ], function (Point, Polyline, Extent, Graphic, Color, GraphicsLayer, SpatialReference, CartographicLineSymbol, SimpleLineSymbol, PictureMarkerSymbol) {
        var taihujuXY = [path];
        var line = new esri.geometry.Polyline({
            "paths": taihujuXY,
            "spatialReference": { "wkid": 4326 }
        });
        var szcolors = ["#8B8989", "#55D4FD", "#1AA9F1", "#5ED624", "#25B464", "#FEC307", "#FD5508"];
        var colorIndex = Number(szcolor);
        var color = szcolors[colorIndex];
        var lineSymbol = new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_SOLID,
            new Color(color),
            3);
        var polyline = new esri.Graphic(line, lineSymbol);
        layer.add(polyline);
    });
}
function GlobalSelectGeometry(paths, layer) {
    layer.clear();
    require(["esri/geometry/Point",
        "esri/geometry/Polyline",
        "esri/geometry/Polygon",
        "esri/geometry/Extent",
        "esri/graphic",
        "esri/Color",
        "esri/layers/GraphicsLayer", "esri/SpatialReference", "esri/symbols/SimpleFillSymbol",
        "esri/symbols/SimpleLineSymbol", "esri/symbols/PictureMarkerSymbol"
    ], function (Point, Polyline, Polygon, Extent, Graphic, Color, GraphicsLayer, SpatialReference, SimpleFillSymbol, SimpleLineSymbol, PictureMarkerSymbol) {
        var lineSymbol = new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_SOLID,
            new Color("#FF0000"), 3);
        var geo = new Polyline({
            "paths": paths,
            "spatialReference": { "wkid": 4326 }
        });
        var polyline = new Graphic(geo, lineSymbol);
        layer.add(polyline);
        var ext = new Extent(geo.getExtent().xmin, geo.getExtent().ymin, geo.getExtent().xmax, geo.getExtent().ymax, new SpatialReference({ wkid: 4326 }));
        map.setExtent(ext.expand(8));
    });
}
function addLayer(num) {
    if (num == 1) {
        //layer1.setVisibility(true);
        map.addLayer(layer1);
    } else if (num == 2) {
        map.addLayer(layer2);
    } else if (num == 3) {
        map.addLayer(layer3);
    } else if (num == 4) {
        map.addLayer(layer4);
    } else if (num == 5) {
        map.addLayer(layer5);
    } else if (num == 6) {
        map.addLayer(layer6);
    } else if (num == 7) {
        map.addLayer(layer7);
    } else if (num == 8) {
        map.addLayer(layer8);
    } else if (num == 9) {
        map.addLayer(layer9);
    } else if (num == 10) {
        map.addLayer(layer10);

    } else if (num == 11) {
        map.addLayer(layer11);
        //layer11.setVisibility(true);
    } else if (num == 12) {
        map.addLayer(layer12);

    } else if (num == 13) {
        map.addLayer(layer13);
    }
}
function clearLayer(num) {
    if (num == 1) {
        //layer1.setVisibility(false);
        map.removeLayer(layer1);
        //layer1.setVisibility(false);
    } else if (num == 2) {
        map.removeLayer(layer2);
    } else if (num == 3) {
        map.removeLayer(layer3);
    } else if (num == 4) {
        map.removeLayer(layer4);
    } else if (num == 5) {
        map.removeLayer(layer5);
    } else if (num == 6) {
        map.removeLayer(layer6);
    } else if (num == 7) {
        map.removeLayer(layer7);
    } else if (num == 8) {
        map.removeLayer(layer8);
    } else if (num == 9) {
        map.removeLayer(layer9);
    } else if (num == 10) {
        map.removeLayer(layer10);
    } else if (num == 11) {
        map.removeLayer(layer11);
    } else if (num == 12) {
        map.removeLayer(layer12);
    } else if (num == 13) {
        map.removeLayer(layer13);
    }
}
function SetLayer(id, HidShow) {
    var Hidlayer = map.getLayer(id);
    Hidlayer.setVisibility(HidShow);
}
function GetTooltip(list, AggSort) {
    require(["esri/map", "esri/layers/ArcGISTiledMapServiceLayer", "esri/layers/FeatureLayer",
        "esri/InfoTemplate", "esri/renderers/ClassBreaksRenderer", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol", "esri/geometry/Polyline", "esri/dijit/Legend",
        "esri/Color", "esri/graphic", "esri/layers/WebTiledLayer", "dojo/domReady!"
    ], function (Map, ArcGISTiledMapServiceLayer, FeatureLayer,
        InfoTemplate, ClassBreaksRenderer, SimpleFillSymbol, SimpleLineSymbol, Polyline, Legend, Color, Graphic, WebTiledLayer
    ) {
            if (list.length > 0) {
                for (numII = 0; numII < list.length; numII++) {
                    var layerUrl = "http://36.155.90.4:6080/arcgis/rest/services/SHHW/MapServer/";
                    var layer = new FeatureLayer(layerUrl, {
                        id: "ToolTipLayer" + list[numII],
                        visible:true,
                    });
                    console.error(layer);
                    //layer.setVisibility(false);
                    map.addLayer(layer);
                }
            }
        });
}
//行政画图层
function TZSetMapLayer() {
    require([
        "esri/graphic",
        "esri/Color",
        "esri/layers/GraphicsLayer", 
        "esri/symbols/SimpleFillSymbol",
        "esri/symbols/SimpleLineSymbol",
        "dojo/_base/lang",
        "esri/geometry/Polygon",
		"esri/geometry/webMercatorUtils",
		"esri/geometry/Point",
        "myJs/MapText",
		"esri/symbols/TextSymbol",
		"esri/symbols/Font"
    ], function (Graphic, Color, GraphicsLayer, SimpleFillSymbol, SimpleLineSymbol, lang, Polygon,
		webMercatorUtils, Point, MapText,TextSymbol, Font) {
        //map.addLayer(layer);
        $.get(
            "../../Common/上海市.json",//json路径
            lang.hitch(this, function (data, status) {
                if (status === "success") {
                    var features = data.features;
                    features.forEach(function (feature) {
                        var allrings = feature.geometry.coordinates;
                        allrings.forEach(function (rings) {
                            //var strJson = "";
                            //var ring = rings[0];
                            //console.error(ring);
                            //for (var num = 0; num < ring.length; num++) {
                            //    strJson += ring[num][0] + "," + ring[num][1]+"|";
                            //}
                            //console.error(strJson);
                            var area = new Polygon(rings);
                            var symbol = new SimpleFillSymbol(
                                SimpleFillSymbol.STYLE_SOLID,
                                new SimpleLineSymbol(
                                    SimpleLineSymbol.STYLE_SOLID,
                                    new Color([140, 146, 141]),//rgb  边框色
                                    2
                                ),
                                new Color([230, 245, 251, 0.2])//rgba  中间填充色
                            );
                            var gra = new Graphic(area, symbol);
                            gra.attributes = feature.properties;
                            areaOverallLayer.add(gra);
                        }, this);

                        var item = feature.properties;
                        var areacodename = item.name;
                        var point = new Point({ "x": item.centroid[0], "y": item.centroid[1], "spatialReference": { "wkid": 4326 } });
                        var font = new Font("14px", Font.STYLE_NORMAL, Font.VARIANT_NORMAL,
                            Font.WEIGHT_BOLDER);
                        var textSymbol = new TextSymbol(
                            areacodename,
                            font,
                            new Color("yellow")
                        );
                        var labelPointGraphic = new Graphic(point, textSymbol);
                        //console.error(areacodename);
                        //map.graphics.add(labelPointGraphic);
                        //areaOverallLayer.add(labelPointGraphic);
                    }, this);
                }
            }),
            "json"
        );
    });
}
//地图聚合
function JHMark(arr) {
    require([
        "dojo/parser",
        "dojo/ready",
        "dojo/_base/array",
        "esri/Color",
        "dojo/dom-style",
        "dojo/query",

        "esri/map",
        "esri/request",
        "esri/graphic",
        "esri/geometry/Extent",

        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleFillSymbol",
        "esri/symbols/PictureMarkerSymbol",
        "esri/renderers/ClassBreaksRenderer",

        "esri/layers/GraphicsLayer",
        "esri/SpatialReference",
        "esri/dijit/PopupTemplate",
        "esri/geometry/Point",
        "esri/geometry/webMercatorUtils",

        "myJs/ClusterLayer",

        "dijit/layout/BorderContainer",
        "dijit/layout/ContentPane",
        "dojo/domReady!"
    ], function (
        parser, ready, arrayUtils, Color, domStyle, query,
        Map, esriRequest, Graphic, Extent,
        SimpleMarkerSymbol, SimpleFillSymbol, PictureMarkerSymbol, ClassBreaksRenderer,
        GraphicsLayer, SpatialReference, PopupTemplate, Point, webMercatorUtils,
        ClusterLayer
    ) {

            ready(function () {
                parser.parse();

                var clusterLayer;

                //map = new Map("myMap", {
                //    basemap: "oceans",
                //    center: [121.404131, 31.177586],
                //    zoom: 13
                //});



                //var photosData = [{ "MT_ID": "956bacfc74414a728fb106bf6898ce4b", "MT_XUHAO": "2017092600002", "MT_TIME": "2018-01-23 17:43:55", "MT_NAME": "1.jpg", "MT_REPORT": "管理员", "MT_LGTD": "121.404131", "MT_LTTD": "31.177586", "MT_IMG_VIDEO": "1", "MT_TYPE": "XC_LIST", "MT_FILE": "http://bin:8081/Common/images/1.jpg" }, { "MT_ID": "a59617d459cc4a80a36e66e23ef1875a", "MT_XUHAO": "2017092600002", "MT_TIME": "2018-01-22 16:54:58", "MT_NAME": "2.jpg", "MT_REPORT": "管理员", "MT_LGTD": "121.404131", "MT_LTTD": "31.177586", "MT_IMG_VIDEO": "1", "MT_TYPE": "XC_LIST", "MT_FILE": "http://bin:8081/Common/images/2.jpg" }, { "MT_ID": "afa756d0dffb41299b613a95d68893be", "MT_XUHAO": "2017092600002", "MT_TIME": "2018-01-22 16:58:26", "MT_NAME": "3.jpg", "MT_REPORT": "管理员", "MT_LGTD": "121.404131", "MT_LTTD": "31.177586", "MT_IMG_VIDEO": "1", "MT_TYPE": "XC_LIST", "MT_FILE": "http://bin:8081/Common/images/3.jpg" }, { "MT_ID": "2017122800003", "MT_XUHAO": "2017092600002", "MT_TIME": "2018-01-24 19:02:16", "MT_NAME": "1.jpg", "MT_REPORT": "管理员", "MT_LGTD": "121.404131", "MT_LTTD": "31.177586", "MT_IMG_VIDEO": "1", "MT_TYPE": "XC_LIST", "MT_FILE": "http://bin:8081/Common/images/1.jpg" }, { "MT_ID": "e38d03bb137047b2b4d2b609a8d4b9c9", "MT_XUHAO": "2017092600002", "MT_TIME": "2018-01-24 18:02:16", "MT_NAME": "5.jpg", "MT_REPORT": "管理员", "MT_LGTD": "121.404131", "MT_LTTD": "31.177586", "MT_IMG_VIDEO": "1", "MT_TYPE": "XC_LIST", "MT_FILE": "http://bin:8081/Common/images/5.jpg" }, { "MT_ID": "2017122800002", "MT_XUHAO": "2017092600002", "MT_TIME": "2018-01-24 17:02:16", "MT_NAME": "6.jpg", "MT_REPORT": "管理员", "MT_LGTD": "121.404131", "MT_LTTD": "31.177586", "MT_IMG_VIDEO": "1", "MT_TYPE": "XC_LIST", "MT_FILE": "http://bin:8081/Common/images/6.jpg" }, { "MT_ID": "9e48fb974fd14c84b8da3888b5e9957c", "MT_XUHAO": "2017092600002", "MT_TIME": "2018-01-25 16:31:35", "MT_NAME": "4.jpg", "MT_REPORT": "管理员", "MT_LGTD": "121.404131", "MT_LTTD": "31.177586", "MT_IMG_VIDEO": "1", "MT_TYPE": "XC_LIST", "MT_FILE": "http://bin:8081/Common/images/4.jpg" }];
                addClusters(arr);
                function addClusters(resp) {
                    var photoInfo = {};
                    var wgs = new SpatialReference({
                        "wkid": 4326
                    });
                    photoInfo = arrayUtils.map(resp, function (p) {
                        //console.log(p.MT_LGTD + "======LTTD" + p.MT_LTTD)
                        var latlng = new Point(parseFloat(p.MT_LGTD), parseFloat(p.MT_LTTD), new SpatialReference({ wkid: 4326 }));
                        var webMercator = latlng;//webMercatorUtils.geographicToWebMercator(latlng);
                        //console.log(webMercator.x + "=========Y" + webMercator.y);
                        //console.log(JSON.stringify(p));
                        //console.log(p.MT_TIME + "@@" + p.MT_NAME + "@@" + p.MT_FILE + "@@" + p.MT_XUHAO);
                        var attributes = {
                            "时间": p.MT_TIME,
                            "图片名称": p.MT_NAME,
                            "路径": p.MT_NAME,
                            "Link": p.MT_XUHAO
                        };
                        return {
                            "x": webMercator.x,
                            "y": webMercator.y,
                            "attributes": attributes
                        };
                    });


                    // cluster layer that uses OpenLayers style clustering
                    clusterLayer = new ClusterLayer({
                        "data": photoInfo,
                        "distance": 0.1,
                        "id": "clusters",
                        "labelColor": "#fff",
                        "labelOffset": 10,
                        "singleColor": "#888"
                    });
                    var defaultSym = new SimpleMarkerSymbol().setSize(4);

                    var renderer = new ClassBreaksRenderer(defaultSym, "clusterCount");

                    var picBaseUrl = "images/";
                    var blue = new PictureMarkerSymbol(picBaseUrl + "BluePin1LargeB.png", 32, 32).setOffset(0, 15);
                    var green = new PictureMarkerSymbol(picBaseUrl + "GreenPin1LargeB.png", 64, 64).setOffset(0, 15);
                    var red = new PictureMarkerSymbol(picBaseUrl + "RedPin1LargeB.png", 72, 72).setOffset(0, 15);
                    renderer.addBreak(0, 2, blue);
                    renderer.addBreak(2, 200, green);
                    renderer.addBreak(200, 1001, red);

                    clusterLayer.setRenderer(renderer);
                    map.addLayer(clusterLayer);

                    // close the info window when the map is clicked
                    map.on("click", cleanUp);
                    // close the info window when esc is pressed
                    map.on("key-down", function (e) {
                        if (e.keyCode === 27) {
                            cleanUp();
                        }
                    });
                }

                function cleanUp() {
                    map.infoWindow.hide();
                    clusterLayer.clearSingles();
                }

                function error(err) {
                    console.log("something failed: ", err);
                }

                // show cluster extents...
                // never called directly but useful from the console 
                window.showExtents = function () {
                    var extents = map.getLayer("clusterExtents");
                    if (extents) {
                        map.removeLayer(extents);
                    }
                    extents = new GraphicsLayer({ id: "clusterExtents" });
                    var sym = new SimpleFillSymbol().setColor(new Color([205, 193, 197, 0.5]));

                    arrayUtils.forEach(clusterLayer._clusters, function (c, idx) {
                        var e = c.attributes.extent;
                        extents.add(new Graphic(new Extent(e[0], e[1], e[2], e[3], map.spatialReference), sym));
                    }, this);
                    map.addLayer(extents, 0);
                };
            });
        });
}
/// <summary>
/// 中国正常坐标系GCJ02协议的坐标，转到 百度地图对应的 BD09 协议坐标
/// </summary>
/// <param name="lat">维度</param>
/// <param name="lng">经度</param>
function Convert_GCJ02_To_BD09(lat, lng) {
    var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    var x = lng;
    var y = lat;
    var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
    var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
    lng = z * Math.cos(theta) + 0.0065;
    lat = z * Math.sin(theta) + 0.006;
    return lng + ':' + lat;
}
/// <summary>
/// 百度地图对应的 BD09 协议坐标，转到 中国正常坐标系GCJ02协议的坐标
/// </summary>
/// <param name="lat">维度</param>
/// <param name="lng">经度</param>
function Convert_BD09_To_GCJ02(lat, lng) {
    //var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    var x = lng - 0.0065;
    var y = lat - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    lng = z * Math.cos(theta);
    lat = z * Math.sin(theta);
    return lng + ':' + lat;
} 