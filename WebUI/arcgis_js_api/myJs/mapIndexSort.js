var map, gl, cycleMap3, bjLayer;
var layer1, layer2, layer3, layer4, layer5, layer6, layer7, layer8, layer9, layer10, layer11, layer12, layer13, layer14, myMapImageLayer;
var BinData = [];
require(["esri/config", "esri/tasks/GeometryService"], function (esriConfig, GeometryService) {
    esriConfig.defaults.geometryService = new GeometryService("https://sampleserver6.arcgisonline.com/arcgis/rest/services/Geometry/GeometryServer");
    //esriConfig.defaults.io.alwaysUseProxy = true;
});
require([
    "esri/map",
    "esri/layers/ArcGISTiledMapServiceLayer",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/geometry/Point",
    "esri/SpatialReference",

    "esri/layers/ImageParameters",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/TextSymbol",
    "esri/layers/LabelClass",
    "esri/renderers/SimpleRenderer",
    "esri/layers/FeatureLayer",
    "esri/Color",
    "esri/symbols/SimpleLineSymbol",
    "esri/layers/GraphicsLayer",
    "esri/graphic",
    "esri/tasks/FeatureSet",
    "esri/geometry/geometryEngine",
    "esri/tasks/Geoprocessor",
    "dojo/domReady!"],
    function (Map, ArcGISTiledMapServiceLayer, ArcGISDynamicMapServiceLayer, Point, SpatialReference,
        ImageParameters, SimpleMarkerSymbol, TextSymbol, LabelClass, SimpleRenderer, FeatureLayer, Color, SimpleLineSymbol, GraphicsLayer, Graphic, FeatureSet, geometryEngine, Geoprocessor) {
        var map = new Map("myMap", {
            //                        center: new Point(1.3091608700115489E7, 4273624.108445918, new SpatialReference({ wkid: 3857 })),
            autoResize: true,
            sliderStyle: "small",
            logo: false,
            showLabels: true
        });
        var baseSpatialRef = new SpatialReference({ "wkt": 'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["degree",0.0174532925199433]]' });

        var tiled = new ArcGISDynamicMapServiceLayer("http://10.32.208.244:6080/arcgis/rest/services/wapian/MapServer");
        map.addLayer(tiled);


        var gp = new Geoprocessor("http://10.8.3.61:6080/arcgis/rest/services/GPDZX/GPServer");
        //var gp = new Geoprocessor("https://localhost:6080/arcgis/rest/services/test/dengzhimian2/GPServer/dengzhimian2");

        var graphicLayer = new GraphicsLayer({ id: "dian" });
        var sssym = new SimpleMarkerSymbol({
            "color": [255, 255, 255, 64],
            "size": 12,
            "angle": -30,
            "xoffset": 0,
            "yoffset": 0,
            "type": "esriSMS",
            "style": "esriSMSCircle",
            "outline": {
                "color": [0, 0, 0, 255],
                "width": 1,
                "type": "esriSLS",
                "style": "esriSLSSolid"
            }
        });
        var features = [];
        var graphic1 = new Graphic(new Point(117.320358, 35.725506, baseSpatialRef), sssym, { "zvalue": 10 });
        var graphic2 = new Graphic(new Point(117.251434, 35.699341, baseSpatialRef), sssym, { "zvalue": 30 });
        var graphic3 = new Graphic(new Point(117.522662, 35.618930, baseSpatialRef), sssym, { "zvalue": 400 });
        var graphic4 = new Graphic(new Point(117.275685, 35.564684, baseSpatialRef), sssym, { "zvalue": 28 });
        var graphic5 = new Graphic(new Point(117.447444, 35.755972, baseSpatialRef), sssym, { "zvalue": 70 });
        var graphic6 = new Graphic(new Point(117.155146, 35.627075, baseSpatialRef), sssym, { "zvalue": 100 });
        var graphic7 = new Graphic(new Point(117.404478, 35.651812, baseSpatialRef), sssym, { "zvalue": 0 });
        var graphic8 = new Graphic(new Point(117.105020, 35.770945, baseSpatialRef), sssym, { "zvalue": 180 });
        //显示数据源，用于展示等值面效果
        graphicLayer.add(graphic1);
        graphicLayer.add(graphic2);
        graphicLayer.add(graphic3);
        graphicLayer.add(graphic4);
        graphicLayer.add(graphic5);
        graphicLayer.add(graphic6);
        graphicLayer.add(graphic7);
        graphicLayer.add(graphic8);
        map.addLayer(graphicLayer);

        //组装输入参数
        features.push(graphic1);
        features.push(graphic2);
        features.push(graphic3);
        features.push(graphic4);
        features.push(graphic5);
        features.push(graphic6);
        features.push(graphic7);
        features.push(graphic8);

        var featureset = new FeatureSet();
        featureset.features = features;
        var para = {
            inputpoints: featureset,
            zvalue: "zvalue"
            //      clipfeature:"xian1"
        }

        //生成矢量等值面
        gp.submitJob(para, function (result) {
            var mianGraphicLayer = new GraphicsLayer({ id: "dengzhimian" });
            var symbol = new esri.symbol.SimpleFillSymbol();
            symbol.setColor(new dojo.Color([150, 150, 150, 0.5]));
            var renderer = new esri.renderer.ClassBreaksRenderer(symbol, "gridcode");//根据输出矢量的gridcode字段分类渲染
            renderer.addBreak(1, 9, new esri.symbol.SimpleFillSymbol().setColor(new dojo.Color([56, 168, 0, 0.5])));
            renderer.addBreak(10, 24, new esri.symbol.SimpleFillSymbol().setColor(new dojo.Color([139, 209, 0, 0.5])));
            renderer.addBreak(25, 49, new esri.symbol.SimpleFillSymbol().setColor(new dojo.Color([255, 255, 0, 0.5])));
            renderer.addBreak(50, 99, new esri.symbol.SimpleFillSymbol().setColor(new dojo.Color([255, 128, 0, 0.5])));
            renderer.addBreak(100, 199, new esri.symbol.SimpleFillSymbol().setColor(new dojo.Color([255, 128, 0, 0.5])));
            renderer.addBreak(200, Infinity, new esri.symbol.SimpleFillSymbol().setColor(new dojo.Color([255, 0, 0, 0.5])));
            mianGraphicLayer.setRenderer(renderer);

            var jobId = result.jobId;
            var status = result.jobStatus;
            if (status == esri.tasks.JobInfo.STATUS_SUCCEEDED) {
                //成功之后，将其中的结果取出来，当然这也是参数名字。
                //在模型中，想要取出中间结果，需要设置为模型参数
                gp.getResultData(jobId, "output", function (jobInfo) {
                    var features = jobInfo.value.features;
                    dojo.forEach(features, function (graphic) {
                        mianGraphicLayer.add(graphic);
                    });
                    map.addLayer(mianGraphicLayer);
                });
            }
        });
    });

