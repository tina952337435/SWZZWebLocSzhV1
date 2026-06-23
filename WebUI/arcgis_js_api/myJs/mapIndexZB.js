var map, gl, cycleMap3, bjLayer;
var layer1, layer2, layer3, layer4, layer5, layer6, layer7, layer8, layer9, layer10, layer11, layer12, layer13;
var BinData = [];
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
], function (Map, Extent, ArcGISDynamicMapServiceLayer, ArcGISTiledMapServiceLayer, WebTiledLayer, GraphicsLayer, Graphic, MapText, webMercatorUtils, Point, SpatialReference, Measurement, dom, Units, TDTMercatorLayer, TDTLayer, TDTImgLayer, TDTNoteLayer, TDTDXTLayer, TDTRiverLayer, ImageParameters) {
    map = new Map("myMap", {
        logo: false,
        slider: false, //放大缩小按钮
        //isDoubleClickZoom:false;
        zoom: 8,
        // isScrollWheel:false,
        showLabels: true,
        center: [120.103963, 31.573982]
    });
    var url = "http://218.94.6.92:6080/arcgis/rest/services/jssl_vector_L3_L17/MapServer"; //水系图

    var url1 = "http://172.16.101.11/xcscms/sipsd/service/TileService/DZDT_GCS2000/MapServer"; //电子图
    var url2 = "http://172.16.101.11/xcscms/sipsd/service/TileService/IMG2017CGCS2000/MapServer"; //遥感图
    var url3 = "http://172.16.101.11/xcscms/sipsd/service/TileService/XZQH_GCS2000/MapServer"//行政图
    var url4 = "http://112.25.70.13:6080/arcgis/rest/services/hd/MapServer"//行政图
    var token = "kAiTBjERZMWBITLdsXqHR9b6eswMtXgGt2lSI9FCA3q1qs1WyYk9BwJHpZCZSoAbXolbKHwYgOVHHXl0IKeHvS3ZMZkMsQvF5gjr67dmlXX7KK1984gagg%3D%3D";
    var tiledMapServiceLayer = new ArcGISTiledMapServiceLayer(url, { id: "sxt", visible: true });

    //var layer = new ArcGISDynamicMapServiceLayer("http://112.21.188.187:6080/arcgis/rest/services/jkq_bj/MapServer", { useMapImage: false });
    var layer = new ArcGISDynamicMapServiceLayer("http://112.25.70.13:6080/arcgis/rest/services/zonghe/MapServer", { useMapImage: true });


    //var layer = new ArcGISDynamicMapServiceLayer("http://112.25.70.13:6080/arcgis/rest/services/zonghe/MapServer", { useMapImage: true  });

    //var tdt = new ArcGISTiledMapServiceLayer(url1 + "?token=" + token, { id: "vec", visible: true });
    //var tdtimg = new ArcGISTiledMapServiceLayer(url2 + "?token=" + token, { id: "img", visible: false  });
    //var tdtdx = new ArcGISTiledMapServiceLayer(url3 + "?token=" + token, { id: "dxt", visible: false  });
    //var tdtdx = new ArcGISTiledMapServiceLayer(url3 + "?token=" + token, { id: "sxt", visible: true });
    //路网
    //layer1 = new ArcGISDynamicMapServiceLayer("http://112.21.188.187:6080/arcgis/rest/services/jkq_lw/MapServer", { useMapImage: true });

    layer1 = new ArcGISDynamicMapServiceLayer("http://112.25.70.13:6080/arcgis/rest/services/zonghe/MapServer", { useMapImage: true });
   
    //地形图
    var tdt = new TDTLayer("vec", { visible: false });
    var tdtimg = new TDTImgLayer("img", { visible: false });
    var tdtnote = new TDTNoteLayer("vec_img_note", { visible: false });
    //
    var tdtdx = new TDTDXTLayer("dxt", { visible: false });
    var tdtdxrv = new TDTRiverLayer("sxt", { visible: false });

    map.addLayer(tdt);
    map.addLayer(tdtimg);
    //map.addLayer(tdtnote);

    map.addLayer(tdtdx);
    map.addLayer(tdtdxrv);


    //map.addLayer(tiledMapServiceLayer);


    //var agglist = [29];
    //layer1.setVisibleLayers(agglist);
    //map.addLayer(layer1);
    //layer1.setVisibility(true);

    map.addLayer(layer);

    //map.addLayer(layer7);

    //gl = new GraphicsLayer({ id: "s" });
    //map.addLayer(gl);

    //bjLayer = new GraphicsLayer({ id: "bj" });
    //map.addLayer(bjLayer);
    //addLine(XCQBJ, bjLayer);

    //mouse-move
    map.on("mouse-move", Location);
    function Location(evt) {
        var mp = evt.mapPoint;
        $("#locationSpan").html(mp.x.toFixed(6) + "," + mp.y.toFixed(6));
    };
    //鼠标点击显示图层信息 
});

