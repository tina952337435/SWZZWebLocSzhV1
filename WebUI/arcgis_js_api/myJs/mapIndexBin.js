var map, gl, cycleMap3, bjLayer;
var layer1, layer2, layer3, layer4, layer5, layer6;
var SQGraphicLayer, YQGraphicLayer, GQGraphicLayer;
var _globallevel = 10;
var mapZOOM = 13;
var labels = new Array();

require(["esri/config", "esri/tasks/GeometryService"], function (esriConfig, GeometryService) {
    esriConfig.defaults.geometryService = new GeometryService("https://sampleserver6.arcgisonline.com/arcgis/rest/services/Geometry/GeometryServer");
    //esriConfig.defaults.io.alwaysUseProxy = true;
});
require([
    "esri/map",
    "esri/geometry/Extent",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/layers/ArcGISTiledMapServiceLayer",
    "esri/layers/WebTiledLayer",
    "esri/layers/GraphicsLayer",
    "esri/graphic",
    "myJs/MapText",
    "esri/geometry/webMercatorUtils",
    "esri/geometry/Point", "esri/SpatialReference",
    "esri/dijit/Measurement", "dojo/dom", "esri/units", "myJs/TDTMercatorLayer",
    "myJs/TDTLayer", "myJs/TDTImgLayer", "myJs/TDTNoteLayer", "myJs/TDTDXTLayer", "myJs/TDTRiverLayer",
    "dojo/domReady!"
], function (Map, Extent, ArcGISDynamicMapServiceLayer, ArcGISTiledMapServiceLayer, WebTiledLayer, GraphicsLayer, Graphic, MapText, webMercatorUtils, Point, SpatialReference, Measurement, dom, Units, TDTMercatorLayer, TDTLayer, TDTImgLayer, TDTNoteLayer, TDTDXTLayer, TDTRiverLayer) {
    map = new Map("myMap", {
        logo: false,
        slider: false, //放大缩小按钮
        //isDoubleClickZoom:false;
        zoom: 12,
        //        isScrollWheel:false,
        showLabels: true,
        //center: [120.489186, 31.644847]
        //center:[120.0887,31.7360]
        center: [120.103963, 31.573982]
    });
    var url = "http://218.94.6.92:6080/arcgis/rest/services/jssl_vector_L3_L17/MapServer"; //水系图
    //url = "http://10.32.208.244:6080/arcgis/rest/services/2015zhiban/MapServer";
    //var wxwapianMapServiceLayer = new ArcGISDynamicMapServiceLayer(url, { id: "wapian", visible: false });
    var wxwapianMapServiceLayer = new ArcGISTiledMapServiceLayer(url, { id: "wapian", visible: false });
    var url1 = "http://172.16.101.11/xcscms/sipsd/service/TileService/DZDT_GCS2000/MapServer"; //电子图
    var url2 = "http://172.16.101.11/xcscms/sipsd/service/TileService/IMG2017CGCS2000/MapServer"; //遥感图
    var url3 = "http://172.16.101.11/xcscms/sipsd/service/TileService/XZQH_GCS2000/MapServer";//行政图
    var url4 = "http://10.32.208.244:6080/arcgis/rest/services/hd/MapServer";//行政图

    var token = "kAiTBjERZMWBITLdsXqHR9b6eswMtXgGt2lSI9FCA3q1qs1WyYk9BwJHpZCZSoAbXolbKHwYgOVHHXl0IKeHvS3ZMZkMsQvF5gjr67dmlXX7KK1984gagg%3D%3D";
    //var tiledMapServiceLayer = new ArcGISTiledMapServiceLayer(url, { id: "sxt", visible: false });

    var layer = new ArcGISDynamicMapServiceLayer("http://112.25.70.13:6080/arcgis/rest/services/wjshp/MapServer", { useMapImage: true });

    //路网
    layer1 = new ArcGISDynamicMapServiceLayer("http://112.25.70.13:6080/arcgis/rest/services/wjshp1/MapServer", {id:"LIXIAN", useMapImage: true });
    ////河道
    //layer2 = new ArcGISDynamicMapServiceLayer("http://112.21.188.187:6080/arcgis/rest/services/jkq_hd/MapServer", { useMapImage: true });
    ////圩区
    //layer3 = new ArcGISDynamicMapServiceLayer("http://112.21.188.187:6080/arcgis/rest/services/jkq_wq/MapServer", { useMapImage: true });
    ////大包围区
    //layer4 = new ArcGISDynamicMapServiceLayer("http://112.21.188.187:6080/arcgis/rest/services/jkq_sgnq/MapServer", { useMapImage: true });
    ////乡镇
    //layer5 = new ArcGISDynamicMapServiceLayer("http://112.21.188.187:6080/arcgis/rest/services/jkq_xz/MapServer", { useMapImage: true });
    ////无背景
    //layer6 = new ArcGISDynamicMapServiceLayer("http://10.32.208.244:6080/arcgis/rest/services/hd_shp/MapServer", { useMapImage: true });
    ////有背景
    //layer7 = new ArcGISDynamicMapServiceLayer("http://10.32.208.244:6080/arcgis/rest/services/hd/MapServer", { useMapImage: true });

    //地形图
    var tdt = new TDTLayer("vec", { visible: false });
    var tdtimg = new TDTImgLayer("img", { visible: false });
    var tdtnote = new TDTNoteLayer("vec_img_note", { visible: false });
    //
    var tdtdx = new TDTDXTLayer("dxt", { visible: false });
    var tdtdxrv = new TDTRiverLayer("dxtrv", { visible: false });

    map.addLayer(tdt);
    map.addLayer(tdtimg);
    //map.addLayer(tdtnote);

    map.addLayer(tdtdx);
    map.addLayer(tdtdxrv);

    map.addLayer(wxwapianMapServiceLayer);
    //map.addLayer(tiledMapServiceLayer);
    //var agglist = [1,2,3];
    //layer1.setVisibleLayers(agglist);
    map.addLayer(layer1); 
    layer1.setVisibility(true);

    //map.addLayer(layer);

    gl = new GraphicsLayer({ id: "s" });
    map.addLayer(gl);

    //bjLayer = new GraphicsLayer({ id: "bj" });
    //map.addLayer(bjLayer);
    //addLine(XCQBJ, bjLayer);

    //mouse-move
    map.on("mouse-move", Location);
    function Location(evt) {
        var mp = evt.mapPoint;
        $("#locationSpan").html(mp.x.toFixed(6) + "," + mp.y.toFixed(6));
    };
    // 注册地图缩放事件
    var _isFirst_ = true;
    var _isZoomIn_ = true;
    map.on('zoom', function (e) {
        var zoom = map.getZoom();
        var zoomFactor = e.zoomFactor;
        if (zoomFactor > 1) {
            if (zoom >= (Number(mapZOOM) - 1)) {
                if (!_isZoomIn_) {
                    _isFirst_ = true;
                }
                if (_isFirst_) {
                    AutoZoomIn();
                    _isFirst_ = false;
                    _isZoomIn_ = true;
                }
            }
        } else if (zoomFactor < 1) {
            if (zoom <= mapZOOM) {
                if (_isZoomIn_) {
                    _isFirst_ = true;
                }
                if (_isFirst_) {
                    AutoZoomOut();
                    _isFirst_ = false;
                    _isZoomIn_ = false;
                }
            }
        }
    });
    map.on('zoom-end', function (e) {
        var zoom = e.level;
        var zoomFactor = e.zoomFactor;
        if (zoomFactor > 1) {
            if (zoom > (Number(mapZOOM) - 1) && !_zoomIned_) {
                AutoZoomIn(false);
            }
        } else if (zoomFactor < 1) {
            if (zoom < mapZOOM && !_zoomOuted_) {
                AutoZoomOut(false);
            }
        }
    });

    SQGraphicLayer = CreateLayer("sq_dyLayer1");
    YQGraphicLayer = CreateLayer("yq_dyLayer2");
    GQGraphicLayer = CreateLayer("gq_dyLayer3");
    setTimeout(function (e) {
        SQMark();
    },100);
});

