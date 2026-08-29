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
    "esri/layers/MapImageLayer",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/layers/ArcGISTiledMapServiceLayer",
    "esri/layers/GraphicsLayer",
    "myJs/TDTMercatorLayer",
    "myJs/TDTLayer", "myJs/TDTImgLayer", "myJs/TDTNoteLayer", "myJs/TDTDXTLayer", "myJs/TDTRiverLayer",
    "myJs/GoogleImgLayer", "myJs/GoogleDxtLayer", "myJs/GoogleVecLayer", "esri/layers/TiledMapServiceLayer",
    "myJs/shswOneMapServer",
    "dojo/domReady!"
], function (Map, MapImageLayer, ArcGISDynamicMapServiceLayer, ArcGISTiledMapServiceLayer,
    GraphicsLayer, 
      TDTMercatorLayer, TDTLayer, TDTImgLayer, TDTNoteLayer, TDTDXTLayer, TDTRiverLayer,
    GoogleImgLayer, GoogleDxtLayer, GoogleVecLayer, TiledMapServiceLayer, shswOneMapServer,ImageParameters) {
        map = new Map("myMap", {
            logo: false,
            slider: false, //放大缩小按钮 
            zoom: 10,
            maxZoom: 18,
            //minZoom: 5
            showLabels: true,
            center: [1301.505898, -12657.422868],
            spatialReference: { "wkid": 3857 }
        });      
        //地形图
        var tdt = new TDTLayer("vec", { visible: false });
        var tdtimg = new TDTImgLayer("img", { visible: true });
        var tdtnote = new TDTNoteLayer("vec_img_note", { visible: false });
        var tdtdx = new TDTDXTLayer("dxt", { visible: false });
        var tdtdxrv = new TDTRiverLayer("sxt", { visible: false });
        //map.addLayer(tdt);
        //map.addLayer(tdtimg, 1);
        //map.addLayer(tdtnote);
        // map.addLayer(tdtdx);
        // map.addLayer(ybRainLayer5);

        var shswOneMapServerLayer=new shswOneMapServer("shsw_OneMapServer", { visible: true });
        map.addLayer(shswOneMapServerLayer);



        var pathname = window.location.pathname;
        if (pathname.indexOf("ybRiversw") == -1
            && pathname.indexOf("ybRiverll") == -1
            && pathname.indexOf("ybAreaSL") == -1
            && pathname.indexOf("daibiaozhanPolygonCounty") == -1
            && pathname.indexOf("areaPolygonStation") == -1
            && pathname.indexOf("frequencyDiagramLeft") == -1
            && pathname.indexOf("frequencyDiagramRight") == -1
            && pathname.indexOf("danzhanchangcichaxun.html") == -1) {
            //添加图层
            //map.addLayer(layer_hw);
        } else {
            map.setZoom(11);
        }



        //图片图层
        myMapImageLayer = CreateImageLayer("MapImageLayer");

        //行政区划边界,水系图,大中型水库,河道
        var AggLayer = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
        var AggSort = [];

        areaOverallLayer = CreateLayer("areaOverallLayer");

        //GetTooltip(AggLayer, AggSort);
        //TZSetMapLayer();
        bjLayer = new GraphicsLayer({ id: "bj", visible: true });
        map.addLayer(bjLayer);
        if (pathname.indexOf("daibiaozhanPolygonCounty") == -1
            && pathname.indexOf("frequencyDiagramLeft") == -1
            && pathname.indexOf("frequencyDiagramRight") == -1
            && pathname.indexOf("danzhanchangcichaxun") == -1) {
            //addLine(SHBJ, bjLayer);
    }
    //addLine(SHBJ, bjLayer);

    addSHPolygon(bjLayer);
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
    var dtlayers = ["vec", "img", "dxt", "sxt", "vec_img_note", "tzsxt"];//, "wapian"
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
    map.setZoom(Number(objNum));
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
        var breakSymbol = new PictureMarkerSymbol("arcgis_js_api/myJs/images/RedPin1LargeB.png", 64, 64);
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

    var url = PicUrl + "qx/";//"UploadDoc/";
    if (str != "") {
        if (str.indexOf("LDTP_") > -1) {
            url = PicUrlNT + type + "/";
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
function addSHAreaPolygon(layer) {
    $.get(
        "../../Common/上海市行政分区.json",//json路径
        function (data, status) {
            if (status === "success") {
                var features = data.features;
                if (features.length > 0) {
                    for (num = 0; num < features.length; num++) {
                        require([
                            "esri/geometry/Point",
                            "esri/graphic",
                            "esri/Color",
                            "esri/symbols/SimpleLineSymbol",
                            "esri/geometry/Polygon",
                            "esri/symbols/SimpleFillSymbol",
                            "esri/symbols/TextSymbol",
                        ], function (Point, Graphic, Color,
                            SimpleLineSymbol, Polygon, SimpleFillSymbol, TextSymbol) {
                                var outRings = [
                                    [90, 10],
                                    [150, 10],
                                    [150, 40],
                                    [90, 40],
                                    [90, 10]
                                ]; //黑色部分
                                var rings = [];//; [outRings];
                                var paths = [];
                                var AllPath = features[num].geometry.coordinates;
                                paths = AllPath;
                                // console.error(AllPath);
                                rings.push(paths);
                                var area = new Polygon(rings);
                                var symbol = new SimpleFillSymbol(
                                    SimpleFillSymbol.STYLE_SOLID,
                                    new SimpleLineSymbol(
                                        SimpleLineSymbol.STYLE_SOLID,
                                        new Color([72, 103, 136]), //rgb155, 153, 153
                                        2
                                    ),
                                    new Color([4, 20, 54, 0]) //rgba
                                );
                                var gra = new Graphic(area, symbol);
                                layer.add(gra);

                                var _name = features[num].properties.NAME;
                                var center = [];
                                if (_name == "宝山区") {
                                    center = [121.404861, 31.392111];
                                } else if (_name == "崇明区") {
                                    center = [121.568484, 31.635916];
                                } else if (_name == "奉贤区") {
                                    center = [121.458472, 30.912345];
                                } else if (_name == "嘉定区") {
                                    center = [121.250333, 31.383524];
                                } else if (_name == "金山区") {
                                    center = [121.255144, 30.818932];
                                } else if (_name == "闵行区") {
                                    center = [121.418901, 31.087213];
                                } else if (_name == "浦东新区") {
                                    center = [121.742177, 31.083823];
                                } else if (_name == "青浦区") {
                                    center = [121.085191, 31.124693];
                                } else if (_name == "松江区") {
                                    center = [121.223543, 31.030470];
                                } else if (_name == "中心城区") {
                                    center = [121.450659, 31.270821];
                                }
                                console.error('center',_name,center);
                                var point = new Point({
                                    "x": center[0],
                                    "y": center[0],
                                    "spatialReference": {
                                        "wkid": 4326
                                    }
                                });
                                var textsymbol = new TextSymbol(_name).//动态设置文本值 
                                    setColor(new dojo.Color([111, 170, 212])).//setColor设置文本颜色 
                                    setFont(new esri.symbol.Font("14px")//setFont设置文本大小 
                                        //.setWeight(esri.symbol.Font.WEIGHT_BOLD)//setWeight设置文本粗体
                                    ).
                                    setOffset(10, 0).
                                    setHaloColor(new Color([255, 255, 255])).
                                    setHaloSize(1.4);
                                var graphic = new esri.Graphic(point, textsymbol);
                                layer.add(graphic);
                            });
                    }
                }
            }
        },
        "json"
    );
}
function addSHPolygon(layer) {
    require(["esri/geometry/Point",
        "esri/geometry/Polyline",
        "esri/geometry/Extent",
        "esri/graphic",
        "esri/Color",
        "esri/layers/GraphicsLayer",
        "esri/symbols/CartographicLineSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/geometry/Polygon",
        "esri/symbols/SimpleFillSymbol",
    ], function (Point, Polyline, Extent, Graphic, Color, GraphicsLayer, CartographicLineSymbol,
        SimpleLineSymbol, Polygon, SimpleFillSymbol) {
            $.get(
                "Common/SHBJ2000.json",//json路径
                function (data, status) {
                    if (status === "success") {
                        var features = data.features;
                        if (features.length > 0) {
                            var polyline1 = [], polyline2 = [], polyline3 = [], polyline4 = [];
                            for (num = 0; num < features.length; num++) {
                                var str = SHBJ;
                                var arr = str.split("|");
                                // var layer = new GraphicsLayer();
                                // map.addLayer(layer, 0);
                                var outRings = [
                                    [90, 10],
                                    [150, 10],
                                    [150, 40],
                                    [90, 40],
                                    [90, 10]
                                ]; //黑色部分
                                var rings = [];// [outRings];
                                var paths = features[num].geometry.coordinates;
                                var strNP = [];
                                var _name = features[num].properties["区县名"];
                                if (_name == "金山区") {
                                    for (var i = 0; i < paths.length; i++) {
                                        var points = paths[i];
                                        if (i < 1400) {
                                            polyline1.push(points);
                                        }
                                        else if (i >= 1400 && i <= 3400) {
                                            polyline4.push(points);
                                        }
                                        else if (i >= 3400 && i <= 6800) {
                                            polyline2.push(points);
                                        } else if (i >= 6800 && i < paths.length) {
                                            polyline3.push(points);
                                        }
                                    }
                                    //console.error(polyline1);
                                }

                                rings.push(paths);
                                var area = new Polygon(rings);
                                var symbol = new SimpleFillSymbol(
                                    SimpleFillSymbol.STYLE_SOLID,
                                    new SimpleLineSymbol(
                                        SimpleLineSymbol.STYLE_SOLID,
                                        new Color([39, 115, 230, 1]), //rgb155, 153, 153
                                        2
                                    ),
                                    new Color([4, 20, 54, 0]) //rgba
                                );
                                var gra = new Graphic(area, symbol);
                                layer.add(gra);

                            }

                            //polyline1.push();
                            var line = new Polyline({
                                "paths": [polyline1],
                                "spatialReference": { "wkid": 4326 }
                            });
                            var lineSymbol = new SimpleLineSymbol(
                                SimpleLineSymbol.STYLE_SOLID,
                                new Color([171, 233, 13]),
                                3);
                            var polyline = new Graphic(line, lineSymbol);
                            layer.add(polyline);


                            line = new Polyline({
                                "paths": [polyline2],
                                "spatialReference": { "wkid": 4326 }
                            });
                            lineSymbol = new SimpleLineSymbol(
                                SimpleLineSymbol.STYLE_SOLID,
                                new Color([255, 217, 96]),
                                3);
                            polyline = new Graphic(line, lineSymbol);
                            layer.add(polyline);

                            line = new Polyline({
                                "paths": [polyline3],
                                "spatialReference": { "wkid": 4326 }
                            });
                            lineSymbol = new SimpleLineSymbol(
                                SimpleLineSymbol.STYLE_SOLID,
                                new Color([38, 159, 219]),
                                3);
                            polyline = new Graphic(line, lineSymbol);
                            layer.add(polyline);


                            line = new Polyline({
                                "paths": [polyline4],
                                "spatialReference": { "wkid": 4326 }
                            });
                            lineSymbol = new SimpleLineSymbol(
                                SimpleLineSymbol.STYLE_SOLID,
                                new Color([1, 242, 165]),
                                3);
                            polyline = new Graphic(line, lineSymbol);
                            layer.add(polyline);
                        }
                    }
                },
                "json"
            );
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
                        visible: true,
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
        webMercatorUtils, Point, MapText, TextSymbol, Font) {
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

                    var picBaseUrl = "arcgis_js_api/myJs/images/";
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


//地图放大缩小调用事件**************************************************************
var globallevel = 7;//全局级别
var textLevelOffset = 1;//文本标注比站点图标晚显示的级别数，即 mapsize + 1 时标出文本
var textLevelDefault = 12;//未配置 mapsize 的标注沿用改造前的固定级别
var zoomEndHandles = {};//已注册的 zoom-end 监听，按“类型|图层”登记，避免重复叠加
function mapZoomEnd(myLayer, mapLevel, stType, field, switchChecked) {
    if (mapLevel == null || mapLevel == undefined) {
        mapLevel = globallevel; //无特殊指定
    }
    if (SetNull(map) == "") {
        map = window.map;
    }
    //同一图层每次刷新都会重新调用，先解绑旧监听，否则监听器会一直累积
    var handleKey = stType + "|" + (myLayer == null || myLayer == undefined ? "" : myLayer.id);
    if (zoomEndHandles[handleKey] != undefined) {
        zoomEndHandles[handleKey].remove();
    }
    zoomEndHandles[handleKey] = map.on("zoom-end", function (zoom) {
        mapLevel = zoom.level;
        setMapZoomNew(myLayer, mapLevel, stType, field, switchChecked);
    });
}

/// <summary>
/// 计算站点文本标注的显示级别：图标级别 + 偏移，不设封顶
/// 封顶会把 mapsize 较大的站点全部压到同一级，文本又会挤在一起出现
/// </summary>
function getTextLevel(mapsize) {
    var base = Number(mapsize);
    if (mapsize == undefined || mapsize === "" || isNaN(base)) {
        base = globallevel;
    }
    return base + textLevelOffset;
}

/// <summary>
/// 实时读取“显示标注”开关，避免使用绑定监听时捕获的旧值
/// </summary>
function getMarkerChecked(defaultChecked) {
    //mapIndex.js 被多个页面引用，未提供该开关的页面沿用传入值
    try {
        if (typeof SpanBiaoZhu == "function") {
            var temp = SpanBiaoZhu();
            return temp == true || temp == "checked";
        }
    } catch (e) {
    }
    return defaultChecked == true;
}

function setMapZoomNew(myLayer, mapLevel, stType, field, switchChecked) {
    //站点图标：按各站自己的 mapsize 控制显隐
    if (myLayer != null && myLayer != undefined && myLayer.graphics != undefined) {
        for (var num = 0; num < myLayer.graphics.length; num++) {
            var item = myLayer.graphics[num];
            if (item.attributes != undefined) {
                var MAPSIZE = item.attributes.mapsize;
                if (MAPSIZE != undefined) {
                    //站点层级等于默认地图层级时，一直要显示
                    if (globallevel == MAPSIZE || mapLevel >= MAPSIZE) {
                        item.show();
                    } else {
                        item.hide();
                    }
                }
            }
        }
    }

    //文本标注：标注 div 统一挂在地图根节点下，各页面共用，这里一次遍历按各自级别处理。
    //带 data-mapsize 的按站点级别，未带的沿用改造前的 textLevelDefault 级，保证老页面行为不变。
    $(".MapTextNew,.MapText").each(function () {
        var mapsize = this.getAttribute("data-mapsize");
        var textLevel = (mapsize == null || mapsize === "") ? textLevelDefault : getTextLevel(mapsize);
        $(this).toggleClass("zoomhide", mapLevel < textLevel);
    });

    //“显示标注”开关：与级别控制用不同的样式名，两者互不覆盖
    $(".MapTextNew,.MapText").toggleClass("nonenew", getMarkerChecked(switchChecked) == false);
}

function removeClassParam(objID, objClass) {
    // console.error('removeClassParam',objID, objClass)
    $("#" + objID).removeClass(objClass);
    $("#" + objID + "Arrow").removeClass(objClass);
}

function addClassParam(objID, objClass) {
    // console.error('addClassParam',objID, objClass)
    $("#" + objID).addClass(objClass);
    $("#" + objID + "Arrow").addClass(objClass);
}

function addClassParamByClass(objID, objClass) {
    $("." + objID).addClass(objClass);
}

function removeClassParamByClass(objID, objClass) {
    $("." + objID).removeClass(objClass);
}

//地图放大缩小调用事件**************************************************************