/***设置地图****/
function setDtLayer(str) {
    var dtlayers = ["vec", "img", "dxt", "sxt", "vec_img_note"];
    for (var i = 0; i < dtlayers.length; i++) {
        var lysStr = dtlayers[i];
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
        //map.addLayer(layer1);
        //map.setVisibleLayers(layer1).visible(true);
        layer1.setVisibility(true);
    } else if (num == 2) {
        //map.addLayer(layer2);
        layer2.setVisibility(true);
    } else if (num == 3) {
        //map.addLayer(layer3);
        layer3.setVisibility(true);
    } else if (num == 4) {
        //map.addLayer(layer4);
        layer4.setVisibility(true);
    } else if (num == 5) {
        //map.addLayer(layer5);
        layer5.setVisibility(true);
    } else if (num == 6) {
        //map.addLayer(layer6);
        layer6.setVisibility(true);
    } else if (num == 7) {
        //map.addLayer(layer7);
        layer7.setVisibility(true);
    } else if (num == 8) {
        layer8.setVisibility(true);
    }
}

function clearLayer(num) {
    if (num == 1) {
        //layer1.hide();
        //map.removeLayer(layer1);
        layer1.setVisibility(false);
    } else if (num == 2) {
        //map.removeLayer(layer2);
        layer2.setVisibility(false);
    } else if (num == 3) {
        //map.removeLayer(layer3);
        layer3.setVisibility(false);
    } else if (num == 4) {
        //map.removeLayer(layer4);
        layer4.setVisibility(false);
    } else if (num == 5) {
        //map.removeLayer(layer5);
        layer5.setVisibility(false);
    } else if (num == 6) {
        //map.removeLayer(layer6);
        layer6.setVisibility(false);
    } else if (num == 7) {
        //map.removeLayer(layer7);
        layer7.setVisibility(false);
    } else if (num == 8) {
        layer8.setVisibility(false);
    }
}