/**
* 地图缩放时自动隐藏两侧图表
*/
var _zoomIned_ = false;
function AutoZoomIn() {
    var smallimg = "../images/2.png";
    $(".seeall").attr("src", smallimg);
    $("#page-head").animate({ top: "-70px" }, 300);
    $("#page-left").animate({ left: "-25%" }, 300);
    $("#page-right").animate({ right: "-25%" }, 300);
    $("#map-title").animate({
        top: '30px',
        left: "40px"
    }, 300);
    $("#map-tl").animate({ right: "40px" }, 300);
    $("#map-toolbar").animate({
        top: '30px',
        right: "40px"
    }, 300);
    $("#SZTL").animate({
        bottom: '-90px'
    }, 300);
    $("#map-zhtl").animate({ right: "40px" }, 300);
    $("#map-reset").animate({ right: "45px" }, 300);
    $("#TLDiv").animate({ left: "40px" }, 300);
    //map.setCenter({
    //    x: _config_.center.x,
    //    y: _config_.center.y,
    //    sr: _config_.center.sr
    //});
    _zoomIned_ = true;
    _zoomOuted_ = false
}

/**
 * 地图缩放时自动隐藏两侧图表
 */
var _zoomOuted_ = false;
function AutoZoomOut() {
    var bigimg = "../images/1.png";
    $(".seeall").attr("src", bigimg);
    $("#page-head").animate({ top: "0" }, 300);
    $("#page-left").animate({ left: "0px" }, 300);
    $("#page-right").animate({ right: "0px" }, 300);
    $("#map-title").animate({
        top: '100px',
        left: "25%"
    }, 300);
    $("#SZTL").animate({
        bottom: '0px'
    }, 300);
    $("#map-tl").animate({ right: "23%" }, 300);
    $("#map-toolbar").animate({
        top: '100px',
        right: "22%"
    }, 300);
    $("#map-zhtl").animate({ right: "22%" }, 300);
    $("#map-reset").animate({ right: "25%" }, 300);
    $("#TLDiv").animate({ left: "21%" }, 300);
    //map.setCenter({
    //    x: _config_.center.x,
    //    y: _config_.center.y,
    //    sr: _config_.center.sr
    //});
    _zoomIned_ = false;
    _zoomOuted_ = true;
}
/***设置地图****/
function setDtLayer(str) {
    var dtlayers = ["vec", "img", "dxt", "wapian","LIXIAN"];// "sxt",
    for (var i = 0; i < dtlayers.length; i++) {
        var lysStr = dtlayers[i];
        console.log(lysStr)
        if (lysStr.indexOf(str) > -1) {
            var ly = map.getLayer(lysStr);
            map.getLayer(lysStr).setVisibility(true);
        }
        else {
            map.getLayer(lysStr).setVisibility(false);
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
function ShowYT(str, type) {
    var url = "http://" + window.location.host + "/weather/"; //window.location.host;
    url = HttpUrl;
    if (type == "降雨预报") {
        url += "JYJB/";
    }
    else if (type == "雷达") {
        url += "LDTP/";
    }
    else if (type == "卫星云图") {
        url += "YTTP/";
    }
    if (str != "") {
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
            SimpleLineSymbol.STYLE_SOLID,
            new Color([76, 145, 249, 1]),
            3);
        var polyline = new esri.Graphic(line, lineSymbol);
        layer.add(polyline);
        map.setExtent(line.getExtent().expand(1.2));
    });
}

function addGJLine(str, layer) {
    var arr = str;
    var path = new Array();
    var s;
    for (var i = 0; i < arr.length; i++) {
        s = [Number(arr[i].LGTD), Number(arr[i].LTTD)];
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
        var lineSymbol = new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_SOLID,
            new Color([76, 145, 249, 1]),
            3);
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
    }
}