/***设置地图****/
var setDtLayerWX = false;
function setDtLayer(str) {
    //var dtlayers = ["vec", "img", "dxt", "sxt", "vec_img_note", "wx"];
    var dtlayers = ["vec", "img", "dxt", "sxt", "wx","wapian"];
    //if (str == "wx") {
    //    setDtLayerWX = true;
    //    clearLayer(13);
    //    var tempTooltip = map.getLayer("ToolTipLayer30");
    //    if (tempTooltip == undefined) {
    //    } else {
    //        tempTooltip.setVisibility(true)
    //    }
    //} else {
    //    setDtLayerWX = false;
    //    clearLayer(13);
    //    addLayer(13);
    //} 
    for (var i = 0; i < dtlayers.length; i++) {
        var lysStr = dtlayers[i];
        if (lysStr == str) {
            //var ly = map.getLayer(lysStr);  
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


function ShowYT(str, type) {
    var url =  HttpUrl;
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
    require([
        "esri/geometry/Polyline",
        "esri/geometry/Extent",
        "esri/graphic",
        "esri/Color",
        "esri/layers/GraphicsLayer", "esri/SpatialReference",
        "esri/symbols/CartographicLineSymbol", "esri/symbols/SimpleLineSymbol", "esri/symbols/PictureMarkerSymbol"
    ], function ( Polyline, Extent, Graphic, Color, GraphicsLayer, SpatialReference, CartographicLineSymbol, SimpleLineSymbol, PictureMarkerSymbol) {
        var taihujuXY = [path];
        var line = new esri.geometry.Polyline({
            "paths": taihujuXY,
            "spatialReference": { "wkid": 4326 }
        });
        //var lineSymbol = new SimpleLineSymbol(
        //    SimpleLineSymbol.STYLE_SOLID,
        //    new Color([76, 145, 249, 1]),
        //    3);
        var lineSymbol = new SimpleLineSymbol("solid", new dojo.Color([255, 0, 0]), 3);
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
    require([ "esri/geometry/Polyline",
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
        var lineSymbol =  new SimpleFillSymbol("solid", new SimpleLineSymbol("solid", new dojo.Color([255, 0, 0]), 2), new dojo.Color([255, 0, 0, 0.25]));

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
    //if (HidShow == true) {
    //    map.addLayer(Hidlayer);
    //} else {
    //    map.removeLayer(Hidlayer); 
    //}
}
function GetTooltip(list, AggSort) {
    require(["esri/map", "esri/layers/ArcGISTiledMapServiceLayer", "esri/layers/FeatureLayer",
        "esri/InfoTemplate", "esri/renderers/ClassBreaksRenderer", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol", "esri/geometry/Polyline", "esri/dijit/Legend",
        "esri/Color", "esri/graphic", "dojo/domReady!"
    ], function (Map, ArcGISTiledMapServiceLayer, FeatureLayer,
        InfoTemplate, ClassBreaksRenderer, SimpleFillSymbol, SimpleLineSymbol, Polyline, Legend, Color, Graphic
    ) {
            //list.reverse(); 
            if (list.length > 0) {
                for (numII = 0; numII < list.length; numII++) {
                    var layerUrl = "http://10.32.208.244:6080/arcgis/rest/services/wapian/MapServer/" + list[numII];
                    var temMsg = "名称=${NAME}<br/>";
                    if (list[numII] == "6") {
                        AggList = ["省", "地区", "县", "乡镇", "街村", "排污口位置", "所在水资源", "排入水域类", "河流名称",
                            "河流编码", "是否划定水", "水功能一级", "水功能二级", "水功能二", "是否已登记", "批准或登记",
                            "取得入河湖", "取得入河", "审批级别", "设置部门", "入河湖废污", "污水主要来", "污水分类情",
                            "是否为电厂", "排放规律", "入河湖排污", "主要排污单", "备注"];
                        if (AggList.length > 0) {
                            for (num = 0; num < AggList.length; num++) {
                                temMsg += AggList[num] + "=${" + AggList[num] + "}<br/>";
                            }
                        }
                    } else if (list[numII] == "7") {
                        AggList = ["省", "地区", "县", "乡镇", "街村", "取水口位置", "所在水资源", "取水方式", "泵站名称",
                            "泵站编码", "是否为引调", "是否位于地", "水源类型", "河流名称", "河流编码", "取水流量",
                            "年最大取水", "取水量取得", "灌溉面积", "单位名称", "所属行业", "有无取水许", "取水许可证",
                            "许可取水量", "取水许可审", "取水许可监", "备注"];
                        if (AggList.length > 0) {
                            for (num = 0; num < AggList.length; num++) {
                                temMsg += AggList[num] + "=${" + AggList[num] + "}<br/>";
                            }
                        }
                    } else if (list[numII] == "7") {
                        temMsg += "备注=${备注}<br/>";
                    } else if (list[numII] == "13" || list[numII] == "14") {
                        temMsg += "工程等别=${工程等别}<br/>";
                        temMsg += "备注=${备注}<br/>";
                    } else if (list[numII] == "8") {
                        AggList = ["省", "地区", "县", "是否跨县", "灌区范围", "主要水源工", "补充水源工", "普查年降水", "耕地面积_",
                            "设计灌溉面", "总灌溉面积", "耕地有效灌", "园林草地等", "耕地实际灌", "其中粮田实", "管理单位名",
                            "核定成本水", "核定过成本", "执行水价"];
                        if (AggList.length > 0) {
                            for (num = 0; num < AggList.length; num++) {
                                temMsg += AggList[num] + "=${" + AggList[num] + "}<br/>";
                            }
                        }
                    } else if (list[numII] == "9") {
                        AggList = ["省", "地区", "县", "乡镇", "所在水资源", "取水水源类", "河湖水库名", "河湖水库编", "取水口个数",
                            "水质目标", "水源地水质", "水源地现状", "是否划分水", "一级保护区", "二级保护区", "准保护区",
                            "主要供水用", "供水人口", "主要供水城", "供水规模", "单位名称", "所属行业"];
                        if (AggList.length > 0) {
                            for (num = 0; num < AggList.length; num++) {
                                temMsg += AggList[num] + "=${" + AggList[num] + "}<br/>";
                            }
                        }
                    } else if (list[numII] == "10") {
                        AggList = ["属性", "面积"];
                        if (AggList.length > 0) {
                            for (num = 0; num < AggList.length; num++) {
                                temMsg += AggList[num] + "=${" + AggList[num] + "}<br/>";
                            }
                        }
                    } else if (list[numII] == "16") {
                        AggList = ["湖泊名称", "所属行政区", "面积", "长度", "备注", "所属乡镇"];
                        if (AggList.length > 0) {
                            for (num = 0; num < AggList.length; num++) {
                                temMsg += AggList[num] + "=${" + AggList[num] + "}<br/>";
                            }
                        }
                    } else if ("18,19,20,21,22,23,24,25".lastIndexOf(list[numII]) > -1) {
                        AggList = ["河道等级", "河流断面", "河道面积", "所属区县", "显示级别", "备注"];
                        if (AggList.length > 0) {
                            for (num = 0; num < AggList.length; num++) {
                                temMsg += AggList[num] + "=${" + AggList[num] + "}<br/>";
                            }
                        }
                    }

                    var layer = new FeatureLayer(layerUrl, {
                        infoTemplate: new InfoTemplate("${NAME}", temMsg),
                        mode: FeatureLayer.MODE_ONDEMAND,
                        id: "ToolTipLayer" + list[numII],
                        outFields: ["*"], 
                    });
                    var tempNum =  Math.abs(13 - Number(AggSort[numII]));//(0.1 * Math.abs(13 - Number(AggSort[numII]))).toFixed(1);
                    layer.setVisibility(false);

                    map.addLayer(layer, tempNum); 
                      
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