function SetLayer(id, HidShow) {
    var Hidlayer = map.getLayer(id);
    Hidlayer.setVisibility(HidShow); 
    //if (HidShow == true) {
    //    alert(Hidlayer.LayerList);
    //    GetTooltip(Hidlayer.LayerList);
    //} else {
    //    var tempTooltip = map.getLayer("TooltipLayer");
    //    map.removeLayer(tempTooltip);
    //}
}
function GetTooltip(list) {
    require(["esri/map", "esri/layers/ArcGISTiledMapServiceLayer", "esri/layers/FeatureLayer",
        "esri/InfoTemplate", "esri/renderers/ClassBreaksRenderer", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol", "esri/geometry/Polyline", "esri/dijit/Legend",
        "esri/Color", "esri/graphic", "dojo/domReady!"
    ], function (Map, ArcGISTiledMapServiceLayer, FeatureLayer,
        InfoTemplate, ClassBreaksRenderer, SimpleFillSymbol, SimpleLineSymbol, Polyline, Legend, Color, Graphic
    ) { 

        if (list.length > 0) {
            for (numII = 0; numII < list.length; numII++) { 
                var layerUrl = "http://112.25.70.13:6080/arcgis/rest/services/zonghe/MapServer/" + list[numII];
                if (list[numII] == "5") {

                } else if (list[numII] == "5") {

                }
                var layer = new FeatureLayer(layerUrl, {
                    infoTemplate: new InfoTemplate("${NAME}", "名称：${NAME}<br/>工程等别：${工程等别}<br/>经度：${POINT_X}<br/>纬度：${POINT_Y}"),
                    mode: FeatureLayer.MODE_ONDEMAND,
                    id: "ToolTipLayer" + numII,
                    outFields: ["*"]
                });


                //var symbol = new SimpleFillSymbol();
                //symbol.setColor(new Color([150, 150, 150, 1])); 
                //var renderer = new ClassBreaksRenderer(symbol, "河道等级");
                //renderer.addBreak(0, 10000000, new SimpleFillSymbol().setColor(new Color([56, 168, 0, 0.5])));
                //renderer.addBreak(10000000, 50000000, new SimpleFillSymbol().setColor(new Color([139, 209, 0, 0.5])));
                //renderer.addBreak(50000000, 100000000, new SimpleFillSymbol().setColor(new Color([255, 255, 0, 0.5])));
                //renderer.addBreak(100000000, 500000000, new SimpleFillSymbol().setColor(new Color([255, 128, 0, 0.5])));
                //renderer.addBreak(500000000, Infinity, new SimpleFillSymbol().setColor(new Color([255, 0, 0, 0.5]))); 
                //layer.setRenderer(renderer);
                //map.lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0, 0.5]), 2.5);
                //layer.graphics[numII].setSymbol(map.lineSymbol);
                //var lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new dojo.Color("#FF0000"), 3);
                //创建面符号
                //var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, lineSymbol, new Color([255, 0, 0, 0.5]));
                //var graphic = new Graphic(event.graphic.geometry, symbol);
                //layer.graphics[numII] = graphic; 


                //var lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new dojo.Color("#FF0000"), 3);
                //var geo = new Polyline({ 
                //    "spatialReference": { "wkid": 4326 }
                //});
                //var polyline = new Graphic(geo, lineSymbol);
                //layer.add(polyline);

                ////地名标注
                //var labelSymbol = new TextSymbol().setColor(new Color("#000000"));
                //labelSymbol.font.setSize("10pt");
                //labelSymbol.font.setFamily("新宋体");
                //var json = {
                //    "labelExpressionInfo": { "value": "{Point}" },
                //    "useCodedValues": false,
                //    "labelPlacement": "center-right"
                //};
                //var labelClass = new LabelClass(json);
                ////labelClass.symbol = labelSymbol;
                //layer.setLabelingInfo([labelClass]);

                map.addLayer(layer);
            }
            $.data(BinData, "ToolCount", list.length);
        } 
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
                        console.log(p.MT_LGTD + "======LTTD" + p.MT_LTTD)
                        var latlng = new Point(parseFloat(p.MT_LGTD), parseFloat(p.MT_LTTD), new SpatialReference({ wkid: 4326 }));
                        var webMercator = latlng;//webMercatorUtils.geographicToWebMercator(latlng);
                        console.log(webMercator.x + "=========Y" + webMercator.y)
                        var attributes = {
                            "时间": p.MT_TIME,
                            "图片名称": p.MT_NAME,
                            "路径": p.MT_FILE,
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
                window.showExtents = function() {
                  var extents = map.getLayer("clusterExtents");
                  if ( extents ) {
                    map.removeLayer(extents);
                  }
                  extents = new GraphicsLayer({ id: "clusterExtents" });
                  var sym = new SimpleFillSymbol().setColor(new Color([205, 193, 197, 0.5]));
      
                  arrayUtils.forEach(clusterLayer._clusters, function(c, idx) {
                    var e = c.attributes.extent;
                    extents.add(new Graphic(new Extent(e[0], e[1], e[2], e[3], map.spatialReference), sym));
                  }, this);
                  map.addLayer(extents, 0);
                }; 
            });
        });
}