function clearLayer(num) {
    if (num == 1) {
        //layer1.hide();
        map.removeLayer(layer1);
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
    }
}

function GetTooltip() {
    require(["esri/map", "esri/layers/ArcGISTiledMapServiceLayer", "esri/layers/FeatureLayer",
        "esri/InfoTemplate", "esri/renderers/ClassBreaksRenderer", "esri/symbols/SimpleFillSymbol", "esri/dijit/Legend",
        "esri/Color", "dojo/domReady!"
    ], function (Map, ArcGISTiledMapServiceLayer, FeatureLayer,
        InfoTemplate, ClassBreaksRenderer, SimpleFillSymbol, Legend, Color
    ) {

            var list = [35, 36, 37, 38, 39, 40, 41, 42];
            //var list = [28, 29, 30, 31, 32, 33, 34, 35];

            if (list.length > 0) {
                for (numII = 0; numII < list.length; numII++) {
                    // console.log(numII);
                    //var layerUrl = "http://10.32.208.244:6080/arcgis/rest/services/hd/MapServer/" + list[numII];
                    var layerUrl = "http://10.32.208.244:6080/arcgis/rest/services/2015zhiban/MapServer/" + list[numII];
                    var layer = new FeatureLayer(layerUrl, {
                        infoTemplate: new InfoTemplate("${NAME}", "${*}"),
                        mode: FeatureLayer.MODE_ONDEMAND,
                        outFields: ["*"]
                    });

                    var symbol = new SimpleFillSymbol();
                    symbol.setColor(new Color([150, 150, 150, 0.5]));

                    var renderer = new ClassBreaksRenderer(symbol, "河道等级");
                    //renderer.addBreak(0, 10000000, new SimpleFillSymbol().setColor(new Color([56, 168, 0, 0.5])));
                    //renderer.addBreak(10000000, 50000000, new SimpleFillSymbol().setColor(new Color([139, 209, 0, 0.5])));
                    //renderer.addBreak(50000000, 100000000, new SimpleFillSymbol().setColor(new Color([255, 255, 0, 0.5])));
                    //renderer.addBreak(100000000, 500000000, new SimpleFillSymbol().setColor(new Color([255, 128, 0, 0.5])));
                    //renderer.addBreak(500000000, Infinity, new SimpleFillSymbol().setColor(new Color([255, 0, 0, 0.5])));

                    //renderer.addBreak(0, 2, new SimpleFillSymbol().setColor(new Color([56, 168, 0, 0.5])));
                    //renderer.addBreak(2, 3, new SimpleFillSymbol().setColor(new Color([139, 209, 0, 0.5])));
                    //renderer.addBreak(3, 4, new SimpleFillSymbol().setColor(new Color([255, 255, 0, 0.5])));
                    //renderer.addBreak(4, 5, new SimpleFillSymbol().setColor(new Color([255, 128, 0, 0.5])));
                    renderer.addBreak(0, Infinity, new SimpleFillSymbol().setColor(new Color([255, 0, 0, 0.5])));


                    //layer.setRenderer(renderer);
                    map.addLayer(layer);

                    //layer.on("load", function () {

                    //    var legend = new Legend({
                    //        map: map,
                    //        layerInfos: [{
                    //            layer: layer,
                    //            title: "各国人口"
                    //        }]
                    //    }, "legend");
                    //    legend.startup();
                    //});
                }
            }

        });
}